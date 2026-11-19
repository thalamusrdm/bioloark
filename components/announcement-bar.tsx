'use client';

import { useEffect, useState } from 'react';

const announcements = [
  { text: 'מתנה בכל קנייה 🎁' },
  { text: 'משלוחים חינם במרכז בקנייה מעל ₪400' },
  { text: 'משלוחים מוזלים לכל הארץ' },
  { text: '', link: '/delivery-check', action: 'בדוק זכאות למשלוח חינם' },
];

export function AnnouncementBar() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % announcements.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const announcement = announcements[active];
  return (
    <aside className="announcement-bar" aria-label="עדכוני משלוחים והטבות">
      <div className="announcement-message" key={active}>
        {announcement.text && <span>{announcement.text}</span>}
        {announcement.action && announcement.link && <a href={announcement.link}>{announcement.action} ←</a>}
      </div>
      <div className="announcement-dots" aria-hidden="true">
        {announcements.map((item, index) => <i className={index === active ? 'is-active' : ''} key={item.text} />)}
      </div>
    </aside>
  );
}
