'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Cart } from '../lib/types';

type CartContextValue = {
  cart?: Cart;
  isOpen: boolean;
  loading: boolean;
  error?: string;
  shopifyEnabled: boolean;
  open: () => void;
  close: () => void;
  add: (merchandiseId: string, quantity?: number) => Promise<void>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children, shopifyEnabled }: { children: React.ReactNode; shopifyEnabled: boolean }) {
  const [cart, setCart] = useState<Cart>();
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const request = useCallback(async (body?: object) => {
    setLoading(true); setError(undefined);
    try {
      const response = await fetch('/api/cart', { method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
      const payload = await response.json() as { cart?: Cart; error?: string };
      if (!response.ok) throw new Error(payload.error || 'לא ניתן לעדכן את הסל');
      setCart(payload.cart);
      return payload.cart as Cart;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'לא ניתן לעדכן את הסל');
      throw caught;
    } finally { setLoading(false); }
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    cart, isOpen, loading, error, shopifyEnabled,
    open: () => { setOpen(true); if (shopifyEnabled && !cart) void request().catch(() => undefined); }, close: () => setOpen(false),
    add: async (merchandiseId, quantity = 1) => { if (!shopifyEnabled) { setOpen(true); return; } await request({ action: 'add', merchandiseId, quantity }); setOpen(true); },
    update: async (lineId, quantity) => { await request({ action: 'update', lineId, quantity }); },
    remove: async (lineId) => { await request({ action: 'remove', lineId }); },
  }), [cart, isOpen, loading, error, shopifyEnabled, request]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
}
