import { getShopPolicies } from '../lib/commerce';

export async function SiteFooter() {
  const policies = await getShopPolicies();
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><img className="footer-logo" src="/images/logo-header.png" alt="Bioloark" /><p>טרריומים נדירים ועיצובים בוטניים בהשראת מסורת הזן היפנית.</p></div>
        <div><h3>גלו</h3><a href="/category/all-products">כל המוצרים</a><a href="/category/rare-plants">צמחים</a><a href="/category/כלים-להכנה">כלים להכנה</a><a href="/project-showcase">פרויקטים</a></div>
        <div><h3>יצירת קשר</h3><a href="mailto:info@bioloark.co.il">info@bioloark.co.il</a><p>מאפו 13, מרכז תל אביב<br />ישראל</p></div>
        <div><h3>שעות פעילות</h3><p>א׳–ה׳: 10:00–19:00<br />ו׳: 09:00–14:00</p><div className="social-links"><a href="https://www.instagram.com/bioloark_israel" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/BioloarkIsrael" target="_blank" rel="noreferrer">Facebook</a></div></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Bioloark. כל הזכויות שמורות.</span>{policies.length ? <nav aria-label="מדיניות החנות">{policies.map((policy) => <a href={`/policies/${policy.handle}`} key={policy.handle}>{policy.title}</a>)}</nav> : <span className="policy-placeholder">מדיניות החנות תופיע כאן לאחר חיבור Shopify</span>}</div>
    </footer>
  );
}
