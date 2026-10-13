import { getMetaCatalogProducts, previewProducts } from '../../../lib/commerce';
import { buildMetaFeed } from '../../../lib/meta-feed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getMetaCatalogProducts();
    return new Response(buildMetaFeed(products, previewProducts()), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch {
    // A failed refresh must not replace the catalog with stale preview inventory.
    return new Response('Product feed temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
