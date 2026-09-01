import type { Product } from '../lib/types';
import { formatMoney } from '../lib/commerce';
import { QuickAddToCart } from './quick-add-to-cart';

export function ProductCard({ product, priority = false, reveal = false, quickAdd = false }: { product: Product; priority?: boolean; reveal?: boolean; quickAdd?: boolean }) {
  const availableVariant = product.variants.find((variant) => variant.availableForSale) || product.variants[0];
  return <article className="product-card" data-reveal={reveal ? '' : undefined}><a href={`/product-page/${encodeURIComponent(product.handle)}`} aria-label={`לצפייה במוצר ${product.title}`}><div className="product-image-wrap"><img src={product.images[0]?.url} alt={product.images[0]?.altText || product.title} loading={priority ? 'eager' : 'lazy'} />{!product.availableForSale && <span className="sale-badge">אזל זמנית</span>}<span className="product-arrow">↙</span></div><div className="product-meta"><div><h3>{product.title}</h3><p>{product.collections[0] || 'Bioloark collection'}</p></div><strong>{formatMoney(product.price)}</strong></div></a>{quickAdd && <QuickAddToCart variantId={availableVariant?.id} available={product.availableForSale && Boolean(availableVariant?.availableForSale)} />}</article>;
}
