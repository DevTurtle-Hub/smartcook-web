import type { StoreItem } from '../api/store.api';
import type { MapCoordinates } from './storeMaps';

// Place coordinates and addresses checked against Google Maps on 2026-11-04.
// Campus: https://www.google.com/maps/search/?api=1&query=13.8038844,109.2191454
export const FPT_QUY_NHON = { name: 'Đại học FPT Quy Nhơn', lat: 13.8038844, lng: 109.2191454 };
export const QUY_NHON_STORES: StoreItem[] = [
  { id: 'qn-gia-dinh', name: 'Siêu thị Gia Đình', brand: 'Gia Đình', address: 'Q6R8+P5V, Quy Nhơn, Gia Lai', latitude: 13.7918696, longitude: 109.2154302, openHours: '' },
  { id: 'qn-winmart', name: 'WinMart Quy Nhơn', brand: 'WinMart', address: 'TTTM An Phú Thịnh, đường 31 Tháng 3, Quy Nhơn', latitude: 13.7733943, longitude: 109.2338629, openHours: '', phone: '0866429525' },
  { id: 'qn-coopmart', name: 'Co.opmart Quy Nhơn', brand: 'Co.opmart', address: 'Đường Nguyễn Tất Thành, Quy Nhơn', latitude: 13.7675591, longitude: 109.2220088, openHours: '', phone: '0911061234' },
  { id: 'qn-go', name: 'GO! Quy Nhơn', brand: 'GO!', address: 'Khu đô thị An Phước, Quy Nhơn', latitude: 13.7547513, longitude: 109.2078568, openHours: '', phone: '19001880' },
];

export function quyNhonStoresNear(center: MapCoordinates, radiusKm: number): StoreItem[] {
  const rad = (degrees: number) => degrees * Math.PI / 180;
  return QUY_NHON_STORES.map(store => {
    const a = Math.sin(rad(store.latitude - center.lat) / 2) ** 2
      + Math.cos(rad(center.lat)) * Math.cos(rad(store.latitude)) * Math.sin(rad(store.longitude - center.lng) / 2) ** 2;
    return { ...store, distanceKm: 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) };
  }).filter(store => store.distanceKm <= radiusKm).sort((a, b) => a.distanceKm - b.distanceKm)
    .map(store => ({ ...store, distanceKm: Math.round(store.distanceKm * 10) / 10 }));
}
