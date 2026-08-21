'use client';

import { useState } from 'react';
import { useCart } from './cart-provider';
import type { ProductVariant } from '../lib/types';

export function AddToCart({ variants, available }: { variants: ProductVariant[]; available: boolean }) {
  const [variantId, setVariantId] = useState(variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const { add, loading, shopifyEnabled } = useCart();
  const selected = variants.find((variant) => variant.id === variantId);
  return <div className="buy-box">{variants.length > 1 && <label>אפשרות<select value={variantId} onChange={(event) => setVariantId(event.target.value)}>{variants.map((variant) => <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>{variant.title}{!variant.availableForSale ? ' — אזל' : ''}</option>)}</select></label>}<div className="buy-row"><div className="quantity product-quantity"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="הפחתת כמות">−</button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} aria-label="הגדלת כמות">+</button></div><button className="add-button" disabled={!available || !selected?.availableForSale || loading} onClick={() => add(variantId, quantity)}>{!available ? 'אזל זמנית' : shopifyEnabled ? 'הוספה לסל' : 'תצוגת Preview — חיבור Shopify ממתין'}</button></div></div>;
}
