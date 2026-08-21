import type { Product } from '../lib/types';
import { formatMoney } from '../lib/commerce';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return <article className="product-card" data-reveal><a href={`/product-page/${encodeURIComponent(product.handle)}`} aria-label={`לצפייה במוצר ${product.title}`}><div className="product-image-wrap"><img src={product.images[0]?.url} alt={product.images[0]?.altText || product.title} loading={priority ? 'eager' : 'lazy'} />{!product.availableForSale && <span className="sale-badge">אזל זמנית</span>}<span className="product-arrow">↙</span></div><div className="product-meta"><div><h3>{product.title}</h3><p>{product.collections[0] || 'Bioloark collection'}</p></div><strong>{formatMoney(product.price)}</strong></div></a></article>;
}
