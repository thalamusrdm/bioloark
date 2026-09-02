'use client';

import { useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const scrollStorageKey = 'bioloark-category-filter-scroll';
let pendingScrollPosition: number | null = null;

export function CategoryFilter({ filters, currentHandle }: { filters: { title: string; href: string }[]; currentHandle: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const showBack = currentHandle !== 'all-products';

  useLayoutEffect(() => {
    const storedPosition = window.sessionStorage.getItem(scrollStorageKey);
    const savedPosition = pendingScrollPosition ?? (storedPosition === null ? Number.NaN : Number(storedPosition));
    if (!Number.isFinite(savedPosition)) return;
    const targetPosition = savedPosition;
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    const restore = () => window.scrollTo(0, targetPosition);
    restore();
    const frame = window.requestAnimationFrame(restore);
    const shortTimer = window.setTimeout(restore, 60);
    const finalTimer = window.setTimeout(() => {
      restore();
      pendingScrollPosition = null;
      window.sessionStorage.removeItem(scrollStorageKey);
      document.documentElement.style.scrollBehavior = previousBehavior;
    }, 260);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(shortTimer);
      window.clearTimeout(finalTimer);
      document.documentElement.style.scrollBehavior = previousBehavior;
    };
  }, [pathname]);

  const navigate = (href: string) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    pendingScrollPosition = window.scrollY;
    window.sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
    const targetPosition = window.scrollY;
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    router.push(href, { scroll: false });
    [0, 60, 180, 380, 700].forEach((delay, index, delays) => window.setTimeout(() => {
      window.scrollTo(0, targetPosition);
      if (index === delays.length - 1) document.documentElement.style.scrollBehavior = previousBehavior;
    }, delay));
  };

  const goBack = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const targetPosition = window.scrollY;
    pendingScrollPosition = targetPosition;
    window.sessionStorage.setItem(scrollStorageKey, String(targetPosition));
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    if (window.history.length > 1) router.back();
    else router.push('/category/all-products', { scroll: false });
    [0, 60, 180, 380, 700].forEach((delay, index, delays) => window.setTimeout(() => {
      window.scrollTo(0, targetPosition);
      if (index === delays.length - 1) document.documentElement.style.scrollBehavior = previousBehavior;
    }, delay));
  };

  return <div className={`collection-category-navigation${showBack ? ' has-back' : ''}`}>{showBack && <button className="category-back-button" type="button" onClick={goBack} aria-label="חזרה לעמוד הקודם"><span aria-hidden="true">→</span>חזרה</button>}<nav className={`collection-category-filter category-count-${filters.length}`} aria-label="סינון מוצרים לפי קטגוריה">{filters.map((filter) => <button type="button" key={filter.href} onClick={() => navigate(filter.href)} aria-current={decodeURIComponent(filter.href).endsWith(`/${currentHandle}`) ? 'page' : undefined}>{filter.title}</button>)}</nav></div>;
}
