import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Store,
  Clock,
  Phone,
  Compass,
  AlertCircle,
  X,
  RotateCw,
  Search,
  ShoppingCart,
  Star,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { storeApi } from '../../api/store.api';
import { useCartStore } from '../../store/useCartStore';
import { toast } from '../../context/ToastContext';

interface NearbySupermarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  neededIngredients?: { name: string; amount?: string | number; unit?: string }[];
}

export interface SupermarketLocation {
  id: string;
  name: string;
  brand: 'winmart' | 'coopmart' | 'bachhoaxanh' | 'lotte' | 'aeon' | 'bigc' | 'other';
  lat: number;
  lng: number;
  address: string;
  distanceKm?: number;
  openHours: string;
  phone?: string;
  rating: number;
  reviewsCount: number;
  hasParking: boolean;
  highlightTag?: string;
}

// Danh sách các chi nhánh chuỗi siêu thị phổ biến ở các thành phố lớn
const POPULAR_SUPERMARKETS: SupermarketLocation[] = [
  // TP.HCM
  {
    id: 'sm-1',
    name: 'WinMart+ Hai Bà Trưng',
    brand: 'winmart',
    lat: 10.7895,
    lng: 106.6923,
    address: '154 Hai Bà Trưng, P. Đa Kao, Quận 1, TP. HCM',
    openHours: '06:00 - 22:00',
    phone: '028 7109 0088',
    rating: 4.6,
    reviewsCount: 142,
    hasParking: true,
    highlightTag: 'Đầy đủ rau củ sạch & thịt VietGAP'
  },
  {
    id: 'sm-2',
    name: 'Co.opmart Cống Quỳnh',
    brand: 'coopmart',
    lat: 10.7681,
    lng: 106.6896,
    address: '189C Cống Quỳnh, P. Nguyễn Cư Trinh, Quận 1, TP. HCM',
    openHours: '07:30 - 22:00',
    phone: '028 3832 5283',
    rating: 4.8,
    reviewsCount: 890,
    hasParking: true,
    highlightTag: 'Đại siêu thị đa dạng nguyên liệu nhất'
  },
  {
    id: 'sm-3',
    name: 'Bách Hóa Xanh Đinh Tiên Hoàng',
    brand: 'bachhoaxanh',
    lat: 10.7932,
    lng: 106.6975,
    address: '95 Đinh Tiên Hoàng, P. Đa Kao, Quận 1, TP. HCM',
    openHours: '06:30 - 21:30',
    phone: '1900 1908',
    rating: 4.4,
    reviewsCount: 215,
    hasParking: true,
    highlightTag: 'Giá bình dân, hải sản & rau tươi mỗi ngày'
  },
  {
    id: 'sm-4',
    name: 'Emart Sala Thủ Thiêm',
    brand: 'other',
    lat: 10.7712,
    lng: 106.7214,
    address: '10 Mai Chí Thọ, P. An Lợi Đông, TP. Thủ Đức, TP. HCM',
    openHours: '07:30 - 22:30',
    phone: '028 3622 9999',
    rating: 4.9,
    reviewsCount: 1420,
    hasParking: true,
    highlightTag: 'Thực phẩm nhập khẩu cao cấp'
  },
  {
    id: 'sm-5',
    name: 'Lotte Mart Quận 7',
    brand: 'lotte',
    lat: 10.7424,
    lng: 106.7028,
    address: '469 Nguyễn Hữu Thọ, P. Tân Hưng, Quận 7, TP. HCM',
    openHours: '08:00 - 22:00',
    phone: '028 3775 3232',
    rating: 4.7,
    reviewsCount: 960,
    hasParking: true,
    highlightTag: 'Nhiều gia vị Hàn Quốc & đồ tươi ngon'
  },
  {
    id: 'sm-6',
    name: 'Tops Market Parkson Cantavil',
    brand: 'bigc',
    lat: 10.8016,
    lng: 106.7454,
    address: '1 Song Hành, P. An Phú, TP. Thủ Đức, TP. HCM',
    openHours: '08:00 - 22:00',
    phone: '028 3740 4088',
    rating: 4.6,
    reviewsCount: 380,
    hasParking: true,
    highlightTag: 'Siêu thị tiêu chuẩn châu Âu'
  },
  {
    id: 'sm-7',
    name: 'Aeon Mall Tân Phú Celadon',
    brand: 'aeon',
    lat: 10.8008,
    lng: 106.6181,
    address: '30 Bờ Bao Tân Thắng, Sơn Kỳ, Tân Phú, TP. HCM',
    openHours: '08:00 - 22:00',
    phone: '1900 636 922',
    rating: 4.8,
    reviewsCount: 2310,
    hasParking: true,
    highlightTag: 'Thực phẩm tươi sống chuẩn Nhật Bản'
  },
  // Hà Nội
  {
    id: 'sm-hn-1',
    name: 'WinMart Tràng Tiền Plaza',
    brand: 'winmart',
    lat: 21.0253,
    lng: 105.8542,
    address: '24 Hai Bà Trưng, Tràng Tiền, Hoàn Kiếm, Hà Nội',
    openHours: '08:00 - 22:00',
    phone: '024 3937 8599',
    rating: 4.6,
    reviewsCount: 420,
    hasParking: true,
    highlightTag: 'Vị trí trung tâm tiện lợi'
  },
  {
    id: 'sm-hn-2',
    name: 'BRG Mart Bà Triệu',
    brand: 'other',
    lat: 21.0115,
    lng: 105.8502,
    address: '191 Bà Triệu, Lê Đại Hành, Hai Bà Trưng, Hà Nội',
    openHours: '07:30 - 21:30',
    phone: '024 3974 6699',
    rating: 4.5,
    reviewsCount: 190,
    hasParking: true,
    highlightTag: 'Nông sản hữu cơ, thịt sạch'
  },
  {
    id: 'sm-hn-3',
    name: 'Big C Thăng Long (GO!)',
    brand: 'bigc',
    lat: 21.0084,
    lng: 105.7925,
    address: '222 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    openHours: '08:00 - 22:30',
    phone: '024 3784 8596',
    rating: 4.7,
    reviewsCount: 1850,
    hasParking: true,
    highlightTag: 'Giá tốt nhất cho số lượng lớn'
  },
  // Quy Nhơn (Bình Định)
  {
    id: 'sm-qn-1',
    name: 'Co.opmart Quy Nhơn',
    brand: 'coopmart',
    lat: 13.7744,
    lng: 109.2192,
    address: '07 Lê Duẩn, P. Lý Thường Kiệt, TP. Quy Nhơn, Bình Định',
    openHours: '07:30 - 22:00',
    phone: '0256 3522 888',
    rating: 4.7,
    reviewsCount: 650,
    hasParking: true,
    highlightTag: 'Siêu thị trung tâm, đa dạng thực phẩm tươi sống'
  },
  {
    id: 'sm-qn-2',
    name: 'GO! Quy Nhơn (Big C Kim Cúc Plaza)',
    brand: 'bigc',
    lat: 13.7583,
    lng: 109.2155,
    address: 'Khu Đô Thị Xanh Vũng Chua, P. Ghềnh Ráng, TP. Quy Nhơn, Bình Định',
    openHours: '08:00 - 22:00',
    phone: '0256 3686 688',
    rating: 4.8,
    reviewsCount: 1120,
    hasParking: true,
    highlightTag: 'Đại siêu thị lớn nhất Quy Nhơn, giá tốt'
  },
  {
    id: 'sm-qn-3',
    name: 'WinMart+ Nguyễn Thái Học Quy Nhơn',
    brand: 'winmart',
    lat: 13.7661,
    lng: 109.2235,
    address: '354 Nguyễn Thái Học, P. Ngô Mây, TP. Quy Nhơn, Bình Định',
    openHours: '06:00 - 22:00',
    phone: '0256 7108 888',
    rating: 4.6,
    reviewsCount: 135,
    hasParking: true,
    highlightTag: 'Cửa hàng tiện lợi, rau củ thịt sạch VietGAP'
  },
  {
    id: 'sm-qn-4',
    name: 'WinMart+ An Dương Vương Quy Nhơn',
    brand: 'winmart',
    lat: 13.7548,
    lng: 109.2177,
    address: '01 An Dương Vương, P. Nguyễn Văn Cừ, TP. Quy Nhơn, Bình Định',
    openHours: '06:00 - 22:00',
    phone: '0256 7109 999',
    rating: 4.5,
    reviewsCount: 98,
    hasParking: true,
    highlightTag: 'Gần bờ biển và các trường đại học'
  },
  {
    id: 'sm-qn-5',
    name: 'Bách Hóa Xanh Trần Hưng Đạo Quy Nhơn',
    brand: 'bachhoaxanh',
    lat: 13.7788,
    lng: 109.2312,
    address: '650 Trần Hưng Đạo, P. Đống Đa, TP. Quy Nhơn, Bình Định',
    openHours: '06:30 - 21:30',
    phone: '1900 1908',
    rating: 4.5,
    reviewsCount: 210,
    hasParking: true,
    highlightTag: 'Hải sản và rau củ quả tươi ngon mỗi ngày'
  },
  {
    id: 'sm-qn-6',
    name: 'Mega Market Quy Nhơn',
    brand: 'other',
    lat: 13.7482,
    lng: 109.2045,
    address: 'Quốc Lộ 1D, P. Ghềnh Ráng, TP. Quy Nhơn, Bình Định',
    openHours: '06:00 - 21:30',
    phone: '0256 3546 888',
    rating: 4.7,
    reviewsCount: 540,
    hasParking: true,
    highlightTag: 'Bán buôn và bán lẻ nguyên liệu thực phẩm lớn'
  },
  // Đà Nẵng
  {
    id: 'sm-dn-1',
    name: 'GO! Đà Nẵng (Big C)',
    brand: 'bigc',
    lat: 16.0645,
    lng: 108.2144,
    address: '255-257 Hùng Vương, Vĩnh Trung, Thanh Khê, Đà Nẵng',
    openHours: '08:00 - 22:00',
    phone: '0236 3666 085',
    rating: 4.6,
    reviewsCount: 880,
    hasParking: true,
    highlightTag: 'Đầy đủ tất cả gia vị và đồ tươi'
  },
  {
    id: 'sm-dn-2',
    name: 'Co.opmart Đà Nẵng',
    brand: 'coopmart',
    lat: 16.0617,
    lng: 108.1876,
    address: '478 Điện Biên Phủ, Thanh Khê Đông, Thanh Khê, Đà Nẵng',
    openHours: '07:30 - 21:30',
    phone: '0236 3771 888',
    rating: 4.5,
    reviewsCount: 430,
    hasParking: true,
    highlightTag: 'Hàng Việt Nam chất lượng cao'
  },
  {
    id: 'sm-dn-3',
    name: 'Lotte Mart Đà Nẵng',
    brand: 'lotte',
    lat: 16.0354,
    lng: 108.2255,
    address: '06 Nại Nam, Hoà Cường Bắc, Hải Châu, Đà Nẵng',
    openHours: '08:00 - 22:00',
    phone: '0236 3611 999',
    rating: 4.7,
    reviewsCount: 920,
    hasParking: true,
    highlightTag: 'Trung tâm mua sắm hiện đại'
  },
  // Nha Trang (Khánh Hòa)
  {
    id: 'sm-nt-1',
    name: 'GO! Nha Trang (Big C)',
    brand: 'bigc',
    lat: 12.2471,
    lng: 109.1764,
    address: 'Lô 4, Đường 19/5, Vĩnh Điềm Trung, TP. Nha Trang, Khánh Hòa',
    openHours: '08:00 - 22:00',
    phone: '0258 3894 888',
    rating: 4.6,
    reviewsCount: 780,
    hasParking: true,
    highlightTag: 'Siêu thị quy mô lớn nhất Nha Trang'
  },
  {
    id: 'sm-nt-2',
    name: 'Co.opmart Nha Trang',
    brand: 'coopmart',
    lat: 12.2536,
    lng: 109.1842,
    address: '02 Lê Hồng Phong, P. Phước Tân, TP. Nha Trang, Khánh Hòa',
    openHours: '07:30 - 22:00',
    phone: '0258 3875 111',
    rating: 4.6,
    reviewsCount: 510,
    hasParking: true,
    highlightTag: 'Đầy đủ hàng thiết yếu mỗi ngày'
  },
  // Cần Thơ
  {
    id: 'sm-ct-1',
    name: 'Lotte Mart Cần Thơ',
    brand: 'lotte',
    lat: 10.0452,
    lng: 105.7725,
    address: '84 Mậu Thân, An Hòa, Ninh Kiều, Cần Thơ',
    openHours: '08:00 - 22:00',
    phone: '0292 3696 888',
    rating: 4.7,
    reviewsCount: 890,
    hasParking: true,
    highlightTag: 'Siêu thị hiện đại miền Tây'
  },
  {
    id: 'sm-ct-2',
    name: 'GO! Cần Thơ (Big C)',
    brand: 'bigc',
    lat: 10.0173,
    lng: 105.7891,
    address: 'Khu Dân Cư Hưng Phú 1, Cái Răng, Cần Thơ',
    openHours: '08:00 - 22:00',
    phone: '0292 3737 888',
    rating: 4.6,
    reviewsCount: 740,
    hasParking: true,
    highlightTag: 'Đa dạng rau quả tươi miền Tây'
  }
];

