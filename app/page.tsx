import { getProducts } from '../lib/commerce';
import { ProductCard } from '../components/product-card';
import { ScrollMotion } from '../components/scroll-motion';

const featuredHandles = [
  'סלגינלה-אונקינטה-selaginella-uncinata',
  'סחלב-תכשיט-מקודס-פטולה-macodes-petola',
  'cushion-moss-terrarium',
  'bioloark-bio-bottle-sd175',
];

const services = [
  { number: '01', title: 'תכנון קירות ירוקים ומפלי מים', description: 'פתרונות מתקדמים להקמת מערכות צמחייה ורטיקליות המשלבות זרימת מים ותאורה ממוחשבת. אנו מתמחים ביצירת חללים שמעניקים שקט נפשי ושלווה בלב הסביבה העירונית.', image: '/images/service-green-wall.webp' },
  { number: '02', title: 'ייעוץ אישי למלונות ומשרדי פרימיום', description: 'שירותי ליווי אדריכלי לאפיון ומרחב. אנו מתמחים בהתאמת מערכות צמחייה ללובים ולחללי עבודה, תוך הבנה עמוקה של צרכי התחזוקה והאסתטיקה המוקפדת.', image: '/images/service-hotels.webp' },
  { number: '03', title: 'הקמת טרריומים מתקדמים בעיצוב אישי', description: 'תכנון והקמה של טרריומים ייחודיים ומורכבים המשלבים צמחי מים, מטפסים וזנים נדירים בייבוא אישי. כל יצירה מתוכננת כעולם שלם של עומק, יוקרה ושלווה טבעית.', image: '/images/service-terrariums.webp' },
];

const testimonials = [
  ['“מאז שטרריומים של ביולוארק נכנסו למשרד, האווירה השתנתה לחלוטין – רגועה, ירוקה ומזמינה. אחרי חודשים, הם עדיין נראים כמו חדשים.”', 'מנהלת משרד, תל אביב'],
  ['“קיבלנו מערכת צמחייה לסלון שמרגישה כמו גן יפני פרטי. התחזוקה מינימלית, והאורחים לא מפסיקים לשאול מאיפה זה הגיע.”', 'לקוח פרטי, רמת השרון'],
  ['“קיר ירוק וטרריומים מעוצבים נוספו ללובי המלון. ההשפעה על האורחים מיידית – תמונות, מחמאות, והצמחים שומרים על מראה רענן.”', 'מנהל מלון בוטיק'],
];

