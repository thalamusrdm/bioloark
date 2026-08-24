import { NextRequest, NextResponse } from 'next/server';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] || character);

export async function POST(request: NextRequest) {
  try {
    const input = await request.json() as Record<string, unknown>;
    const name = String(input.name || '').trim().slice(0, 100);
    const phone = String(input.phone || '').trim().slice(0, 40);
    const email = String(input.email || '').trim().slice(0, 160);
    const message = String(input.message || '').trim().slice(0, 3000);
    if (String(input.website || '').trim()) return NextResponse.json({ ok: true });
    if (!name || !phone || !emailPattern.test(email) || !message) return NextResponse.json({ error: 'נא למלא שם, טלפון, אימייל והודעה תקינים.' }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL || 'info@bioloark.co.il';
    if (!apiKey || !from) return NextResponse.json({ error: 'טופס יצירת הקשר עדיין לא חובר לשירות הדיוור.' }, { status: 503 });

    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `פנייה חדשה מאתר Bioloark — ${name}`,
        html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.7"><h2>פנייה חדשה מהאתר</h2><p><strong>שם:</strong> ${escapeHtml(name)}</p><p><strong>טלפון:</strong> ${escapeHtml(phone)}</p><p><strong>אימייל:</strong> ${escapeHtml(email)}</p><p><strong>הודעה:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p></div>`,
      }),
    });
    if (!result.ok) return NextResponse.json({ error: 'שליחת ההודעה נכשלה. נסו שוב בעוד רגע.' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'לא הצלחנו לקבל את הפרטים. נסו שוב.' }, { status: 500 });
  }
}
