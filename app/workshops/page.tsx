import { ContactForm } from '../../components/contact-form';

export const metadata = {
  title: 'סדנאות | Bioloark',
  description: 'סדנאות הטרריום של Bioloark ייפתחו בקרוב. השאירו פרטים ונחזור אליכם.',
};

export default function WorkshopsPage() {
  return (
    <main className="workshops-page internal-page">
      <section>
        <p className="eyebrow dark">BIOLOARK WORKSHOPS</p>
        <h1>סדנאות בקרוב</h1>
        <p>בקרוב נפתח סדנאות ליצירת טרריומים ועולמות בוטניים חיים. השאירו פרטים ונחזור אליכם עם כל המידע.</p>
        <ContactForm triggerLabel="השארת פרטים לסדנה" />
      </section>
    </main>
  );
}