export default async function Home() {
  const products = await getProducts();
  const featured = featuredHandles.map((handle) => products.find((product) => product.handle === handle)).filter(Boolean);
  const organization = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Bioloark', url: 'https://www.bioloark.co.il', image: 'https://www.bioloark.co.il/images/og.jpg', email: 'info@bioloark.co.il', address: { '@type': 'PostalAddress', streetAddress: 'מאפו 13', addressLocality: 'תל אביב', addressCountry: 'IL' }, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'], opens: '10:00', closes: '19:00' }, { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '14:00' }], sameAs: ['https://www.facebook.com/BioloarkIsrael', 'https://www.instagram.com/bioloark_israel'] };
  return <main><ScrollMotion /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    <section className="hero" id="top"><div className="hero-image" data-scroll-media data-scroll-speed="28" aria-hidden="true" /><div className="hero-veil" aria-hidden="true" /><div className="hero-content" data-reveal><p className="eyebrow">BOTANICAL ART DESIGN FOR INTERIORS</p><h1>יוצרת טרריומים אלגנטיים ועולמות קטנים של טבע שמכניסים חיים ויופי לכל חלל <span>Bioloark</span></h1><p className="hero-copy">אנחנו משלבים בין עיצוב, איזון ותשומת לב לפרטים כדי ליצור מראה נקי, מרשים ומלא השראה</p><a className="primary-button" href="#collection">למוצרי החנות <span>←</span></a></div><div className="hero-note"><span>01</span><p>עיצוב בוטני בהשראת מסורת הזן היפנית</p></div></section>

    <section className="collection-section" id="collection"><div className="section-heading" data-reveal><div><p className="eyebrow dark">A CURATED LIVING COLLECTION</p><h2>נבחרים מהסטודיו</h2></div><a href="/category/all-products">לכל המוצרים <span>←</span></a></div><div className="product-grid">{featured.map((product, index) => product && <ProductCard key={product.id} product={product} priority={index < 2} reveal />)}</div></section>

    <section className="terrarium-feature"><img src="/images/terrarium-feature.webp" alt="טרריום מעוצב של Bioloark" data-scroll-media data-scroll-speed="24" /><div className="terrarium-feature-copy" data-reveal><p className="eyebrow">A WORLD WITHIN</p><h2>טבע חי.<br />בתוך עולם משל עצמו.</h2><p>קומפוזיציות בוטניות חד־פעמיות, שנבנות שכבה אחר שכבה וממשיכות להשתנות יחד עם החלל.</p><a className="outline-button" href="/category/טרריומים-מעוצבים">לחנות טרריומים מעוצבים</a></div></section>

    <section className="services-section"><div className="services-intro" data-reveal><p className="eyebrow dark">BOTANICAL SYSTEMS & CONSULTING</p><h2>שירותי ייעוץ ותכנון מערכות צמחייה</h2><p>אנו מציעים פתרונות תכנון וליווי אישיים ליצירת מערכות אקולוגיות מתקדמות, המשלבות את העדינות היפנית עם טכנולוגיה מודרנית לחללי יוקרה, משרדים ובתי מלון.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.number} data-reveal><div className="service-image"><img src={service.image} alt={service.title} loading="lazy" data-scroll-media data-scroll-speed="14" /><span>{service.number}</span></div><h3>{service.title}</h3><p>{service.description}</p></article>)}</div></section>

    <section className="about-section" id="about"><div className="about-image"><img src="/images/og.jpg" alt="עולם בוטני מיניאטורי בתוך טרריום זכוכית" loading="lazy" data-scroll-media data-scroll-speed="20" /></div><div className="about-copy" data-reveal><p className="eyebrow dark">קצת עלינו</p><h2>ביולוארק נולדה מתוך אהבה עמוקה לטבע.</h2><p className="about-lead">אנחנו מתמחים ביצירת טרריומים מעוצבים, מערכות צמחייה מתקדמות וקירות ירוקים, המכניסים שלווה, יוקרה וירוק חי אל בתים, משרדים ומלונות.</p><p>כל פרויקט אצלנו מתוכנן בקפדנות – מאפיון החלל, בחירת הצמחים המתאימים ועד תחזוקה קלה לאורך זמן. המטרה שלנו היא ליצור עבורכם פינה ירוקה ייחודית, מותאמת אישית, שנראית כמו יצירת אמנות חיה ונשארת יפה לאורך שנים.</p><a href="/project-showcase">לפרויקטים שלנו <span>←</span></a></div></section>

    <section className="testimonials-section"><div className="section-heading light" data-reveal><div><p className="eyebrow">LIVING TESTIMONIALS</p><h2>מה אומרים עלינו</h2></div><span className="quote-mark">״</span></div><div className="testimonial-grid">{testimonials.map(([quote, author], index) => <blockquote key={author} data-reveal><span>0{index + 1}</span><p>{quote}</p><cite>{author}</cite></blockquote>)}</div></section>

    <section className="contact-band"><div data-reveal><p className="eyebrow dark">LET&apos;S CREATE SOMETHING LIVING</p><h2>הטבע הבא בחלל שלכם<br />מתחיל בשיחה.</h2><p>זמינים לייעוץ ותכנון מערכות צמחייה מתקדמות לבתי מלון, משרדים וחללי יוקרה.</p><a className="primary-button dark-button" href="mailto:info@bioloark.co.il">יצירת קשר וייעוץ <span>←</span></a><small>ביולוארק — מאפו 13, מרכז תל אביב, ישראל</small></div></section>
  </main>;
}
