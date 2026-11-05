import { validMapCoordinates, type MapCoordinates } from './storeMaps';

export interface CurrentLocation extends MapCoordinates { accuracy: number }

/** Read a fresh device fix. Never substitute an IP location or a city centre. */
export function getCurrentLocation(
  geolocation: Pick<Geolocation, 'getCurrentPosition'> | undefined = typeof navigator !== 'undefined' ? navigator.geolocation : undefined,
): Promise<CurrentLocation> {
  return new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error('Trình duyệt chưa hỗ trợ định vị. Hãy mở trang bằng HTTPS hoặc localhost và bật vị trí thiết bị.'));
      return;
    }
    geolocation.getCurrentPosition(position => {
      const { latitude: lat, longitude: lng, accuracy } = position.coords;
      if (!validMapCoordinates(lat, lng) || !Number.isFinite(accuracy) || accuracy < 0) {
        reject(new Error('Thiết bị chưa trả về vị trí hợp lệ. Hãy bật định vị và thử lại.'));
      } else if (accuracy > 1000) {
        // Even the smallest store-search radius would be unreliable with this fix.
        reject(new Error(`Vị trí thiết bị còn quá rộng (sai số khoảng ${Math.round(accuracy).toLocaleString('vi-VN')} m). Hãy bật vị trí chính xác/GPS, bật Wi-Fi và định vị lại.`));
      } else {
        resolve({ lat, lng, accuracy });
      }
    }, async error => {
      let browserAllowed = false;
      if (error.code === 1 && typeof navigator !== 'undefined' && navigator.permissions) {
        try { browserAllowed = (await navigator.permissions.query({ name: 'geolocation' })).state === 'granted'; } catch { /* Some browsers do not expose permission state. */ }
      }
      reject(new Error(error.code === 1
        ? browserAllowed
          ? 'Trình duyệt đã cho phép nhưng thiết bị đang chặn vị trí. Hãy bật Dịch vụ định vị và cho phép trình duyệt dùng vị trí trong cài đặt hệ thống, rồi định vị lại.'
          : 'Chưa được cấp quyền vị trí. Hãy cho phép Vị trí cho SmartCook trong trình duyệt, bật định vị trên thiết bị rồi tải lại trang.'
        : error.code === 3
          ? 'Chưa lấy được vị trí hiện tại trong thời gian chờ. Hãy bật GPS/Wi-Fi và định vị lại.'
          : 'Thiết bị chưa xác định được vị trí hiện tại. Hãy bật định vị trên thiết bị rồi thử lại.'));
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });
}
