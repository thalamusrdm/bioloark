'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Cart, CartLine } from '../lib/types';

type CartMerchandise = CartLine['merchandise'];

type CartContextValue = {
  cart?: Cart;
  isOpen: boolean;
  loading: boolean;
  error?: string;
  shopifyEnabled: boolean;
  open: () => void;
  close: () => void;
  add: (merchandiseId: string, quantity?: number, previewMerchandise?: CartMerchandise) => Promise<boolean>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children, shopifyEnabled }: { children: React.ReactNode; shopifyEnabled: boolean }) {
  const [cart, setCart] = useState<Cart>();
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [addedNoticeOpen, setAddedNoticeOpen] = useState(false);

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
    open: () => { setAddedNoticeOpen(false); setOpen(true); if (shopifyEnabled && !cart) void request().catch(() => undefined); }, close: () => setOpen(false),
    add: async (merchandiseId, quantity = 1, previewMerchandise) => {
      if (!shopifyEnabled) {
        if (!previewMerchandise) return false;
        setCart((current) => {
          const lines = current?.lines || [];
          const existing = lines.find((line) => line.merchandise.id === merchandiseId);
          const nextLines = existing
            ? lines.map((line) => line.merchandise.id === merchandiseId ? { ...line, quantity: line.quantity + quantity } : line)
            : [...lines, { id: `preview-${merchandiseId}`, quantity, merchandise: previewMerchandise }];
          return { totalQuantity: nextLines.reduce((sum, line) => sum + line.quantity, 0), lines: nextLines, subtotal: { amount: nextLines.reduce((sum, line) => sum + line.merchandise.price.amount * line.quantity, 0), currencyCode: previewMerchandise.price.currencyCode } };
        });
        setAddedNoticeOpen(true);
        window.setTimeout(() => setAddedNoticeOpen(false), 6500);
        return true;
      }
      try {
        await request({ action: 'add', merchandiseId, quantity });
        setAddedNoticeOpen(true);
        window.setTimeout(() => setAddedNoticeOpen(false), 6500);
        return true;
      } catch {
        return false;
      }
    },
    update: async (lineId, quantity) => {
      if (!shopifyEnabled) { setCart((current) => updatePreviewCart(current, lineId, quantity)); return; }
      await request({ action: 'update', lineId, quantity });
    },
    remove: async (lineId) => {
      if (!shopifyEnabled) { setCart((current) => updatePreviewCart(current, lineId, 0)); return; }
      await request({ action: 'remove', lineId });
    },
  }), [cart, isOpen, loading, error, shopifyEnabled, request]);

  return <CartContext.Provider value={value}>{children}{addedNoticeOpen && <aside className="cart-added-notice" role="status" aria-live="polite"><button className="cart-added-close" type="button" onClick={() => setAddedNoticeOpen(false)} aria-label="סגירת ההודעה">×</button><strong>המוצר נוסף לסל</strong><div><button type="button" onClick={() => setAddedNoticeOpen(false)}>להמשיך לקנות</button><button className="cart-added-open" type="button" onClick={value.open}>מעבר לסל</button></div></aside>}</CartContext.Provider>;
}

function updatePreviewCart(cart: Cart | undefined, lineId: string, quantity: number): Cart | undefined {
  if (!cart) return cart;
  const lines = quantity > 0 ? cart.lines.map((line) => line.id === lineId ? { ...line, quantity } : line) : cart.lines.filter((line) => line.id !== lineId);
  return { ...cart, lines, totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0), subtotal: { ...cart.subtotal, amount: lines.reduce((sum, line) => sum + line.merchandise.price.amount * line.quantity, 0) } };
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
}
