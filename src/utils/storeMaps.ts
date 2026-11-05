export interface MapCoordinates { lat: number; lng: number }

export function validMapCoordinates(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

export function storeDirectionsUrl(destination: MapCoordinates, origin?: MapCoordinates, travelMode: 'driving' | 'walking' | 'two-wheeler' = 'driving'): string {
  if (!validMapCoordinates(destination.lat, destination.lng)) throw new Error('Tọa độ cửa hàng không hợp lệ');
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', `${destination.lat},${destination.lng}`);
  url.searchParams.set('travelmode', travelMode);
  if (origin && validMapCoordinates(origin.lat, origin.lng)) url.searchParams.set('origin', `${origin.lat},${origin.lng}`);
  return url.toString();
}

export function storeSearchUrl(query: string): string {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', query.trim() || 'Siêu thị gần tôi');
  return url.toString();
}
