'use client';

import { useEffect } from 'react';

export function ScrollMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const media = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-media]'));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

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
        const speed = Number(element.dataset.scrollSpeed || 22) * mobileFactor;
        const shift = Math.max(-speed, Math.min(speed, progress * speed));
        element.style.setProperty('--scroll-shift', `${shift.toFixed(2)}px`);
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return null;
}
