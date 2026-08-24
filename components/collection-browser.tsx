'use client';

import type { Product } from '../lib/types';
import { ProductCard } from './product-card';

export function CollectionBrowser({ products }: { products: Product[] }) {
  return <div className="collection-browser"><div className="collection-toolbar"><p>{products.length} {products.length === 1 ? 'פריט' : 'פריטים'}</p></div><div className="product-grid collection-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}</div></div>;
}
