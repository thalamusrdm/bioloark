import { getProducts } from '../../lib/commerce';
import { ProductCard } from '../../components/product-card';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLocaleLowerCase('he');
  const products = await getProducts();
  const results = query ? products.filter((product) => `${product.title} ${product.description} ${product.collections.join(' ')}`.toLocaleLowerCase('he').includes(query)) : [];
  return <main className="internal-page search-page">
    <section className="search-head">
      <p className="eyebrow dark">SEARCH THE COLLECTION</p><h1>חיפוש</h1>
      <form><label className="sr-only" htmlFor="search-page-input">חיפוש מוצר באתר</label><input id="search-page-input" name="q" defaultValue={q} placeholder="טרריום, צמח או כלי…" /><button>חיפוש</button></form>
    </section>
    <section className="search-results" aria-live="polite"><p>{query ? `${results.length} תוצאות עבור “${q}”` : 'הקלידו שם מוצר, צמח או קטגוריה'}</p>{results.length > 0 && <div className="product-grid collection-grid">{results.map((product) => <ProductCard product={product} key={product.id} />)}</div>}</section>
  </main>;
}
