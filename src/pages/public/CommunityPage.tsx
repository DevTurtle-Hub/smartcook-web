import React, { useState } from 'react';
import { MessageSquare, Share2, Send, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { Post } from '../../types';

export const CommunityPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [newPostCaption, setNewPostCaption] = useState('');

  // Sample community posts with 6 reactions
  const [posts, setPosts] = useState<Post[]>([
    {
      _id: 'post-1',
      author: {
        _id: 'u1',
        fullName: 'Nguyễn Thị Mai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      caption: 'Lần đầu nấu món Thịt kho tàu theo công thức trên SmartCook! Quả thực thơm nức mũi cả xóm, nước dừa sóng sánh màu cánh gián cực kỳ chuẩn bài luôn ạ 🥰 Cả nhà ai cũng khen!',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
          publicId: 'img1',
        },
      ],
      recipe: {
        _id: 'seed-1',
        title: 'Thịt Kho Tàu Trứng Cút Nước Dừa',
      },
      tags: ['thitkhotau', 'monngonmoingay', 'smartcook'],
      reactionCounts: { like: 24, love: 52, haha: 2, wow: 18, sad: 0, angry: 0 },
      totalReactions: 96,
      commentsCount: 14,
      sharesCount: 5,
      createdAt: '2 giờ trước',
    },
    {
      _id: 'post-2',
      author: {
        _id: 'u2',
        fullName: 'Trần Văn Hoàng',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      },
      caption: 'Nay thử tính năng Quét AI tủ lạnh trên app, tủ còn đúng miếng ức gà với củ hành tây mà gợi ý ngay món Ức gà sốt bơ tỏi này. Nấu mất đúng 15p, chuẩn vị healthy cho anh em gymer nhé!',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80',
          publicId: 'img2',
        },
      ],
      tags: ['healthy', 'eatclean', 'aiscanner'],
      reactionCounts: { like: 45, love: 31, haha: 8, wow: 12, sad: 0, angry: 0 },
      totalReactions: 96,
      commentsCount: 9,
      sharesCount: 3,
      createdAt: '5 giờ trước',
    },
  ]);

  const reactionEmojis = [
    { type: 'like', emoji: '👍', label: 'Thích' },
    { type: 'love', emoji: '❤️', label: 'Yêu thích' },
    { type: 'haha', emoji: '😄', label: 'Haha' },
    { type: 'wow', emoji: '😮', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Buồn' },
    { type: 'angry', emoji: '😡', label: 'Giận' },
  ];

  const handleReact = (postId: string, type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        return {
          ...p,
          reactionCounts: {
            ...p.reactionCounts,
            [type]: p.reactionCounts[type] + 1,
          },
          totalReactions: p.totalReactions + 1,
        };
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Community Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
          Cộng Đồng Bếp Thông Minh
        </h1>
        <p className="text-sm text-slate-500">
          Chia sẻ thành quả nấu nướng, mẹo hay bảo quản đồ ăn và giao lưu cùng hàng nghìn người yêu ẩm thực.
        </p>
      </div>

      {/* Create Post Input Box */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-orange-200 shrink-0"
          />
          <textarea
            placeholder={isAuthenticated ? "Hôm nay bạn vừa nấu món gì ngon? Chia sẻ cùng mọi người nhé..." : "Vui lòng đăng nhập để đăng bài viết..."}
            disabled={!isAuthenticated}
            value={newPostCaption}
            onChange={(e) => setNewPostCaption(e.target.value)}
            className="w-full bg-slate-50 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 border border-slate-200 resize-none h-20"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-orange-500 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            <span>Thêm ảnh món ăn</span>
          </button>

          <button
            disabled={!isAuthenticated || !newPostCaption.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Đăng bài</span>
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Author */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{post.author.fullName}</h4>
                  <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="px-5 pb-3">
              <p className="text-sm text-slate-700 leading-relaxed">{post.caption}</p>
              {post.recipe && (
                <div className="mt-3 p-3 bg-orange-50/80 rounded-2xl border border-orange-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-900">Món ăn: {post.recipe.title}</span>
                  <span className="text-xs font-semibold text-orange-600">Xem công thức →</span>
                </div>
              )}
            </div>

            {/* Image */}
            {post.images && post.images.length > 0 && (
              <div className="max-h-96 overflow-hidden bg-slate-100">
                <img src={post.images[0].url} alt="Post media" className="w-full object-cover" />
              </div>
            )}

            {/* Reaction counts summary */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="flex -space-x-1">
                  <span>❤️</span>
                  <span>👍</span>
                  <span>😮</span>
                </span>
                <span className="font-semibold text-slate-600">{post.totalReactions} lượt cảm xúc</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{post.commentsCount} bình luận</span>
                <span>{post.sharesCount} chia sẻ</span>
              </div>
            </div>

            {/* Interactive Reaction & Action Bar */}
            <div className="px-4 py-2 flex items-center justify-around text-xs font-semibold text-slate-600">
              {/* 6 Emojis Picker Button */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <span>👍</span>
                  <span>Cảm xúc</span>
                </button>

                {/* Popover Reaction Picker */}
                <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex items-center gap-1 bg-white p-2 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2 z-20">
                  {reactionEmojis.map((emoji) => (
                    <button
                      key={emoji.type}
                      onClick={() => handleReact(post._id, emoji.type as any)}
                      title={emoji.label}
                      className="text-2xl p-1.5 hover:scale-125 transition-transform"
                    >
                      {emoji.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Bình luận</span>
              </button>

              <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
