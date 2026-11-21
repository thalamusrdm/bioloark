'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

const SLIDE_DURATION = 7000;

type HeroSlide = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  poster?: string;
  fit?: 'cover' | 'contain';
};

const slides: HeroSlide[] = [
  {
    type: 'image',
    src: '/images/terrarium-hero-kit.jpg',
    alt: 'ערכת הטרריום המלאה לצד הטרריום המוגמר',
    fit: 'contain',
  },
  {
    type: 'video',
    src: '/videos/terrarium-hero-build.mp4',
    poster: '/images/terrarium-hero-build-poster.jpg',
    alt: 'סרטון בניית הטרריום מהערכה',
    fit: 'contain',
  },
  {
    type: 'image',
    src: '/images/terrarium-hero-contents.jpg',
    alt: 'פירוט כל הפריטים הכלולים בערכת הטרריום',
    fit: 'contain',
  },
  {
    type: 'video',
    src: '/videos/terrarium-hero-crab-wide.mp4',
    poster: '/images/terrarium-hero-crab-wide-poster.jpg',
    alt: 'עולם טרריום חי עם מפל מים וסרטן ערפד',
    fit: 'contain',
  },
  {
    type: 'video',
    src: '/videos/terrarium-hero-crab-feeding.mp4',
    poster: '/images/terrarium-hero-crab-feeding-poster.jpg',
    alt: 'סרטון האכלת סרטן ערפד בטרריום',
    fit: 'contain',
  },
  {
    type: 'image',
    src: '/images/terrarium-hero-packaging.jpg',
    alt: 'מערכות Bioloark ארוזות וכלי עבודה לטרריום',
    fit: 'contain',
  },
  {
    type: 'image',
    src: '/images/terrarium-hero-gallery.jpg',
    alt: 'אוסף עולמות הטרריום של Bioloark',
    fit: 'contain',
  },
];

export function HeroMediaCarousel() {
  const [active, setActive] = useState(0);
  const [hoverPause, setHoverPause] = useState(false);
  const [pointerPause, setPointerPause] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const pointerStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const paused = hoverPause || pointerPause;

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [active, paused]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [active]);

  const goTo = (index: number) => setActive((index + slides.length) % slides.length);

  const startPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.hero-media-controls')) return;
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setPointerPause(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const movePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    if (!start || start.id !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (!dragging && Math.abs(deltaX) < 5) return;
    if (!dragging && Math.abs(deltaX) <= Math.abs(deltaY)) return;

    event.preventDefault();
    setDragging(true);
    setDragOffset(Math.max(-140, Math.min(140, deltaX)));
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    setPointerPause(false);
    setDragging(false);
    setDragOffset(0);

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!start || start.id !== event.pointerId || cancelled) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    goTo(active + (deltaX < 0 ? 1 : -1));
  };

  return (
    <div
      className={`hero-image hero-media-carousel${dragging ? ' is-dragging' : ''}`}
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
      onFocusCapture={() => setHoverPause(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHoverPause(false);
      }}
      onPointerDown={startPointer}
      onPointerMove={movePointer}
      onPointerUp={finishPointer}
      onPointerCancel={(event) => finishPointer(event, true)}
      onDragStart={(event) => event.preventDefault()}
      aria-label="תמונות וסרטונים של ערכת הטרריום"
    >
      <div className="hero-media-stage">
        {slides.map((slide, index) => {
          const backdrop = slide.poster || slide.src;
          return (
            <figure
              className={`hero-media-slide is-${slide.fit || 'cover'}${index === active ? ' is-active' : ''}`}
              aria-hidden={index !== active}
              key={slide.src}
              style={index === active ? { transform: `translate3d(${dragOffset}px, 0, 0)` } : undefined}
            >
              {slide.fit === 'contain' && <span className="hero-media-backdrop" style={{ backgroundImage: `url(${backdrop})` }} aria-hidden="true" />}
              {slide.type === 'image' ? (
                <img src={slide.src} alt={index === active ? slide.alt : ''} loading={index === 0 ? 'eager' : 'lazy'} draggable={false} />
              ) : (
                <video
                  ref={(node) => { videoRefs.current[index] = node; }}
                  src={slide.src}
                  poster={slide.poster}
                  muted
                  playsInline
                  draggable={false}
                  preload={slide.src === '/videos/terrarium-hero-build.mp4' ? 'auto' : 'metadata'}
                  onEnded={(event) => {
                    if (index !== active) return;
                    if (paused) {
                      event.currentTarget.currentTime = 0;
                      void event.currentTarget.play().catch(() => undefined);
                    } else {
                      goTo(active + 1);
                    }
                  }}
                  aria-label={slide.alt}
                />
              )}
            </figure>
          );
        })}
      </div>

      <div className="hero-media-controls" dir="ltr">
        <div className="hero-media-dots" aria-label="בחירת תמונה או סרטון">
          {slides.map((slide, index) => (
            <button
              type="button"
              className={index === active ? 'is-active' : ''}
              onClick={() => goTo(index)}
              aria-label={`מעבר ל${slide.type === 'video' ? 'סרטון' : 'תמונה'} ${index + 1}`}
              aria-current={index === active ? 'true' : undefined}
              key={slide.src}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
