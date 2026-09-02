'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './cart-provider';

const shopSections = [
  { title: 'יצירות מוכנות', href: '/category/טרריומים-מעוצבים', items: [{ title: 'טרריום נוף', href: '/category/טרריום-נוף' }, { title: 'טרריום טורפים', href: '/category/טרריום-טורפים' }] },
  { title: 'הכל לטרריום', href: '/category/כלים-להכנה', items: [{ title: 'מצע אדמה ופחם', href: '/category/מצע-אדמה-ופחם' }, { title: 'סלעים וגזעים', href: '/category/סלעים-וגזעים' }, { title: 'כלי זכוכית ותאורה', href: '/category/טרריומים-כלי-זכוכית-ותאורה-1' }] },
  { title: 'צמחים', href: '/category/rare-plants', items: [{ title: 'מטפסים ומתפשטים', href: '/category/מטפסים' }, { title: 'שרכים', href: '/category/שרכים' }, { title: 'מוס', href: '/category/מוס' }, { title: 'ביגוניות וסחלבים', href: '/category/ביגוניות-וסחלבים' }] },
  { title: 'סדנאות', href: '/workshops', items: [] },
  { title: 'בלוג וטיפים', href: '/blog', items: [] },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = decodeURI(pathname);
  const isCurrent = (href: string) => currentPath === href;
  const { cart, open } = useCart();
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); } };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Bioloark — דף הבית"><img src="/images/logo-header.png" alt="Bioloark" /></a>
        <nav className="desktop-nav" aria-label="ניווט ראשי">
          {shopSections.map((section) => section.items.length ? <div className="nav-menu" key={section.title}><a className="nav-parent" href={section.href}>{section.title}<span>⌄</span></a><div className="nav-dropdown"><a href={section.href}>{section.title}</a>{section.items.map((item) => <a href={item.href} key={item.href}>{item.title}</a>)}</div></div> : <a key={section.title} href={section.href}>{section.title}</a>)}<a href="/#about">קצת עלינו</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => setSearchOpen((value) => !value)} aria-expanded={searchOpen} aria-controls="header-search" aria-label="חיפוש"><svg className="search-icon" viewBox="0 0 32 32" aria-hidden="true"><circle cx="14" cy="14" r="7.5" /><path d="m19.5 19.5 6 6" /></svg></button>
          <button className="cart-button" onClick={open} aria-label={`פתיחת הסל, ${cart?.totalQuantity || 0} פריטים`}>
            <span className="cart-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" role="presentation"><path d="M3.5 5.5h4l2.4 14h13.7l2.5-10H9.2" /><path d="M12 25.5a1.7 1.7 0 1 0 0 .01M22.5 25.5a1.7 1.7 0 1 0 0 .01" /></svg>
              <span className="cart-count">{cart?.totalQuantity || 0}</span>
            </span>
          </button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}><i /><i /><i /></button>
        </div>
      </header>
      {menuOpen && <div className="mobile-menu"><button onClick={() => setMenuOpen(false)} aria-label="סגירת תפריט">×</button><nav><a href="/category/all-products" aria-current={isCurrent('/category/all-products') ? 'page' : undefined}>כל המוצרים</a>{shopSections.map((section) => section.items.length ? <details key={section.title} data-current={section.items.some((item) => isCurrent(item.href)) || isCurrent(section.href) ? 'true' : undefined}><summary>{section.title}</summary><div>{section.items.map((item) => <a href={item.href} key={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.title}</a>)}</div></details> : <a href={section.href} key={section.title} aria-current={isCurrent(section.href) ? 'page' : undefined}>{section.title}</a>)}<a href="/#about">קצת עלינו</a></nav><nav className="mobile-menu-social" aria-label="רשתות חברתיות"><a href="https://www.instagram.com/bioloark_israel" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/BioloarkIsrael" target="_blank" rel="noreferrer">Facebook</a><a href="https://wa.me/972522233640" target="_blank" rel="noreferrer">WhatsApp</a></nav><p>מאפו 13, מרכז תל אביב<br />info@bioloark.co.il</p></div>}
      {searchOpen && <div className="search-popover" id="header-search" role="search" aria-label="חיפוש באתר"><button className="search-close" onClick={() => setSearchOpen(false)} aria-label="סגירת החיפוש">×</button><form action="/search"><label htmlFor="site-search">חיפוש באתר</label><div><input autoFocus id="site-search" name="q" placeholder="טרריום, צמח או כלי…" /><button type="submit">חיפוש</button></div></form></div>}
    </>
  );
}
