import catalog from '../data/catalog.json' with { type: 'json' };

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const paths = [
  '/', '/project-showcase', '/search?q=מוס', '/robots.txt', '/sitemap.xml',
  ...catalog.collections.map((collection) => `/category/${encodeURIComponent(collection.handle)}`),
  ...catalog.products.map((product) => `/product-page/${encodeURIComponent(product.handle)}`),
];

const failures = [];
for (let index = 0; index < paths.length; index += 12) {
  await Promise.all(paths.slice(index, index + 12).map(async (path) => {
    try {
      const response = await fetch(base + path);
      if (!response.ok) failures.push(`${response.status} ${path}`);
    } catch (error) { failures.push(`ERR ${path}: ${error.message}`); }
  }));
}
const redirect = await fetch(`${base}/home-1`, { redirect: 'manual' });
if (redirect.status !== 301 || redirect.headers.get('location') !== `${base}/`) failures.push(`redirect ${redirect.status} ${redirect.headers.get('location')}`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Passed ${paths.length} routes and the /home-1 permanent redirect.`);
