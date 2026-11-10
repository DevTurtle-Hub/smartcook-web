import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ChevronDown, Mic, Send, Square, Volume2, VolumeX, X, LoaderCircle } from 'lucide-react';
import { useCookingVoice } from '../../hooks/useCookingVoice';
import type { CookingVoiceReply, CookingVoiceRequest } from '../../api/cookingVoice.api';
import type { RecipeVideoCommand } from '../../utils/recipeVideoCommands';
import { parseRecipeVideoCommand } from '../../utils/recipeVideoCommands';

interface Props {
  recipeId: string;
  context: Omit<CookingVoiceRequest, 'userVoiceText' | 'conversationHistory'>;
  onAction: (reply: CookingVoiceReply) => void;
  onInteraction?: () => void;
  cookingActive?: boolean;
  onVideoCommand?: (command: RecipeVideoCommand) => string;
  videoVoiceTarget?: HTMLElement | null;
}

export function CookingVoiceAssistant({ recipeId, context, onAction, onInteraction, cookingActive, onVideoCommand, videoVoiceTarget }: Props) {
  const voice = useCookingVoice(context, recipeId, onAction, cookingActive, onVideoCommand);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [expanded, setExpanded] = useState(true);
  const [draft, setDraft] = useState('');
  const busy = voice.phase !== 'idle';
  const status = voice.phase === 'permission' ? 'Đang chờ quyền micro…'
    : voice.phase === 'recording' ? 'Đang nghe… Tự gửi khi bạn ngừng nói, hoặc bấm “Dừng và gửi” (tối đa 15 giây).'
    : voice.phase === 'transcribing' ? 'Đang nhận diện lời nói…'
    : voice.phase === 'thinking' ? 'Đang xử lý câu hỏi…'
    : voice.isSpeaking ? 'Đang đọc câu trả lời…' : 'Nói hoặc nhập để hỏi về món đang nấu';

  function toggleRecording() {
    if (voice.phase === 'recording') voice.stopRecording();
    else void voice.startRecording();
  }

  return (
    <section id="recipe-voice-assistant" aria-label="Trợ lý giọng nói nấu ăn" onFocusCapture={onInteraction} onPointerDownCapture={onInteraction} className="scroll-mt-28 rounded-2xl border border-emerald-200 bg-white shadow-sm overflow-hidden">
      {videoVoiceTarget && createPortal(
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/15 px-3 py-2.5 text-xs text-slate-200">
          <button type="button" disabled={!isAuthenticated || (busy && voice.phase !== 'recording')} onClick={toggleRecording}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
            {voice.phase === 'recording' ? <Square size={14} /> : <Mic size={14} />}
            {voice.phase === 'recording' ? 'Dừng và gửi' : 'Nói lệnh video'}
          </button>
          <a href="#recipe-voice-assistant" onClick={() => setExpanded(true)} className="font-semibold text-white underline underline-offset-4">
            Nhập lệnh
          </a>
          <span role="status" className="min-w-0 break-words">
            {voice.error || (busy ? status : voice.reply && parseRecipeVideoCommand(voice.transcript)
              ? voice.reply : 'Thử nói “Tua tới 30 giây” hoặc “Tạm dừng”.')}
          </span>
        </div>,
        videoVoiceTarget,
      )}
      <button type="button" aria-expanded={expanded} onClick={() => {
        if (expanded) voice.cancel();
        setExpanded(!expanded);
      }} className="flex w-full items-center justify-between gap-3 bg-emerald-50 p-4 text-left">
        <span className="flex items-center gap-3">
          <span className="rounded-xl bg-emerald-600 p-2 text-white"><Mic size={20} /></span>
          <span><span className="block font-extrabold text-emerald-900">Trợ lý giọng nói nấu ăn</span>
            <span className="block text-xs text-emerald-700">Bước {context.currentStep.stepNumber} · {context.recipeTitle}</span></span>
        </span>
        <ChevronDown size={18} className={expanded ? 'rotate-180 shrink-0' : 'shrink-0'} />
      </button>
      {expanded && <div className="space-y-4 p-4 sm:p-5">
        {!isAuthenticated && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><Link to="/auth/login" className="font-bold underline">Đăng nhập</Link> để nói bằng micro và hỏi AI. Bạn vẫn có thể nhập lệnh điều khiển video, chuyển bước hoặc chỉnh hẹn giờ.</p>}
        <p className="text-xs text-slate-500">Hỏi nguyên liệu, cách nấu, hoặc nói “Chuyển sang bước hai”, “Lùi bước”, “Thêm hai phút”, “Trừ hai phút”. Lệnh thời gian chỉnh hẹn giờ nấu của bước đang chọn.</p>
        {onVideoCommand && <p className="text-xs text-slate-500">
          Video: “Mở video hướng dẫn”, “Tua nhanh 30 giây”, “Tua lùi 1 phút”, “Phát chậm hơn”, “Tạm dừng” hoặc “Phát tiếp”.
        </p>}
        {(voice.transcript || voice.reply) && <div role="log" aria-live="polite" className="max-h-72 overflow-y-auto space-y-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">
          {voice.transcript && <div><p className="text-xs font-bold text-slate-500">BẠN</p><p className="whitespace-pre-wrap break-words">{voice.transcript}</p></div>}
          {voice.reply && <div><p className="text-xs font-bold text-emerald-700">BẾP TRƯỞNG AI</p><p className="whitespace-pre-wrap break-words text-emerald-900">{voice.reply}</p></div>}
        </div>}
        {voice.error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{voice.error}</p>}
        <div className="flex flex-wrap gap-2">
          {voice.quickReplies.map((text) => <button key={text} type="button" disabled={busy} onClick={() => void voice.send(text)}
            className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50">{text}</button>)}
        </div>
        <form onSubmit={(event) => {
          event.preventDefault();
          if (busy || !draft.trim()) return;
          void voice.send(draft);
          setDraft('');
        }} className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="cooking-voice-question" className="sr-only">Câu hỏi về món đang nấu</label>
            <textarea id="cooking-voice-question" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={600} rows={2}
              placeholder="Hoặc nhập câu hỏi cho AI…" disabled={busy}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50" />
          </div>
          <button type="submit" disabled={busy || !draft.trim()} className="mb-1 flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"><Send size={16} /> Gửi</button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" disabled={!isAuthenticated || (busy && voice.phase !== 'recording')} onClick={toggleRecording} className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white disabled:opacity-50 ${voice.phase === 'recording' ? 'bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {voice.phase === 'recording' ? <Square size={18} /> : busy ? <LoaderCircle size={18} className="animate-spin" /> : <Mic size={18} />}
            {voice.phase === 'recording' ? 'Dừng và gửi' : 'Chạm để nói'}
          </button>
          {voice.error && !busy && <button type="button" disabled={!isAuthenticated} onClick={() => void voice.startRecording(true)} className="text-xs font-semibold text-emerald-800 underline disabled:opacity-50">Ghi âm dự phòng qua AI</button>}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            {busy && <button type="button" onClick={voice.cancel} className="flex items-center gap-1"><X size={16} /> Hủy</button>}
            <button type="button" disabled={busy || !voice.reply} onClick={() => voice.isSpeaking ? voice.stopSpeech() : voice.speak(voice.reply)} className="flex items-center gap-1 disabled:opacity-40">
              {voice.isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}{voice.isSpeaking ? 'Dừng đọc' : 'Nghe lại'}
            </button>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={voice.readReplies} onChange={(event) => {
              voice.setReadReplies(event.target.checked);
              if (!event.target.checked) voice.stopSpeech();
            }} />Đọc câu trả lời</label>
          </div>
        </div>
        <p role="status" className="text-xs text-slate-500">{status}</p>
      </div>}
    </section>
  );
}
