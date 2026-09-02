import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionBrowser } from '../../../components/collection-browser';
import { getCollection, previewCollections } from '../../../lib/commerce';

const categoryFilters: Record<string, { title: string; href: string }[]> = {
  'all-products': [
    { title: 'הכל לטרריום', href: '/category/כלים-להכנה' },
    { title: 'צמחים', href: '/category/rare-plants' },
    { title: 'יצירות מוכנות', href: '/category/טרריומים-מעוצבים' },
  ],
  'כלים-להכנה': [
    { title: 'מצע אדמה ופחם', href: '/category/מצע-אדמה-ופחם' },
    { title: 'סלעים וגזעים', href: '/category/סלעים-וגזעים' },
    { title: 'כלי זכוכית ותאורה', href: '/category/טרריומים-כלי-זכוכית-ותאורה-1' },
  ],
  'rare-plants': [
    { title: 'מטפסים ומתפשטים', href: '/category/מטפסים' },
    { title: 'שרכים', href: '/category/שרכים' },
    { title: 'מוס', href: '/category/מוס' },
    { title: 'ביגוניות וסחלבים', href: '/category/ביגוניות-וסחלבים' },
  ],
  'טרריומים-מעוצבים': [
    { title: 'טרריום נוף', href: '/category/טרריום-נוף' },
    { title: 'טרריום טורפים', href: '/category/טרריום-טורפים' },
  ],
};

export async function generateStaticParams() { return previewCollections().map((collection) => ({ handle: collection.handle })); }
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> { const { handle } = await params; const { collection } = await getCollection(handle); if (!collection) return {}; return { title: `${collection.title} | Bioloark`, description: collection.description || `קולקציית ${collection.title} של Bioloark`, alternates: { canonical: `/category/${collection.handle}` } }; }

export default async function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params; const { collection, products } = await getCollection(handle); if (!collection) notFound();
  const filters = categoryFilters[decodeURIComponent(handle)] || [];
  return <main className="internal-page"><section className="collection-hero"><p className="eyebrow">BIOLOARK COLLECTION</p><h1>{collection.title}</h1><p>{collection.description || 'פריטים שנבחרו בקפידה ליצירת עולמות בוטניים חיים.'}</p></section><section className="collection-body">{filters.length > 0 && <nav className={`collection-category-filter category-count-${filters.length}`} aria-label="סינון מוצרים לפי קטגוריה">{filters.map((filter) => <a href={filter.href} key={filter.href}>{filter.title}</a>)}</nav>}<div className="breadcrumbs"><a href="/">בית</a><span>/</span><span>{collection.title}</span></div><CollectionBrowser products={products} /></section></main>;
}
