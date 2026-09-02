'use client';

import { useCart } from './cart-provider';
import type { Money, ProductImage } from '../lib/types';

export function QuickAddToCart({ variantId, available, title, handle, image, price }: { variantId?: string; available: boolean; title: string; handle: string; image?: ProductImage; price: Money }) {
  const { add, loading } = useCart();
  return <button className="product-quick-add" type="button" disabled={!available || !variantId || loading} onClick={() => variantId && void add(variantId, 1, { id: variantId, title: 'Default Title', product: { title, handle }, image, price })}>{!available ? 'אזל זמנית' : loading ? 'מוסיף לסל…' : 'הוסף לסל'}</button>;
}
