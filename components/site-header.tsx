'use client';

import { useEffect, useState } from 'react';
import { useCart } from './cart-provider';

const shopSections = [
  { title: 'יצירות מוכנות', href: '/category/טרריומים-מעוצבים', items: [{ title: 'טרריום נוף', href: '/category/טרריום-נוף' }, { title: 'טרריום טורפים', href: '/category/טרריום-טורפים' }] },
  { title: 'הכל לטרריום', href: '/category/כלים-להכנה', items: [{ title: 'כל המוצרים לטרריום', href: '/category/כלים-להכנה' }, { title: 'מצע אדמה ופחם', href: '/category/מצע-אדמה-ופחם' }, { title: 'סלעים וגזעים', href: '/category/סלעים-וגזעים' }, { title: 'כלי זכוכית ותאורה', href: '/category/טרריומים-כלי-זכוכית-ותאורה-1' }] },
  { title: 'צמחים', href: '/category/rare-plants', items: [{ title: 'כל הצמחים', href: '/category/rare-plants' }, { title: 'מטפסים ומתפשטים', href: '/category/מטפסים' }, { title: 'שרכים', href: '/category/שרכים' }, { title: 'מוס', href: '/category/מוס' }, { title: 'ביגוניות וסחלבים', href: '/category/ביגוניות-וסחלבים' }] },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
          {shopSections.map((section) => section.items.length ? <div className="nav-menu" key={section.title}><a className="nav-parent" href={section.href}>{section.title}<span>⌄</span></a><div className="nav-dropdown"><a href={section.href}>{section.title}</a>{section.items.slice(1).map((item) => <a href={item.href} key={item.href}>{item.title}</a>)}</div></div> : <a key={section.title} href={section.href}>{section.title}</a>)}<a href="/#about">קצת עלינו</a><a href="/project-showcase">פרויקטים</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => setSearchOpen((value) => !value)} aria-expanded={searchOpen} aria-controls="header-search" aria-label="חיפוש"><span aria-hidden="true">⌕</span></button>
          <button className="cart-button" onClick={open} aria-label={`פתיחת הסל, ${cart?.totalQuantity || 0} פריטים`}>סל <span>{cart?.totalQuantity || 0}</span></button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="פתיחת תפריט"><i /><i /><i /></button>
        </div>
      </header>
      {menuOpen && <div className="mobile-menu"><button onClick={() => setMenuOpen(false)} aria-label="סגירת תפריט">×</button><nav><a href="/category/all-products">כל המוצרים</a>{shopSections.map((section) => section.items.length ? <details key={section.title}><summary>{section.title}</summary><div>{section.items.map((item) => <a href={item.href} key={item.href}>{item.title}</a>)}</div></details> : <a href={section.href} key={section.title}>{section.title}</a>)}<a href="/project-showcase">פרויקטים נבחרים</a><a href="/#about">קצת עלינו</a></nav><p>מאפו 13, מרכז תל אביב<br />info@bioloark.co.il</p></div>}
      {searchOpen && <div className="search-popover" id="header-search" role="search" aria-label="חיפוש באתר"><button className="search-close" onClick={() => setSearchOpen(false)} aria-label="סגירת החיפוש">×</button><form action="/search"><label htmlFor="site-search">חיפוש באתר</label><div><input autoFocus id="site-search" name="q" placeholder="טרריום, צמח או כלי…" /><button type="submit">חיפוש</button></div></form></div>}
    </>
  );
}
