import type { Metadata } from 'next';
import { getBlogArticles } from '../../lib/commerce';

export const metadata: Metadata = { title: 'בלוג וטיפים | Bioloark', description: 'מדריכים מקצועיים על טרריומים, תאורה, צמחים טורפים ופלודריומים.' };

export default async function BlogPage() {
  const articles = await getBlogArticles();
  return <main className="internal-page blog-page"><section className="blog-hero"><p className="eyebrow">BOTANICAL NOTES & FIELD GUIDES</p><h1>בלוג וטיפים</h1><p>ידע מעשי מהסטודיו לבניית מערכות חיות, מאוזנות ויפות יותר.</p></section><section className="blog-grid" aria-label="מאמרים">{articles.map((article, index) => <article className="blog-card" key={article.id}><a href={`/blog/${encodeURIComponent(article.handle)}`}><div className="blog-card-image">{article.image && <img src={article.image.url} alt={article.image.altText} loading={index === 0 ? 'eager' : 'lazy'} />}</div><div className="blog-card-copy"><p>{article.tags.slice(0, 2).join(' · ') || 'BIOLOARK GUIDE'}</p><h2>{article.title}</h2><span>{article.excerpt}</span><b>לקריאת המדריך ←</b></div></a></article>)}</section><aside className="blog-social-links" aria-label="טיפים נוספים ברשתות החברתיות"><p>בלוגים וטיפים נוספים</p><div><a className="social-brand-button instagram" href="https://www.instagram.com/bioloark_israel/" target="_blank" rel="noreferrer"><i aria-hidden="true">◎</i>Instagram <span>↗</span></a><a className="social-brand-button facebook" href="https://www.facebook.com/BioloarkIsrael" target="_blank" rel="noreferrer"><i aria-hidden="true">f</i>Facebook <span>↗</span></a></div></aside></main>;
}
