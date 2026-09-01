import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogArticle, getBlogArticles } from '../../../lib/commerce';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const article = await getBlogArticle((await params).handle);
  return article ? { title: `${article.title} | Bioloark`, description: article.excerpt, openGraph: { title: article.title, description: article.excerpt, images: article.image ? [article.image.url] : [] } } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ handle: string }> }) {
  const article = await getBlogArticle((await params).handle);
  if (!article) notFound();
  const related = (await getBlogArticles()).filter((item) => item.handle !== article.handle).slice(0, 3);
  const structured = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.excerpt, datePublished: article.publishedAt, author: { '@type': 'Organization', name: article.author }, image: article.image?.url };
  return <main className="internal-page article-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} /><article><header className="article-header"><div><a href="/blog">בלוג וטיפים</a><p>{article.tags.join(' · ')}</p><h1>{article.title}</h1><span>{article.excerpt}</span></div>{article.image && <img src={article.image.url} alt={article.image.altText} />}</header><div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} /></article>{related.length > 0 && <section className="article-related"><p className="eyebrow dark">KEEP READING</p><h2>עוד מהבלוג</h2><div>{related.map((item) => <a href={`/blog/${encodeURIComponent(item.handle)}`} key={item.id}><span>{item.tags[0] || 'מדריך'}</span><h3>{item.title}</h3><b>לקריאה ←</b></a>)}</div></section>}</main>;
}
