import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  MoreHorizontal, 
  X, 
  Smile, 
  Hash, 
  Utensils, 
  Plus, 
  Flame, 
  CheckCircle2, 
  Paperclip, 
  Check,
  Trash2,
  Loader2,
  Pin,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import type { Post, Recipe, ReactionType } from '../../types';
import { UserHeader } from '../../components/user/UserHeader';
import { recipeApi } from '../../api/recipe.api';
import { communityApi } from '../../api/community.api';
import { socketService } from '../../services/socket.service';
import { toast } from '../../context/ToastContext';

// Format relative time helper
const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return 'Vừa xong';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Vừa xong';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const CommunityPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { startChatWithUser } = useChatStore();
  const navigate = useNavigate();

  // Posts Feed State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [postError, setPostError] = useState<string | null>(null);
  const [selectedTopicTag, setSelectedTopicTag] = useState<string>('all');
  
  // Post Creator State
  const [newPostCaption, setNewPostCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState<{ url: string; file?: File; name: string }[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<{ _id: string; title: string; image?: string; category?: string } | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['smartcook', 'yeubep']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; label: string } | null>(null);
  
  // Modals & Popovers for composer
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Feed interactions
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, Array<{ id?: string; author: string; authorId?: string; text: string; time: string; avatar?: string }>>>({});
  const [isLoadingComments, setIsLoadingComments] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset suggested tags
  const popularTags = ['monngonmoingay', 'healthy', 'eatclean', 'bepgiadinh', 'nauanthoathich', 'quickdinner', 'aiscan'];

  // Quick feelings / cooking status
  const moodOptions = [
    { emoji: '😋', label: 'Đang thèm ăn' },
    { emoji: '👨‍🍳', label: 'Vào bếp trổ tài' },
    { emoji: '🎉', label: 'Thành công mỹ mãn' },
    { emoji: '🥗', label: 'Healthy & Eat clean' },
    { emoji: '⚡', label: 'Nấu siêu tốc < 15p' },
    { emoji: '🥰', label: 'Cơm gia đình ấm cúng' },
  ];

  // Quick emojis to insert into text
  const quickEmojis = ['😋', '👨‍🍳', '🥘', '🍲', '🥩', '🥗', '🔥', '✨', '❤️', '🤤', '👏', '👌'];

  // Fetch real posts from backend
  const fetchPosts = async (tag?: string) => {
    setIsLoadingPosts(true);
    setPostError(null);
    try {
      const data = await communityApi.getPosts({
        tag: tag && tag !== 'all' ? tag : undefined,
        limit: 30,
      });
      if (data && data.posts) {
        setPosts(data.posts);
      }
    } catch (err: any) {
      console.error('Lỗi khi tải bài viết cộng đồng:', err);
      setPostError('Không thể tải bài viết cộng đồng. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts(selectedTopicTag);
  }, [selectedTopicTag]);

  // Real-time Live Feed listeners: reactions, comments, new posts, deletions
  useEffect(() => {
    socketService.connect();

    // 1. Real-time reaction update
    const handleLiveReaction = (data: {
      postId: string;
      totalReactions: number;
      reactionCounts: Record<string, number>;
      userId: string;
      reactionType: string | null;
    }) => {
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== data.postId) return p;
          const isCurrentUser = user?._id && data.userId === user._id;
          return {
            ...p,
            totalReactions: data.totalReactions,
            reactionCounts: {
              like: data.reactionCounts?.like ?? p.reactionCounts?.like ?? 0,
              love: data.reactionCounts?.love ?? p.reactionCounts?.love ?? 0,
              haha: data.reactionCounts?.haha ?? p.reactionCounts?.haha ?? 0,
              wow: data.reactionCounts?.wow ?? p.reactionCounts?.wow ?? 0,
              sad: data.reactionCounts?.sad ?? p.reactionCounts?.sad ?? 0,
              angry: data.reactionCounts?.angry ?? p.reactionCounts?.angry ?? 0,
            },
            ...(isCurrentUser
              ? {
                  myReaction: (data.reactionType as ReactionType) || null,
                  isLiked: !!data.reactionType,
                }
              : {}),
          };
        })
      );
    };

    // 2. Real-time new comment
    const handleLiveComment = (data: {
      postId: string;
      comment: any;
      commentsCount: number;
    }) => {
      // Update comment count on post in feed
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== data.postId) return p;
          return {
            ...p,
            commentsCount: data.commentsCount,
          };
        })
      );

      // If comments section is open for this post, append in real-time
      setPostComments((prev) => {
        const existing = prev[data.postId];
        if (!existing) return prev;

        const commentId = data.comment._id || data.comment.id;
        if (existing.some((c) => c.id === commentId)) return prev;

        const authorName =
          data.comment.author?.fullName ||
          `${data.comment.author?.firstName || ''} ${data.comment.author?.lastName || ''}`.trim() ||
          'Thành viên SmartCook';

        const formatted = {
          id: commentId,
          author: authorName,
          authorId: data.comment.author?._id || data.comment.author?.id,
          text: data.comment.content,
          time: 'Vừa xong',
          avatar: data.comment.author?.avatar,
        };

        return {
          ...prev,
          [data.postId]: [...existing, formatted],
        };
      });
    };

    // 3. Real-time new post
    const handleLiveNewPost = (data: { post: any }) => {
      if (!data?.post?._id) return;
      setPosts((prev) => {
        if (prev.some((p) => p._id === data.post._id)) return prev;
        return [data.post, ...prev];
      });
    };

    // 4. Real-time post deleted
    const handleLivePostDeleted = (data: { postId: string }) => {
      if (!data?.postId) return;
      setPosts((prev) => prev.filter((p) => p._id !== data.postId));
    };

    socketService.onPostReaction(handleLiveReaction);
    socketService.onPostComment(handleLiveComment);
    socketService.onCommunityPost(handleLiveNewPost);
    socketService.onPostDeleted(handleLivePostDeleted);

    return () => {
      socketService.offPostReaction(handleLiveReaction);
      socketService.offPostComment(handleLiveComment);
      socketService.offCommunityPost(handleLiveNewPost);
      socketService.offPostDeleted(handleLivePostDeleted);
    };
  }, [user?._id]);

  // Load recipes for attaching
  useEffect(() => {
    if (showRecipeModal && availableRecipes.length === 0) {
      setIsLoadingRecipes(true);
      recipeApi.getRecipes({ limit: 20 })
        .then((data) => {
          if (data && data.recipes) {
            setAvailableRecipes(data.recipes);
          }
        })
        .catch((err) => console.warn('Lỗi lấy danh sách công thức:', err))
        .finally(() => setIsLoadingRecipes(false));
    }
  }, [showRecipeModal]);

  // Handle local image file upload & preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImgs: { url: string; file: File; name: string }[] = [];
    Array.from(files).forEach((file) => {
      if (selectedImages.length + newImgs.length >= 6) return;
      const url = URL.createObjectURL(file);
      newImgs.push({ url, file, name: file.name });
    });

    setSelectedImages((prev) => [...prev, ...newImgs]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const removed = prev[index];
      if (removed?.url && removed.url.startsWith('blob:')) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTag = customTagInput.trim().replace(/^#+/, '').toLowerCase();
    if (cleanTag && !selectedTags.includes(cleanTag)) {
      setSelectedTags([...selectedTags, cleanTag]);
      setCustomTagInput('');
      setShowTagInput(false);
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewPostCaption((prev) => prev + emoji);
  };

  const reactionEmojis = [
    { type: 'like', emoji: '👍', label: 'Thích' },
    { type: 'love', emoji: '❤️', label: 'Yêu thích' },
    { type: 'haha', emoji: '😄', label: 'Haha' },
    { type: 'wow', emoji: '😮', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Buồn' },
    { type: 'angry', emoji: '😡', label: 'Giận' },
  ];

  // Real React handler with optimistic UI update
  const handleReact = async (postId: string, type: ReactionType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const currentReactions = p.reactionCounts || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
        const hasReactedSame = p.myReaction === type;
        const newReaction = hasReactedSame ? null : type;
        const countDiff = hasReactedSame ? -1 : (p.myReaction ? 0 : 1);

        return {
          ...p,
          isLiked: newReaction !== null,
          myReaction: newReaction,
          totalReactions: Math.max(0, (p.totalReactions || 0) + countDiff),
          reactionCounts: {
            ...currentReactions,
            [type]: Math.max(0, (currentReactions[type] || 0) + (hasReactedSame ? -1 : 1)),
            ...(p.myReaction && p.myReaction !== type ? {
              [p.myReaction]: Math.max(0, (currentReactions[p.myReaction] || 0) - 1)
            } : {})
          }
        };
      })
    );

    try {
      const updatedPost = await communityApi.reactPost(postId, type);
      if (updatedPost) {
        setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
      }
    } catch (err) {
      console.error('Lỗi khi thả cảm xúc:', err);
    }
  };

  // Real Create Post handler uploading to backend + Cloudinary
  const handleCreatePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!newPostCaption.trim() && selectedImages.length === 0) return;

    setIsPublishing(true);

    try {
      const fullCaption = selectedMood 
        ? `${selectedMood.emoji} Cảm thấy ${selectedMood.label.toLowerCase()}:\n${newPostCaption}`
        : newPostCaption;

      const formData = new FormData();
      formData.append('caption', fullCaption);
      if (selectedRecipe) {
        formData.append('recipeId', selectedRecipe._id);
        formData.append('dishName', selectedRecipe.title);
      }
      if (selectedTags.length > 0) {
        formData.append('tags', selectedTags.join(','));
      }

      // Append image files
      selectedImages.forEach((img) => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });

      const newPost = await communityApi.createPost(formData);
      setPosts((prev) => [newPost, ...prev]);
      
      // Reset form
      setNewPostCaption('');
      setSelectedImages([]);
      setSelectedRecipe(null);
      setSelectedMood(null);
      setSelectedTags(['smartcook', 'yeubep']);
      toast.success('🎉 Đăng bài viết cộng đồng thành công! Bạn nhận được +20 XP Đầu Bếp.');
    } catch (err: any) {
      console.error('Lỗi khi đăng bài:', err);
      toast.error(err.response?.data?.message || 'Đăng bài viết thất bại. Vui lòng thử lại!');
    } finally {
      setIsPublishing(false);
    }
  };

  // Toggle and fetch comments
  const handleToggleComments = async (postId: string) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }

    setActiveCommentPostId(postId);

    if (!postComments[postId]) {
      setIsLoadingComments((prev) => ({ ...prev, [postId]: true }));
      try {
        const res = await communityApi.getComments(postId);
        if (res && res.comments) {
          const formatted = res.comments.map((c) => ({
            id: c._id,
            author: c.author?.fullName || `${c.author?.firstName || ''} ${c.author?.lastName || ''}`.trim() || 'Thành viên SmartCook',
            authorId: c.author?._id || c.author?.id,
            text: c.content,
            time: formatRelativeTime(c.createdAt),
            avatar: c.author?.avatar,
          }));
          setPostComments((prev) => ({ ...prev, [postId]: formatted }));
        }
      } catch (err) {
        console.warn('Lỗi khi tải bình luận:', err);
      } finally {
        setIsLoadingComments((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  // Real Add Comment handler
  const handleSendComment = async (postId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const newComment = await communityApi.addComment(postId, text);
      const formatted = {
        id: newComment._id,
        author: newComment.author?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Bạn',
        authorId: user?._id,
        text: newComment.content,
        time: 'Vừa xong',
        avatar: user?.avatar,
      };

      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), formatted],
      }));

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p))
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      toast.success('Đã gửi thảo luận thành công!');
    } catch (err: any) {
      console.error('Lỗi khi gửi bình luận:', err);
      toast.error('Không thể gửi bình luận. Vui lòng thử lại!');
    }
  };

  // Delete Post handler
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bài viết này không?')) return;
    try {
      await communityApi.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.info('Đã xoá bài viết thành công.');
    } catch (err: any) {
      console.error('Lỗi khi xoá bài viết:', err);
      toast.error(err.response?.data?.message || 'Không thể xoá bài viết!');
    }
  };

  const filteredRecipes = availableRecipes.filter((r) => 
    r.title.toLowerCase().includes(recipeSearch.toLowerCase()) || 
    (r.category && r.category.toLowerCase().includes(recipeSearch.toLowerCase()))
  );

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
        {/* Create Post Card - Thiết kế Hiện đại & Chuyên Nghiệp */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl shadow-orange-950/5 border border-orange-100/90 space-y-4 transition-all hover:border-orange-200">
          
          {/* Header người dùng & trạng thái cảm xúc */}
          <div className="flex items-center justify-between pb-3 border-b border-orange-50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Avatar"
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-orange-300 ring-2 ring-orange-100 shadow-sm shrink-0"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-slate-800 tracking-tight">
                    {user?.fullName || `${user?.lastName || ''} ${user?.firstName || 'Bếp Trưởng'}`.trim()}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    <span>Thành viên Bếp</span>
                  </span>
                </div>
                {selectedMood ? (
                  <div className="flex items-center gap-1.5 text-xs text-orange-600 font-semibold mt-0.5">
                    <span>{selectedMood.emoji} Cảm thấy {selectedMood.label.toLowerCase()}</span>
                    <button 
                      onClick={() => setSelectedMood(null)} 
                      className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">Chia sẻ khoảnh khắc bếp & mâm cơm của bạn</p>
                )}
              </div>
            </div>

            {/* Quick Mood Dropdown Toggle */}
            <div className="relative group">
              <button 
                type="button"
                className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-orange-200/60"
              >
                <span>{selectedMood?.emoji || '😊'}</span>
                <span className="hidden sm:inline">{selectedMood?.label || 'Tâm trạng'}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-orange-100 p-2 hidden group-hover:block z-30 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">Hôm nay bạn thế nào?</p>
                <div className="space-y-1 mt-1">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.label}
                      type="button"
                      onClick={() => setSelectedMood(mood)}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all flex items-center gap-2"
                    >
                      <span className="text-base">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ô nhập nội dung chính */}
          <div className="relative">
            <textarea
              placeholder={isAuthenticated ? "Hôm nay bạn nấu được món gì ngon? Chia sẻ bí quyết, cảm nhận và hình ảnh thành quả cùng cộng đồng..." : "Vui lòng đăng nhập để đăng bài viết lên cộng đồng..."}
              disabled={!isAuthenticated}
              value={newPostCaption}
              onChange={(e) => setNewPostCaption(e.target.value)}
              rows={3}
              className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-2xl p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 border border-slate-200/80 focus:border-orange-300 resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Xem trước hình ảnh đã chọn (Preview Grid) */}
          {selectedImages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                  <span>Hình ảnh đã chọn ({selectedImages.length}/6)</span>
                </span>
                <button 
                  type="button" 
                  onClick={() => setSelectedImages([])}
                  className="text-slate-400 hover:text-rose-500 text-[11px] font-semibold transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-square bg-slate-100 border border-slate-200 shadow-xs">
                    <img src={img.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md"
                      title="Xóa ảnh này"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-orange-500/90 text-white text-[9px] font-bold">Ảnh bìa</span>
                    )}
                  </div>
                ))}

                {selectedImages.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-2xl border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-orange-600 aspect-square"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Thêm ảnh</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Công thức món ăn được gắn kèm (Attached Recipe Card) */}
          {selectedRecipe && (
            <div className="p-3.5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/60 rounded-2xl border border-orange-200 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full">
                      Món ăn kèm công thức
                    </span>
                    {selectedRecipe.category && (
                      <span className="text-[10px] font-medium text-slate-500">· {selectedRecipe.category}</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5 line-clamp-1">
                    {selectedRecipe.title}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-white/80"
                title="Hủy đính kèm món này"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Danh sách Hashtags đã gắn */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1 mr-1">
              <Hash className="w-3.5 h-3.5 text-orange-500" />
              <span>Chủ đề:</span>
            </span>

            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold group"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="text-orange-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Nút gợi ý tag nhanh */}
            {popularTags.filter((t) => !selectedTags.includes(t)).slice(0, 3).map((ptag) => (
              <button
                key={ptag}
                type="button"
                onClick={() => handleToggleTag(ptag)}
                className="text-[11px] font-semibold text-slate-500 hover:text-orange-600 px-2 py-0.5 rounded-lg hover:bg-orange-50 transition-colors"
              >
                +# {ptag}
              </button>
            ))}

            {/* Custom Tag Input Toggle */}
            {showTagInput ? (
              <form onSubmit={handleAddCustomTag} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Nhập thẻ..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  autoFocus
                  className="w-24 px-2 py-0.5 text-xs bg-white rounded-lg border border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => setShowTagInput(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 px-2 py-0.5 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Thêm thẻ</span>
              </button>
            )}
          </div>

          {/* Quick emoji popover */}
          {showEmojiPicker && (
            <div className="p-2 bg-orange-50/70 rounded-2xl border border-orange-200 flex flex-wrap items-center gap-1.5 animate-in fade-in">
              <span className="text-[11px] font-semibold text-slate-500 px-2">Biểu tượng gợi ý:</span>
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleInsertEmoji(emoji)}
                  className="text-lg p-1 hover:scale-125 transition-transform hover:bg-white rounded-lg"
                >
                  {emoji}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="ml-auto text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Hidden File Input for Real Multi-Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Action Toolbar & Submit Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Action Tools */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {/* Image upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors px-3 py-2 rounded-xl hover:bg-emerald-50 active:scale-95"
                title="Tải ảnh từ máy tính hoặc điện thoại"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Ảnh / Video</span>
              </button>

              {/* Attach recipe button */}
              <button
                type="button"
                onClick={() => setShowRecipeModal(true)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors px-3 py-2 rounded-xl active:scale-95 ${
                  selectedRecipe 
                    ? 'text-orange-600 bg-orange-50 border border-orange-200/80' 
                    : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
                title="Gắn kèm món ăn từ thực đơn của SmartCook"
              >
                <Utensils className="w-4 h-4 text-orange-500" />
                <span>{selectedRecipe ? 'Đổi công thức' : 'Gắn công thức'}</span>
              </button>

              {/* Emoji quick insert */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors px-3 py-2 rounded-xl active:scale-95 ${
                  showEmojiPicker ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
                title="Chèn biểu tượng cảm xúc"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span>Icon</span>
              </button>
            </div>

            {/* Nút Đăng Bài Hoàn Chỉnh */}
            <button
              onClick={() => handleCreatePost()}
              disabled={!isAuthenticated || isPublishing || (!newPostCaption.trim() && selectedImages.length === 0)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Đăng bài ngay</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Chọn Công Thức Đính Kèm */}
        {showRecipeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] shadow-2xl border border-orange-100 flex flex-col overflow-hidden animate-in zoom-in-95">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-orange-50/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Gắn Công Thức Món Ăn</h3>
                    <p className="text-[11px] text-slate-500">Giúp mọi người dễ dàng xem nguyên liệu & cách nấu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecipeModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recipe Search Input */}
              <div className="p-4 border-b border-slate-100">
                <input
                  type="text"
                  placeholder="Tìm món ăn theo tên hoặc danh mục..."
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                />
              </div>

              {/* Recipe List */}
              <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[50vh]">
                {isLoadingRecipes ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-400">Đang tải danh sách công thức...</p>
                  </div>
                ) : filteredRecipes.length > 0 ? (
                  filteredRecipes.map((r) => {
                    const isSelected = selectedRecipe?._id === r._id;
                    return (
                      <div
                        key={r._id}
                        onClick={() => {
                          setSelectedRecipe({ _id: r._id, title: r.title, image: r.image, category: r.category });
                          setShowRecipeModal(false);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'bg-orange-50/80 border-orange-400 shadow-xs' 
                            : 'bg-white border-slate-100 hover:border-orange-200 hover:bg-orange-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={r.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80'}
                            alt={r.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{r.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span>{r.category || 'Món chính'}</span>
                              <span>·</span>
                              <span>{r.cookingTimeMinutes || 25} phút</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-orange-600 hover:underline">Chọn</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Không tìm thấy công thức nào phù hợp.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRecipeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'monngonmoingay', label: '🍜 Món Ngon Mỗi Ngày' },
            { id: 'eatclean', label: '🥗 Eat Clean' },
            { id: 'bepgiadinh', label: '🍲 Bếp Gia Đình' },
            { id: 'nauanthoathich', label: '🧁 Nấu Ăn Thoả Thích' },
            { id: 'aiscan', label: '🤖 AI Bếp' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTopicTag(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all shadow-xs border ${
                selectedTopicTag === tab.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-orange-500/20'
                  : 'bg-white text-slate-600 border-orange-100 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => fetchPosts(selectedTopicTag)}
            className="p-2 rounded-2xl bg-white border border-orange-100 text-slate-500 hover:text-orange-600 hover:border-orange-300 transition-colors ml-auto shrink-0 shadow-xs"
            title="Làm mới bài viết"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPosts ? 'animate-spin text-orange-500' : ''}`} />
          </button>
        </div>

        {/* Feed List - Phong cách Culinary Magazine & Bếp Hiện Đại */}
        {isLoadingPosts ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-orange-100/70 shadow-sm animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="w-32 h-3.5 bg-slate-200 rounded-md" />
                    <div className="w-20 h-2.5 bg-slate-100 rounded-md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-slate-200 rounded-md" />
                  <div className="w-3/4 h-3 bg-slate-100 rounded-md" />
                </div>
                <div className="w-full h-56 bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-orange-200 space-y-3 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-2xl font-black">
              🍳
            </div>
            <h3 className="font-extrabold text-base text-slate-800">Chưa có bài viết nào ở chủ đề này</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Hãy trở thành người đầu tiên chia sẻ món ngon và kinh nghiệm bếp núc với cộng đồng SmartCook!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => {
              const authorName = post.author?.fullName || `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'Đầu bếp SmartCook';
              const authorAvatar = post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
              const isMyPost = user?._id === post.author?._id || (user as any)?.role === 'admin';
              const activeReaction = reactionEmojis.find((r) => r.type === post.myReaction);

              return (
                <article 
                  key={post._id} 
                  className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100/70 overflow-hidden flex flex-col group"
                >
                  {/* Media Image Showcase Đặt Lên Hàng Đầu Phong Cách Tạp Chí Ẩm Thực */}
                  {post.images && post.images.length > 0 && (
                    <div className="relative overflow-hidden bg-slate-100 max-h-[500px]">
                      {post.images.length === 1 ? (
                        <div className="w-full h-full overflow-hidden">
                          <img 
                            src={post.images[0].url} 
                            alt="Culinary Creation" 
                            className="w-full max-h-[480px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500" 
                          />
                        </div>
                      ) : post.images.length === 2 ? (
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-amber-50/50">
                          {post.images.map((img, i) => (
                            <div key={i} className="aspect-4/3 overflow-hidden rounded-2xl">
                              <img src={img.url} alt={`Creation ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-amber-50/50">
                          {post.images.slice(0, 3).map((img, i) => (
                            <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
                              <img src={img.url} alt={`Creation ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              {i === 2 && post.images.length > 3 && (
                                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center text-white font-black text-lg">
                                  +{post.images.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Ghim bài */}
                      {post.isPinned && (
                        <div className="absolute top-4 right-14 bg-amber-500 text-white backdrop-blur-md rounded-xl px-2.5 py-1 text-[11px] font-bold shadow-md flex items-center gap-1 z-10">
                          <Pin className="w-3 h-3 fill-white" />
                          <span>Được ghim</span>
                        </div>
                      )}

                      {/* Floating Chef Badge trên góc ảnh */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2 shadow-md flex items-center gap-3 border border-white/80">
                        <img
                          src={authorAvatar}
                          alt={authorName}
                          className="w-8 h-8 rounded-xl object-cover ring-2 ring-orange-400"
                        />
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-800 tracking-tight leading-tight">
                            {authorName}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium">{formatRelativeTime(post.createdAt)}</p>
                        </div>

                        {/* Nút Nhắn tin cho chủ bài đăng */}
                        {user?._id !== post.author?._id && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startChatWithUser({
                                id: post.author?._id || '',
                                name: authorName,
                                avatar: authorAvatar,
                                role: 'Chủ Bài Đăng'
                              });
                            }}
                            className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-bold shadow-xs hover:scale-105 active:scale-95 transition-all"
                            title={`Nhắn tin trực tiếp với ${authorName}`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Nhắn tin</span>
                          </button>
                        )}
                      </div>

                      {/* Author delete button */}
                      {isMyPost && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 backdrop-blur-md flex items-center justify-center shadow-md transition-all"
                          title="Xoá bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Nếu không có ảnh thì hiển thị tác giả phong cách card nhẹ nhàng */}
                  {(!post.images || post.images.length === 0) && (
                    <div className="p-6 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={authorAvatar}
                          alt={authorName}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-orange-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-800">
                              {authorName}
                            </h4>
                            {post.isPinned && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-extrabold">
                                <Pin className="w-2.5 h-2.5 fill-amber-700" /> Ghim
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">{formatRelativeTime(post.createdAt)}</span>
                        </div>

                        {/* Nút Nhắn tin cho tác giả bài viết */}
                        {user?._id !== post.author?._id && (
                          <button
                            type="button"
                            onClick={() => startChatWithUser({
                              id: post.author?._id || '',
                              name: authorName,
                              avatar: authorAvatar,
                              role: 'Chủ Bài Đăng'
                            })}
                            className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200/80 transition-all active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-orange-600" />
                            <span>Nhắn tin</span>
                          </button>
                        )}
                      </div>

                      {isMyPost && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Xoá bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Story & Nội dung cảm nhận ẩm thực */}
                  <div className="p-6 pt-5 space-y-3.5">
                    <p className="text-sm sm:text-[15px] text-slate-800 font-normal leading-relaxed whitespace-pre-line tracking-tight">
                      {post.caption}
                    </p>

                    {/* Món ăn gắn kèm (Linked Recipe Card) */}
                    {(post.dishName || post.recipeId) && (
                      <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center font-black text-lg shadow-2xs shrink-0">
                            🍲
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">Công Thức Món Ăn</span>
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">{post.dishName || 'Món ngon SmartCook'}</h4>
                          </div>
                        </div>

                        {post.recipeId && (
                          <Link
                            to={`/recipe/${typeof post.recipeId === 'string' ? post.recipeId : (post.recipeId as any)._id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-500 hover:text-white text-orange-600 text-xs font-bold border border-orange-200 shadow-2xs transition-all shrink-0"
                          >
                            Xem cách nấu
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Hashtag Pills phong cách Pinterest/Instagram Foodie */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag} 
                            onClick={() => setSelectedTopicTag(tag)}
                            className="px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors cursor-pointer border border-orange-200/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Modern Aesthetic Interaction Bar */}
                  <div className="px-6 py-4 bg-slate-50/60 border-t border-amber-50/80 flex items-center justify-between">
                    
                    {/* Floating Reaction Pill */}
                    <div className="relative group flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/70 shadow-xs">
                      <button 
                        type="button" 
                        onClick={() => handleReact(post._id, post.myReaction || 'like')}
                        className={`flex items-center gap-1.5 text-xs font-extrabold transition-transform ${
                          post.myReaction ? 'text-orange-600 scale-105' : 'text-slate-600 hover:text-orange-600'
                        }`}
                      >
                        {activeReaction ? (
                          <span className="text-base">{activeReaction.emoji}</span>
                        ) : (
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                        )}
                        <span>{post.totalReactions || 0}</span>
                      </button>

                      {/* Reaction Popover */}
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex items-center gap-1.5 bg-white p-2 rounded-2xl shadow-xl border border-orange-100 animate-in fade-in zoom-in-95 z-30">
                        {reactionEmojis.map((emoji) => (
                          <button
                            key={emoji.type}
                            onClick={() => handleReact(post._id, emoji.type as any)}
                            title={emoji.label}
                            className={`text-xl p-1 hover:scale-130 transition-transform ${
                              post.myReaction === emoji.type ? 'scale-120 drop-shadow-sm' : ''
                            }`}
                          >
                            {emoji.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right side actions: Comment & Share */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleComments(post._id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                          activeCommentPostId === post._id
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/30'
                            : 'bg-white text-slate-600 border-slate-200/70 hover:border-orange-200 hover:text-orange-600 shadow-xs'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount || 0} Thảo luận</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          toast.success('Đã sao chép liên kết bài viết vào khay nhớ tạm!');
                        }}
                        className="p-2 rounded-2xl bg-white text-slate-500 hover:text-orange-600 border border-slate-200/70 hover:border-orange-200 shadow-xs transition-colors"
                        title="Chia sẻ bài viết"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* COMMENTS SECTION - Thiết kế dạng hội thoại ẩm thực gọn gàng */}
                  {(activeCommentPostId === post._id || (postComments[post._id] && postComments[post._id].length > 0)) && (
                    <div className="bg-[#fffdfa] p-5 sm:p-6 border-t border-amber-100/60 space-y-4">
                      {/* Loading comments spinner */}
                      {isLoadingComments[post._id] && (
                        <div className="py-4 text-center">
                          <Loader2 className="w-5 h-5 text-orange-500 animate-spin mx-auto" />
                          <span className="text-[11px] text-slate-400 mt-1 block">Đang tải thảo luận...</span>
                        </div>
                      )}

                      {/* Danh sách bình luận */}
                      <div className="space-y-3">
                        {(postComments[post._id] || []).map((c, idx) => (
                          <div key={idx} className="flex gap-3 items-start group/comment">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-400 to-amber-300 text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0 overflow-hidden">
                              {c.avatar ? (
                                <img src={c.avatar} alt={c.author} className="w-full h-full object-cover" />
                              ) : (
                                c.author.slice(0, 1)
                              )}
                            </div>
                            <div className="bg-white rounded-2xl p-3 px-4 border border-amber-100/90 text-xs shadow-xs flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-800">{c.author}</span>
                                  <span className="text-[10px] text-slate-400">{c.time}</span>
                                </div>

                                {/* Nút Nhắn tin cho chủ bình luận */}
                                {user?._id !== c.authorId && (
                                  <button
                                    type="button"
                                    onClick={() => startChatWithUser({
                                      id: c.authorId || `comment-author-${idx}`,
                                      name: c.author,
                                      avatar: c.avatar,
                                      role: 'Thành Viên Bình Luận'
                                    })}
                                    className="opacity-0 group-hover/comment:opacity-100 inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2 py-0.5 rounded-lg transition-all"
                                    title={`Nhắn tin với ${c.author}`}
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Nhắn tin</span>
                                  </button>
                                )}
                              </div>
                              <p className="text-slate-600 text-xs leading-relaxed">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input gửi bình luận */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder={isAuthenticated ? "Góp ý hoặc hỏi bí quyết nấu nướng..." : "Đăng nhập để tham gia thảo luận..."}
                          disabled={!isAuthenticated}
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendComment(post._id);
                          }}
                          className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm border border-orange-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 placeholder-slate-400 shadow-inner"
                        />
                        <button
                          onClick={() => handleSendComment(post._id)}
                          disabled={!isAuthenticated || !commentInputs[post._id]?.trim()}
                          className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-orange-500/25 active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Gửi</span>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
