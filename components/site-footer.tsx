import { getShopPolicies } from '../lib/commerce';
import { localPolicies } from '../lib/local-policies';
import { AccessibilityRestoreButton } from './accessibility-widget';

export async function SiteFooter() {
  const shopPolicies = await getShopPolicies();
  const policies = [...localPolicies, ...shopPolicies.filter((policy) => !localPolicies.some((local) => local.handle === policy.handle))];
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><a className="footer-logo-link" href="/" aria-label="Bioloark — דף הבית"><img className="footer-logo" src="/images/logo-header.png" alt="Bioloark" /></a><p>טרריומים נדירים ועיצובים בוטניים בהשראת מסורת הזן היפנית.</p></div>
        <div><h3>גלו</h3><a href="/category/all-products">כל המוצרים</a><a href="/category/rare-plants">צמחים</a><a href="/category/כלים-להכנה">הכל לטרריום</a><a href="/project-showcase">פרויקטים</a></div>
        <div className="footer-contact"><h3>יצירת קשר</h3><a href="mailto:info@bioloark.co.il">info@bioloark.co.il</a><a href="tel:0522233640" dir="ltr">052-2233640</a><p>מאפו 13, מרכז תל אביב<br />ישראל</p><a className="footer-whatsapp" href="https://wa.me/972522233640" target="_blank" rel="noreferrer" aria-label="פתיחת שיחת WhatsApp עם חנות Bioloark"><span aria-hidden="true">↗</span>שיחה ב־WhatsApp</a></div>
        <div><h3>שעות פעילות</h3><p>א׳–ה׳: 10:00–19:00<br />ו׳: 09:00–14:00</p><div className="social-links"><a href="https://www.instagram.com/bioloark_israel" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/BioloarkIsrael" target="_blank" rel="noreferrer">Facebook</a></div></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Bioloark. כל הזכויות שמורות.</span><nav aria-label="מדיניות החנות">{policies.map((policy) => <a href={`/policies/${policy.handle}`} key={policy.handle}>{policy.title}</a>)}<AccessibilityRestoreButton /></nav></div>
    </footer>
  );
}
