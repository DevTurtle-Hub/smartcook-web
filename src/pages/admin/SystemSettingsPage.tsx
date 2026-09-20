import React, { useState } from 'react';
import {
  Settings,
  Key,
  Database,
  Cloud,
  Shield,
  Smartphone,
  CheckCircle,
  Save,
  Cpu,
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const [appName, setAppName] = useState('SmartCook - Trợ Lý Ẩm Thực Thông Minh');
  const [appVersion, setAppVersion] = useState('2.4.0 (Build 108)');
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyD-•••••••••••••••••••••••_SmartCookLive');
  const [cloudinaryName, setCloudinaryName] = useState('smartcook-cloud-storage');
  const [pushServiceKey, setPushServiceKey] = useState('AAAA-••••••••••••••••••••-FCM-Live');
  const [visionEndpoint, setVisionEndpoint] = useState('https://vision.smartcook.vn/v1/detect');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã lưu cấu hình tham số hệ thống và API Keys an toàn!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
            Cài Đặt Hệ Thống & Cấu Hình API Keys
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Thiết lập thông tin ứng dụng di động, kết nối các dịch vụ AI Cloud, bộ nhớ ảnh và Push Notification Server.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mọi Dịch Vụ Đang Kết Nối Ổn Định</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Info Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Thông Tin Ứng Dụng Mobile</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Tên Ứng Dụng</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Phiên Bản Hiện Tại (App Store / Play Store)</label>
            <input
              type="text"
              value={appVersion}
              onChange={(e) => setAppVersion(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Vision AI Detect Endpoint</label>
            <input
              type="text"
              value={visionEndpoint}
              onChange={(e) => setVisionEndpoint(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 font-mono"
            />
          </div>
        </div>

        {/* API Keys Configuration Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" />
            <span>Cấu Hình API Keys & Cloud Services</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
              <span>Google Gemini AI API Key</span>
              <span className="text-[10px] text-emerald-600 font-bold">● Active</span>
            </label>
            <input
              type="text"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
              <span>Cloud Storage (Cloudinary Name)</span>
              <span className="text-[10px] text-emerald-600 font-bold">● Active</span>
            </label>
            <input
              type="text"
              value={cloudinaryName}
              onChange={(e) => setCloudinaryName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
              <span>Firebase Cloud Messaging (FCM Server Key)</span>
              <span className="text-[10px] text-emerald-600 font-bold">● Active</span>
            </label>
            <input
              type="text"
              value={pushServiceKey}
              onChange={(e) => setPushServiceKey(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thiết Lập Hệ Thống</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
