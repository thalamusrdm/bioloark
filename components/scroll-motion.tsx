'use client';

import { useEffect } from 'react';

export function ScrollMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const media = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-media]'));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const spotlights = Array.from(document.querySelectorAll<HTMLElement>('[data-spotlight]'));
    const touchPanStates = new WeakMap<HTMLElement, { startX: number; startPosition: number }>();

    if (reduceMotion.matches) {
      reveals.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    reveals.forEach((element) => observer.observe(element));

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const mobileFactor = window.innerWidth < 720 ? 0.48 : 1;

      media.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom < -160 || bounds.top > viewportHeight + 160) return;

        const progress = (viewportHeight * 0.5 - (bounds.top + bounds.height * 0.5)) / viewportHeight;
        const visibleProgress = Math.max(0, Math.min(1, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)));

        if (element.dataset.scrollAxis === 'x') {
          const trackBounds = element.parentElement?.getBoundingClientRect() ?? bounds;
          const startLine = viewportHeight * 0.45;
          const endLine = -trackBounds.height * 0.45;
          const horizontalProgress = Math.max(0, Math.min(1, (startLine - trackBounds.top) / (startLine - endLine)));
          const overflow = Math.max(0, element.offsetWidth - (element.parentElement?.clientWidth ?? 0));
          const horizontalShift = -horizontalProgress * overflow;
          element.style.setProperty('--scroll-shift-x', `${horizontalShift.toFixed(2)}px`);
          element.style.setProperty('--scroll-shift', '0px');
        } else {
          const speed = Number(element.dataset.scrollSpeed || 22) * mobileFactor;
          const shift = Math.max(-speed, Math.min(speed, progress * speed));
          element.style.setProperty('--scroll-shift', `${shift.toFixed(2)}px`);
        }

        const zoomRange = Number(element.dataset.scrollZoom || 0) * mobileFactor;
        if (zoomRange > 0) {
          element.style.setProperty('--scroll-scale', (1.035 + visibleProgress * zoomRange).toFixed(4));
        }
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const moveSpotlight = (event: PointerEvent) => {
      const element = event.currentTarget as HTMLElement;
      const mobileTouch = event.pointerType === 'touch' && window.innerWidth <= 900 && element.classList.contains('terrarium-feature');
      if (event.pointerType === 'touch' && !mobileTouch) return;
      const bounds = element.getBoundingClientRect();
      element.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
      element.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);

      if (mobileTouch) {
        const state = touchPanStates.get(element);
        const image = element.querySelector<HTMLImageElement>(':scope > img');
        if (!state || !image) return;
        const nextPosition = Math.max(0, Math.min(100, state.startPosition - ((event.clientX - state.startX) / bounds.width) * 100));
        element.dataset.mobileImagePosition = nextPosition.toFixed(2);
        image.style.objectPosition = `${nextPosition.toFixed(2)}% center`;
      }
    };

    const showSpotlight = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const element = event.currentTarget as HTMLElement;
      element.classList.add('is-spotlight-active');
      moveSpotlight(event);
    };

    const hideSpotlight = (event: PointerEvent) => {
      (event.currentTarget as HTMLElement).classList.remove('is-spotlight-active');
    };

    const startTouchSpotlight = (event: PointerEvent) => {
      const element = event.currentTarget as HTMLElement;
      if (event.pointerType !== 'touch' || window.innerWidth > 900 || !element.classList.contains('terrarium-feature')) return;
      touchPanStates.set(element, { startX: event.clientX, startPosition: Number(element.dataset.mobileImagePosition || 50) });
      element.classList.add('is-spotlight-active', 'is-touch-panning');
      moveSpotlight(event);
    };

    const endTouchSpotlight = (event: PointerEvent) => {
      const element = event.currentTarget as HTMLElement;
      if (event.pointerType !== 'touch') return;
      touchPanStates.delete(element);
      element.classList.remove('is-spotlight-active', 'is-touch-panning');
    };

    const pendingImages = media.filter(
      (element): element is HTMLImageElement => element instanceof HTMLImageElement && !element.complete,
    );
    pendingImages.forEach((image) => image.addEventListener('load', requestUpdate, { once: true }));
    spotlights.forEach((element) => {
      element.addEventListener('pointerenter', showSpotlight);
      element.addEventListener('pointerdown', startTouchSpotlight);
      element.addEventListener('pointermove', moveSpotlight);
      element.addEventListener('pointerup', endTouchSpotlight);
      element.addEventListener('pointercancel', endTouchSpotlight);
      element.addEventListener('pointerleave', hideSpotlight);
    });

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      pendingImages.forEach((image) => image.removeEventListener('load', requestUpdate));
      spotlights.forEach((element) => {
        element.removeEventListener('pointerenter', showSpotlight);
        element.removeEventListener('pointerdown', startTouchSpotlight);
        element.removeEventListener('pointermove', moveSpotlight);
        element.removeEventListener('pointerup', endTouchSpotlight);
        element.removeEventListener('pointercancel', endTouchSpotlight);
        element.removeEventListener('pointerleave', hideSpotlight);
      });
    };
  }, []);

  return null;
}
