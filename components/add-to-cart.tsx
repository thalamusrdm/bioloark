'use client';

import { useState } from 'react';
import { useCart } from './cart-provider';
import type { ProductImage, ProductVariant } from '../lib/types';

export function AddToCart({ variants, available, title, handle, image, description, showPreviewLabel = false }: { variants: ProductVariant[]; available: boolean; title: string; handle: string; image?: ProductImage; description: string; showPreviewLabel?: boolean }) {
  const initialVariant = variants.find((variant) => variant.availableForSale) || variants[0];
  const [variantId, setVariantId] = useState(initialVariant?.id || '');
  const [quantity, setQuantity] = useState(1);
  const { add, loading } = useCart();
  const selected = variants.find((variant) => variant.id === variantId) || initialVariant;
  const price = selected?.price;
  const formattedPrice = price ? new Intl.NumberFormat('he-IL', { style: 'currency', currency: price.currencyCode || 'ILS', minimumFractionDigits: price.amount % 1 ? 2 : 0 }).format(price.amount) : '';

  return <><div className="product-live-price" aria-live="polite" aria-atomic="true"><p key={variantId} className="product-price product-price-live">{formattedPrice}</p>{variants.length > 1 && selected && <span>מחיר עבור: {selected.title}</span>}</div>{showPreviewLabel && <p className="preview-label">תצוגה מקדימה מתוכן האתר הישן</p>}<div className="product-intro">{description.split(/\r?\n\r?\n/)[0] || 'פרטי המוצר יעודכנו דרך Shopify.'}</div><div className="buy-box">{variants.length > 1 && <label>אפשרות<select value={variantId} onChange={(event) => setVariantId(event.target.value)}>{variants.map((variant) => <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>{variant.title}{!variant.availableForSale ? ' — אזל' : ''}</option>)}</select></label>}<div className="buy-row"><div className="quantity product-quantity"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="הפחתת כמות">−</button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} aria-label="הגדלת כמות">+</button></div><button className="add-button" disabled={!available || !selected?.availableForSale || loading} onClick={() => selected && void add(selected.id, quantity, { id: selected.id, title: selected.title, product: { title, handle }, image, price: selected.price })}>{!available ? 'אזל זמנית' : loading ? 'מוסיף לסל…' : 'הוספה לסל'}</button></div></div></>;
}
