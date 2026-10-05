import { create } from 'zustand';
import type {
  AdminKPI,
  HeroBannerConfig,
  SystemIngredientGroup,
  SystemIngredient,
  PendingContribution,
  CommunityPostAdmin,
  ModerationReport,
  AppUserAdmin,
  AdminStaff,
  AIEngineConfig,
  PushNotificationSchedule,
  AdminTaskItem,
  DishRecipeAdmin,
} from '../types/admin';

interface AdminState {
  kpi: AdminKPI;
  heroBanner: HeroBannerConfig;
  recipes: DishRecipeAdmin[];
  ingredientGroups: SystemIngredientGroup[];
  ingredients: SystemIngredient[];
  pendingContributions: PendingContribution[];
  communityPosts: CommunityPostAdmin[];
  reports: ModerationReport[];
  users: AppUserAdmin[];
  staff: AdminStaff[];
  aiConfig: AIEngineConfig;
  notifications: PushNotificationSchedule[];
  tasks: AdminTaskItem[];

  // Recipe Actions
  addRecipe: (recipe: Omit<DishRecipeAdmin, 'id' | 'rating' | 'ratingsCount'>) => void;
  updateRecipe: (id: string, recipe: Partial<DishRecipeAdmin>) => void;
  deleteRecipe: (id: string) => void;

