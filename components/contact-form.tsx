'use client';

import { FormEvent, useEffect, useState } from 'react';

export function ContactForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setMessage('');
    const form = event.currentTarget;
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setStatus('error');
      setMessage(result.error || 'לא הצלחנו לשלוח כרגע. נסו שוב בעוד רגע.');
      return;
    }
    form.reset();
    setStatus('success');
  }

  return (
    <>
      <button className="primary-button dark-button contact-trigger" type="button" onClick={() => { setOpen(true); setStatus('idle'); }}>
        יצירת קשר וייעוץ <span>←</span>
      </button>
      {open && <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div className="contact-dialog">
          <button className="contact-close" type="button" onClick={() => setOpen(false)} aria-label="סגירת הטופס">×</button>
          {status === 'success' ? <div className="contact-success"><p className="eyebrow dark">תודה</p><h3 id="contact-title">הפרטים נשלחו בהצלחה</h3><p>נחזור אליכם בהקדם.</p><button type="button" onClick={() => setOpen(false)}>סגירה</button></div> : <>
            <p className="eyebrow dark">LET&apos;S TALK</p>
            <h3 id="contact-title">נשמח לשמוע מכם</h3>
            <form onSubmit={submit}>
              <label>שם מלא<input name="name" autoComplete="name" required /></label>
              <label>טלפון<input name="phone" type="tel" autoComplete="tel" required /></label>
              <label>אימייל<input name="email" type="email" autoComplete="email" required /></label>
              <label className="contact-message">במה נוכל לעזור?<textarea name="message" rows={4} required /></label>
              <label className="contact-honeypot" aria-hidden="true">אתר<input name="website" tabIndex={-1} autoComplete="off" /></label>
              <button className="primary-button dark-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'שולחים…' : 'שליחת פרטים'}</button>
              {status === 'error' && <p className="contact-error" role="alert">{message}</p>}
            </form>
          </>}
        </div>
      </div>}
    </>
  );
}
