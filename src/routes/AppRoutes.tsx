import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Admin Modules
import { DashboardPage } from '../pages/admin/DashboardPage';
import { DishManagementPage } from '../pages/admin/DishManagementPage';
import { CommunityModerationPage } from '../pages/admin/CommunityModerationPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { AIEnginePage } from '../pages/admin/AIEnginePage';
import { MarketingPage } from '../pages/admin/MarketingPage';
import { SystemSettingsPage } from '../pages/admin/SystemSettingsPage';

// User & Public Modules
import { UserLandingPage } from '../pages/user/UserLandingPage';
import { RecipeListPage } from '../pages/public/RecipeListPage';
import { RecipeDetailPage } from '../pages/public/RecipeDetailPage';
import { AIScanPage } from '../pages/user/AIScanPage';
import { CommunityPage } from '../pages/public/CommunityPage';
import { ProfilePage } from '../pages/user/ProfilePage';
import { MyKitchenPage } from '../pages/user/MyKitchenPage';

// Auth Guard component for User Routes
import { useAuthStore } from '../store/useAuthStore';

const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
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
        <Route path="settings" element={<SystemSettingsPage />} />
      </Route>

      {/* 8. Mặc định fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
