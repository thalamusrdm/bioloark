'use client';

import { useRouter } from 'next/navigation';

export function ProductBackButton() {
  const router = useRouter();

  const goBack = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    if (window.history.length > 1) router.back();
    else router.push('/category/all-products', { scroll: false });
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
