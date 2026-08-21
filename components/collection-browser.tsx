'use client';

import { useMemo, useState } from 'react';
import type { Product } from '../lib/types';
import { ProductCard } from './product-card';

export function CollectionBrowser({ products }: { products: Product[] }) {
  const [sort, setSort] = useState('featured');
  const [availableOnly, setAvailableOnly] = useState(false);
  const visible = useMemo(() => {
    const next = availableOnly ? products.filter((product) => product.availableForSale) : [...products];
    if (sort === 'price-asc') next.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === 'price-desc') next.sort((a, b) => b.price.amount - a.price.amount);
    if (sort === 'title') next.sort((a, b) => a.title.localeCompare(b.title, 'he'));
    return next;
  }, [availableOnly, products, sort]);
  return <><div className="collection-toolbar"><p>{visible.length} פריטים</p><div><label className="availability-filter"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} /> זמינים לרכישה</label><label>מיון<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">מומלצים</option><option value="price-asc">מחיר: מהנמוך לגבוה</option><option value="price-desc">מחיר: מהגבוה לנמוך</option><option value="title">שם</option></select></label></div></div><div className="product-grid collection-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}</div></>;
}
