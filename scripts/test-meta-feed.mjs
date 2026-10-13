import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildMetaFeed } from '../lib/meta-feed.ts';

const product = { source: 'shopify', id: 'gid://shopify/Product/123', handle: 'אדמה', title: 'Soil & Moss', description: '<natural>', images: [], variants: [
  { id: 'gid://shopify/ProductVariant/456', availableForSale: false, price: { amount: 12.5, currencyCode: 'ILS' } },
  { id: 'gid://shopify/ProductVariant/457', availableForSale: true, price: { amount: 20, currencyCode: 'ILS' } },
] };
const fallback = [{ handle: 'אדמה', images: [{ url: '/images/soil.jpg' }] }];
const feed = buildMetaFeed([product], fallback);
assert.match(feed, /<g:id>456<\/g:id>/);
assert.match(feed, /<g:id>457<\/g:id>/);
assert.match(feed, /Soil &amp; Moss/);
assert.match(feed, /&lt;natural&gt;/);
assert.match(feed, /12\.50 ILS/);
assert.match(feed, /https:\/\/www.bioloark.co.il\/product-page\/%D7/);
assert.match(feed, /https:\/\/www.bioloark.co.il\/images\/soil.jpg/);
assert.match(feed, /out of stock/);
assert.match(feed, /in stock/);
assert.throws(() => buildMetaFeed([{ ...product, source: 'preview' }], fallback));
assert.throws(() => buildMetaFeed([product], []));
assert.throws(() => buildMetaFeed([], fallback));
assert.throws(() => buildMetaFeed([{ ...product, variants: [{ ...product.variants[0], id: 'preview:123' }] }], fallback));
console.log('Meta feed: 11 checks passed');
const commerce = fs.readFileSync(new URL('../lib/commerce.ts', import.meta.url), 'utf8');
const start = commerce.indexOf('query MetaCatalog');
const end = commerce.indexOf('`, { after }', start);
fs.writeFileSync(new URL('../../../meta-catalog.graphql', import.meta.url), commerce.slice(start, end));
