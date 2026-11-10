export function isYouTubeVideoId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{11}$/.test(value);
}

export function parseYouTubeVideoUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) {
    return null;
  }

  const host = url.hostname;
  const path = url.pathname.replace(/\/$/, '');
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = path.slice(1);
  } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    id = path === '/watch'
      ? url.searchParams.get('v')
      : path.match(/^\/(?:shorts|live|embed)\/([^/]+)$/)?.[1] ?? null;
  } else if (['youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
    id = path.match(/^\/embed\/([^/]+)$/)?.[1] ?? null;
  }

  return isYouTubeVideoId(id) ? id : null;
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
}
