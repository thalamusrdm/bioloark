'use client';

import { useState } from 'react';
import type { ProductImage } from '../lib/types';

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const image = images[active];
  if (!image) return <div className="product-placeholder">Bioloark</div>;
  return <div className="product-gallery"><div className="product-main-image"><img src={image.url} alt={image.altText || title} /><span>{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div>{images.length > 1 && <div className="product-thumbs">{images.map((item, index) => <button className={index === active ? 'active' : ''} key={item.url} onClick={() => setActive(index)} aria-label={`הצגת תמונה ${index + 1}`}><img src={item.url} alt="" /></button>)}</div>}</div>;
}
