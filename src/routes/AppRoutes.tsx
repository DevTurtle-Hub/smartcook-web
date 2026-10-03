import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { PageLoadingFallback } from '../components/common/PageLoadingFallback';
import { useAuthStore } from '../store/useAuthStore';

// Helper for React.lazy with named exports
const lazyLoad = <T extends Record<string, any>, K extends keyof T>(
  loader: () => Promise<T>,
  exportName: K
) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

// Lazy-loaded Auth Pages
const LoginPage = lazyLoad(() => import('../pages/auth/LoginPage'), 'LoginPage');
const RegisterPage = lazyLoad(() => import('../pages/auth/RegisterPage'), 'RegisterPage');

// Lazy-loaded Admin Modules
const DashboardPage = lazyLoad(() => import('../pages/admin/DashboardPage'), 'DashboardPage');
const DishManagementPage = lazyLoad(() => import('../pages/admin/DishManagementPage'), 'DishManagementPage');
const CommunityModerationPage = lazyLoad(() => import('../pages/admin/CommunityModerationPage'), 'CommunityModerationPage');
const UserManagementPage = lazyLoad(() => import('../pages/admin/UserManagementPage'), 'UserManagementPage');
const AIEnginePage = lazyLoad(() => import('../pages/admin/AIEnginePage'), 'AIEnginePage');
const MarketingPage = lazyLoad(() => import('../pages/admin/MarketingPage'), 'MarketingPage');
const SystemSettingsPage = lazyLoad(() => import('../pages/admin/SystemSettingsPage'), 'SystemSettingsPage');
const SupermarketManagementPage = lazyLoad(() => import('../pages/admin/SupermarketManagementPage'), 'SupermarketManagementPage');

// Lazy-loaded User & Public Modules
const UserLandingPage = lazyLoad(() => import('../pages/user/UserLandingPage'), 'UserLandingPage');
const RecipeListPage = lazyLoad(() => import('../pages/public/RecipeListPage'), 'RecipeListPage');
const RecipeDetailPage = lazyLoad(() => import('../pages/public/RecipeDetailPage'), 'RecipeDetailPage');
const AIScanPage = lazyLoad(() => import('../pages/user/AIScanPage'), 'AIScanPage');
const CommunityPage = lazyLoad(() => import('../pages/public/CommunityPage'), 'CommunityPage');
const ProfilePage = lazyLoad(() => import('../pages/user/ProfilePage'), 'ProfilePage');
const MyKitchenPage = lazyLoad(() => import('../pages/user/MyKitchenPage'), 'MyKitchenPage');

// Auth Guard component for User Routes
const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* 1. Trang Dành Cho User - Giới thiệu & Khám Phá Công Nghệ App SmartCook */}
        <Route path="/" element={<UserLandingPage />} />
        <Route path="/showcase" element={<UserLandingPage />} />

        {/* 2. Trang Chủ (Kho Món Ăn - Recipe Cards) */}
        <Route path="/recipes" element={<RecipeListPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />

        {/* 3. Trang Bếp Của Tôi (Tôi có gì trong tủ lạnh - AI Gợi ý) */}
        <Route path="/my-kitchen" element={<MyKitchenPage />} />
        <Route path="/kitchen" element={<MyKitchenPage />} />

        {/* 4. Trang Scan Chụp/Tải Ảnh AI (Có hướng dẫn tải app mobile) */}
        <Route path="/scan" element={<AIScanPage />} />

        {/* 4. Trang Cộng Đồng (Đăng bài, chat, bình luận, thả tim) */}
        <Route path="/community" element={<CommunityPage />} />

        {/* 5. Trang Hồ Sơ Cá Nhân (Yêu cầu đăng nhập) */}
        <Route
          path="/profile"
          element={
            <ProtectedUserRoute>
              <ProfilePage />
            </ProtectedUserRoute>
          }
        />

        {/* 6. Trang Đăng Nhập & Đăng Ký */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
        </Route>

        {/* 7. Toàn Bộ Hệ Thống Quản Trị Admin Portal (Bảo vệ chỉ Admin truy cập) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dishes" element={<DishManagementPage />} />
          <Route path="recipes" element={<Navigate to="/admin/dishes" replace />} />
          <Route path="ingredients" element={<Navigate to="/admin/dishes" replace />} />
          <Route path="community" element={<CommunityModerationPage />} />
          <Route path="ai-engine" element={<AIEnginePage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="supermarkets" element={<SupermarketManagementPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
        </Route>

        {/* 8. Mặc định fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
