import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { ArrowUpRight, Play, Search, Video, X } from 'lucide-react';
import { handleImageError, resolveRecipeImage } from '../../utils/imageFallback';
import { isYouTubeVideoId, youTubeWatchUrl } from '../../utils/youtubeVideo';
import type { RecipeVideoCommand } from '../../utils/recipeVideoCommands';
import { controlYouTubeVideo, loadYouTubePlayer, type YouTubePlayer } from '../../utils/youtubePlayer';

export interface RecipeVideoControls {
  run(command: RecipeVideoCommand): string;
}

interface RecipeVideoGuideProps {
  title: string;
  image: string;
  youtubeVideoId?: string | null;
  ref?: Ref<RecipeVideoControls>;
  onVoiceTarget: (node: HTMLDivElement | null) => void;
}

export function RecipeVideoGuide({ title, image, youtubeVideoId, ref, onVoiceTarget }: RecipeVideoGuideProps) {
  const [opened, setOpened] = useState(false);
  const [notice, setNotice] = useState('');
  const [unavailable, setUnavailable] = useState(false);
  const section = useRef<HTMLElement>(null);
  const playerHost = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const focusFrame = useRef(false);
  const videoId = isYouTubeVideoId(youtubeVideoId) ? youtubeVideoId : null;
  const watchUrl = videoId ? youTubeWatchUrl(videoId) : null;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`cách làm ${title}`)}`;

  useEffect(() => {
    const host = playerHost.current;
    if (!opened || !videoId || !host) return;

    const frame = document.createElement('iframe');
    const params = new URLSearchParams({
      autoplay: '1', playsinline: '1', rel: '0', enablejsapi: '1', origin: window.location.origin,
    });
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
    frame.title = `Video hướng dẫn món ${title} trên YouTube`;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.className = 'block aspect-video min-h-[200px] w-full border-0';
    host.append(frame);
    if (focusFrame.current) frame.focus();

    let active = true;
    let instance: YouTubePlayer | undefined;
    const controlsUnavailable = () => {
      if (!active) return;
      setUnavailable(true);
      setNotice('Chưa kết nối được điều khiển giọng nói. Bạn vẫn có thể dùng nút trên trình phát hoặc mở video trên YouTube.');
    };
    const readyTimeout = window.setTimeout(controlsUnavailable, 12000);
    void loadYouTubePlayer().then((api) => {
      if (!active) return;
      instance = new api.Player(frame, {
        events: {
          onReady: ({ target }) => {
            if (!active) return;
            window.clearTimeout(readyTimeout);
            player.current = target;
            setUnavailable(false);
            if (!focusFrame.current) target.playVideo();
          },
          onStateChange: ({ data }) => {
            if (active && data === 1) setNotice('');
          },
          onError: () => {
            if (!active) return;
            window.clearTimeout(readyTimeout);
            player.current = null;
            setUnavailable(true);
            setNotice('YouTube không phát được video tại đây. Bạn có thể thử mở video trực tiếp trên YouTube.');
          },
          onAutoplayBlocked: () => {
            if (active) setNotice('Trình duyệt yêu cầu thao tác trực tiếp. Hãy bấm nút Phát trong khung video.');
          },
        },
      });
    }).catch(() => {
      window.clearTimeout(readyTimeout);
      controlsUnavailable();
    });

    return () => {
      active = false;
      window.clearTimeout(readyTimeout);
      player.current = null;
      instance?.destroy();
      frame.remove();
    };
  }, [opened, title, videoId]);

  function openVideo(fromButton: boolean) {
    focusFrame.current = fromButton;
    setNotice('');
    setUnavailable(false);
    setOpened(true);
  }

  function closeVideo() {
    setOpened(false);
  }

  useImperativeHandle(ref, () => ({
    run(command) {
      if (command.type === 'ignore') return 'Mình giữ nguyên video nhé.';
      if (command.type === 'invalid-time') return 'Bạn muốn tua bao lâu? Ví dụ, “tua tới 30 giây” hoặc “tua lùi một phút”.';
      if (command.type === 'open') section.current?.scrollIntoView({ block: 'start' });
      if (!videoId) return 'Món này chưa có clip đính kèm. Bạn có thể tìm theo tên món ở mục Video hướng dẫn.';
      if (command.type === 'close') {
        closeVideo();
        return opened ? 'Mình đã đóng video.' : 'Video đang đóng.';
      }
      if (!opened) {
        if (command.type !== 'open' && command.type !== 'play') return 'Bạn hãy nói “mở video hướng dẫn” trước nhé.';
        section.current?.scrollIntoView({ block: 'start' });
        openVideo(false);
        return 'Mình đã mở trình phát video hướng dẫn.';
      }
      if (!player.current) return unavailable
        ? 'Chưa kết nối được điều khiển giọng nói. Bạn có thể dùng nút trên trình phát.'
        : 'Trình phát đang tải. Bạn thử lại sau giây lát nhé.';
      return controlYouTubeVideo(player.current, command) ?? 'Bạn hãy nói lại lệnh điều khiển video nhé.';
    },
  }));

  return (
    <section
      id="recipe-video"
      ref={section}
      tabIndex={-1}
      aria-labelledby="recipe-video-heading"
      className="scroll-mt-28 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm focus-visible:outline-2 focus-visible:outline-orange-500 sm:p-5"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-700">
          <Video aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 id="recipe-video-heading" className="font-heading text-base font-extrabold text-slate-900 sm:text-lg">
            Video hướng dẫn
          </h2>
          <p className="text-xs leading-relaxed text-slate-600">Xem cách làm trước khi bắt đầu nấu.</p>
        </div>
      </div>

      {videoId && watchUrl ? (
        <>
          {opened ? (
            <div className="mt-4 overflow-hidden rounded-xl bg-slate-950">
              <div className="flex items-center justify-between gap-2 px-3 py-2 text-white">
                <span className="px-1 text-xs font-semibold">Đang xem trên YouTube</span>
                <button
                  type="button"
                  onClick={() => {
                    closeVideo();
                    requestAnimationFrame(() => playButton.current?.focus());
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <X aria-hidden="true" className="size-4" /> Đóng video
                </button>
              </div>
              <div ref={playerHost} />
              {notice && <p role="status" className="px-4 py-3 text-xs text-orange-100">{notice}</p>}
              <div ref={onVoiceTarget} />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 rounded-xl bg-orange-50/60 p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-center sm:gap-5">
              <button
                ref={playButton}
                type="button"
                onClick={() => openVideo(true)}
                aria-label={`Phát video hướng dẫn món ${title}`}
                className="group relative grid aspect-video w-full place-items-center overflow-hidden rounded-lg bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                <img
                  src={resolveRecipeImage(image, title)}
                  onError={(event) => handleImageError(event, resolveRecipeImage(null, title))}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="absolute inset-0 bg-slate-950/35" aria-hidden="true" />
                <span className="relative grid size-12 place-items-center rounded-full bg-orange-600 text-white shadow-lg ring-4 ring-white/30 transition-colors group-hover:bg-orange-700">
                  <Play aria-hidden="true" className="ml-0.5 size-5 fill-current" />
                </span>
                <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/80 px-2 py-1 text-[10px] font-bold text-white">
                  YouTube
                </span>
              </button>
              <div className="space-y-1">
                <p className="text-xs font-bold text-orange-700">Video tham khảo</p>
                <p className="text-sm font-extrabold leading-snug text-slate-900 sm:text-base">{title}</p>
                <p className="text-xs leading-relaxed text-slate-600">
                  Nguyên liệu và cách làm trong video có thể khác đôi chút so với công thức SmartCook.
                </p>
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-xs text-slate-600">Nếu trình phát gặp lỗi, bạn có thể mở video trực tiếp.</p>
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Mở trên YouTube <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
          <p className="text-xs leading-relaxed text-slate-600">Công thức này chưa có video đính kèm.</p>
          <a href={searchUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Search aria-hidden="true" className="size-3.5" /> Tìm video trên YouTube
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      )}
    </section>
  );
}

const linkClass = 'inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600';
