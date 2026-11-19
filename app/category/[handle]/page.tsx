import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryFilter } from '../../../components/category-filter';
import { CollectionBrowser } from '../../../components/collection-browser';
import { getCollection, previewCollections } from '../../../lib/commerce';
import styles from './category.module.css';

const readyTerrariums = {
  handle: 'טרריומים-מעוצבים',
  title: 'טרריומים מעוצבים לקנייה',
  description: 'טרריומים מוכנים עם צמחים חיים, מעיצובי יער עם מוס ועד טרריומים עם צמחים טורפים. בדגמים נבחרים תאורה כלולה. ניתן לאסוף מהסטודיו בתל אביב.',
};

const glassTerrariums = {
  handle: 'טרריומים-כלי-זכוכית-ותאורה-1',
  title: 'כלי זכוכית לטרריום ותאורת גידול',
  description: 'כלי זכוכית לבניית טרריום בבית, כולל דגמים עם תאורה מובנית וגופי תאורה נפרדים. השוו בין צורת הכלי, המידות והציוד שכלול בדגם.',
};

const categoryCopy = new Map([
  [readyTerrariums.handle, readyTerrariums],
  [glassTerrariums.handle, glassTerrariums],
]);

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
    { title: 'מוס', href: '/category/מוס' },
    { title: 'שרכים', href: '/category/שרכים' },
    { title: 'ביגוניות וסחלבים', href: '/category/ביגוניות-וסחלבים' },
    { title: 'מטפסים ומתפשטים', href: '/category/מטפסים' },
    { title: 'צמחים טורפים', href: '/category/צמחים-טורפים' },
  ],
  'טרריומים-מעוצבים': [
    { title: 'טרריום נוף', href: '/category/טרריום-נוף' },
    { title: 'טרריום טורפים', href: '/category/טרריום-טורפים' },
  ],
};

for (const handle of ['מצע-אדמה-ופחם', 'סלעים-וגזעים', 'טרריומים-כלי-זכוכית-ותאורה-1']) categoryFilters[handle] = categoryFilters['כלים-להכנה'];
for (const handle of ['מטפסים', 'שרכים', 'מוס', 'ביגוניות-וסחלבים', 'צמחים-טורפים']) categoryFilters[handle] = categoryFilters['rare-plants'];
for (const handle of ['טרריום-נוף', 'טרריום-טורפים']) categoryFilters[handle] = categoryFilters['טרריומים-מעוצבים'];

export async function generateStaticParams() { return previewCollections().map((collection) => ({ handle: collection.handle })); }
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const { collection } = await getCollection(handle);
  if (!collection) return {};
  const copy = categoryCopy.get(collection.handle);
  return {
    title: `${copy?.title ?? collection.title} | Bioloark`,
    description: copy?.description || collection.description || `קולקציית ${collection.title} של Bioloark`,
    alternates: { canonical: `/category/${collection.handle}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params; const { collection, products } = await getCollection(handle); if (!collection) notFound();
  const filters = categoryFilters[decodeURIComponent(handle)] || [];
  const copy = categoryCopy.get(collection.handle);
  const title = copy?.title ?? collection.title;

  return (
    <main className="internal-page">
      <section className={`collection-hero${copy ? ` ${styles.readyHero}` : ''}`}>
        <p className="eyebrow">BIOLOARK COLLECTION</p>
        <h1>{title}</h1>
        <p>{copy?.description || collection.description || 'פריטים שנבחרו בקפידה ליצירת עולמות בוטניים חיים.'}</p>
      </section>
      <section className="collection-body">
        {filters.length > 0 && <CategoryFilter filters={filters} currentHandle={decodeURIComponent(handle)} />}
        <div className="breadcrumbs"><a href="/">בית</a><span>/</span><span>{title}</span></div>
        <CollectionBrowser products={products} />
        {copy === readyTerrariums && (
          <section className={styles.buyingGuide} aria-labelledby="terrarium-buying-guide">
            <h2 id="terrarium-buying-guide">איך בוחרים טרריום מוכן?</h2>
            <ul>
              <li><strong>צמחייה.</strong> בחרו <a href="/category/טרריום-נוף">טרריום נוף</a> אם אתם אוהבים מראה של יער קטן. אם מעניינים אתכם צמחים כמו דיונאה וכדנית, ראו את דגמי <a href="/category/טרריום-טורפים">טרריום הטורפים</a> ואת הוראות הטיפול שלהם.</li>
              <li><strong>תאורה.</strong> בעמוד הדגם בדקו אם תאורה כלולה ואיפה היא מותקנת. אם אתם מתכננים להניח את הכלי בפינה עם מעט אור טבעי, בחרו דגם עם תאורת גידול מתאימה.</li>
              <li><strong>מידות ואיסוף.</strong> מדדו את רוחב המדף ואת הגובה הפנוי לפתיחת המכסה. בדקו את מפרט הדגם או פנו אלינו לבירור מידות ואפשרויות מסירה. ניתן לאסוף מהסטודיו בתל אביב.</li>
            </ul>
            {products.some((product) => product.handle === 'טרריום-צמחייה-בצורת-טיפה-מעוצב-עם-תאורה') && (
              <p>אם אתם מחפשים טרריום עם מנורה כלולה, ראו את <a href="/product-page/טרריום-צמחייה-בצורת-טיפה-מעוצב-עם-תאורה">דגם הטיפה עם תאורה</a>.</p>
            )}
            <p>חדש לכם? <a href="/blog/terrarium-guide">מדריך הטרריום למתחילים</a> מסביר איך לבחור מקום בבית ולטפל בצמחים.</p>
          </section>
        )}
        {copy === glassTerrariums && (
          <section className={styles.buyingGuide} aria-labelledby="terrarium-glass-guide">
            <h2 id="terrarium-glass-guide">איך בוחרים כלי זכוכית לטרריום?</h2>
            <ul>
              <li><strong>פתח ומכסה.</strong> פתח רחב מקל על השתילה והגיזום. לצמחים שאוהבים לחות, חפשו כלי עם מכסה ובדקו אם אפשר לכוון את האוורור.</li>
              <li><strong>מידות.</strong> מדדו את השטח הפנוי וגם את המרווח מעל הכלי. צריך מקום להרים את המכסה ולהגיע לצמחים.</li>
              <li><strong>תאורה.</strong> בדקו במפרט אם יש מנורה מובנית. אם בוחרים מנורה נפרדת, בדקו את המידות ואיך היא מתחברת לכלי.</li>
            </ul>
            {products.some((product) => product.handle === 'bioloark-bio-bottle-sd175') && (
              <p>לדוגמה, <a href="/product-page/bioloark-bio-bottle-sd175">כלי הזכוכית SD175</a> מגיע במידות 175 × 205 מ״מ וכולל תאורת LED ופתחי אוורור מתכווננים.</p>
            )}
            {products.some((product) => product.handle === 'bioloark-dl-05-terrarium-magnetic-light') && (
              <p>לכלי שכבר יש לכם, <a href="/product-page/bioloark-dl-05-terrarium-magnetic-light">תאורת DL-05</a> היא גוף מגנטי נפרד במידות 80 × 20 מ״מ, עם שלושה מצבי תאורה.</p>
            )}
            <p>מתלבטים מה מתאים למקום שבחרתם? קראו את <a href="/blog/terrarium-lighting-guide">מדריך התאורה לטרריום</a>.</p>
          </section>
        )}
      </section>
    </main>
  );
}
