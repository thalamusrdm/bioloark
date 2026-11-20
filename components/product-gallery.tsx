'use client';

import { useState } from 'react';
import type { ProductImage } from '../lib/types';

type ProductGalleryProps = {
  images: ProductImage[];
  title: string;
  videoSrc?: string;
  videoPoster?: string;
};

export function ProductGallery({ images, title, videoSrc, videoPoster }: ProductGalleryProps) {
  const [active, setActive] = useState(() => videoSrc ? images.length : 0);
  const videoIndex = images.length;
  const totalMedia = images.length + (videoSrc ? 1 : 0);
  const videoIsActive = Boolean(videoSrc) && active === videoIndex;
  const image = images[active];
  if (!image && !videoIsActive) return <div className="product-placeholder">Bioloark</div>;

  return (
    <div className="product-gallery">
      <div className={`product-main-image${videoIsActive ? ' is-video' : ''}`}>
        {videoIsActive ? (
          <video autoPlay muted loop playsInline controls preload="metadata" poster={videoPoster} aria-label={`סרטון בניית ${title}`}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img src={image.url} alt={image.altText || title} />
        )}
        <span>{String(active + 1).padStart(2, '0')} / {String(totalMedia).padStart(2, '0')}</span>
      </div>
      {totalMedia > 1 && (
        <div className="product-thumbs">
          {images.map((item, index) => (
            <button className={index === active ? 'active' : ''} key={item.url} onClick={() => setActive(index)} aria-label={`הצגת תמונה ${index + 1}`}>
              <img src={item.url} alt="" />
            </button>
          ))}
          {videoSrc && (
            <button className={`product-video-thumb${videoIsActive ? ' active' : ''}`} type="button" onClick={() => setActive(videoIndex)} aria-label="הפעלת סרטון בניית הטרריום">
              {videoPoster && <img src={videoPoster} alt="" />}
              <span aria-hidden="true">▶</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
