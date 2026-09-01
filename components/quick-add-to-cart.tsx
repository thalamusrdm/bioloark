'use client';

import { useCart } from './cart-provider';

export function QuickAddToCart({ variantId, available }: { variantId?: string; available: boolean }) {
  const { add, loading } = useCart();
  return <button className="product-quick-add" type="button" disabled={!available || !variantId || loading} onClick={() => variantId && add(variantId, 1)}>{available ? 'הוסף לסל' : 'אזל זמנית'}</button>;
}
