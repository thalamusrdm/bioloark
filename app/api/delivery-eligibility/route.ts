const STUDIO = { latitude: 32.080729, longitude: 34.77054 };
const FREE_DELIVERY_RADIUS_KM = 10;
const addressCache = new Map<string, { address: string; latitude: number; longitude: number }>();

type GeocodingResult = { lat: string; lon: string; display_name: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as { address?: string };
    const address = body.address?.trim();
    if (!address || address.length < 5) return Response.json({ error: 'יש להזין רחוב, מספר ועיר.' }, { status: 400 });

    const location = await geocodeIsraeliAddress(address);
    if (!location) return Response.json({ error: 'לא מצאנו את הכתובת. נסו לכתוב רחוב, מספר ועיר באופן מלא.' }, { status: 404 });

    const distanceKm = haversineDistance(STUDIO.latitude, STUDIO.longitude, location.latitude, location.longitude);
    return Response.json({
      address: location.address,
      distanceKm: Math.round(distanceKm * 10) / 10,
      withinRadius: distanceKm <= FREE_DELIVERY_RADIUS_KM,
    });
  } catch {
    return Response.json({ error: 'לא הצלחנו לבדוק את הכתובת כרגע. נסו שוב בעוד רגע.' }, { status: 500 });
  }
}

async function geocodeIsraeliAddress(address: string) {
  const cacheKey = address.toLocaleLowerCase('he-IL');
  const cached = addressCache.get(cacheKey);
  if (cached) return cached;

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', `${address}, ישראל`);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'il');
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'he,en',
      'User-Agent': 'BioloarkDeliveryEligibility/1.0 (https://www.bioloark.co.il)',
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Geocoding request failed');
  const results = await response.json() as GeocodingResult[];
  const first = results[0];
  if (!first) return undefined;

  const location = { address: first.display_name, latitude: Number(first.lat), longitude: Number(first.lon) };
  if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return undefined;
  addressCache.set(cacheKey, location);
  return location;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lon2 - lon1);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
