import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../components/cart-provider';
import { SiteHeader } from '../components/site-header';
import { CartDrawer } from '../components/cart-drawer';
import { SiteFooter } from '../components/site-footer';
import { shopifyIsConfigured } from '../lib/commerce';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bioloark.co.il'),
  title: 'Bioloark | אמנות בוטנית וטרריומים מעוצבים',
  description: 'טרריומים מעוצבים בסגנון יפני קפדני, עם מוס חי ומגוון צמחים. כל טרריום מורכב בעבודת יד כמעשה אמנות חי.',
  openGraph: { title: 'Bioloark | אמנות בוטנית וטרריומים מעוצבים', description: 'עולמות קטנים של טבע, מורכבים ביד ומעוצבים לחיים.', images: ['/images/og.jpg'], locale: 'he_IL', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Bioloark | אמנות בוטנית וטרריומים מעוצבים', description: 'עולמות קטנים של טבע, מורכבים ביד ומעוצבים לחיים.', images: ['/images/og.jpg'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="he" dir="rtl"><body><CartProvider shopifyEnabled={shopifyIsConfigured()}><SiteHeader />{children}<SiteFooter /><CartDrawer /></CartProvider></body></html>;
}