  // Actions
  toggleTask: (id: string) => void;
  approveContribution: (id: string) => void;
  rejectContribution: (id: string, reason: string) => void;
  updateHeroBanner: (banner: Partial<HeroBannerConfig>) => void;
  addIngredientSynonym: (ingredientId: string, synonym: string) => void;
  removeIngredientSynonym: (ingredientId: string, synonym: string) => void;
  addIngredient: (ingredient: Omit<SystemIngredient, 'id' | 'inStockUsersCount'>) => void;
  updateIngredient: (id: string, ingredient: Partial<SystemIngredient>) => void;
  deleteIngredient: (id: string) => void;
  togglePostStatus: (id: string, status: 'published' | 'pinned' | 'hidden' | 'flagged' | 'spam') => void;
  deleteCommunityPost: (id: string) => void;
  resolveReport: (id: string, action: 'resolved' | 'dismissed') => void;
  toggleUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned') => void;
  updateUserBadge: (userId: string, badge: AppUserAdmin['badge']) => void;
  updateUserProfile: (userId: string, updated: Partial<AppUserAdmin>) => void;
  deleteUser: (userId: string) => void;
  updateAIConfig: (config: Partial<AIEngineConfig>) => void;
  addNotification: (notif: Omit<PushNotificationSchedule, 'id'>) => void;
  setKpi: (kpi: Partial<AdminKPI>) => void;
  setUsers: (users: AppUserAdmin[]) => void;
  setRecipes: (recipes: DishRecipeAdmin[]) => void;
  setCommunityPosts: (posts: CommunityPostAdmin[]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  kpi: {
    totalUsers: 14250,
    activeUsers: 3840,
    publishedRecipes: 128,
    communityPostsToday: 42,
    aiScansCount: 4120,
    aiChatMessagesCount: 18560,
    totalRevenueVnd: 325000000,
    monthlyTargetVnd: 500000000,
    monthlyAchievedPercent: 65,
  },

  heroBanner: {
    _id: 'banner-01',
    recipeId: 'rec-01',
    title: 'Bò Bít Tết Sốt Tiêu Đen & Măng Tây Áp Chảo',
    subtitle: 'Công thức MasterChef chuẩn 5 sao dành cho bữa tối lãng mạn tại gia.',
    badge: 'MÓN NỔI BẬT HÔM NAY',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    locationTag: 'Ẩm thực Âu - Hiện Đại',
    prepTime: '25 phút',
    calories: '540 kcal',
    servings: '2 phần',
    isActive: true,
  },

  recipes: [
    {
      id: 'dish-1',
      title: 'Bò Bít Tết Sốt Tiêu Đen & Măng Tây Áp Chảo',
      description: 'Thịt bò mềm mọng nước, tiêu đen thơm nồng cay nhẹ kết hợp măng tây giòn ngọt chuẩn vị ẩm thực Âu hiện đại.',
      category: 'Ẩm thực',
      subCategory: 'Món Âu',
      prepTimeMinutes: 10,
      cookingTimeMinutes: 15,
      difficulty: 'Trung bình',
      servings: 2,
      calories: 540,
      macro: { protein: 46, carbs: 12, fat: 32, fiber: 4 },
      estimatedCostVnd: 120000,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
      status: 'published',
      rating: 4.9,
      ratingsCount: 142,
      dietaryTags: ['High Protein', 'Bữa Tối Lãng Mạn', 'Low Carb'],
      ingredients: [
        { name: 'Thịt bò thăn ngoại', amount: '350g', note: 'Chọn loại bò có vân mỡ đều' },
        { name: 'Măng tây xanh', amount: '150g', note: 'Bỏ phần gốc già' },
        { name: 'Bơ lạt', amount: '20g' },
        { name: 'Tiêu đen xay vỡ', amount: '10g' },
        { name: 'Rượu vang đỏ', amount: '30ml' },
        { name: 'Tỏi tươi & Lá hương thảo', amount: '2 nhánh' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Ướp thịt bò với muối biển, tiêu đen xay vỡ trong 15 phút ở nhiệt độ phòng.', timerMinutes: 15 },
        { stepNumber: 2, instruction: 'Làm nóng chảo gang với dầu ô liu, áp chảo mỗi mặt 2-3 phút để đạt độ chín Medium Rare.', timerMinutes: 5 },
        { stepNumber: 3, instruction: 'Cho bơ, tỏi đập dập và lá hương thảo vào rưới đều lên mặt thịt, sau đó cho thịt nghỉ 5 phút.', timerMinutes: 5 },
        { stepNumber: 4, instruction: 'Áp chảo măng tây với phần bơ còn lại trong 3 phút, làm sốt tiêu đen với rượu vang và rưới lên đĩa.', timerMinutes: 3 },
      ],
      substitutions: [
        { original: 'Bơ lạt', substitute: 'Dầu Olive Extra Virgin', note: 'Dành cho người ăn kiêng giảm chất béo bão hòa' },
      ],
    },
    {
      id: 'dish-2',
      title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi Mật Ong',
      description: 'Món ăn vàng cho chế độ Eat Clean giảm cân tăng cơ, ức gà mềm ngọt mọng nước không hề bị khô xác.',
      category: 'Sức khỏe',
      subCategory: 'Eat Clean',
      prepTimeMinutes: 10,
      cookingTimeMinutes: 15,
      difficulty: 'Dễ',
      servings: 2,
      calories: 290,
      macro: { protein: 42, carbs: 8, fat: 10, fiber: 2 },
      estimatedCostVnd: 45000,
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
      status: 'published',
      rating: 4.8,
      ratingsCount: 89,
      dietaryTags: ['Eat Clean', 'High Protein', 'Giảm cân'],
      ingredients: [
        { name: 'Ức gà phi lê', amount: '300g' },
        { name: 'Mật ong nguyên chất', amount: '1 muỗng canh' },
        { name: 'Tỏi băm', amount: '4 tép' },
        { name: 'Nước tương ít muối', amount: '1 muỗng canh' },
        { name: 'Dầu ô liu', amount: '1 thìa cà phê' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Khía nhẹ mặt ức gà, ướp với chút muối, tiêu và tỏi băm 10 phút.', timerMinutes: 10 },
        { stepNumber: 2, instruction: 'Pha nước sốt gồm mật ong, nước tương và 2 thìa nước ấm.', timerMinutes: 2 },
        { stepNumber: 3, instruction: 'Áp chảo ức gà lửa vừa mỗi mặt 5 phút đến khi vàng đều.', timerMinutes: 10 },
        { stepNumber: 4, instruction: 'Đổ nước sốt vào rim nhỏ lửa 3 phút cho sốt sệt lại và bám đều mặt gà.', timerMinutes: 3 },
      ],
      substitutions: [
        { original: 'Mật ong', substitute: 'Đường ăn kiêng cỏ ngọt Stevia', note: 'Giảm tối đa calories cho người tiểu đường/Keto' },
      ],
    },
    {
      id: 'dish-3',
      title: 'Canh Thịt Bò Hầm Cà Rốt & Khoai Tây',
      description: 'Món canh thanh ngọt ấm áp, cung cấp đầy đủ chất xơ và vitamin cho bữa cơm gia đình quây quần.',
      category: 'Gia đình',
      subCategory: 'Món Canh',
      prepTimeMinutes: 15,
      cookingTimeMinutes: 30,
      difficulty: 'Dễ',
      servings: 4,
      calories: 320,
      macro: { protein: 28, carbs: 22, fat: 12, fiber: 5 },
      estimatedCostVnd: 75000,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
      author: 'Chef Trần Linh',
      status: 'published',
      rating: 4.9,
      ratingsCount: 65,
      dietaryTags: ['Bữa Cơm Gia Đình', 'Nhanh & Tiện lợi'],
      ingredients: [
        { name: 'Thịt bắp bò', amount: '250g' },
        { name: 'Cà rốt tươi', amount: '1 củ' },
        { name: 'Khoai tây', amount: '2 củ' },
        { name: 'Hành ngò', amount: '1 bó nhỏ' },
        { name: 'Gia vị: hạt nêm, tiêu', amount: 'vừa đủ' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Bò thái miếng vuông vừa ăn, trụng sơ nước sôi để nước canh trong.', timerMinutes: 5 },
        { stepNumber: 2, instruction: 'Hầm bò với 1 lít nước trong 20 phút cho mềm.', timerMinutes: 20 },
        { stepNumber: 3, instruction: 'Cho cà rốt và khoai tây cắt khúc vào hầm thêm 10 phút, nêm nếm vừa miệng.', timerMinutes: 10 },
      ],
    },
    {
      id: 'dish-4',
      title: 'Tôm Sú Hấp Nước Dừa Xiêm',
      description: 'Tôm sú tươi giòn ngọt tự nhiên hòa quyện với vị béo bùi thanh mát của nước dừa tươi Bến Tre.',
      category: 'Nhanh & Tiện lợi',
      subCategory: 'Hải Sản',
      prepTimeMinutes: 5,
      cookingTimeMinutes: 10,
      difficulty: 'Dễ',
      servings: 3,
      calories: 210,
      macro: { protein: 36, carbs: 6, fat: 3, fiber: 1 },
      estimatedCostVnd: 95000,
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
      status: 'published',
      rating: 4.8,
      ratingsCount: 78,
      dietaryTags: ['Hải Sản', 'Dưới 20 Phút', 'Low Fat'],
      ingredients: [
        { name: 'Tôm sú loại lớn', amount: '400g' },
        { name: 'Nước dừa tươi', amount: '1 quả' },
        { name: 'Sả đập dập', amount: '3 cây' },
        { name: 'Muối ớt chanh chấm kèm', amount: '1 chén' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Rửa sạch tôm, cắt râu. Xếp sả dưới đáy nồi rồi đặt tôm lên.', timerMinutes: 5 },
        { stepNumber: 2, instruction: 'Đổ nước dừa ngập xâm xấp, đậy vung hấp lửa lớn trong 7-8 phút đến khi tôm đỏ au.', timerMinutes: 8 },
      ],
    },
    {
      id: 'dish-5',
      title: 'Trứng Xào Cà Chua Kiểu Gia Đình',
      description: 'Món ăn quốc dân nhanh gọn, tiết kiệm chi phí nhưng cực kỳ thơm ngon, 100% nguyên liệu sẵn có trong tủ lạnh.',
      category: 'Tiết kiệm',
      subCategory: 'Nấu Nhanh',
      prepTimeMinutes: 5,
      cookingTimeMinutes: 7,
      difficulty: 'Dễ',
      servings: 2,
      calories: 180,
      macro: { protein: 14, carbs: 6, fat: 12, fiber: 2 },
      estimatedCostVnd: 18000,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
      author: 'Đặng Mai Phương',
      status: 'published',
      rating: 4.7,
      ratingsCount: 110,
      dietaryTags: ['Tiết Kiệm <20k', 'Sinh Viên', 'Dưới 15 Phút'],
      ingredients: [
        { name: 'Trứng gà', amount: '3 quả' },
        { name: 'Cà chua chín', amount: '2 quả' },
        { name: 'Hành lá cắt nhỏ', amount: '2 nhánh' },
        { name: 'Nước mắm & hạt tiêu', amount: '1 thìa' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Đánh tan trứng với chút nước mắm và tiêu. Xào sơ trứng vừa chín tới rồi múc ra đĩa.', timerMinutes: 3 },
        { stepNumber: 2, instruction: 'Xào cà chua nhuyễn mềm tạo sốt, trút trứng vào đảo đều 1 phút, rắc hành lá và tắt bếp.', timerMinutes: 4 },
      ],
    },
  ],

  ingredientGroups: [
    { id: 'grp-1', name: 'Thịt & Gia Cầm', icon: '🥩', itemCount: 42, color: 'from-rose-500 to-red-600' },
    { id: 'grp-2', name: 'Hải Sản Tươi', icon: '🦐', itemCount: 28, color: 'from-blue-500 to-indigo-600' },
    { id: 'grp-3', name: 'Rau Củ Quả', icon: '🥦', itemCount: 65, color: 'from-emerald-500 to-teal-600' },
    { id: 'grp-4', name: 'Gia Vị & Nước Sốt', icon: '🧂', itemCount: 54, color: 'from-amber-500 to-orange-600' },
    { id: 'grp-5', name: 'Tinh Bột & Trứng', icon: '🥚', itemCount: 22, color: 'from-yellow-400 to-amber-500' },
    { id: 'grp-6', name: 'Đồ Khô & Đóng Hộp', icon: '🥫', itemCount: 31, color: 'from-slate-500 to-slate-700' },
  ],

  ingredients: [
    {
      id: 'ing-1',
      groupId: 'grp-1',
      name: 'Thịt Gà',
      icon: '🍗',
      unit: 'gram',
      shelfLifeDays: 3,
      synonyms: ['gà', 'ức gà', 'đùi gà', 'cánh gà', 'gà ta', 'thịt gà phi lê'],
      inStockUsersCount: 1840,
    },
    {
      id: 'ing-2',
      groupId: 'grp-1',
      name: 'Thịt Bò',
      icon: '🥩',
      unit: 'gram',
      shelfLifeDays: 4,
      synonyms: ['bò', 'thăn bò', 'bắp bò', 'nạm bò', 'ba chỉ bò', 'thịt bò xay'],
      inStockUsersCount: 1420,
    },
    {
      id: 'ing-3',
      groupId: 'grp-3',
      name: 'Cà Rốt',
      icon: '🥕',
      unit: 'củ',
      shelfLifeDays: 14,
      synonyms: ['cà rốt đà lạt', 'carot', 'củ cải đỏ'],
      inStockUsersCount: 2210,
    },
    {
      id: 'ing-4',
      groupId: 'grp-2',
      name: 'Tôm Sú',
      icon: '🦐',
      unit: 'con / gram',
      shelfLifeDays: 2,
      synonyms: ['tôm', 'tôm đất', 'tôm thẻ', 'tôm nõn'],
      inStockUsersCount: 980,
    },
    {
      id: 'ing-5',
      groupId: 'grp-5',
      name: 'Trứng Gà',
      icon: '🥚',
      unit: 'quả',
      shelfLifeDays: 21,
      synonyms: ['trứng', 'trứng ta', 'trứng gà công nghiệp', 'hột gà'],
      inStockUsersCount: 3150,
    },
  ],

  pendingContributions: [
    {
      id: 'contrib-1',
      title: 'Salad Bơ Trứng Eat Clean Giảm Mỡ',
      authorName: 'Trần Thảo Linh',
      authorEmail: 'thaolinh98@gmail.com',
      submittedAt: '10 phút trước',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
      category: 'Healthy / Eat Clean',
      cookingTimeMinutes: 15,
      calories: 280,
      status: 'pending',
      ingredientsCount: 6,
      stepsCount: 3,
    },
    {
      id: 'contrib-2',
      title: 'Cơm Tấm Sườn Bì Chả Sài Gòn Chuẩn Vị',
      authorName: 'Nguyễn Quốc Hưng',
      authorEmail: 'hungchef.saigon@gmail.com',
      submittedAt: '45 phút trước',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
      category: 'Món Việt Truyền Thống',
      cookingTimeMinutes: 60,
      calories: 680,
      status: 'pending',
      ingredientsCount: 14,
      stepsCount: 6,
    },
    {
      id: 'contrib-3',
      title: 'Smoothie Chuối Việt Quất Yến Mạch',
      authorName: 'Đặng Mai Phương',
      authorEmail: 'maiphuong.fit@gmail.com',
      submittedAt: '2 giờ trước',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
      category: 'Thức Uống Detox',
      cookingTimeMinutes: 10,
      calories: 210,
      status: 'pending',
      ingredientsCount: 5,
      stepsCount: 2,
    },
  ],

  communityPosts: [
    {
      id: 'post-1',
      author: {
        id: 'usr-1',
        name: 'Hoàng Yến (Chef Yến)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        badge: 'Master Chef',
      },
      content: 'Thành quả bữa trưa quét nguyên liệu tủ lạnh qua Smart Vision AI! Được gợi ý món Ức gà cuộn măng tây, vừa ngon vừa không lo tăng cân! 🥑✨ #KhoeMonNgon #HealthyEatClean #SmartFridge',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
      tags: ['KhoeMonNgon', 'HealthyEatClean', 'SmartFridge'],
      likes: 342,
      comments: 28,
      createdAt: '1 giờ trước',
      status: 'pinned',
    },
    {
      id: 'post-2',
      author: {
        id: 'usr-2',
        name: 'Lê Minh Quân',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        badge: 'Đầu Bếp Nghiệp Dư',
      },
      content: 'Có ai biết chỗ mua bơ lạt Anchor sỉ ở Quận 1 không ạ? Đang làm mẻ bánh quy bơ cho tụi nhỏ. #HoiDapBep #GiaVi',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
      tags: ['HoiDapBep', 'GiaVi'],
      likes: 64,
      comments: 12,
      createdAt: '3 giờ trước',
      status: 'published',
    },
    {
      id: 'post-3',
      author: {
        id: 'usr-spam-01',
        name: 'Account_Spam_992',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        badge: 'Thành Viên Mới',
      },
      content: 'Nhận kéo tương tác, tăng view live stream, ib zalo 09xxxxxxx giá hạt dẻ siêu tốc!',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      tags: ['Spam', 'DichVu'],
      likes: 1,
      comments: 0,
      createdAt: '4 giờ trước',
      status: 'flagged',
      reportCount: 3,
      reportsList: [
        { reporter: 'Đỗ Hải Đăng', reason: 'Spam / Bán hàng', date: '30 phút trước', details: 'Bài viết quảng cáo dịch vụ tăng tương tác sai chủ đề ẩm thực.' },
        { reporter: 'Trần Thảo Linh', reason: 'Spam / Bán hàng', date: '45 phút trước', details: 'Rác bảng tin, để lại số điện thoại cá nhân.' },
        { reporter: 'Võ Minh Thư', reason: 'Nội dung phản cảm', date: '1 giờ trước', details: 'Bot lừa đảo câu kéo zalo.' },
      ],
    },
    {
      id: 'post-4',
      author: {
        id: 'usr-bot-02',
        name: 'Bot_Auto_Seeding',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        badge: 'Thành Viên Mới',
      },
      content: 'Link tải phần mềm hack game bài tặng 50k trải nghiệm tại bit.ly/spam-link-2026 ngay hôm nay!!',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      tags: ['Spam'],
      likes: 0,
      comments: 0,
      createdAt: '5 giờ trước',
      status: 'spam',
      reportCount: 5,
      reportsList: [
        { reporter: 'Hệ thống SmartVision AI', reason: 'Spam / Bán hàng', date: '5 giờ trước', details: 'Phát hiện liên kết cờ bạc bit.ly/spam-link-2026 tự động cách ly.' },
        { reporter: 'Lê Minh Quân', reason: 'Spam / Bán hàng', date: '4 giờ trước', details: 'Bot spam link lạ độc hại.' },
      ],
    },
    {
      id: 'post-5',
      author: {
        id: 'usr-3',
        name: 'Nguyễn Bích Phương',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        badge: 'Bếp Trưởng Bạc',
      },
      content: 'Canh kim chi thịt ba chỉ bò nóng hổi ăn cùng cơm trắng những ngày mưa se lạnh. Đơn giản mà tốn cơm cực kỳ các bác ạ! 🍲🌧️ #MonNgonMoiNgay #AmThucGiaDinh',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
      tags: ['MonNgonMoiNgay', 'AmThucGiaDinh'],
      likes: 189,
      comments: 24,
      createdAt: '6 giờ trước',
      status: 'published',
    },
  ],

  reports: [
    {
      id: 'rep-1',
      targetType: 'post',
      targetId: 'post-3',
      targetPreview: 'Nhận kéo tương tác, tăng view live stream, ib zalo...',
      reporterName: 'Đỗ Hải Đăng',
      reason: 'Spam / Bán hàng',
      reportedAt: '30 phút trước',
      status: 'pending',
    },
    {
      id: 'rep-2',
      targetType: 'comment',
      targetId: 'cmt-882',
      targetPreview: 'Nấu ăn dở ẹc mà cũng khoe lên đây, nhìn như đồ bỏ đi',
      reporterName: 'Nguyễn Thị Mai',
      reason: 'Quấy rối / Đả kích',
      reportedAt: '2 giờ trước',
      status: 'pending',
    },
  ],

  users: [
    {
      id: 'usr-1',
      fullName: 'Võ Minh Thư',
      email: 'minhthu.chef@gmail.com',
      phoneNumber: '0912 345 678',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      joinDate: '12/01/2026',
      lastActive: '5 phút trước',
      postsCount: 38,
      savedRecipesCount: 114,
      badge: 'Master Chef',
      tier: 'VIP Premium',
      status: 'active',
      dietPreference: 'Eat Clean / Low-Carb',
      smartFridgeItemsCount: 18,
      expiringItemsCount: 3,
      completedCookSessions: 46,
      aiScansCount: 29,
      healthGoal: 'Giảm cân & Giữ dáng',
      allergies: ['Đậu phộng', 'Hải sản vỏ cứng'],
      favoriteIngredients: ['Ức gà', 'Măng tây', 'Trứng gà', 'Bơ sáp', 'Dầu olive'],
      recentAppActivities: [
        { action: 'Hoàn thành món ăn', description: 'Đã nấu Bò Bít Tết Sốt Tiêu Đen (Chế độ Cook With Me)', timestamp: 'Hôm qua, 19:30', type: 'cook' },
        { action: 'Smart Vision Scan', description: 'Quét 4 nguyên liệu trong tủ lạnh: Ức gà, cà rốt, tỏi tây', timestamp: 'Hôm qua, 11:15', type: 'ai_scan' },
        { action: 'Cập nhật tủ lạnh', description: 'Thêm 500g ức gà phi lê vào ngăn mát tủ lạnh', timestamp: '2 ngày trước', type: 'fridge' },
        { action: 'Đăng bài cộng đồng', description: 'Chia sẻ ảnh thành quả bữa trưa Eat Clean lên Feed', timestamp: '3 ngày trước', type: 'community' },
        { action: 'Lưu công thức', description: 'Đã lưu công thức Canh Kim Chi Bò Mỹ vào mục Yêu thích', timestamp: '4 ngày trước', type: 'saved' },
      ],
    },
    {
      id: 'usr-2',
      fullName: 'Nguyễn Văn Đạt',
      email: 'dat.nguyen2026@outlook.com',
      phoneNumber: '0988 765 432',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      joinDate: '28/02/2026',
      lastActive: '12 giờ trước',
      postsCount: 12,
      savedRecipesCount: 45,
      badge: 'Bếp Trưởng Bạc',
      tier: 'VIP Premium',
      status: 'active',
      dietPreference: 'Ẩm thực Việt Nam / Giàu Protein',
      smartFridgeItemsCount: 12,
      expiringItemsCount: 1,
      completedCookSessions: 22,
      aiScansCount: 14,
      healthGoal: 'Tăng cơ săn chắc',
      allergies: ['Không có'],
      favoriteIngredients: ['Thịt bò', 'Nấm hương', 'Sả tươi', 'Nước mắm Phú Quốc'],
      recentAppActivities: [
        { action: 'Hoàn thành món ăn', description: 'Đã nấu Cơm Tấm Sườn Bì Chả chuẩn vị', timestamp: '12 giờ trước', type: 'cook' },
        { action: 'Smart Vision Scan', description: 'Nhận diện thịt bò thăn & ớt chuông', timestamp: '1 ngày trước', type: 'ai_scan' },
      ],
    },
    {
      id: 'usr-3',
      fullName: 'Trịnh Gia Bảo',
      email: 'giabao.foodie@gmail.com',
      phoneNumber: '0903 112 233',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      joinDate: '15/03/2026',
      lastActive: '1 ngày trước',
      postsCount: 4,
      savedRecipesCount: 19,
      badge: 'Đầu Bếp Nghiệp Dư',
      tier: 'Free',
      status: 'active',
      dietPreference: 'Ăn Chay / Thanh Đạm',
      smartFridgeItemsCount: 8,
      expiringItemsCount: 0,
      completedCookSessions: 9,
      aiScansCount: 7,
      healthGoal: 'Ăn uống lành mạnh',
      allergies: ['Sữa bò tươi'],
      favoriteIngredients: ['Đậu phụ', 'Nấm đùi gà', 'Rau củ quả sạch'],
      recentAppActivities: [
        { action: 'Lưu công thức', description: 'Đã lưu món Canh Nấm Hạt Sen Thanh Đạm', timestamp: '1 ngày trước', type: 'saved' },
      ],
    },
  ],

  staff: [
    {
      id: 'st-1',
      name: 'Dinh Loi (Lead Admin)',
      email: 'admin@smartcook.vn',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      lastLogin: 'Hiện đang online',
      status: 'active',
    },
    {
      id: 'st-2',
      name: 'Ngọc Lan Content',
      email: 'lan.ngoc@smartcook.vn',
      role: 'Content Editor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      lastLogin: 'Hôm nay, 08:30',
      status: 'active',
    },
    {
      id: 'st-3',
      name: 'Quang Khải Mod',
      email: 'khai.mod@smartcook.vn',
      role: 'Community Moderator',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      lastLogin: 'Hôm qua, 17:45',
      status: 'active',
    },
  ],

  aiConfig: {
    systemPrompt: `Bạn là SmartCook Chef AI - Trợ lý ẩm thực ảo thân thiện, uyên bác và am hiểu sâu sắc văn hóa ẩm thực Việt Nam kết hợp các phương pháp nấu ăn hiện đại. Hãy luôn gợi ý công thức chi tiết, tính toán dinh dưỡng chính xác, ưu tiên các nguyên liệu có sẵn trong tủ lạnh người dùng và giữ giọng văn ấm áp, khích lệ.`,
    personaTone: 'friendly',
    temperature: 0.7,
    quickPrompts: [
      'Tối nay ăn gì nhanh dưới 20 phút?',
      'Tủ lạnh chỉ có ức gà và trứng, nấu món gì ngon?',
      'Bí quyết ướp thịt nướng mềm mọng không bị khô?',
      'Gợi ý thực đơn Eat Clean 1500 calo cho người bận rộn',
      'Cách nhận biết thực phẩm đông lạnh còn tươi hay không?',
    ],
    visionAccuracyOverall: 94.8,
    recentScans: [
      {
        id: 'scan-1',
        user: 'minhthu.chef@gmail.com',
        detectedLabels: ['Ức gà (98%)', 'Cà rốt (96%)', 'Hành tây (92%)', 'Tỏi (88%)'],
        confidence: 96.5,
        recommendedRecipe: 'Ức Gà Xào Rau Củ Ngọt Tự Nhiên',
        timestamp: '5 phút trước',
      },
      {
        id: 'scan-2',
        user: 'dat.nguyen2026@outlook.com',
        detectedLabels: ['Thăn bò (95%)', 'Ớt chuông (94%)', 'Nấm đông cô (89%)'],
        confidence: 93.2,
        recommendedRecipe: 'Bò Xào Nấm & Ớt Chuông Sốt Hào',
        timestamp: '18 phút trước',
      },
      {
        id: 'scan-3',
        user: 'thaolinh98@gmail.com',
        detectedLabels: ['Tôm sú (97%)', 'Rau muống (96%)', 'Chanh (91%)'],
        confidence: 95.0,
        recommendedRecipe: 'Canh Chua Tôm Rau Muống',
        timestamp: '32 phút trước',
      },
    ],
  },

  notifications: [
    {
      id: 'notif-1',
      title: '🍲 Gợi ý bữa trưa 11:00: Tủ lạnh bạn đã có sẵn nguyên liệu!',
      body: 'Chỉ mất 20 phút để nấu món Canh cá chua ngọt thanh mát. Mở app xem công thức ngay!',
      scheduledTime: 'Hàng ngày lúc 11:00 AM',
      targetAudience: 'all',
      category: 'lunch_meal',
      status: 'scheduled',
      clicksCount: 1420,
    },
    {
      id: 'notif-2',
      title: '🌟 Bữa tối sum vầy 17:30: Đổi vị với Bò Bít Tết tiêu đen',
      body: 'Công thức độc quyền MasterChef mới cập nhật dành riêng cho thành viên SmartCook.',
      scheduledTime: 'Hàng ngày lúc 17:30 PM',
      targetAudience: 'all',
      category: 'dinner_meal',
      status: 'scheduled',
      clicksCount: 2310,
    },
  ],

  tasks: [
    {
      id: 'tsk-1',
      title: 'Duyệt 3 công thức mới do người dùng đóng góp',
      category: 'Recipe Moderation',
      dueDate: 'Hôm nay',
      completed: false,
      priority: 'high',
    },
    {
      id: 'tsk-2',
      title: 'Xử lý 2 báo cáo vi phạm bài viết spam & bình luận',
      category: 'Community Safety',
      dueDate: 'Hôm nay',
      completed: false,
      priority: 'high',
    },
    {
      id: 'tsk-3',
      title: 'Cập nhật từ điển Keyword Synonyms cho nhóm Hải Sản',
      category: 'AI Matching Engine',
      dueDate: '20 Th09',
      completed: true,
      priority: 'medium',
    },
    {
      id: 'tsk-4',
      title: 'Kiểm tra Push Notification bữa trưa 11:00 AM',
      category: 'Marketing Automated',
      dueDate: '20 Th09',
      completed: false,
      priority: 'normal',
    },
  ],

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),

  approveContribution: (id) =>
    set((state) => ({
      pendingContributions: state.pendingContributions.filter((c) => c.id !== id),
      kpi: { ...state.kpi, publishedRecipes: state.kpi.publishedRecipes + 1 },
    })),

  rejectContribution: (id, reason) =>
    set((state) => ({
      pendingContributions: state.pendingContributions.map((c) =>
        c.id === id ? { ...c, status: 'rejected', rejectionReason: reason } : c
      ),
    })),

  updateHeroBanner: (banner) =>
    set((state) => ({
      heroBanner: { ...state.heroBanner, ...banner },
    })),

  addIngredientSynonym: (ingredientId, synonym) =>
    set((state) => ({
      ingredients: state.ingredients.map((ing) =>
        ing.id === ingredientId && !ing.synonyms.includes(synonym)
          ? { ...ing, synonyms: [...ing.synonyms, synonym] }
          : ing
      ),
    })),

  removeIngredientSynonym: (ingredientId, synonym) =>
    set((state) => ({
      ingredients: state.ingredients.map((ing) =>
        ing.id === ingredientId
          ? { ...ing, synonyms: ing.synonyms.filter((s) => s !== synonym) }
          : ing
      ),
    })),

  addIngredient: (ingredient) =>
    set((state) => {
      const newIng: SystemIngredient = {
        ...ingredient,
        id: 'ing-' + Date.now(),
        inStockUsersCount: 0,
      };
      return {
        ingredients: [newIng, ...state.ingredients],
        ingredientGroups: state.ingredientGroups.map((g) =>
          g.id === ingredient.groupId ? { ...g, itemCount: g.itemCount + 1 } : g
        ),
      };
    }),

  updateIngredient: (id, updated) =>
    set((state) => ({
      ingredients: state.ingredients.map((ing) => (ing.id === id ? { ...ing, ...updated } : ing)),
    })),

  deleteIngredient: (id) =>
    set((state) => {
      const target = state.ingredients.find((i) => i.id === id);
      return {
        ingredients: state.ingredients.filter((ing) => ing.id !== id),
        ingredientGroups: target
          ? state.ingredientGroups.map((g) =>
              g.id === target.groupId ? { ...g, itemCount: Math.max(0, g.itemCount - 1) } : g
            )
          : state.ingredientGroups,
      };
    }),

  togglePostStatus: (id, status) =>
    set((state) => ({
      communityPosts: state.communityPosts.map((p) => (p.id === id ? { ...p, status } : p)),
    })),

  deleteCommunityPost: (id) =>
    set((state) => ({
      communityPosts: state.communityPosts.filter((p) => p.id !== id),
    })),

  resolveReport: (id, action) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, status: action } : r)),
    })),

  toggleUserStatus: (userId, status) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, status } : u)),
    })),

  updateUserBadge: (userId, badge) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, badge } : u)),
    })),

  updateUserProfile: (userId, updated) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, ...updated } : u)),
    })),

  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
      kpi: {
        ...state.kpi,
        totalUsers: Math.max(0, state.kpi.totalUsers - 1),
      },
    })),

  updateAIConfig: (config) =>
    set((state) => ({
      aiConfig: { ...state.aiConfig, ...config },
    })),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        { ...notif, id: `notif-${Date.now()}` },
        ...state.notifications,
      ],
    })),

  // Recipe Actions
  addRecipe: (recipe) =>
    set((state) => ({
      recipes: [
        {
          ...recipe,
          id: `dish-${Date.now()}`,
          rating: 5.0,
          ratingsCount: 1,
        },
        ...state.recipes,
      ],
      kpi: {
        ...state.kpi,
        publishedRecipes: state.kpi.publishedRecipes + 1,
      },
    })),

  updateRecipe: (id, updated) =>
    set((state) => ({
      recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...updated } : r)),
    })),

  deleteRecipe: (id) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== id),
      kpi: {
        ...state.kpi,
        publishedRecipes: Math.max(0, state.kpi.publishedRecipes - 1),
      },
    })),

  setKpi: (kpi) =>
    set((state) => ({
      kpi: { ...state.kpi, ...kpi },
    })),

  setUsers: (users) =>
    set(() => ({
      users,
    })),

  setRecipes: (recipes) =>
    set(() => ({
      recipes,
    })),

  setCommunityPosts: (communityPosts) =>
    set(() => ({
      communityPosts,
    })),
}));
