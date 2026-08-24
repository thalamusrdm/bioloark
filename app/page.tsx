import { getProducts } from '../lib/commerce';
import { ProductCard } from '../components/product-card';
import { ProductCarousel } from '../components/product-carousel';
import { ScrollMotion } from '../components/scroll-motion';
import { ContactForm } from '../components/contact-form';

const featuredHandles = [
  'סלגינלה-אונקינטה-selaginella-uncinata',
  'סחלב-תכשיט-מקודס-פטולה-macodes-petola',
  'cushion-moss-terrarium',
  'bioloark-bio-bottle-sd175',
];

const services = [
  { number: '01', title: 'תכנון קירות ירוקים ומפלי מים', description: 'פתרונות מתקדמים להקמת מערכות צמחייה ורטיקליות המשלבות זרימת מים ותאורה ממוחשבת. אנו מתמחים ביצירת חללים שמעניקים שקט נפשי ושלווה בלב הסביבה העירונית.', image: '/images/service-green-wall.webp' },
  { number: '02', title: 'ייעוץ עסקי ולוווי צמוד לעסקים, מלונות ומשרדים', description: 'שירותי ליווי אדריכלי לאפיון ומרחב. אנו מתמחים בהתאמת מערכות צמחייה ללובים ולחללי עבודה, תוך הבנה עמוקה של צרכי התחזוקה והאסתטיקה המוקפדת.', image: '/images/service-hotels.webp' },
  { number: '03', title: 'הקמת טרריומים מתקדמים בעיצוב אישי', description: 'תכנון והקמה של טרריומים ייחודיים ומורכבים המשלבים צמחי מים, מטפסים וזנים נדירים בייבוא אישי. כל יצירה מתוכננת כעולם שלם של עומק, יוקרה ושלווה טבעית.', image: '/images/service-terrariums.webp' },
];

const testimonials = [
  ['“אהלן, בוקר טוב. ראשית רציתי להגיד לך, תקשיב, הבוקר קמתי עם הכוס קפה, הסתכלתי על הטרריום, תענוג. הבן שלי היה איתי, אמר לי אבא, משהו משהו!! אז שפו.”', 'לקוח פרטי, תל אביב'],
  ['“היי אבידן רציתי שתדע שכולם נהנו מאוד מהסדנה, הטרריומים יצאו מושלמים ושואלים אותי מתי תהיה עוד סדנה”', 'קיבוץ אליפז'],
  ['“טרריום טורפים זה בול מה שהבית שלי היה צריך, היו לי פה מלא מעופפים, כמעט ולא רואים אותם יותר. תודה רבה”', 'לקוחה פרטית, קריית אתא'],
];

const pathways = [
  { number: '01', label: 'READY-MADE', title: 'יצירות מוכנות', description: 'עיצובים המשלבים בין האסתטיקה היפנית והטבע המתפרץ.', image: '/images/path-ready-made.webp', href: '/category/טרריומים-מעוצבים' },
  { number: '02', label: 'CREATE YOUR OWN', title: 'עשה זאת בעצמך', description: 'כלי זכוכית, תאורה, מצעים, צמחים וכל מה שצריך כדי לבנות עולם קטן משלכם.', image: '/images/about-seed-beginning.webp', href: '/category/כלים-להכנה' },
  { number: '03', label: 'BESPOKE', title: 'ייעוץ ותכנון', description: 'ליווי אישי בתכנון מערכות צמחייה ופתרונות בוטניים לבתים, משרדים וחללי אירוח.', image: '/images/service-hotels.webp', href: '#consulting' },
];

