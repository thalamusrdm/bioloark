'use client';

import { useEffect, useState } from 'react';

export type ProjectImage = { src: string; alt: string };
export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setActive(null); if (active !== null && event.key === 'ArrowLeft') setActive((active + 1) % images.length); if (active !== null && event.key === 'ArrowRight') setActive((active - 1 + images.length) % images.length); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [active, images.length]);
  return <><div className="project-grid">{images.map((image, index) => <button onClick={() => setActive(index)} key={image.src} aria-label={`פתיחת ${image.alt}`}><img src={image.src} alt={image.alt} loading={index < 4 ? 'eager' : 'lazy'} /><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div>{active !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={images[active].alt}><button className="overlay-close" onClick={() => setActive(null)} aria-label="סגירה">×</button><button className="lightbox-prev" onClick={() => setActive((active - 1 + images.length) % images.length)} aria-label="תמונה קודמת">→</button><figure><img src={images[active].src} alt={images[active].alt} /><figcaption>{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</figcaption></figure><button className="lightbox-next" onClick={() => setActive((active + 1) % images.length)} aria-label="תמונה הבאה">←</button></div>}</>;
}
