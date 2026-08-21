import type { Metadata } from 'next';
import { ProjectGallery } from '../../components/project-gallery';

export const metadata: Metadata = {
  title: 'פרויקטים נבחרים | Bioloark',
  description: 'טרריומים בעבודת יד ומערכות ירוקות בהתאמה אישית, שעוצבו כדי להעניק שקט ונוכחות לחלל שלכם.',
  alternates: { canonical: '/project-showcase' },
};

const images = [
  { src: '/images/project-03.webp', alt: 'קיר תצוגה עם טרריומים עגולים וצמחייה נדירה' },
  { src: '/images/project-04.webp', alt: 'טרריום צילינדר גבוה עם מפל וצמחייה חיה' },
  { src: '/images/project-05.webp', alt: 'קיר מוס חי עם פלג מים בתוך חלל זכוכית' },
  { src: '/images/project-06.webp', alt: 'קיר ירוק ממוסגר ומואר בחלל מגורים מודרני' },
  { src: '/images/project-07.webp', alt: 'טרריום זכוכית מלבני עם שביל אבנים וצמחייה' },
  { src: '/images/project-08.webp', alt: 'קיר ירוק בחדר ישיבות מואר' },
  { src: '/images/service-green-wall.webp', alt: 'מערכת צמחייה ממוסגרת עם מפל מים ותאורה' },
  { src: '/images/service-hotels.webp', alt: 'קיר מוס וצמחייה בחלל משרדים' },
  { src: '/images/project-09.webp', alt: 'טרריום זן עם שני עצי בונסאי וחול לבן' },
  { src: '/images/project-10.webp', alt: 'קיר טרופי עם מפל מים בחלל אירוח' },
  { src: '/images/project-11.webp', alt: 'קומפוזיציה בוטנית עם שרכים וסחלבים בחלל מגורים' },
  { src: '/images/project-12.webp', alt: 'מיצב עמודי צמחייה טרופית בחלל גלריה' },
];

export default function ProjectsPage() {
  return <main className="internal-page projects-page"><section className="projects-hero"><div><p className="eyebrow">SELECTED WORKS · 2015—2026</p><h1>פרויקטים<br />נבחרים</h1></div><p>טרריומים בעבודת יד ומערכות ירוקות בהתאמה אישית, שעוצבו כדי להעניק שקט ונוכחות לחלל שלכם.</p></section><ProjectGallery images={images} /></main>;
}
