const profileUrl = 'https://www.instagram.com/bioloark_israel/';
const fallbackImages = ['/images/terrarium-feature-16x9.webp', '/images/about-waterfall-v2.webp', '/images/path-consulting-cube-v3.webp'];
const featuredReels = [
  'https://www.instagram.com/reel/Dbaz6MatqNa/',
  'https://www.instagram.com/reel/DaDCUB4NGlu/',
  'https://www.instagram.com/reel/DcBJAhENh16/',
];

function embedUrl(url: string) {
  const clean = url.trim().split('?')[0].replace(/\/$/, '');
  return `${clean}/embed/captioned/`;
}

export function InstagramReels() {
  const configuredReels = (process.env.INSTAGRAM_REEL_URLS || '').split(',').map((url) => url.trim()).filter(Boolean);
  const reels = (configuredReels.length ? configuredReels : featuredReels).slice(0, 3);
  return <section className="instagram-section" aria-labelledby="instagram-title">
    <div className="instagram-heading"><div><p className="eyebrow dark">FROM THE STUDIO</p><h2 id="instagram-title">מהסטודיו ל־Instagram</h2><small>גררו או גללו כדי לצפות בעוד סרטונים ←</small></div><a href={profileUrl} target="_blank" rel="noreferrer">לכל הסרטונים ↗</a></div>
    {reels.length ? <div className="instagram-reel-grid">{reels.map((url) => <iframe key={url} src={embedUrl(url)} title="סרטון Reel של Bioloark" loading="lazy" allow="encrypted-media" />)}</div> : <div className="instagram-reel-grid instagram-fallback">{fallbackImages.map((image, index) => <a href={profileUrl} target="_blank" rel="noreferrer" key={image}><img src={image} alt="הצצה לסרטוני הסטודיו של Bioloark" loading="lazy" /><span><b>REEL {String(index + 1).padStart(2, '0')}</b>צפייה ב־Instagram ↗</span></a>)}</div>}
  </section>;
}
