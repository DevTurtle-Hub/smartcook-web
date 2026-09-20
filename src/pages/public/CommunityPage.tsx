import React, { useState } from 'react';
import { 
  MessageSquare, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { Post } from '../../types';
import { UserHeader } from '../../components/user/UserHeader';

export const CommunityPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [newPostCaption, setNewPostCaption] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, Array<{ author: string; text: string; time: string; avatar?: string }>>>({
    'post-1': [
      { author: 'Lê Tuấn Hưng', text: 'Nhìn màu thịt kho đẹp mê ly luôn bạn ơi, nước dừa xiêm nấu ra màu cánh gián tự nhiên đỉnh thật!', time: '1 giờ trước' },
      { author: 'Hoàng Kim', text: 'Bật app lên nấu theo từng bước tiện cực kỳ, không sợ cháy nồi luôn.', time: '30 phút trước' }
    ],
    'post-2': [
      { author: 'Trần Bình', text: 'Scan AI chuẩn thật, bữa mình scan tủ cũng ra ngay món này ăn đỡ ngán hẳn.', time: '2 giờ trước' }
    ]
  });

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
      recipe: {
        _id: 'seed-3',
        title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi Mật Ong',
      },
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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostCaption.trim()) return;

    const newPost: Post = {
      _id: `post-${Date.now()}`,
      author: {
        _id: user?._id || 'user-current',
        fullName: user?.fullName || `${user?.lastName || ''} ${user?.firstName || 'Bếp Trưởng'}`.trim(),
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      caption: newPostCaption,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
          publicId: `img-${Date.now()}`
        }
      ],
      tags: ['smartcook', 'yeubep', 'monanngon'],
      reactionCounts: { like: 1, love: 1, haha: 0, wow: 0, sad: 0, angry: 0 },
      totalReactions: 2,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: 'Vừa xong',
    };

    setPosts([newPost, ...posts]);
    setNewPostCaption('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      author: user?.fullName || `${user?.lastName || ''} ${user?.firstName || 'Bạn'}`.trim(),
      text,
      time: 'Vừa xong',
      avatar: user?.avatar
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      {/* Header Đồng Bộ */}
      <UserHeader />

      {/* Decorative background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[5%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Community Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-700 text-xs font-extrabold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>Mạng Xã Hội Ẩm Thực SmartCook</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Cộng Đồng Bếp Thông Minh
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Nơi chia sẻ thành quả mâm cơm ngon, công thức độc đáo, trò chuyện giao lưu và truyền cảm hứng nấu ăn mỗi ngày.
          </p>
        </div>

        {/* Create Post Input Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-orange-100 space-y-4">
          <div className="flex gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-11 h-11 rounded-2xl object-cover border-2 border-orange-200 shrink-0"
            />
            <textarea
              placeholder={isAuthenticated ? "Hôm nay bạn nấu được món gì ngon? Chia sẻ cảm nhận và hình ảnh cùng mọi người nhé..." : "Vui lòng đăng nhập để đăng bài viết lên cộng đồng..."}
              disabled={!isAuthenticated}
              value={newPostCaption}
              onChange={(e) => setNewPostCaption(e.target.value)}
              className="w-full bg-orange-50/30 hover:bg-orange-50/60 focus:bg-white rounded-2xl p-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 border border-orange-200/80 resize-none h-24 transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => alert("Tính năng đính kèm thêm ảnh từ thiết bị.")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-orange-50"
            >
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>Đính kèm hình ảnh</span>
            </button>

            <button
              onClick={handleCreatePost}
              disabled={!isAuthenticated || !newPostCaption.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng bài ngay</span>
            </button>
          </div>
        </div>

        {/* Feed List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post._id} className="bg-white rounded-3xl shadow-sm border border-orange-100/90 overflow-hidden transition-all hover:shadow-md">
              {/* Author Info */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.fullName}
                    className="w-10 h-10 rounded-2xl object-cover border border-orange-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 hover:text-orange-600 transition-colors cursor-pointer">
                      {post.author.fullName}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">{post.createdAt}</span>
                  </div>
                </div>

                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Caption */}
              <div className="px-5 pb-3">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{post.caption}</p>
                {post.recipe && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/70 flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-950">Món ăn: {post.recipe.title}</span>
                    <a href={`/recipes/${post.recipe._id}`} className="text-xs font-bold text-orange-600 hover:text-orange-700">
                      Xem công thức →
                    </a>
                  </div>
                )}
              </div>

              {/* Media Image */}
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
                  <span className="font-bold text-slate-700">{post.totalReactions} cảm xúc</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-medium">
                  <button 
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)} 
                    className="hover:text-orange-600 transition-colors"
                  >
                    {post.commentsCount} bình luận
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert("Đã sao chép liên kết bài viết!");
                    }}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {post.sharesCount} chia sẻ
                  </button>
                </div>
              </div>

              {/* Interactive Reaction & Action Bar */}
              <div className="px-4 py-2 flex items-center justify-around text-xs font-bold text-slate-600">
                
                {/* 6 Emojis Picker Button */}
                <div className="relative group">
                  <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Thả Tim</span>
                  </button>

                  {/* Popover Reaction Picker */}
                  <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex items-center gap-1 bg-white p-2 rounded-2xl shadow-xl border border-orange-100 animate-in fade-in slide-in-from-bottom-2 z-20">
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

                {/* Comment Toggle Button */}
                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
                  className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition-colors ${activeCommentPostId === post._id ? 'bg-orange-100 text-orange-600' : 'hover:bg-orange-50 hover:text-orange-600'}`}
                >
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Bình luận</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Đã sao chép liên kết chia sẻ!");
                  }}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Chia sẻ</span>
                </button>
              </div>

              {/* COMMENTS SECTION: Hiển thị danh sách bình luận & ô nhập comment */}
              {(activeCommentPostId === post._id || (postComments[post._id] && postComments[post._id].length > 0)) && (
                <div className="bg-orange-50/40 p-4 sm:p-5 border-t border-orange-100/80 space-y-3">
                  {/* Danh sách bình luận */}
                  <div className="space-y-2.5">
                    {(postComments[post._id] || []).map((c, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <div className="w-7 h-7 rounded-xl bg-orange-200 text-orange-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {c.author.slice(0, 1)}
                        </div>
                        <div className="bg-white rounded-2xl p-2.5 px-3.5 border border-orange-100 text-xs shadow-xs flex-1">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="font-bold text-slate-900">{c.author}</span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-slate-700 text-[11px] leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ô nhập bình luận */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder={isAuthenticated ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận..."}
                      disabled={!isAuthenticated}
                      value={commentInputs[post._id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post._id);
                      }}
                      className="flex-1 bg-white rounded-xl px-3 py-2 text-xs border border-orange-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder-slate-400"
                    />
                    <button
                      onClick={() => handleSendComment(post._id)}
                      disabled={!isAuthenticated || !commentInputs[post._id]?.trim()}
                      className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};
