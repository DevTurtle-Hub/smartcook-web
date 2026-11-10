import type { RecipeVideoCommand } from './recipeVideoCommands';

export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlaybackRate(): number;
  getAvailablePlaybackRates(): number[];
  setPlaybackRate(rate: number): void;
  destroy(): void;
}

type PlayerEvent = { target: YouTubePlayer };
interface YouTubeAPI {
  Player: new (frame: HTMLIFrameElement, options: {
    events: {
      onReady(event: PlayerEvent): void;
      onStateChange(event: PlayerEvent & { data: number }): void;
      onError(event: PlayerEvent & { data: number }): void;
      onAutoplayBlocked(event: PlayerEvent): void;
    };
  }) => YouTubePlayer;
}

type YouTubeWindow = Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
let apiRequest: Promise<YouTubeAPI> | undefined;

export function loadYouTubePlayer(): Promise<YouTubeAPI> {
  const host = window as YouTubeWindow;
  if (host.YT?.Player) return Promise.resolve(host.YT);
  if (apiRequest) return apiRequest;

  apiRequest = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    const previousReady = host.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(fail, 10000);

    function cleanup() {
      window.clearTimeout(timeout);
      script.onerror = null;
      if (host.onYouTubeIframeAPIReady === ready) host.onYouTubeIframeAPIReady = previousReady;
    }

    function fail() {
      cleanup();
      script.remove();
      apiRequest = undefined;
      reject(new Error('YouTube Player API unavailable'));
    }

    function ready() {
      if (!host.YT?.Player) {
        fail();
        return;
      }
      cleanup();
      resolve(host.YT);
      previousReady?.();
    }

    host.onYouTubeIframeAPIReady = ready;
    script.onerror = fail;
    document.head.append(script);
  });
  return apiRequest;
}

export function controlYouTubeVideo(player: YouTubePlayer, command: RecipeVideoCommand): string | null {
  if (command.type === 'play' || command.type === 'open') {
    player.playVideo();
    return 'Mình phát video nhé.';
  }
  if (command.type === 'pause') {
    player.pauseVideo();
    return 'Mình đã tạm dừng video.';
  }
  if (command.type === 'seek') {
    const duration = player.getDuration();
    const current = player.getCurrentTime();
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(current)) {
      return 'Video đang tải. Bạn hãy thử tua lại sau giây lát.';
    }
    const position = Math.min(duration, Math.max(0, current + command.seconds));
    player.seekTo(position, true);
    const wholeSeconds = Math.floor(position);
    const time = `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
    return `Mình tua video đến khoảng ${time}.`;
  }
  if (command.type === 'rate') {
    const rate = player.getPlaybackRate();
    const rates = player.getAvailablePlaybackRates().slice().sort((a, b) => a - b);
    const next = command.direction === 'normal' ? 1 : command.direction === 'faster'
      ? rates.find((item) => item > rate)
      : rates.reverse().find((item) => item < rate);
    if (next === undefined || !rates.includes(next)) return 'Video không có mức tốc độ phù hợp. Bạn có thể tua tới hoặc lùi theo giây.';
    if (next === rate) return 'Video đang ở tốc độ bình thường.';
    player.setPlaybackRate(next);
    return `Mình đặt tốc độ phát ${next.toLocaleString('vi-VN')} lần.`;
  }
  return null;
}
