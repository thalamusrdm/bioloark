'use client';

import { useEffect, useState } from 'react';
import { useCart } from './cart-provider';

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
          <a href="/category/all-products">החנות</a><a href="/category/rare-plants">צמחים</a><a href="/category/כלים-להכנה">כלים להכנה</a><a href="/category/טרריומים-מעוצבים">טרריומים מעוצבים</a><a href="/#about">קצת עלינו</a><a href="/project-showcase">פרויקטים</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => setSearchOpen(true)} aria-label="חיפוש"><span aria-hidden="true">⌕</span></button>
          <button className="cart-button" onClick={open} aria-label={`פתיחת הסל, ${cart?.totalQuantity || 0} פריטים`}>סל <span>{cart?.totalQuantity || 0}</span></button>
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="פתיחת תפריט"><i /><i /><i /></button>
        </div>
      </header>
      {menuOpen && <div className="mobile-menu"><button onClick={() => setMenuOpen(false)} aria-label="סגירת תפריט">×</button><nav><a href="/category/all-products">כל המוצרים</a><a href="/category/rare-plants">צמחים נדירים</a><a href="/category/כלים-להכנה">כלים להכנה</a><a href="/category/טרריומים-מעוצבים">טרריומים מעוצבים</a><a href="/project-showcase">פרויקטים נבחרים</a><a href="/#about">קצת עלינו</a></nav><p>מאפו 13, מרכז תל אביב<br />info@bioloark.co.il</p></div>}
      {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="חיפוש באתר"><button className="overlay-close" onClick={() => setSearchOpen(false)} aria-label="סגירה">×</button><form action="/search"><label htmlFor="site-search">מה תרצו למצוא?</label><div><input autoFocus id="site-search" name="q" placeholder="טרריום, צמח או כלי…" /><button type="submit">חיפוש</button></div></form></div>}
    </>
  );
}
