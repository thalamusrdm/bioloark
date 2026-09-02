'use client';

import { useCart } from './cart-provider';

function shekels(amount: number, currency = 'ILS') { return new Intl.NumberFormat('he-IL', { style: 'currency', currency }).format(amount); }

export function CartDrawer() {
  const { cart, isOpen, close, loading, error, shopifyEnabled, update, remove } = useCart();
  if (!isOpen) return null;
  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-label="סל קניות">
      <button className="drawer-scrim" onClick={close} aria-label="סגירת הסל" />
      <aside className="cart-drawer">
        <div className="drawer-head"><div><p className="eyebrow dark">YOUR SELECTION</p><h2>הסל שלך</h2></div><button onClick={close} aria-label="סגירה">×</button></div>
        {!shopifyEnabled && !cart?.lines.length ? <div className="preview-cart"><span>Preview</span><h3>הסל מוכן לבדיקה</h3><p>הוסיפו מוצר כדי לבדוק את חוויית סל הקניות. התשלום המאובטח יופעל בחיבור ל־Shopify.</p></div> : cart?.lines.length ? <>
          <div className="cart-lines">{cart.lines.map((line) => <article className="cart-line" key={line.id}>{line.merchandise.image && <img src={line.merchandise.image.url} alt={line.merchandise.image.altText} />}<div><h3>{line.merchandise.product.title}</h3><p>{line.merchandise.title !== 'Default Title' ? line.merchandise.title : ''}</p><strong>{shekels(line.merchandise.price.amount, line.merchandise.price.currencyCode)}</strong><div className="quantity"><button onClick={() => line.quantity > 1 ? update(line.id, line.quantity - 1) : remove(line.id)} aria-label="הפחתת כמות">−</button><span>{line.quantity}</span><button onClick={() => update(line.id, line.quantity + 1)} aria-label="הגדלת כמות">+</button><button className="remove" onClick={() => remove(line.id)}>הסרה</button></div></div></article>)}</div>
          <div className="cart-summary"><div><span>סכום ביניים</span><strong>{shekels(cart.subtotal.amount, cart.subtotal.currencyCode)}</strong></div><p>משלוח ומסים יחושבו בשלב התשלום.</p>{shopifyEnabled && cart.checkoutUrl ? <a className="checkout-button" href={cart.checkoutUrl}>לתשלום מאובטח ב־Shopify</a> : <a className="checkout-button" href="mailto:info@bioloark.co.il">להשלמת הזמנה צרו קשר</a>}</div>
        </> : <div className="empty-cart"><p>הסל עדיין ריק.</p><button onClick={close}>להמשיך לקולקציה</button></div>}
        {loading && <p className="cart-status">מעדכנים את הסל…</p>}{error && <p className="cart-error">{error}</p>}
      </aside>
    </div>
  );
}
