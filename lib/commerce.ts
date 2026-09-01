/* eslint-disable @typescript-eslint/no-explicit-any */
import catalogJson from '../data/catalog.json';
import type { Cart, Collection, Money, Product, ProductImage, ProductVariant, ShopPolicy } from './types';

type Catalog = { products: Product[]; collections: Collection[] };
const previewCatalog = catalogJson as Catalog;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-07';

export function shopifyIsConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
    (process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN || process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN),
  );
}

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}, buyerIp?: string): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  if (!domain || (!publicToken && !privateToken)) throw new Error('Shopify is not configured');
  const response = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(publicToken
        ? { 'X-Shopify-Storefront-Access-Token': publicToken }
        : { 'Shopify-Storefront-Private-Token': privateToken! }),
      ...(!publicToken && buyerIp ? { 'Shopify-Storefront-Buyer-IP': buyerIp } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Shopify request failed (${response.status})`);
  const payload = await response.json() as { data?: T; errors?: { message: string }[] };
  if (payload.errors?.length || !payload.data) throw new Error(payload.errors?.[0]?.message || 'Invalid Shopify response');
  return payload.data;
}

const productFields = `
  id title handle description descriptionHtml availableForSale
  seo { title description }
  featuredImage { url altText width height }
  images(first: 8) { nodes { url altText width height } }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 30) { nodes { id title availableForSale price { amount currencyCode } selectedOptions { name value } } }
  collections(first: 20) { nodes { handle } }
