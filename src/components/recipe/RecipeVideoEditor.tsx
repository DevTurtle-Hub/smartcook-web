import { useId, useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Video } from 'lucide-react';
import { recipeApi } from '../../api/recipe.api';
import { parseYouTubeVideoUrl, youTubeWatchUrl } from '../../utils/youtubeVideo';

interface RecipeVideoEditorProps {
  recipeId: string;
  youtubeVideoId?: string | null;
  onSaved: (id: string | null) => void;
}

export function RecipeVideoEditor({ recipeId, youtubeVideoId, onSaved }: RecipeVideoEditorProps) {
  const fieldId = useId();
  const savedUrl = youtubeVideoId ? youTubeWatchUrl(youtubeVideoId) : '';
  const [url, setUrl] = useState(savedUrl);
  const [invalid, setInvalid] = useState(false);
  const queryClient = useQueryClient();
  const saveVideo = useMutation({
    mutationFn: (id: string | null) => recipeApi.updateRecipe(recipeId, { youtubeVideoId: id }),
    onSuccess: (recipe) => {
      const id = recipe.youtubeVideoId ?? null;
      setUrl(id ? youTubeWatchUrl(id) : '');
      onSaved(id);
      void queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveVideo.isPending) return;
    const id = parseYouTubeVideoUrl(url);
    if (url.trim() && !id) {
      setInvalid(true);
      return;
    }
    if (id === (youtubeVideoId ?? null)) {
      setUrl(savedUrl);
      return;
    }
    saveVideo.mutate(id);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 rounded-lg border border-slate-200 bg-white p-4">
      <label htmlFor={fieldId} className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Video aria-hidden="true" className="size-4 text-orange-600" /> Video hướng dẫn
      </label>
      <input
        id={fieldId}
        type="text"
        inputMode="url"
        autoComplete="off"
        maxLength={2048}
        value={url}
        disabled={saveVideo.isPending}
        onChange={(event) => {
          setUrl(event.target.value);
          setInvalid(false);
          saveVideo.reset();
        }}
        placeholder="https://youtu.be/…"
        aria-invalid={invalid}
        aria-describedby={`${fieldId}-help${invalid ? ` ${fieldId}-error` : ''}`}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-2 focus:outline-orange-500 aria-invalid:border-rose-500"
      />
      <p id={`${fieldId}-help`} className="text-xs leading-relaxed text-slate-600">
        Dán liên kết đến một video YouTube. Để gỡ video, xóa liên kết rồi lưu.
      </p>
      {invalid && <p id={`${fieldId}-error`} role="alert" className="text-xs font-medium text-rose-700">Nhập liên kết đến một video YouTube hợp lệ.</p>}
      {saveVideo.isError && <p role="alert" className="text-xs font-medium text-rose-700">Chưa lưu được video. Vui lòng thử lại.</p>}
      {saveVideo.isSuccess && <p role="status" className="text-xs font-medium text-emerald-700">{youtubeVideoId ? 'Đã lưu video hướng dẫn.' : 'Đã gỡ video hướng dẫn.'}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saveVideo.isPending || url.trim() === savedUrl}
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {saveVideo.isPending ? 'Đang lưu…' : 'Lưu video'}
        </button>
        {savedUrl && (
          <a href={savedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:underline">
            Mở video hiện tại <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
        )}
      </div>
    </form>
  );
}
