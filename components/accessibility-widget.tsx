'use client';

import { useEffect, useRef, useState } from 'react';

type Preference = 'contrast' | 'grayscale' | 'links' | 'readable' | 'motion';

const options: Array<{ key: Preference; label: string }> = [
  { key: 'contrast', label: 'ניגודיות מוגברת' },
  { key: 'grayscale', label: 'תצוגה בגווני אפור' },
  { key: 'links', label: 'הדגשת קישורים' },
  { key: 'readable', label: 'פונט קריא' },
  { key: 'motion', label: 'הפחתת תנועה' },
];

const emptyPreferences: Record<Preference, boolean> = { contrast: false, grayscale: false, links: false, readable: false, motion: false };

function applyPreferences(preferences: Record<Preference, boolean>) {
  options.forEach(({ key }) => document.documentElement.classList.toggle(`a11y-${key}`, preferences[key]));
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [preferences, setPreferences] = useState(emptyPreferences);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bioloark-accessibility') || '{}') as Partial<Record<Preference, boolean>>;
      const next = { ...emptyPreferences, ...saved };
      setPreferences(next); applyPreferences(next);
      setHidden(localStorage.getItem('bioloark-accessibility-hidden') === 'true');
    } catch { /* Ignore invalid browser storage. */ }
    const show = () => { setHidden(false); setOpen(true); localStorage.removeItem('bioloark-accessibility-hidden'); };
    window.addEventListener('bioloark:show-accessibility', show);
    return () => window.removeEventListener('bioloark:show-accessibility', show);
  }, []);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const toggle = (key: Preference) => {
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next); applyPreferences(next);
    localStorage.setItem('bioloark-accessibility', JSON.stringify(next));
  };
  const reset = () => { setPreferences(emptyPreferences); applyPreferences(emptyPreferences); localStorage.removeItem('bioloark-accessibility'); };
  const hide = () => { setOpen(false); setHidden(true); localStorage.setItem('bioloark-accessibility-hidden', 'true'); };

  if (hidden) return null;
  return <aside className="accessibility-widget" aria-label="כלי נגישות">
    {open && <div className="accessibility-panel" id="accessibility-panel">
      <div className="accessibility-panel-head"><h2>כלי נגישות</h2><button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="סגירת תפריט הנגישות">×</button></div>
      <p>בחרו התאמות תצוגה. להגדלת כל האתר ניתן להשתמש ב־Ctrl ו־+.</p>
      <div className="accessibility-options">{options.map(({ key, label }) => <button type="button" key={key} className={preferences[key] ? 'active' : ''} aria-pressed={preferences[key]} onClick={() => toggle(key)}>{label}</button>)}</div>
      <div className="accessibility-panel-actions"><button type="button" onClick={reset}>איפוס התאמות</button><a href="/policies/accessibility-statement">הצהרת נגישות</a></div>
    </div>}
    <div className="accessibility-launcher">
      <button className="accessibility-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="accessibility-panel" aria-label="פתיחת כלי נגישות"><img src="/images/accessibility-hands.png" alt="" aria-hidden="true" /><span>נגישות</span></button>
      <button className="accessibility-hide" type="button" onClick={hide} aria-label="הסתרת כפתור הנגישות">×</button>
    </div>
  </aside>;
}

export function AccessibilityRestoreButton() {
  return <button className="accessibility-restore" type="button" onClick={() => window.dispatchEvent(new Event('bioloark:show-accessibility'))}>הצגת כלי נגישות</button>;
}
