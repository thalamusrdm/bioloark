'use client';

import { useEffect, useState } from 'react';

const TAG_ID = 'AW-18511642896';
const CONSENT_KEY = 'bioloark-ad-measurement-consent-v1';
type Choice = 'accepted' | 'declined';
type Gtag = (...args: unknown[]) => void;
type TaggedWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

// Only the Shopify Google & YouTube app sends purchase events, after checkout.
// This tag preserves ad-click attribution on the separate Next.js storefront.
export function GoogleAdsMeasurement() {
  const [showChoice, setShowChoice] = useState(false);

  useEffect(() => {
    const tagged = window as TaggedWindow;
    tagged.dataLayer = tagged.dataLayer || [];
    const gtag: Gtag = tagged.gtag || function (...args: unknown[]) {
      tagged.dataLayer!.push(arguments);
      void args;
    };
    tagged.gtag = gtag;
    if (!document.getElementById('bioloark-google-ads-tag')) {
      gtag('consent', 'default', {
        ad_storage: 'denied', analytics_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied',
      });
      gtag('set', 'ads_data_redaction', true);
      gtag('set', 'url_passthrough', true);
      gtag('set', 'linker', {
        domains: ['bioloark.co.il', '2fbwew-8r.myshopify.com'],
        accept_incoming: true,
      });
      let saved: string | null = null;
      try { saved = localStorage.getItem(CONSENT_KEY); } catch { /* Storage can be unavailable. */ }
      if (saved === 'accepted') {
        gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });
      }
      setShowChoice(saved !== 'accepted' && saved !== 'declined');
      gtag('js', new Date());
      gtag('config', TAG_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
      const script = document.createElement('script');
      script.id = 'bioloark-google-ads-tag';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`;
      document.head.appendChild(script);
    } else {
      try { setShowChoice(!['accepted', 'declined'].includes(localStorage.getItem(CONSENT_KEY) || '')); }
      catch { setShowChoice(true); }
    }
  }, []);

  function choose(choice: Choice) {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch { /* Apply for this visit even without storage. */ }
    (window as TaggedWindow).gtag?.('consent', 'update', {
      ad_storage: choice === 'accepted' ? 'granted' : 'denied',
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    setShowChoice(false);
  }

  return <>
    {showChoice && <aside className="ad-consent-panel" aria-label="העדפות מדידת פרסום">
      <strong>עוגיות למדידת פרסום</strong>
      <p>באישורכם נשתמש בעוגיות של Google כדי למדוד אילו מודעות מובילות לביקורים ורכישות. <a href="/policies/privacy-policy">מדיניות הפרטיות</a></p>
      <div><button type="button" onClick={() => choose('declined')}>ללא עוגיות פרסום</button><button type="button" onClick={() => choose('accepted')}>אישור עוגיות מדידה</button></div>
    </aside>}
    {!showChoice && <button className="ad-consent-settings" type="button" onClick={() => setShowChoice(true)}>העדפות עוגיות</button>}
  </>;
}
