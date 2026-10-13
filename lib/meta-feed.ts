import type { Product } from './types';

const origin = 'https://www.bioloark.co.il';
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]!));
const field = (name: string, value: string) => `<g:${name}>${escapeXml(value)}</g:${name}>`;

// Match the numeric variant content IDs used by the Shopify Meta channel.
export function buildMetaFeed(products: Product[], imageFallbacks: Product[]) {
  const fallbackByHandle = new Map(imageFallbacks.map((product) => [product.handle, product]));
  const items: string[] = [];
  for (const product of products) {
    if (product.source !== 'shopify') throw new Error('Live Shopify products are required');
    const image = product.images[0]?.url || fallbackByHandle.get(product.handle)?.images[0]?.url;
    if (!image) throw new Error(`Missing product image: ${product.handle}`);
    const imageUrl = new URL(image, origin);
    if (imageUrl.protocol !== 'https:') throw new Error('Product images must use HTTPS');
    const productId = /^gid:\/\/shopify\/Product\/(\d+)$/.exec(product.id)?.[1];
    if (!productId || !product.variants.length) throw new Error('Invalid Shopify product');
    for (const variant of product.variants) {
      const id = /^gid:\/\/shopify\/ProductVariant\/(\d+)$/.exec(variant.id)?.[1];
      if (!id || !Number.isFinite(variant.price.amount) || variant.price.amount < 0 || !/^[A-Z]{3}$/.test(variant.price.currencyCode)) throw new Error('Invalid Shopify variant');
      const link = new URL(`/product-page/${encodeURIComponent(product.handle)}`, origin);
      link.searchParams.set('variant', id);
      items.push('<item>' + [
        field('id', id), field('item_group_id', productId),
        field('title', product.title), field('description', product.description || product.title),
        field('link', link.toString()), field('image_link', imageUrl.toString()),
        field('availability', variant.availableForSale ? 'in stock' : 'out of stock'),
        field('price', `${variant.price.amount.toFixed(2)} ${variant.price.currencyCode}`),
        field('condition', 'new'), field('brand', 'Bioloark'),
      ].join('') + '</item>');
    }
  }
  if (!items.length) throw new Error('No live products available');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>Bioloark product catalog</title><link>${origin}</link><description>Live Shopify products with Bioloark storefront links</description>${items.join('')}</channel></rss>`;
}