export default async function Home() {
  const products = await getProducts();
  const featured = featuredHandles.flatMap((handle) => { const product = products.find((item) => item.handle === handle); return product ? [product] : []; });
  const additionalTerrariums = products.filter((product) => !featuredHandles.includes(product.handle) && product.collections.includes('טרריומים-מעוצבים')).slice(0, 8);
  const carouselProducts = [...featured, ...additionalTerrariums].reverse();
  const organization = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Bioloark', url: 'https://www.bioloark.co.il', image: 'https://www.bioloark.co.il/images/og.jpg', email: 'info@bioloark.co.il', address: { '@type': 'PostalAddress', streetAddress: 'מאפו 13', addressLocality: 'תל אביב', addressCountry: 'IL' }, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'], opens: '10:00', closes: '19:00' }, { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '14:00' }], sameAs: ['https://www.facebook.com/BioloarkIsrael', 'https://www.instagram.com/bioloark_israel'] };
  return <main className="home-boutique"><ScrollMotion /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    <section className="hero" id="top"><div className="hero-image" data-scroll-media data-scroll-speed="12" aria-hidden="true" /><div className="hero-veil" aria-hidden="true" /><div className="hero-content" data-reveal><p className="eyebrow">BOTANICAL ART DESIGN FOR INTERIORS</p><h1><span className="hero-brand-line" dir="ltr">Bioloark</span><span className="hero-tagline">עיצוב חי, מדויק ומלא השראה</span></h1><p className="hero-copy">אנחנו משלבים בין עיצוב, איזון ותשומת לב לפרטים כדי ליצור מראה נקי, מרשים ומלא השראה</p><a className="primary-button" href="#collection">למוצרי החנות <span>←</span></a></div></section>

    <section className="path-section" aria-labelledby="path-title"><div className="path-heading" data-reveal><p className="eyebrow dark">THREE WAYS INTO THE LIVING WORLD</p><h2 id="path-title">הדרך שלכם<br />להכניס טבע פנימה</h2><p>בחרו יצירה מוכנה, בנו עולם משלכם או תנו לנו לתכנן עבורכם פתרון מותאם אישית.</p></div><div className="path-grid">{pathways.map((path) => <a className="path-card" href={path.href} key={path.number} data-reveal><div className="path-card-media"><img src={path.image} alt={path.title} loading="lazy" data-scroll-media data-scroll-speed="6" /></div><div className="path-card-copy"><span>{path.number}</span><p>{path.label}</p><h3>{path.title}</h3><small>{path.description}</small><b aria-hidden="true">↙</b></div></a>)}</div></section>

    <section className="collection-section" id="collection"><div className="section-heading" data-reveal><div><p className="eyebrow dark">A CURATED LIVING COLLECTION</p><h2>נבחרים מהסטודיו</h2></div><a href="/category/all-products">לכל המוצרים <span>←</span></a></div><ProductCarousel>{carouselProducts.map((product, index) => <ProductCard key={product.id} product={product} priority={index >= carouselProducts.length - 2} reveal />)}</ProductCarousel></section>

    <section className="terrarium-feature" data-spotlight><img src="/images/terrarium-world.webp" alt="סטודיו Bioloark עם טרריומים מעוצבים" data-scroll-media data-scroll-axis="x" /><div className="terrarium-feature-copy" data-reveal><p className="eyebrow">A WORLD WITHIN</p><h2>טרריומים ועולמות קטנים בעיצוב מוקפד</h2><p>פיסות טבע שנבנות שכבה אחר שכבה מתוך השראה ליצור נוף טבעי ומסעיר שמרגיש מוכר.</p><a className="outline-button" href="/category/טרריומים-מעוצבים">לחנות טרריומים מעוצבים</a></div></section>

    <section className="services-section" id="consulting"><div className="services-intro" data-reveal><p className="eyebrow dark">BOTANICAL SYSTEMS & CONSULTING</p><h2>שירותי ייעוץ ותכנון מערכות צמחייה</h2><p>אנו מציעים פתרונות תכנון וליווי אישיים ליצירת מערכות אקולוגיות מתקדמות, המשלבות את העדינות היפנית עם טכנולוגיה מודרנית לחללי יוקרה, משרדים ובתי מלון.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.number} data-reveal><div className="service-image"><img src={service.image} alt={service.title} loading="lazy" data-scroll-media data-scroll-speed="8" /></div><h3>{service.title}</h3><p>{service.description}</p></article>)}</div></section>

    <section className="about-section" id="about"><div className="about-image"><img src="/images/about-seed-beginning.webp" alt="יד מניחה בעדינות זרע באדמת טרריום באמצעות פינצטה" loading="lazy" data-scroll-media data-scroll-speed="9" /></div><div className="about-copy" data-reveal><p className="eyebrow dark">קצת עלינו</p><h2>ביולוארק נולדה מתוך אהבה לטבע</h2><p className="about-lead">אנחנו מתמחים ביצירת טרריומים מעוצבים, מערכות צמחייה מתקדמות וקירות ירוקים, המכניסים שלווה, יוקרה וירוק חי אל בתים, משרדים ומלונות.</p><p>כל פרויקט אצלנו מתוכנן בקפדנות – מאפיון החלל, בחירת הצמחים המתאימים ועד תחזוקה קלה לאורך זמן. המטרה שלנו היא ליצור עבורכם פינה ירוקה ייחודית, מותאמת אישית, שנראית כמו יצירת אמנות חיה ונשארת יפה לאורך שנים.</p><a href="/project-showcase">לפרויקטים שלנו <span>←</span></a></div></section>

    <section className="testimonials-section"><div className="section-heading light" data-reveal><div><p className="eyebrow">LIVING TESTIMONIALS</p><h2>מה אומרים עלינו</h2></div><span className="quote-mark">״</span></div><div className="testimonial-grid">{testimonials.map(([quote, author]) => <blockquote key={author} data-reveal><p>{quote}</p><cite>{author}</cite></blockquote>)}</div></section>

    <section className="contact-band"><div data-reveal><p className="eyebrow dark">LET&apos;S CREATE SOMETHING LIVING</p><h2>תנו לנו לבנות לכם פינה חיה וירוקה</h2><p>זמינים לייעוץ ותכנון מערכות צמחייה מתקדמות לבתי מלון, משרדים וחללי יוקרה.</p><ContactForm /><small>ביולוארק — מאפו 13, מרכז תל אביב, ישראל</small></div></section>
  </main>;
}
