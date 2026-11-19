'use client';

import { FormEvent, useState } from 'react';
import { useCart } from './cart-provider';

const FREE_DELIVERY_MINIMUM = 400;

type EligibilityResponse = {
  address: string;
  distanceKm: number;
  withinRadius: boolean;
  error?: string;
};

export function DeliveryEligibilityChecker() {
  const { cart } = useCart();
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<EligibilityResponse>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const subtotal = Number(cart?.subtotal.amount || 0);
  const meetsMinimum = subtotal > FREE_DELIVERY_MINIMUM;
  const remaining = Math.max(0, FREE_DELIVERY_MINIMUM + 0.01 - subtotal);

  async function checkEligibility(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(undefined);
    try {
      const response = await fetch('/api/delivery-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const payload = await response.json() as EligibilityResponse;
      if (!response.ok) throw new Error(payload.error || 'לא הצלחנו לבדוק את הכתובת');
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'לא הצלחנו לבדוק את הכתובת');
    } finally {
      setLoading(false);
    }
  }

  const eligible = Boolean(result?.withinRadius && meetsMinimum);
  return (
    <section className="delivery-check-card">
      <div className="delivery-check-intro">
        <p className="eyebrow dark">FREE LOCAL DELIVERY</p>
        <h1>בדיקת זכאות למשלוח חינם</h1>
        <p>המשלוח החינמי זמין כאשר הכתובת נמצאת ברדיוס של עד 10 ק״מ ממאפו 13, תל אביב, וסכום הקנייה גבוה מ־₪400.</p>
      </div>

      <form onSubmit={checkEligibility} className="delivery-check-form">
        <label htmlFor="delivery-address">כתובת מלאה למשלוח</label>
        <div>
          <input id="delivery-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="רחוב, מספר, עיר" minLength={5} required autoComplete="street-address" />
          <button type="submit" disabled={loading}>{loading ? 'בודקים…' : 'בדיקת כתובת'}</button>
        </div>
        <small>הכתובת משמשת לבדיקה בלבד ואינה נשמרת באתר. נתוני מפה © OpenStreetMap contributors.</small>
      </form>

      <div className="delivery-check-cart" aria-label="מצב סכום הקנייה">
        <span>סכום נוכחי בסל</span>
        <strong>₪{subtotal.toFixed(2)}</strong>
        {meetsMinimum ? <em className="is-valid">סף הקנייה הושג ✓</em> : <em>חסרים ₪{remaining.toFixed(2)} לזכאות</em>}
      </div>

      <div className="delivery-check-result" aria-live="polite">
        {error && <p className="delivery-check-error">{error}</p>}
        {result && <>
          <h2>{eligible ? 'נראה שיש זכאות למשלוח חינם' : 'עדיין אין זכאות למשלוח חינם'}</h2>
          <ul>
            <li className={result.withinRadius ? 'is-valid' : 'is-invalid'}>כתובת בטווח 10 ק״מ: {result.withinRadius ? 'כן' : 'לא'} <small>({result.distanceKm.toFixed(1)} ק״מ ממאפו 13)</small></li>
            <li className={meetsMinimum ? 'is-valid' : 'is-invalid'}>סכום קנייה מעל ₪400: {meetsMinimum ? 'כן' : 'לא'}</li>
          </ul>
          <p>הכתובת שנמצאה: {result.address}</p>
        </>}
      </div>

      <aside className="delivery-check-note">
        הבדיקה המוקדמת היא הערכה לפי מרחק אווירי. המחיר והזכאות הסופיים נקבעים לפי הכתובת והסל המעודכנים בקופה המאובטחת של Shopify.
      </aside>
      <a className="delivery-check-shop" href="/category/all-products">להמשך קנייה ←</a>
    </section>
  );
}
