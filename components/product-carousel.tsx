'use client';

import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

export function ProductCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const draggingRef = useRef(false);
  const draggedRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const directionRef = useRef(-1);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const placeAtStart = window.requestAnimationFrame(() => {
      track.scrollLeft = track.scrollWidth - track.clientWidth;
    });

    if (reducedMotion) return () => window.cancelAnimationFrame(placeAtStart);

    let animationFrame = 0;
    let previousTime = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min(32, time - previousTime);
      previousTime = time;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const paused = hoveredRef.current || focusedRef.current || draggingRef.current || time < pauseUntilRef.current;

      if (!paused && maxScroll > 1) {
        track.scrollLeft += directionRef.current * elapsed * 0.034;
        if (track.scrollLeft <= 0) {
          track.scrollLeft = 0;
          directionRef.current = 1;
          pauseUntilRef.current = time + 900;
        } else if (track.scrollLeft >= maxScroll) {
          track.scrollLeft = maxScroll;
          directionRef.current = -1;
          pauseUntilRef.current = time + 900;
        }
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(placeAtStart);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const pauseAfterInteraction = (duration = 2200) => {
    pauseUntilRef.current = performance.now() + duration;
  };

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    pauseAfterInteraction(2800);
    track.scrollBy({ left: direction * track.clientWidth * 0.78, behavior: 'smooth' });
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      pauseAfterInteraction(2800);
      return;
    }
    const track = event.currentTarget;
    draggingRef.current = true;
    draggedRef.current = false;
    dragStartRef.current = { x: event.clientX, scrollLeft: track.scrollLeft };
    pauseAfterInteraction();
  };

  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const distance = event.clientX - dragStartRef.current.x;
    if (!draggedRef.current && Math.abs(distance) > 10) {
      draggedRef.current = true;
      event.currentTarget.classList.add('is-dragging');
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!draggedRef.current) return;
    event.preventDefault();
    event.currentTarget.scrollLeft = dragStartRef.current.scrollLeft - distance;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.classList.remove('is-dragging');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pauseAfterInteraction();
  };

  const preventDraggedClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!draggedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    draggedRef.current = false;
  };

  return <div
    className="product-carousel"
    role="region"
    aria-roledescription="carousel"
    aria-label="נבחרים מהסטודיו"
    onPointerEnter={() => { hoveredRef.current = true; }}
    onPointerLeave={() => { hoveredRef.current = false; pauseAfterInteraction(650); }}
    onFocusCapture={() => { focusedRef.current = true; }}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { focusedRef.current = false; pauseAfterInteraction(650); } }}
  >
    <div className="product-carousel-toolbar"><p>גררו או גללו כדי לגלות עוד</p><div><button type="button" onClick={() => scrollByPage(-1)} aria-label="למוצרים הבאים">←</button><button type="button" onClick={() => scrollByPage(1)} aria-label="למוצרים הקודמים">→</button></div></div>
    <div
      className="product-carousel-track"
      ref={trackRef}
      onPointerDown={startDrag}
      onPointerMove={drag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={preventDraggedClick}
      onWheel={() => pauseAfterInteraction()}
    >{children}</div>
  </div>;
}
