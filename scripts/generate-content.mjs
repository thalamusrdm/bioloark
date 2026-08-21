import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.resolve(root, '..', 'bioloark-content', 'bioloark-content');

function splitDocument(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: text };
  return { frontmatter: match[1], body: match[2].trim() };
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return '';
  const raw = match[1].trim();
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw.replace(/^['"]|['"]$/g, '');
}

function list(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (start < 0) return [];
  const values = [];
  for (let i = start + 1; i < lines.length; i++) {
    const match = lines[i].match(/^\s+-\s+['"]?(.*?)['"]?\s*$/);
    if (!match) break;
    values.push(match[1]);
  }
  return values;
}

function cleanBody(body, title) {
  return body
    .replace(new RegExp(`^#\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'm'), '')
    .trim();
}

function categorySlugs(body) {
  return body.split(/\r?\n/)
    .filter((line) => line.startsWith('|'))
    .map((line) => line.split('|').map((cell) => cell.trim()).filter(Boolean).at(-1)?.replace(/`/g, ''))
    .filter((value) => value && value !== 'slug' && !/^[-:]+$/.test(value));
}

const productDir = path.join(source, 'products');
const productFiles = (await readdir(productDir)).filter((name) => name.endsWith('.md') && name !== '_index.md');
const products = [];
for (const file of productFiles) {
  const text = await readFile(path.join(productDir, file), 'utf8');
  const { frontmatter, body } = splitDocument(text);
  const title = scalar(frontmatter, 'title');
  const description = cleanBody(body, title);
  products.push({
    id: `preview:${scalar(frontmatter, 'slug')}`,
    title,
    handle: scalar(frontmatter, 'slug'),
    sourceUrl: scalar(frontmatter, 'source_url'),
    seoTitle: scalar(frontmatter, 'page_title') || `${title} | Bioloark`,
    description,
    descriptionHtml: description
      .split(/\r?\n\r?\n/)
      .map((part) => part.startsWith('## ') ? `<h2>${part.slice(3)}</h2>` : `<p>${part.replace(/\r?\n/g, '<br>')}</p>`)
      .join(''),
    price: { amount: Number(scalar(frontmatter, 'price')), currencyCode: scalar(frontmatter, 'currency') || 'ILS' },
    availableForSale: scalar(frontmatter, 'availability') === 'InStock',
    images: (list(frontmatter, 'images_original').length ? list(frontmatter, 'images_original') : list(frontmatter, 'images')).map((url, index) => ({ url, altText: `${title} — תמונה ${index + 1}`, width: 1200, height: 1200 })),
    variants: [{ id: `preview:${scalar(frontmatter, 'slug')}:default`, title: 'ברירת מחדל', availableForSale: scalar(frontmatter, 'availability') === 'InStock', price: { amount: Number(scalar(frontmatter, 'price')), currencyCode: scalar(frontmatter, 'currency') || 'ILS' }, selectedOptions: [] }],
    collections: [],
    source: 'preview',
  });
}

const categoryDir = path.join(source, 'categories');
const categoryFiles = (await readdir(categoryDir)).filter((name) => name.endsWith('.md') && name !== '_index.md');
const collections = [];
for (const file of categoryFiles) {
  const text = await readFile(path.join(categoryDir, file), 'utf8');
  const { frontmatter, body } = splitDocument(text);
  const title = scalar(frontmatter, 'title');
  const handle = scalar(frontmatter, 'slug');
  const intro = body.replace(/^#.*$/m, '').split(/^##\s+/m)[0].trim();
  const slugs = handle === 'all-products' ? products.map((product) => product.handle) : categorySlugs(body);
  collections.push({ id: `preview:${handle}`, title, handle, description: intro, productHandles: slugs });
  for (const product of products) if (slugs.includes(product.handle) && !product.collections.includes(handle)) product.collections.push(handle);
}

const orphan = products.find((product) => product.handle === 'טרריום-ביולוארק-מעוצב-נוף-ג-ונגל');
if (orphan && !orphan.collections.includes('טרריומים-מעוצבים')) orphan.collections.push('טרריומים-מעוצבים');
const terrariums = collections.find((collection) => collection.handle === 'טרריומים-מעוצבים');
if (terrariums && orphan && !terrariums.productHandles.includes(orphan.handle)) terrariums.productHandles.push(orphan.handle);

products.sort((a, b) => a.price.amount - b.price.amount || a.title.localeCompare(b.title, 'he'));
collections.sort((a, b) => (b.productHandles.length - a.productHandles.length));

await mkdir(path.join(root, 'data'), { recursive: true });
await writeFile(path.join(root, 'data', 'catalog.json'), JSON.stringify({ products, collections }, null, 2) + '\n');
console.log(`Generated ${products.length} products and ${collections.length} collections.`);