`;

function money(value: { amount: string | number; currencyCode: string }): Money {
  return { amount: Number(value.amount), currencyCode: value.currencyCode };
}

function mapProduct(node: any): Product {
  const images: ProductImage[] = (node.images?.nodes || []).map((image: any) => ({ ...image, altText: image.altText || node.title }));
  const variants: ProductVariant[] = (node.variants?.nodes || []).map((variant: any) => ({ ...variant, price: money(variant.price) }));
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    seoTitle: node.seo?.title || `${node.title} | Bioloark`,
    description: node.description || '',
    descriptionHtml: node.descriptionHtml || '',
    price: money(node.priceRange.minVariantPrice),
    availableForSale: node.availableForSale,
    images,
    variants,
    collections: (node.collections?.nodes || []).map((collection: any) => collection.handle),
    source: 'shopify',
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!shopifyIsConfigured()) return previewCatalog.products;
  try {
    const data = await shopifyFetch<{ products: { nodes: any[] } }>(`query Products { products(first: 100, sortKey: TITLE) { nodes { ${productFields} } } }`);
    return data.products.nodes.map(mapProduct);
  } catch {
    return previewCatalog.products;
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const decoded = decodeURIComponent(handle);
  if (!shopifyIsConfigured()) return previewCatalog.products.find((product) => product.handle === decoded);
  try {
    const data = await shopifyFetch<{ product: any }>(`query Product($handle: String!) { product(handle: $handle) { ${productFields} } }`, { handle: decoded });
    return data.product ? mapProduct(data.product) : undefined;
  } catch {
    return previewCatalog.products.find((product) => product.handle === decoded);
  }
}

export async function getCollections(): Promise<Collection[]> {
  if (!shopifyIsConfigured()) return previewCatalog.collections;
  try {
    const data = await shopifyFetch<{ collections: { nodes: any[] } }>(`query Collections { collections(first: 100) { nodes { id title handle description products(first: 100) { nodes { handle } } } } }`);
    return data.collections.nodes.map((node) => ({ id: node.id, title: node.title, handle: node.handle, description: node.description || '', productHandles: node.products.nodes.map((product: any) => product.handle) }));
  } catch {
    return previewCatalog.collections;
  }
}

export async function getCollection(handle: string): Promise<{ collection?: Collection; products: Product[] }> {
  const decoded = decodeURIComponent(handle);
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);
  const collection = collections.find((item) => item.handle === decoded);
  return { collection, products: collection ? products.filter((product) => collection.productHandles.includes(product.handle) || product.collections.includes(decoded)) : [] };
}

export function previewCollections() { return previewCatalog.collections; }
export function previewProducts() { return previewCatalog.products; }

export function formatMoney(value: Money) {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: value.currencyCode || 'ILS', minimumFractionDigits: value.amount % 1 ? 2 : 0 }).format(value.amount);
}

export async function getShopPolicies(): Promise<ShopPolicy[]> {
  if (!shopifyIsConfigured()) return [];
  try {
    const data = await shopifyFetch<{ shop: Record<string, ShopPolicy | null> }>(`query Policies { shop { privacyPolicy { title body url handle } refundPolicy { title body url handle } shippingPolicy { title body url handle } termsOfService { title body url handle } } }`);
    return Object.values(data.shop).filter((policy): policy is ShopPolicy => Boolean(policy));
  } catch { return []; }
}

const cartFields = `
  id totalQuantity checkoutUrl
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) { nodes { id quantity merchandise { ... on ProductVariant { id title price { amount currencyCode } image { url altText width height } product { title handle } } } } }
`;

function mapCart(cart: any): Cart {
  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    checkoutUrl: cart.checkoutUrl,
    subtotal: money(cart.cost.subtotalAmount),
    lines: cart.lines.nodes.map((line: any) => ({ ...line, merchandise: { ...line.merchandise, price: money(line.merchandise.price), image: line.merchandise.image ? { ...line.merchandise.image, altText: line.merchandise.image.altText || line.merchandise.product.title } : undefined } })),
  };
}

export async function cartQuery(id: string, buyerIp?: string) {
  const data = await shopifyFetch<{ cart: any }>(`query Cart($id: ID!) { cart(id: $id) { ${cartFields} } }`, { id }, buyerIp);
  return data.cart ? mapCart(data.cart) : undefined;
}
export async function cartCreate(merchandiseId: string, quantity: number, buyerIp?: string) {
  const data = await shopifyFetch<{ cartCreate: { cart: any; userErrors: { message: string }[]; warnings: { message: string }[] } }>(`mutation CartCreate($input: CartInput!) { cartCreate(input: $input) { cart { ${cartFields} } userErrors { message } warnings { message } } }`, { input: { buyerIdentity: { countryCode: 'IL' }, lines: [{ merchandiseId, quantity }] } }, buyerIp);
  if (data.cartCreate.userErrors.length) throw new Error(data.cartCreate.userErrors[0].message);
  if (data.cartCreate.warnings.length || !data.cartCreate.cart?.totalQuantity) throw new Error(data.cartCreate.warnings[0]?.message || 'המוצר לא נוסף לסל');
  return mapCart(data.cartCreate.cart);
}
export async function cartLinesAdd(id: string, merchandiseId: string, quantity: number, buyerIp?: string) {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: any; userErrors: { message: string }[]; warnings: { message: string }[] } }>(`mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${cartFields} } userErrors { message } warnings { message } } }`, { cartId: id, lines: [{ merchandiseId, quantity }] }, buyerIp);
  if (data.cartLinesAdd.userErrors.length) throw new Error(data.cartLinesAdd.userErrors[0].message);
  if (data.cartLinesAdd.warnings.length) throw new Error(data.cartLinesAdd.warnings[0].message);
  return mapCart(data.cartLinesAdd.cart);
}
export async function cartLinesUpdate(id: string, lineId: string, quantity: number, buyerIp?: string) {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: any; userErrors: { message: string }[] } }>(`mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${cartFields} } userErrors { message } } }`, { cartId: id, lines: [{ id: lineId, quantity }] }, buyerIp);
  if (data.cartLinesUpdate.userErrors.length) throw new Error(data.cartLinesUpdate.userErrors[0].message);
  return mapCart(data.cartLinesUpdate.cart);
}
export async function cartLinesRemove(id: string, lineId: string, buyerIp?: string) {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: any; userErrors: { message: string }[] } }>(`mutation Remove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${cartFields} } userErrors { message } } }`, { cartId: id, lineIds: [lineId] }, buyerIp);
  if (data.cartLinesRemove.userErrors.length) throw new Error(data.cartLinesRemove.userErrors[0].message);
  return mapCart(data.cartLinesRemove.cart);
}
