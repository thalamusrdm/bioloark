import type { Metadata } from 'next';
import { DeliveryEligibilityChecker } from '../../components/delivery-eligibility-checker';

export const metadata: Metadata = {
  title: 'בדיקת זכאות למשלוח חינם | Bioloark',
  description: 'בדקו מראש אם הכתובת והקנייה שלכם זכאיות למשלוח חינם מ־Bioloark.',
};

export default function DeliveryCheckPage() {
  return <main className="internal-page delivery-check-page"><DeliveryEligibilityChecker /></main>;
}