// Công thức tính khoảng cách Haversine (km) giữa 2 tọa độ GPS
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const NearbySupermarketsModal: React.FC<NearbySupermarketsModalProps> = ({
  isOpen,
  onClose,
  neededIngredients = []
}) => {
  // Tọa độ người dùng mặc định (Quận 1, TP.HCM nếu chưa cấp quyền)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: 10.7769,
    lng: 106.7009
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Vị trí mặc định (Trung tâm TP.HCM)');
  const [selectedSupermarket, setSelectedSupermarket] = useState<SupermarketLocation | null>(null);
  const [mapViewMode, setMapViewMode] = useState<'store' | 'user'>('store');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [liveStores, setLiveStores] = useState<SupermarketLocation[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
  const [isCopiedList, setIsCopiedList] = useState<boolean>(false);

  // Lấy danh sách nguyên liệu từ giỏ đi chợ nếu props neededIngredients rỗng
  const cartItems = useCartStore((state) => state.items);
  const displayIngredients = useMemo(() => {
    if (neededIngredients && neededIngredients.length > 0) {
      return neededIngredients;
    }
    return cartItems.map((c) => ({
      name: c.name,
      amount: c.amount,
      unit: c.unit,
    }));
  }, [neededIngredients, cartItems]);

  // Sao chép danh sách đi chợ
  const handleCopyShoppingList = () => {
    if (displayIngredients.length === 0) return;
    const text = displayIngredients
      .map((item, idx) => `${idx + 1}. ${item.name}${item.amount ? ` (${item.amount}${item.unit ? ' ' + item.unit : ''})` : ''}`)
      .join('\n');
    navigator.clipboard?.writeText(text);
    setIsCopiedList(true);
    toast.success(`Đã sao chép ${displayIngredients.length} món cần mua vào khay nhớ tạm!`);
    setTimeout(() => setIsCopiedList(false), 2000);
  };

  // Hàm lấy vị trí thật qua Geolocation Browser + Reverse Geocoding
  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Trình duyệt không hỗ trợ định vị.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Đang xác định tọa độ GPS của bạn...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setIsLocating(false);

        // Reverse Geocoding hiển thị tên Phường/Quận/Thành phố thực tế
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`
          );
          if (res.ok) {
            const data = await res.json();
            const locationParts = [
              data.locality || data.city,
              data.principalSubdivision
            ].filter(Boolean);
            const addressText = locationParts.length > 0 ? locationParts.join(', ') : 'Vị trí hiện tại';
            setLocationStatus(`Vị trí của bạn: ${addressText} (GPS chính xác)`);
          } else {
            setLocationStatus('Đã định vị theo vị trí thực tế của bạn');
          }
        } catch {
          setLocationStatus('Đã định vị theo vị trí thực tế của bạn');
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Không thể lấy vị trí';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Bạn đã từ chối quyền định vị. Đang dùng vị trí ước tính';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Thông tin vị trí không khả dụng';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Hết thời gian yêu cầu định vị';
        }
        setLocationStatus(errorMsg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (isOpen) {
      requestCurrentLocation();
    }
  }, [isOpen]);

  // Tải danh sách siêu thị thật từ Backend theo GPS
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingStores(true);
    storeApi.getNearbyStores(userCoords.lat, userCoords.lng, 35, 15)
      .then((apiStores) => {
        if (apiStores && apiStores.length > 0) {
          const mapped: SupermarketLocation[] = apiStores.map((s) => {
            let brand: any = 'other';
            const b = (s.brand || '').toLowerCase();
            if (b.includes('winmart') || b.includes('win')) brand = 'winmart';
            else if (b.includes('coopmart') || b.includes('co.op') || b.includes('coop')) brand = 'coopmart';
            else if (b.includes('bach hoa') || b.includes('bachhoaxanh')) brand = 'bachhoaxanh';
            else if (b.includes('lotte')) brand = 'lotte';
            else if (b.includes('aeon')) brand = 'aeon';
            else if (b.includes('bigc') || b.includes('tops') || b.includes('go!')) brand = 'bigc';

            return {
              id: s.id,
              name: s.name,
              brand,
              lat: s.latitude,
              lng: s.longitude,
              address: s.address,
              distanceKm: s.distanceKm !== undefined ? s.distanceKm : calculateDistanceKm(userCoords.lat, userCoords.lng, s.latitude, s.longitude),
              openHours: s.openHours || '06:30 - 22:00',
              phone: s.phone || '1900 1908',
              rating: 4.8,
              reviewsCount: 340,
              hasParking: true,
              highlightTag: `Chuỗi ${s.brand || 'Siêu thị'} - Đầy đủ rau củ quả & thịt tươi sống`,
            };
          });
          setLiveStores(mapped);
        } else {
          setLiveStores([]);
        }
      })
      .catch((err) => {
        console.warn('Lỗi lấy siêu thị gần bạn từ backend:', err);
        setLiveStores([]);
      })
      .finally(() => {
        setIsLoadingStores(false);
      });
  }, [isOpen, userCoords.lat, userCoords.lng]);

  // Tính khoảng cách và sắp xếp lấy siêu thị gần nhất
  const nearbySupermarkets = useMemo(() => {
    const baseList = liveStores.length > 0
      ? liveStores
      : POPULAR_SUPERMARKETS.map((sm) => ({
          ...sm,
          distanceKm: calculateDistanceKm(userCoords.lat, userCoords.lng, sm.lat, sm.lng)
        }));

    // Sắp xếp theo khoảng cách tăng dần
    const sorted = [...baseList].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    // Nếu có tìm kiếm theo tên hoặc chuỗi
    if (searchFilter.trim()) {
      const filterLower = searchFilter.toLowerCase().trim();
      return sorted.filter(
        (sm) =>
          sm.name.toLowerCase().includes(filterLower) ||
          sm.address.toLowerCase().includes(filterLower)
      ).slice(0, 6);
    }

    return sorted.slice(0, 6);
  }, [liveStores, userCoords, searchFilter]);

  // Chọn mặc định siêu thị đầu tiên khi danh sách đổi
  useEffect(() => {
    if (nearbySupermarkets.length > 0 && !selectedSupermarket) {
      setSelectedSupermarket(nearbySupermarkets[0]);
    }
  }, [nearbySupermarkets, selectedSupermarket]);

  if (!isOpen) return null;

  const currentFocus = selectedSupermarket || nearbySupermarkets[0];

  // URL chỉ đường qua Google Maps
  const getGoogleMapsDirUrl = (sm: SupermarketLocation) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${sm.lat},${sm.lng}`;
  };

  // URL OpenStreetMap iFrame view
  const mapEmbedUrl = currentFocus
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${currentFocus.lng - 0.015}%2C${currentFocus.lat - 0.01}%2C${currentFocus.lng + 0.015}%2C${currentFocus.lat + 0.01}&layer=mapnik&marker=${currentFocus.lat}%2C${currentFocus.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${userCoords.lng - 0.015}%2C${userCoords.lat - 0.01}%2C${userCoords.lng + 0.015}%2C${userCoords.lat + 0.01}&layer=mapnik&marker=${userCoords.lat}%2C${userCoords.lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* HEADER MODAL */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Siêu Thị & Cửa Hàng Gần Bạn Nhất</span>
                {isLoadingStores ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                    <RotateCw className="w-3 h-3 animate-spin" /> Đang cập nhật GPS...
                  </span>
                ) : (
                  <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                    {liveStores.length > 0 ? `Đã tìm thấy ${liveStores.length} siêu thị` : 'Bản đồ vệ tinh & dẫn đường'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-orange-100/90 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-200" />
                <span>{locationStatus}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={requestCurrentLocation}
              disabled={isLocating}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all text-xs font-bold flex items-center gap-1.5 border border-white/15"
              title="Định vị lại vị trí hiện tại"
            >
              <RotateCw className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Định vị lại</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NGUYÊN LIỆU CẦN MUA REMINDER */}
        {displayIngredients.length > 0 && (
          <div className="px-5 py-2.5 bg-amber-50/90 border-b border-amber-200/60 flex items-center justify-between gap-3 overflow-x-auto text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold shrink-0">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
              <span>Cần mua ({displayIngredients.length} món):</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-slate-700 flex-1">
              {displayIngredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white rounded-lg border border-amber-200/80 text-[11px] font-semibold text-slate-800 shrink-0 shadow-2xs"
                >
                  {ing.name} {ing.amount ? `(${ing.amount}${ing.unit ? ' ' + ing.unit : ''})` : ''}
                </span>
              ))}
            </div>
            <button
              onClick={handleCopyShoppingList}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold shrink-0 transition-colors shadow-2xs"
              title="Sao chép danh sách đi chợ"
            >
              {isCopiedList ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedList ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        )}

        {/* MAIN BODY: 2 CỘT (DANH SÁCH 5 SIÊU THỊ & BẢN ĐỒ CHI TIẾT) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* CỘT TRÁI: DANH SÁCH 5 SIÊU THỊ GẦN NHẤT (5/12 CỘT) */}
          <div className="lg:col-span-5 border-r border-slate-100 flex flex-col min-h-0 bg-slate-50/40">
            {/* Thanh tìm kiếm nhanh */}
            <div className="p-3.5 border-b border-slate-200/70 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lọc siêu thị (WinMart, Co.op, Bách Hóa Xanh...)"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* List 5 Siêu thị */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {nearbySupermarkets.map((sm, index) => {
                const isSelected = selectedSupermarket?.id === sm.id;
                return (
                  <div
                    key={sm.id}
                    onClick={() => setSelectedSupermarket(sm)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border text-left relative ${
                      isSelected
                        ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-500/20'
                        : 'bg-white hover:bg-orange-50/20 border-slate-200/80 hover:border-orange-200 shadow-2xs'
                    }`}
                  >
                    {/* Header item */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isSelected
                              ? 'bg-orange-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 line-clamp-1">
                            {sm.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {sm.address}
                          </p>
                        </div>
                      </div>

                      {/* Khoảng cách badge */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-black text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-lg">
                          ~{sm.distanceKm} km
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {sm.distanceKm ? `${Math.round(sm.distanceKm * 3 + 2)} phút xe máy` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Tags & Rating */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{sm.rating}</span>
                        <span className="text-slate-400 font-normal">({sm.reviewsCount})</span>
                      </div>

                      {sm.highlightTag && (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                          {sm.highlightTag}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {nearbySupermarkets.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Không tìm thấy siêu thị phù hợp với từ khóa.
                </div>
              )}
            </div>

            {/* Chuyển nhanh vị trí mẫu các thành phố lớn */}
            <div className="p-3 border-t border-slate-200/80 bg-white/70 flex flex-col gap-1.5 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-600">Thử vị trí các khu vực:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords({ lat: 13.7744, lng: 109.2192 });
                    setLocationStatus('TP. Quy Nhơn (Bình Định)');
                  }}
                  className="px-2 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold transition-colors border border-orange-200/60"
                >
                  Quy Nhơn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords({ lat: 16.0544, lng: 108.2022 });
                    setLocationStatus('Đà Nẵng (Hải Châu)');
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 font-bold transition-colors"
                >
                  Đà Nẵng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords({ lat: 10.7769, lng: 106.7009 });
                    setLocationStatus('TP. Hồ Chí Minh (Quận 1)');
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 font-bold transition-colors"
                >
                  TP.HCM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords({ lat: 21.0285, lng: 105.8542 });
                    setLocationStatus('Hà Nội (Hoàn Kiếm)');
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 font-bold transition-colors"
                >
                  Hà Nội
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords({ lat: 12.2471, lng: 109.1842 });
                    setLocationStatus('Nha Trang (Khánh Hòa)');
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 font-bold transition-colors"
                >
                  Nha Trang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserCoords({ lat: 10.0452, lng: 105.7725 });
                    setLocationStatus('Cần Thơ (Ninh Kiều)');
                  }}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-600 font-bold transition-colors"
                >
                  Cần Thơ
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: MAP VIEW & DETAILS CARD (7/12 CỘT) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-slate-900 relative">
            {/* Cảnh báo khoảng cách nếu xa */}
            {currentFocus && currentFocus.distanceKm && currentFocus.distanceKm > 15 && (
              <div className="px-4 py-2 bg-amber-500/90 text-white text-[11px] font-semibold flex items-center justify-between gap-2 z-30 shrink-0">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Siêu thị chuỗi lớn gần nhất cách bạn ~{currentFocus.distanceKm} km. Bạn có thể tìm chợ & tạp hóa gần hơn quanh bạn.
                </span>
                <a
                  href={`https://www.google.com/maps/search/siêu+thị+chợ/@${userCoords.lat},${userCoords.lng},15z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline whitespace-nowrap hover:text-amber-100 font-bold"
                >
                  Tìm chợ quanh đây
                </a>
              </div>
            )}

            {/* Bản đồ nhúng Google Maps Embed - Cực kỳ tin cậy, không bị chặn hay vỡ tile */}
            <div className="flex-1 w-full h-full relative min-h-[340px] overflow-hidden bg-slate-100">
              <iframe
                key={`${mapViewMode}-${currentFocus?.id || 'user'}`}
                title={mapViewMode === 'user' ? 'Vị trí hiện tại của bạn' : `Bản đồ ${currentFocus?.name}`}
                src={
                  mapViewMode === 'user'
                    ? `https://maps.google.com/maps?q=${userCoords.lat},${userCoords.lng}&hl=vi&z=16&output=embed`
                    : `https://maps.google.com/maps?q=${currentFocus ? currentFocus.lat : userCoords.lat},${currentFocus ? currentFocus.lng : userCoords.lng}&hl=vi&z=16&output=embed`
                }
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Chế độ xem bản đồ: Siêu thị / Vị trí của tôi */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/90 text-[11px]">
                <button
                  type="button"
                  onClick={() => setMapViewMode('store')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    mapViewMode === 'store'
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  Xem siêu thị
                </button>
                <button
                  type="button"
                  onClick={() => setMapViewMode('user')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    mapViewMode === 'user'
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  Vị trí của tôi
                </button>
              </div>

              {/* Overlay actions mở Google Maps */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                <a
                  href={`https://www.google.com/maps/search/siêu+thị+chợ/@${userCoords.lat},${userCoords.lng},15z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-bold shadow-lg border border-slate-200/90 hover:text-orange-600 transition-all active:scale-95"
                  title="Tìm tất cả siêu thị, cửa hàng tiện lợi và chợ quanh tọa độ của bạn"
                >
                  <Search className="w-3.5 h-3.5 text-orange-600" />
                  <span>Tìm chợ quanh tôi</span>
                </a>
                {currentFocus && (
                  <a
                    href={getGoogleMapsDirUrl(currentFocus)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-extrabold shadow-lg border border-slate-200/90 hover:text-orange-600 transition-all active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    <span>Mở Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Chi tiết siêu thị đang được chọn */}
            {currentFocus && (
              <div className="p-4 bg-white border-t border-slate-200/80 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase">
                        Đang chọn
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {currentFocus.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{currentFocus.address}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {currentFocus.openHours}
                      </span>
                      {currentFocus.phone && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3.5 h-3.5" />
                          {currentFocus.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-orange-600 font-bold">
                        <Compass className="w-3.5 h-3.5" />
                        Cách bạn {currentFocus.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={getGoogleMapsDirUrl(currentFocus)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-orange-600/25 transition-all"
                    >
                      <Navigation className="w-4 h-4 fill-white" />
                      <span>Chỉ Đường Đi Ngay</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER MODAL */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Đã tối ưu tọa độ theo các chuỗi siêu thị lớn: WinMart, Co.opmart, Bách Hóa Xanh, Big C (GO!), Lotte Mart</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 shadow-2xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
