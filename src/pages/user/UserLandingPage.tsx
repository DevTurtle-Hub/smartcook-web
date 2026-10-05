import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Smartphone, 
  Scan, 
  ChefHat, 
  MapPin, 
  Flame, 
  Layers, 
  ArrowRight, 
  Download, 
  Star, 
  CheckCircle2, 
  Play, 
  Refrigerator, 
  Camera, 
  Compass,
  Heart,
  Calendar,
  ShoppingCart,
  Clock,
  Activity,
  Award,
  Zap,
  Lock,
  ChevronDown,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  Shield,
  ExternalLink,
  Send,
  HelpCircle,
  Check
} from 'lucide-react';
import { UserHeader } from '../../components/user/UserHeader';

interface FeatureShowcaseItem {
  id: string;
  moduleCode: string;
  title: string;
  badge: string;
  headline: string;
  tagline: string;
  description: string;
  problemStatement: string;
  solutionHighlight: string;
  imageSrc: string;
  accentPill: string;
  highlights: {
    icon: React.ReactNode;
    title: string;
    desc: string;
  }[];
  metrics: {
    label: string;
    val: string;
  }[];
}

export const UserLandingPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 6 Render 3D nghệ thuật độc lạ (Mỗi màn hình hòa trộn liền mạch với phông nền, nguyên liệu bay tự nhiên)
  const showcases: FeatureShowcaseItem[] = [
    {
      id: 'module-home',
      moduleCode: 'MODULE 03 & 08',
      title: 'Khám Phá & Gợi Ý Món Ngon (Home & Recommendation)',
      badge: 'Trung Tâm Khám Phá Thông Minh',
      headline: 'Giải quyết dứt điểm câu hỏi "Hôm nay ăn món gì?"',
      tagline: 'Gợi ý tức thì mâm cơm chuẩn vị dựa trên 100% nguyên liệu có sẵn',
      description: 'Trang chủ của SmartCook tự động phân tích dữ liệu nguyên liệu trong tủ lạnh, khẩu vị các thành viên trong gia đình và mục tiêu dinh dưỡng để đưa ra thực đơn hoàn hảo ngay khi bạn mở app.',
      problemStatement: 'Người dùng thường mất 20-30 phút mỗi ngày đau đầu suy nghĩ thực đơn mà không biết trong tủ lạnh mình có thể làm được món gì.',
      solutionHighlight: 'Thuật toán Smart Recommendation đề xuất tức thì các món ăn có sẵn 100% nguyên liệu hoặc chỉ thiếu 1-2 gia vị nhỏ.',
      imageSrc: '/app-screens/3d_home_trans.png',
      accentPill: 'bg-orange-100 text-orange-700 border-orange-200',
      highlights: [
        {
          icon: <Flame className="w-5 h-5 text-orange-500" />,
          title: 'Gợi ý "Nấu ngay với 100% nguyên liệu"',
          desc: 'Tự động tính toán các món ăn mà bạn có đủ nguyên liệu (Thịt gà, Cà chua, Bơ, Gạo) để vào bếp nấu ngay không cần suy nghĩ.'
        },
        {
          icon: <Layers className="w-5 h-5 text-amber-500" />,
          title: 'Phân loại đa nhu cầu thông minh',
          desc: 'Chuyển đổi linh hoạt: Nấu nhanh (< 15p), Cơm gia đình sum vầy, Healthy & Eat Clean, hoặc Thực đơn tiết kiệm.'
        },
        {
          icon: <Heart className="w-5 h-5 text-rose-500" />,
          title: 'AI Match cá nhân hóa theo khẩu vị',
          desc: 'Học hỏi thói quen like, lưu công thức và lịch sử nấu nướng để tinh chỉnh đề xuất chuẩn gu riêng của gia đình.'
        }
      ],
      metrics: [
        { label: 'Tỉ lệ khớp món', val: '100%' },
        { label: 'Thời gian gợi ý', val: '< 0.3 giây' },
        { label: 'Kho công thức', val: '10,000+' }
      ]
    },
    {
      id: 'module-fridge',
      moduleCode: 'MODULE 06 & 14',
      title: 'Tôi Có Gì Trong Tủ Lạnh? (Smart Fridge Inventory)',
      badge: 'Quản Lý Kho Thực Phẩm & Chống Lãng Phí',
      headline: 'Tối ưu hóa thực phẩm hiện có – Không lo bỏ phí đồ ăn',
      tagline: 'Chọn nguyên liệu hiện có, app sẽ gợi ý món ăn kèm danh sách thiếu & % phù hợp',
      description: 'Chức năng cốt lõi cho phép người dùng tick chọn nhanh các nguyên liệu sẵn có trong tủ mát (Thịt gà, Trứng, Cà rốt, Cà chua, Bơ...). Hệ thống sẽ tính toán và xếp hạng các món nấu được theo tỉ lệ % nguyên liệu khớp.',
      problemStatement: 'Thực phẩm mua về hay bị lãng quên dưới đáy tủ lạnh dẫn đến quá hạn, ôi thiu và lãng phí tiền bạc.',
      solutionHighlight: 'Phân loại công thức theo bậc: Đủ 100% nguyên liệu → 80% nguyên liệu → 60% nguyên liệu, kèm nút thêm nguyên liệu thiếu vào giỏ đi chợ.',
      imageSrc: '/app-screens/3d_fridge_trans.png',
      accentPill: 'bg-amber-100 text-amber-800 border-amber-200',
      highlights: [
        {
          icon: <Refrigerator className="w-5 h-5 text-amber-500" />,
          title: 'Tick chọn nguyên liệu siêu tốc',
          desc: 'Giao diện icon trực quan theo nhóm: Thịt gia cầm, Trứng tươi, Rau xanh, Củ quả và Ngũ cốc dinh dưỡng.'
        },
        {
          icon: <Activity className="w-5 h-5 text-orange-500" />,
          title: 'Tính toán % nguyên liệu tương thích',
          desc: 'Mỗi món ăn hiển thị rõ ràng số nguyên liệu đang có và số gia vị còn thiếu để bạn chủ động chuẩn bị.'
        },
        {
          icon: <ShoppingCart className="w-5 h-5 text-emerald-500" />,
          title: 'Đẩy vào giỏ đi chợ 1-chạm',
          desc: 'Tự động thêm các gia vị thiếu vào danh sách mua sắm thông minh liên kết với các chuỗi siêu thị.'
        }
      ],
      metrics: [
        { label: 'Tiết kiệm chi phí', val: '40%/tháng' },
        { label: 'Phân loại thực phẩm', val: '250+ loại' },
        { label: 'Tỉ lệ gợi ý chuẩn', val: '96.5%' }
      ]
    },
    {
      id: 'module-ai-scan',
      moduleCode: 'MODULE 07 & 25',
      title: 'Quét Bàn Bếp & Tủ Lạnh Bằng AI Camera (AI Vision 98%)',
      badge: 'Công Nghệ AI Nhận Diện Thị Giác',
      headline: 'Không cần nhập tay – Đưa camera lên là nhận diện tức thì',
      tagline: 'Chụp ảnh tủ lạnh, AI khoanh vùng từng nguyên liệu với độ chính xác 98%',
      description: 'Chỉ cần mở camera hướng vào tủ lạnh hoặc bàn bếp chuẩn bị nấu ăn. Mô hình Computer Vision học sâu tự động phát hiện, khoanh vùng Bounding Box và gắn nhãn từng loại thực phẩm trong vòng 1 giây.',
      problemStatement: 'Phải gõ tìm kiếm từng củ hành, quả ớt rất phiền phức và mất thời gian của người làm bếp.',
      solutionHighlight: 'Hệ thống Deep Learning xử lý ảnh tức thời, lọc nhiễu nền và nhận diện đồng thời hơn 15 loại nguyên liệu cùng lúc.',
      imageSrc: '/app-screens/3d_camera_trans.png',
      accentPill: 'bg-rose-100 text-rose-700 border-rose-200',
      highlights: [
        {
          icon: <Scan className="w-5 h-5 text-rose-500" />,
          title: 'Bounding Box 3D thời gian thực',
          desc: 'Nhận diện chuẩn xác: Cà chua bi (98%), Quả bơ sáp (96%), Hành tây (95%), Tỏi tép (97%).'
        },
        {
          icon: <Camera className="w-5 h-5 text-orange-500" />,
          title: 'Hỗ trợ quét đa vật thể phức tạp',
          desc: 'Tự động nhận diện trong nhiều điều kiện ánh sáng, phân tách thực phẩm xếp chồng lên nhau.'
        },
        {
          icon: <Sparkles className="w-5 h-5 text-amber-500" />,
          title: 'Lập tức gợi ý công thức sáng tạo',
          desc: 'Sau khi nhận diện, hệ thống tự động sinh ra danh sách công thức độc quyền từ chính những gì vừa quét được.'
        }
      ],
      metrics: [
        { label: 'Độ chính xác AI', val: '98%' },
        { label: 'Tốc độ quét', val: '< 1 giây' },
        { label: 'Dữ liệu huấn luyện', val: '500K+ ảnh' }
      ]
    },
    {
      id: 'module-recipe',
      moduleCode: 'MODULE 05, 09 & 10',
      title: 'Chi Tiết Món Ăn & Chế Độ Bắt Đầu Nấu (Cook With Me)',
      badge: 'Trợ Lý Nấu Ăn Từng Bước Có Hẹn Giờ',
      headline: 'Dễ dàng trở thành MasterChef ngay trong căn bếp nhà bạn',
      tagline: 'Xem định lượng calo (520 kcal), thời gian (15p) và chế độ nấu có Smart Timer',
      description: 'Mỗi món ăn (như Cơm Đùi Gà Trứng Ốp La) đều được phân rã chi tiết thành từng bước kèm bộ đếm thời gian countdown. Bạn không lo bị cháy khét hay quên nêm nếm gia vị.',
      problemStatement: 'Người nấu vừa đảo chảo vừa phải chạm tay bẩn vào màn hình để lướt đọc các bước nấu.',
      solutionHighlight: 'Chế độ Cook With Me hiển thị phông chữ to rõ, có âm thanh hẹn giờ và chia rõ từng giai đoạn sơ chế đến hoàn tất.',
      imageSrc: '/app-screens/3d_recipe_trans.png',
      accentPill: 'bg-orange-100 text-orange-800 border-orange-200',
      highlights: [
        {
          icon: <Activity className="w-5 h-5 text-orange-500" />,
          title: 'Định lượng dinh dưỡng & Calo chuẩn',
          desc: 'Hiển thị chính xác: 520 kcal, 15 phút chế biến, mức độ Dễ, kèm phân tích Protein, Carbs, Fat.'
        },
        {
          icon: <Play className="w-5 h-5 text-amber-500" />,
          title: 'Nút "Bắt đầu nấu" có Smart Timer',
          desc: 'Bộ đếm giờ tích hợp cho từng bước chiên gà, nấu sốt, ốp la trứng để món ăn luôn đạt độ chín hoàn hảo.'
        },
        {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          title: 'Đánh giá 4.7 ⭐ từ cộng đồng',
          desc: 'Hơn 660 đánh giá tích cực và mẹo nấu ngon được chia sẻ trực tiếp từ các đầu bếp tại gia.'
        }
      ],
      metrics: [
        { label: 'Năng lượng', val: '520 kcal' },
        { label: 'Thời gian nấu', val: '15 phút' },
        { label: 'Cấp độ món', val: 'Dễ thực hiện' }
      ]
    },
    {
      id: 'module-market',
      moduleCode: 'MODULE 13 & ĐỊNH VỊ BÁN LẺ',
      title: 'Định Vị Siêu Thị Gần Nhất (Smart Market Locator)',
      badge: 'Bản Đồ Mua Sắm Thông Minh',
      headline: 'Thiếu nguyên liệu? Có ngay siêu thị quanh bạn chỉ 5 phút',
      tagline: 'Hiển thị danh sách WinMart+, Co.opmart, Big C kèm chỉ đường ngắn nhất',
      description: 'Khi phát hiện thiếu nguyên liệu cho bữa ăn, SmartCook lập tức kích hoạt bản đồ định vị các chuỗi bán lẻ gần bạn nhất kèm lộ trình và thời gian di chuyển thực tế.',
      problemStatement: 'Đang nấu thì hết tiêu, thiếu nước tương mà không biết tiệm tạp hóa hay siêu thị nào gần nhất còn mở cửa.',
      solutionHighlight: 'Định vị GPS chính xác và nút "Chỉ đường" liên kết Google Maps dẫn bạn đến tận nơi trong tích tắc.',
      imageSrc: '/app-screens/3d_market_trans.png',
      accentPill: 'bg-amber-100 text-amber-800 border-amber-200',
      highlights: [
        {
          icon: <MapPin className="w-5 h-5 text-amber-500" />,
          title: 'Bản đồ tương tác thời gian thực',
          desc: 'Hiển thị trực quan các ghim siêu thị WinMart+, Co.opmart, Lotte Mart trong bán kính 1km - 5km.'
        },
        {
          icon: <Compass className="w-5 h-5 text-orange-500" />,
          title: 'Khoảng cách & Thời gian di chuyển chuẩn',
          desc: 'Ví dụ: WinMart+ (1.2 km - 5 phút lái xe), Co.opmart (2.3 km - 8 phút), Big C (3.1 km).'
        },
        {
          icon: <ShoppingCart className="w-5 h-5 text-emerald-500" />,
          title: 'Đồng bộ giỏ hàng đi chợ',
          desc: 'Tự động kiểm tra danh mục nguyên liệu còn thiếu và gom thành danh sách mua sắm ngắn gọn.'
        }
      ],
      metrics: [
        { label: 'Thời gian tiếp cận', val: 'Từ 5 phút' },
        { label: 'Chuỗi liên kết', val: '1,500+ điểm' },
        { label: 'Độ chính xác GPS', val: '10 mét' }
      ]
    },
    {
      id: 'module-survey',
      moduleCode: 'MODULE 02',
      title: 'Khảo Sát Khẩu Vị Bằng AI (Personalized Nutrition)',
      badge: 'Cá Nhân Hóa Trải Nghiệm Khách Hàng',
      headline: 'Hiểu khẩu vị riêng của bạn – Loại bỏ 100% dị ứng',
      tagline: 'Cá nhân hóa trải nghiệm dựa trên sở thích, khẩu vị và mục tiêu thể hình',
      description: 'Bảng khảo sát ngắn gọn giúp AI hiểu bạn ăn mặn hay nhạt, quan tâm chế độ Giảm cân, Tăng cơ, Eat Clean hay Ăn chay, và loại bỏ hoàn toàn các thực phẩm gây dị ứng nguy hiểm.',
      problemStatement: 'Mỗi người trong nhà có nhu cầu dinh dưỡng khác nhau, người cần giảm cân, người dị ứng hải sản nhưng các app khác toàn gợi ý chung chung.',
      solutionHighlight: 'Bộ lọc dị ứng tuyệt đối và tùy biến khẩu phần theo từng mục tiêu thể chất của người dùng.',
      imageSrc: '/app-screens/3d_survey_trans.png',
      accentPill: 'bg-rose-100 text-rose-700 border-rose-200',
      highlights: [
        {
          icon: <Heart className="w-5 h-5 text-rose-500" />,
          title: 'Bảo vệ dị ứng thực phẩm an toàn',
          desc: 'Loại bỏ tự động các món có chứa trứng, sữa, hải sản, đậu phộng tùy theo bạn thiết lập.'
        },
        {
          icon: <Award className="w-5 h-5 text-orange-500" />,
          title: 'Tùy biến mục tiêu thể chất',
          desc: 'Hỗ trợ mục tiêu: Ăn bình thường, Giảm mỡ, Tăng cơ thể thao, Ăn chay dưỡng sinh, Low-Carb.'
        },
        {
          icon: <CheckCircle2 className="w-5 h-5 text-amber-500" />,
          title: 'Hoàn tất khảo sát trong 30 giây',
          desc: 'Chỉ với vài thao tác chạm, giao diện và thuật toán AI sẽ chuyển đổi để phục vụ riêng cho bạn.'
        }
      ],
      metrics: [
        { label: 'Thời gian khảo sát', val: '30 giây' },
        { label: 'Chế độ ăn', val: '12+ chế độ' },
        { label: 'Bảo vệ dị ứng', val: 'Tuyệt đối 100%' }
      ]
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[15%] w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] right-[-5%] w-[650px] h-[650px] bg-amber-300/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[700px] h-[700px] bg-orange-200/25 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
      </div>

      {/* 1. Header Navigation Bar Thông Minh (Tự động nhận diện Đã đăng nhập / Chưa đăng nhập) */}
      <UserHeader isLandingPage={true} />

      {/* 2. Hero Section - Phong cách Tươi Sáng, Sang Trọng, Ảnh Render 3D Tự Nhiên */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content: Phong cách Modern SaaS / Consumer Tech sang trọng */}
            <div className="lg:col-span-6 space-y-7 text-center lg:text-left relative">
              {/* Glow trang trí phía sau text */}
              <div className="absolute -top-16 -left-12 w-72 h-72 bg-gradient-to-tr from-orange-400/20 to-amber-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Tagline Pill hiện đại với hiệu ứng pulse */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-orange-200/80 shadow-[0_2px_12px_rgba(249,115,22,0.12)] text-orange-600 text-xs font-bold uppercase tracking-wider hover:border-orange-400 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-extrabold">Trợ Lý Nấu Ăn Thông Minh Số 1 Cho Người Việt</span>
              </div>

              {/* Headline Typography cực kỳ mạnh mẽ & hiện đại */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.8rem] font-black text-slate-900 tracking-tight leading-[1.12] font-heading">
                Nấu Ngon Dễ Dàng <br className="hidden sm:inline" />
                Hơn Cùng{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 drop-shadow-sm">
                    SmartCook
                  </span>
                  {/* Gạch chân nghệ thuật gradient mềm */}
                  <span className="absolute left-0 -bottom-1.5 w-full h-3 bg-gradient-to-r from-orange-400/30 to-amber-400/10 rounded-full -rotate-1 -z-0"></span>
                </span>
              </h1>

              {/* Mô tả súc tích, làm nổi bật công nghệ và giá trị cốt lõi */}
              <p className="text-base sm:text-[1.1rem] text-slate-900 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Ứng dụng di động tiên phong ứng dụng{' '}
                <span className="inline-flex items-center px-2.5 py-0.5 mx-1 rounded-md bg-orange-100/90 border border-orange-200 font-bold text-orange-700 text-sm">
                  <Zap className="w-3.5 h-3.5 mr-1 inline text-orange-600" /> AI Computer Vision
                </span>{' '}
                nhận diện thực phẩm bàn bếp & tủ lạnh, gợi ý món ăn chuẩn <strong className="font-extrabold text-black underline decoration-amber-400 decoration-2">100% nguyên liệu sẵn có</strong> và kết nối siêu thị thực phẩm gần bạn.
              </p>

              {/* Action Buttons: Nút Tải Google Play nhỏ gọn & Nút Khám phá */}
              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href="#download"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                >
                  <svg className="w-4 h-4 fill-current text-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.404 2.404 0 0 1-.61-.958V2.772c.16-.368.378-.7.609-.958zm11.246 11.248l2.257 2.258-11.75 6.784 9.493-9.042zm0-2.124L5.362 1.896l11.75 6.784-2.257 2.258zm1.488 1.487l3.298-1.905c1.077-.622 1.077-1.637 0-2.259l-3.298-1.905-2.054 2.035 2.054 2.034z"/>
                  </svg>
                  <span className="leading-none">Tải về từ Google Play</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a
                  href="#module-home"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-orange-50/60 border border-slate-200/90 hover:border-orange-300 text-slate-800 font-semibold text-sm transition-all duration-200 shadow-2xs hover:shadow-xs group"
                >
                  <span>Khám Phá 6 Phân Hệ</span>
                  <ChevronDown className="w-3.5 h-3.5 text-orange-500 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Social Proof & Metrics Thẻ Tinh Gọn, Hiện Đại */}
              <div className="pt-5 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
                {/* Rating Card */}
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-xs">
                  <div className="flex -space-x-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    <strong className="text-black font-black text-sm">4.9</strong>
                    <span className="text-slate-400 mx-1">/</span>
                    <span>12,500+ đầu bếp tại gia</span>
                  </div>
                </div>

                {/* AI Metric Tag */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300/80 text-xs font-bold text-emerald-900 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>AI Bounding Box 98% chính xác</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Render 3D Điện Thoại Nổi Tự Nhiên Hòa Tan Vào Phông Nền Sáng */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <div 
                className="relative max-w-[440px] transition-transform duration-300 ease-out flex flex-col items-center"
                style={{
                  transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`
                }}
              >
                {/* ẢNH 3D NGHỆ THUẬT: ĐIỆN THOẠI VÀ RAU CỦ TRONG SUỐT TỰ NHIÊN */}
                <div className="relative w-full overflow-visible">
                  <img 
                    src="/app-screens/3d_home_trans.png" 
                    alt="SmartCook 3D Food Phone Showcase"
                    className="w-full h-auto select-none hover:scale-105 transition-transform duration-500 drop-shadow-[0_20px_25px_rgba(234,88,12,0.15)]"
                  />
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* 3. TRẢI DÀI CÁC PHÂN HỆ APP - MỖI PHÂN HỆ MANG MỘT PHONG CÁCH THIẾT KẾ VÀ TRẢI NGHIỆM ĐỘC BẢN */}
      <section className="relative z-10 py-16 space-y-36">
        {showcases.map((item, index) => {
          const isEven = index % 2 === 1; // Đảo vị trí xen kẽ giữa các section tạo nhịp điệu thị giác cuốn hút

          return (
            <div 
              key={item.id}
              id={item.id}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                
                {/* ẢNH ĐIỆN THOẠI 3D: Tự động đổi vị trí Trái/Phải theo thứ tự xen kẽ */}
                <div className={`lg:col-span-5 flex justify-center items-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative w-full max-w-[420px] group flex flex-col items-center">
                    {/* Quầng sáng ambient gradient biến đổi sắc thái theo từng section */}
                    <div className={`absolute inset-0 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none ${
                      index === 0 ? 'bg-gradient-to-tr from-orange-400/25 to-amber-200/20' :
                      index === 1 ? 'bg-gradient-to-tr from-amber-400/25 to-emerald-200/20' :
                      index === 2 ? 'bg-gradient-to-tr from-rose-400/25 to-orange-200/20' :
                      index === 3 ? 'bg-gradient-to-tr from-orange-500/25 to-red-200/20' :
                      index === 4 ? 'bg-gradient-to-tr from-sky-400/25 to-emerald-200/20' :
                      'bg-gradient-to-tr from-purple-400/25 to-rose-200/20'
                    }`} />
                    
                    {/* Ảnh 3D trong suốt */}
                    <div className="relative w-full overflow-visible">
                      <img 
                        src={item.imageSrc} 
                        alt={item.title}
                        className="w-full h-auto object-contain group-hover:scale-[1.04] transition-all duration-500 select-none drop-shadow-[0_20px_35px_rgba(234,88,12,0.18)]"
                        loading="lazy"
                      />
                    </div>

                    {/* Micro Tagline */}
                    <div className="mt-5 text-center relative z-20">
                      <span className="inline-block text-xs font-bold text-slate-800 bg-white/90 px-4 py-1.5 rounded-full border border-slate-200 shadow-xs italic backdrop-blur-xs">
                        "{item.tagline}"
                      </span>
                    </div>
                  </div>
                </div>

                {/* MÔ TẢ NỘI DUNG: Mỗi phân hệ có layout và điểm nhấn hoàn toàn khác biệt */}
                <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  
                  {/* PHONG CÁCH 1: (Module 0 & Home) - Editorial Minimalist với Accent Bars */}
                  {index === 0 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight font-heading">
                          {item.title}
                        </h2>
                        <p className="text-orange-600 font-bold text-base sm:text-lg flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          <span>{item.headline}</span>
                        </p>
                      </div>

                      <p className="text-black text-base sm:text-[1.05rem] leading-relaxed font-normal">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Vấn đề thực tế
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {item.problemStatement}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Giải pháp SmartCook
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {item.solutionHighlight}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-black tracking-wider uppercase text-slate-500 block">
                          Trải Nghiệm Đột Phá
                        </span>
                        <div className="space-y-2.5">
                          {item.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-3.5 p-2 rounded-xl">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {h.icon}
                              </div>
                              <div className="space-y-0.5 flex-1">
                                <h4 className="text-sm sm:text-base font-bold text-black">
                                  {h.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-black leading-relaxed">
                                  {h.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHONG CÁCH 2: (Module Tủ Lạnh) - Visual Step Flow / Process Pipeline */}
                  {index === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight font-heading">
                          {item.title}
                        </h2>
                        <p className="text-amber-600 font-bold text-base sm:text-lg">
                          ✨ {item.headline}
                        </p>
                      </div>

                      <p className="text-black text-base sm:text-[1.05rem] leading-relaxed font-normal">
                        {item.description}
                      </p>

                      {/* Problem/Solution phong cách tinh tế, nhã nhặn */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Trước đây
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {item.problemStatement}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Với SmartCook
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {item.solutionHighlight}
                          </p>
                        </div>
                      </div>

                      {/* Highlight dạng Pipeline 3 Bước liên kết số thứ tự */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-black tracking-wider uppercase text-slate-500 block">
                          Quy Trình Hoạt Động Thông Minh
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {item.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-slate-700">0{hIdx + 1}.</span>
                                <div className="text-amber-600">{h.icon}</div>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-black leading-snug">{h.title}</h4>
                              <p className="text-xs text-black leading-relaxed">{h.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHONG CÁCH 3: (Module AI Camera Scan) - Modern AI Intelligence & Visual Precision */}
                  {index === 2 && (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight font-heading">
                          {item.title}
                        </h2>

                        <p className="text-orange-600 font-bold text-base sm:text-lg flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          <span>{item.headline}</span>
                        </p>
                      </div>

                      <p className="text-black text-base sm:text-[1.05rem] leading-relaxed font-normal">
                        {item.description}
                      </p>

                      {/* AI Detection Capabilities: 4 Pills thực tế nhận diện thực phẩm tức thì */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-black shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                          <span>Cà chua bi: <strong className="text-slate-900 font-bold">98%</strong></span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-black shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                          <span>Quả bơ sáp: <strong className="text-slate-900 font-bold">96%</strong></span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-black shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                          <span>Hương thảo: <strong className="text-slate-900 font-bold">97%</strong></span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-black shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                          <span>Tỏi tép: <strong className="text-slate-900 font-bold">95%</strong></span>
                        </div>
                      </div>

                      {/* Vấn Đề & Đột Phá Công Nghệ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Bất tiện trước đây
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {item.problemStatement}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Đột phá AI Vision
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {item.solutionHighlight}
                          </p>
                        </div>
                      </div>

                      {/* Danh sách tính năng cao cấp tĩnh, không đổi màu khi di chuột */}
                      <div className="space-y-3 pt-1">
                        <span className="text-xs font-black tracking-wider uppercase text-slate-500 block">
                          Năng Lực Nhận Diện Thông Minh
                        </span>
                        <div className="space-y-2.5">
                          {item.highlights.map((h, hIdx) => (
                            <div 
                              key={hIdx} 
                              className="flex items-start gap-3.5 p-2 rounded-xl"
                            >
                              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {h.icon}
                              </div>
                              <div className="space-y-0.5 flex-1">
                                <h4 className="text-sm sm:text-base font-bold text-black">
                                  {h.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                                  {h.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHONG CÁCH 4: (Module Nấu Ăn Cook With Me) - Warm Chef Studio / Interactive Recipe Card */}
                  {index === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight font-heading">
                          {item.title}
                        </h2>
                        <p className="text-amber-600 font-bold text-base sm:text-lg">
                          🍳 {item.headline}
                        </p>
                      </div>

                      <p className="text-black text-base sm:text-[1.05rem] leading-relaxed">
                        {item.description}
                      </p>

                      {/* Problem/Solution phong cách thanh lịch */}
                      <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Tối ưu trải nghiệm làm bếp
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {item.solutionHighlight}
                        </p>
                      </div>

                      {/* Highlights dạng Quick Tags */}
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-black tracking-wider uppercase text-slate-500 block">
                          Trợ Lý Vào Bếp Thực Chiến
                        </span>
                        <div className="space-y-2">
                          {item.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-3 p-2 rounded-xl">
                              <span className="mt-0.5 text-orange-500">{h.icon}</span>
                              <div>
                                <h4 className="text-sm sm:text-base font-bold text-black">{h.title}</h4>
                                <p className="text-xs sm:text-sm text-black">{h.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Khung Card Món Ăn Tinh Gọn Chuẩn Mẫu (Có nút HOT & POPULAR) */}
                      <div className="pt-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black tracking-wider uppercase text-slate-500">
                            Thực Đơn Nổi Bật Hôm Nay
                          </span>
                          <Link 
                            to="/recipes"
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
                          >
                            <span>Xem tất cả</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>

                        {/* 2 Card Mẫu Chuẩn Form Ảnh Chụp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Card 1: Cơm Đùi Gà Trứng Ốp (HOT) */}
                          <div className="bg-white rounded-[26px] p-3 shadow-sm hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-slate-100">
                              <img 
                                src="https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80" 
                                alt="Cơm Đùi Gà Trứng Ốp" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Badge HOT */}
                              <div className="absolute top-2.5 left-2.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-md bg-gradient-to-r from-orange-500 to-amber-500">
                                  <Flame className="w-2.5 h-2.5 fill-white text-white" />
                                  <span>HOT</span>
                                </span>
                              </div>
                              {/* Heart Button */}
                              <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center">
                                <Heart className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                              </div>
                            </div>

                            <div className="pt-3 px-1 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                                <span className="text-sm">🍳</span>
                                <span>12 phút</span>
                                <span className="text-orange-400 font-normal">•</span>
                                <span>Nhanh gọn</span>
                              </div>

                              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                                Cơm Đùi Gà Trứng Ốp
                              </h4>

                              <div className="pt-1 flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-slate-400 truncate max-w-[85px]">
                                  Tiện lợi • ...
                                </span>
                                <Link
                                  to="/recipes/seed-chicken-rice"
                                  className="px-3 py-1 rounded-xl bg-orange-50 hover:bg-orange-500 border border-orange-200 hover:border-orange-500 text-orange-600 hover:text-white text-xs font-bold transition-all duration-200 flex items-center gap-1 shrink-0"
                                >
                                  <span>Xem chi tiết</span>
                                  <span className="text-xs">→</span>
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: Ức Gà Sốt Bơ Tỏi (POPULAR) */}
                          <div className="bg-white rounded-[26px] p-3 shadow-sm hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-slate-100">
                              <img 
                                src="https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80" 
                                alt="Ức Gà Sốt Bơ Tỏi" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Badge POPULAR */}
                              <div className="absolute top-2.5 left-2.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-md bg-gradient-to-r from-rose-500 to-orange-500">
                                  <Heart className="w-2.5 h-2.5 fill-white text-white" />
                                  <span>POPULAR</span>
                                </span>
                              </div>
                              {/* Heart Button */}
                              <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center">
                                <Heart className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                              </div>
                            </div>

                            <div className="pt-3 px-1 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                                <span className="text-sm">🍳</span>
                                <span>15 phút</span>
                                <span className="text-orange-400 font-normal">•</span>
                                <span>Eat Clean</span>
                              </div>

                              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                                Ức Gà Sốt Bơ Tỏi Mật Ong
                              </h4>

                              <div className="pt-1 flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-slate-400 truncate max-w-[85px]">
                                  Healthy • ...
                                </span>
                                <Link
                                  to="/recipes/seed-3"
                                  className="px-3 py-1 rounded-xl bg-orange-50 hover:bg-orange-500 border border-orange-200 hover:border-orange-500 text-orange-600 hover:text-white text-xs font-bold transition-all duration-200 flex items-center gap-1 shrink-0"
                                >
                                  <span>Xem chi tiết</span>
                                  <span className="text-xs">→</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHONG CÁCH 5: (Module Định Vị Siêu Thị) - Map Pin & Geolocation Style */}
                  {index === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight font-heading">
                          {item.title}
                        </h2>
                        <p className="text-orange-600 font-bold text-base sm:text-lg flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span>{item.headline}</span>
                        </p>
                      </div>

                      <p className="text-black text-base sm:text-[1.05rem] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Tiết kiệm tối đa thời gian di chuyển
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {item.solutionHighlight}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                        {item.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                            <div className="mx-auto w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                              {h.icon}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-black">{h.title}</h4>
                            <p className="text-xs text-black line-clamp-2">{h.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PHONG CÁCH 6: (Module Khảo Sát Khẩu Vị) - Health & Wellness Personalized Cards */}
                  {index === 5 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight font-heading">
                          {item.title}
                        </h2>
                        <p className="text-orange-600 font-bold text-base sm:text-lg">
                          ✨ {item.headline}
                        </p>
                      </div>

                      <p className="text-black text-base sm:text-[1.05rem] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Chăm sóc dinh dưỡng cho từng cá nhân
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {item.solutionHighlight}
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        {item.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-purple-100">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                              {h.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm sm:text-base font-bold text-black">{h.title}</h4>
                              <p className="text-xs sm:text-sm text-black">{h.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics Footer - Tinh gọn, đồng nhất thanh Stats Bar phía dưới */}
                  <div className="pt-4 border-t border-slate-200/70 flex flex-wrap items-center gap-6">
                    {item.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-0.5">
                        <span className="text-[11px] text-slate-500 block">{m.label}</span>
                        <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                          {m.val}
                        </span>
                      </div>
                    ))}

                    <div className="ml-auto">
                      <a 
                        href="#download"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 group transition-colors"
                      >
                        <span>Trải nghiệm ngay</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </section>

      {/* 4. FOOTER CHUYÊN NGHIỆP, HIỆN ĐẠI & ĐẦY ĐỦ TÍNH NĂNG */}
      <footer className="relative z-10 bg-[#0f131a] text-slate-300 pt-16 pb-12 border-t border-slate-800/90 overflow-hidden">
        {/* Glow ambient mềm phía sau footer */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Grid: 4 Cột chuẩn SaaS / Consumer Tech */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            
            {/* Cột 1: Thông tin thương hiệu & Giới thiệu (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white font-heading">SmartCook</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    AI Tech
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Hệ sinh thái công nghệ ẩm thực thông minh tiên phong tại Việt Nam. Ứng dụng mô hình Computer Vision 98% chuẩn xác, nhận diện nguyên liệu tủ lạnh tức thì và tự động tối ưu hóa bữa cơm dinh dưỡng mỗi ngày cho gia đình.
              </p>

              {/* Tải về từ Google Play Badge Mini */}
              <div className="pt-2">
                <a
                  href="#download-android"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Ứng dụng SmartCook APK đang chuẩn bị tải xuống. Vui lòng kiểm tra mục Download của bạn!");
                  }}
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold shadow-sm hover:border-orange-500/50 transition-all group"
                >
                  <svg className="w-5 h-5 fill-current text-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.404 2.404 0 0 1-.61-.958V2.772c.16-.368.378-.7.609-.958zm11.246 11.248l2.257 2.258-11.75 6.784 9.493-9.042zm0-2.124L5.362 1.896l11.75 6.784-2.257 2.258zm1.488 1.487l3.298-1.905c1.077-.622 1.077-1.637 0-2.259l-3.298-1.905-2.054 2.035 2.054 2.034z"/>
                  </svg>
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">Khả dụng trên</span>
                    <strong className="text-white text-xs font-bold leading-tight">Google Play (Android)</strong>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-orange-400 transition-all ml-1" />
                </a>
              </div>
            </div>

            {/* Cột 2: Tính năng cốt lõi (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Tính Năng Cốt Lõi
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="#module-home" className="hover:text-orange-400 transition-colors block">
                    Gợi ý món 100% nguyên liệu sẵn có
                  </a>
                </li>
                <li>
                  <a href="#module-fridge" className="hover:text-orange-400 transition-colors block">
                    Quản lý kho tủ lạnh & chống lãng phí
                  </a>
                </li>
                <li>
                  <a href="#module-ai-scan" className="hover:text-orange-400 transition-colors block">
                    AI Camera Scan nhận diện 98%
                  </a>
                </li>
                <li>
                  <a href="#module-recipe" className="hover:text-orange-400 transition-colors block">
                    Chế độ Cook With Me & Smart Timer
                  </a>
                </li>
                <li>
                  <a href="#module-market" className="hover:text-orange-400 transition-colors block">
                    Định vị siêu thị & lộ trình mua sắm
                  </a>
                </li>
                <li>
                  <a href="#module-survey" className="hover:text-orange-400 transition-colors block">
                    Cá nhân hóa khẩu vị & bảo vệ dị ứng
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 3: Hệ sinh thái & Cổng quản trị (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Hệ Sinh Thái
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/admin/dashboard" className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1.5 transition-colors">
                    <Lock className="w-3 h-3" />
                    <span>Cổng Admin</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-orange-400 transition-colors block">
                    Đăng nhập tài khoản
                  </Link>
                </li>
                <li>
                  <a href="#community" onClick={(e) => { e.preventDefault(); alert("Cộng đồng 12,500+ đầu bếp SmartCook đang hoạt động tích cực!"); }} className="hover:text-orange-400 transition-colors block">
                    Cộng đồng Bếp Việt
                  </a>
                </li>
                <li>
                  <a href="#recipes" onClick={(e) => { e.preventDefault(); alert("Kho hơn 10,000+ công thức nấu ăn chuẩn vị."); }} className="hover:text-orange-400 transition-colors block">
                    Kho 10,000+ Công thức
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => { e.preventDefault(); alert("Trung tâm câu hỏi thường gặp (FAQ)."); }} className="hover:text-orange-400 transition-colors block">
                    Hỗ trợ & Hỏi đáp (FAQ)
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 4: Liên hệ & Đăng ký nhận tin (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Liên Hệ & Nhận Bản Tin
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Đăng ký email để nhận thực đơn gợi ý mỗi tuần và cập nhật tính năng AI mới nhất.
              </p>

              {/* Form nhận bản tin */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Cảm ơn bạn đã đăng ký nhận bản tin từ SmartCook!");
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email"
                    required
                    placeholder="Email của bạn..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Gửi</span>
                </button>
              </form>

              {/* Thông tin trực tiếp */}
              <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span>Khu Công Nghệ Cao, Hà Nội, Việt Nam</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span>support@smartcook.vn</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Footer: Bản quyền & Chính sách */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <p>© 2026 SmartCook Vietnam Joint Stock Company. Bảo lưu mọi quyền.</p>
            </div>

            <div className="flex flex-wrap items-center gap-5 font-medium">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Chính sách bảo mật thông tin người dùng được mã hóa an toàn."); }} className="hover:text-slate-300 transition-colors">
                Chính sách bảo mật
              </a>
              <span>•</span>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Điều khoản dịch vụ sử dụng ứng dụng SmartCook."); }} className="hover:text-slate-300 transition-colors">
                Điều khoản dịch vụ
              </a>
              <span>•</span>
              <a href="#standards" onClick={(e) => { e.preventDefault(); alert("Tiêu chuẩn dinh dưỡng và định lượng calo chuẩn y khoa."); }} className="hover:text-slate-300 transition-colors">
                Tiêu chuẩn dinh dưỡng
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
