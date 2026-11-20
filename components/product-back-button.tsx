'use client';

import { useRouter } from 'next/navigation';

export function ProductBackButton() {
  const router = useRouter();

  const goBack = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const referrer = document.referrer ? new URL(document.referrer) : null;
    const cameFromThisSite = referrer?.origin === window.location.origin;

    if (cameFromThisSite && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/category/all-products', { scroll: false });
  };

  return (
    <div className="product-back-navigation">
      <button className="category-back-button product-back-button" type="button" onClick={goBack} aria-label="חזרה לעמוד הקודם">
        <span aria-hidden="true">→</span>
        חזרה
      </button>
    </div>
  );
}
