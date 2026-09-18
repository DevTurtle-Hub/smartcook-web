import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { LandingPage } from '../pages/public/LandingPage';
import { RecipeListPage } from '../pages/public/RecipeListPage';
import { RecipeDetailPage } from '../pages/public/RecipeDetailPage';
import { CommunityPage } from '../pages/public/CommunityPage';
import { ProfilePage } from '../pages/user/ProfilePage';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

import { DashboardPage } from '../pages/admin/DashboardPage';
import { RecipeManagementPage } from '../pages/admin/RecipeManagementPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Zone (Khách & Người Dùng) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recipes" element={<RecipeListPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 2. Authentication Zone */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Route>

      {/* 3. Admin Zone (Bảo Vệ Bởi AdminGuard) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="recipes" element={<RecipeManagementPage />} />
        <Route path="ingredients" element={<RecipeManagementPage />} />
        <Route path="stores" element={<RecipeManagementPage />} />
        <Route path="community" element={<RecipeManagementPage />} />
        <Route path="users" element={<RecipeManagementPage />} />
      </Route>

      {/* 4. Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
