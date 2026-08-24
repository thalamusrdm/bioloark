import { NextRequest, NextResponse } from 'next/server';
import { missingShopifyAdminEnvironmentVariables, shopifyAdminIsConfigured, storeContactInShopify } from '../../../lib/shopify-admin';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const input = await request.json() as Record<string, unknown>;
    const name = String(input.name || '').trim().slice(0, 100);
    const phone = String(input.phone || '').trim().slice(0, 40);
    const email = String(input.email || '').trim().slice(0, 160);
    const message = String(input.message || '').trim().slice(0, 3000);
    if (String(input.website || '').trim()) return NextResponse.json({ ok: true });
    if (!name || !phone || !emailPattern.test(email) || !message) return NextResponse.json({ error: 'נא למלא שם, טלפון, אימייל והודעה תקינים.' }, { status: 400 });

    if (!shopifyAdminIsConfigured()) {
      return NextResponse.json({
        error: 'טופס יצירת הקשר עדיין לא חובר ל-Shopify.',
        missing: missingShopifyAdminEnvironmentVariables(),
      }, { status: 503 });
    }
    await storeContactInShopify({ name, phone, email, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form delivery failed', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'לא הצלחנו לקבל את הפרטים. נסו שוב.' }, { status: 500 });
  }
}
