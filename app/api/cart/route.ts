import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { cartCreate, cartLinesAdd, cartLinesRemove, cartLinesUpdate, cartQuery, shopifyIsConfigured } from '../../../lib/commerce';

const COOKIE_NAME = 'bioloark_cart';
async function context() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const buyerIp = headerStore.get('cf-connecting-ip') || headerStore.get('x-forwarded-for')?.split(',')[0]?.trim();
  return { cookieStore, buyerIp };
}
function response(cart: Awaited<ReturnType<typeof cartQuery>>) {
  const publicCart = cart ? { ...cart, id: undefined } : undefined;
  const next = NextResponse.json({ cart: publicCart });
  if (cart?.id) next.cookies.set(COOKIE_NAME, cart.id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
  return next;
}
export async function GET() {
  if (!shopifyIsConfigured()) return NextResponse.json({ cart: undefined });
  try {
    const { cookieStore, buyerIp } = await context();
    const id = cookieStore.get(COOKIE_NAME)?.value;
    return response(id ? await cartQuery(id, buyerIp) : undefined);
  } catch { return NextResponse.json({ cart: undefined }); }
}
export async function POST(request: NextRequest) {
  if (!shopifyIsConfigured()) return NextResponse.json({ error: 'Shopify עדיין לא מחובר' }, { status: 503 });
  try {
    const input = await request.json() as { action: 'add' | 'update' | 'remove'; merchandiseId?: string; lineId?: string; quantity?: number };
    const { cookieStore, buyerIp } = await context();
    const id = cookieStore.get(COOKIE_NAME)?.value;
    if (input.action === 'add' && input.merchandiseId) {
      let cart;
      if (id) { try { cart = await cartLinesAdd(id, input.merchandiseId, Math.max(1, input.quantity || 1), buyerIp); } catch { cart = await cartCreate(input.merchandiseId, Math.max(1, input.quantity || 1), buyerIp); } }
      else cart = await cartCreate(input.merchandiseId, Math.max(1, input.quantity || 1), buyerIp);
      return response(cart);
    }
    if (!id) return NextResponse.json({ error: 'הסל פג תוקף. הוסיפו את המוצר מחדש.' }, { status: 410 });
    if (input.action === 'update' && input.lineId) return response(await cartLinesUpdate(id, input.lineId, Math.max(1, input.quantity || 1), buyerIp));
    if (input.action === 'remove' && input.lineId) return response(await cartLinesRemove(id, input.lineId, buyerIp));
    return NextResponse.json({ error: 'בקשת סל לא תקינה' }, { status: 400 });
  } catch (caught) { return NextResponse.json({ error: caught instanceof Error ? caught.message : 'לא ניתן לעדכן את הסל' }, { status: 500 }); }
}
