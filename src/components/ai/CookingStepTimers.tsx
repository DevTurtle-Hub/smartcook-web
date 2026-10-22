import { Clock, Pause, Play, RotateCcw, Timer } from 'lucide-react';
import type { CookingTimerInput, CookingTimerState } from '../../utils/cookingTimer';

interface Props {
  timer: CookingTimerState;
  stepNumber: number;
  nextStepNumber?: number;
  onAction: (action: CookingTimerInput) => void;
  onConfirm: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const clock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export function CookingStepTimers({ timer, stepNumber, nextStepNumber, onAction, onConfirm, onNext, onPrevious }: Props) {
  const running = timer.status === 'running';
  const confirmed = timer.status === 'confirmed';
  const advancing = timer.graceDeadlineMs !== null;
  const progress = timer.initialSeconds ? Math.min(100, Math.max(0, (1 - timer.remainingSeconds / timer.initialSeconds) * 100)) : 0;
  const status = running ? 'Đang đếm' : confirmed ? 'Đã xác nhận xong'
    : timer.status === 'expired' ? 'Hết giờ — kiểm tra món ăn'
    : timer.status === 'paused' ? 'Tạm dừng' : 'Chờ bắt đầu';

  return (
    <section aria-label="Hẹn giờ và tự chuyển bước" className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-orange-800"><Timer size={18} />Hẹn giờ nấu · Bước {stepNumber}</h4>
          <span className="text-xs text-slate-500">{status}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p role="timer" aria-label={`Thời gian nấu bước ${stepNumber}`} className="font-mono text-4xl font-black tracking-wider text-orange-600">{clock(timer.remainingSeconds)}</p>
          <div className="flex gap-2">
            <button type="button" aria-label={running ? 'Tạm dừng hẹn giờ' : 'Bắt đầu hẹn giờ'}
              disabled={!timer.remainingSeconds || confirmed}
              onClick={() => onAction({ type: 'toggle' })}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-40">
              {running ? <Pause size={16} /> : <Play size={16} />}{running ? 'Tạm dừng' : timer.status === 'paused' ? 'Tiếp tục' : 'Bắt đầu'}
            </button>
            <button type="button" aria-label="Đặt lại thời gian của bước" onClick={() => onAction({ type: 'reset' })}
              className="rounded-xl border border-slate-200 px-3 text-slate-600 hover:bg-slate-50"><RotateCcw size={16} /></button>
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-orange-100"><div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="flex flex-wrap items-center gap-2">
          {[30, 60, 300].map((seconds) => <button type="button" key={seconds} onClick={() => onAction({ type: 'adjust', seconds })}
            className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-50">+{seconds < 60 ? `${seconds}s` : `${seconds / 60}p`}</button>)}
          <button type="button" disabled={timer.stepIndex === 0} onClick={onPrevious} className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs disabled:opacity-40">Bước trước</button>
          <button type="button" onClick={onConfirm} disabled={confirmed && nextStepNumber === undefined}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40">
            {confirmed ? nextStepNumber === undefined ? 'Đã xong bước cuối' : 'Qua ngay' : nextStepNumber === undefined ? 'Xong bước cuối' : 'Đã xong bước này'}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-slate-500" aria-live="polite">
          {timer.status === 'expired' ? 'Hết thời gian dự kiến. Kiểm tra món ăn, thêm thời gian nếu cần hoặc xác nhận đã xong bước.'
            : confirmed ? 'Thêm thời gian hoặc đặt lại đồng hồ sẽ hủy đếm chuyển bước.'
            : timer.initialSeconds ? 'Đồng hồ lấy thời lượng từ công thức. Hết giờ không tự xác nhận món đã chín.'
            : 'Bước này chưa có thời lượng. Bấm thêm thời gian hoặc xác nhận khi làm xong.'}
        </p>
      </div>
      <div className="space-y-3 border-t border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-emerald-900">
          <input type="checkbox" checked={timer.autoEnabled} onChange={(event) => onAction({ type: 'auto', enabled: event.target.checked })} className="accent-emerald-600" />
          Tự chuyển bước sau khi xác nhận xong
        </label>
        {timer.autoEnabled ? <>
          <div className="flex flex-wrap items-center gap-3">
            <div role="status" className="flex flex-1 flex-wrap items-center gap-2 text-sm text-emerald-900">
              <Clock size={16} />
              {nextStepNumber === undefined ? 'Bước cuối — xác nhận hoàn thành món khi đã sẵn sàng'
                : confirmed ? <><span>{advancing ? `Qua Bước ${nextStepNumber} sau:` : 'Đã tạm dừng chuyển:'}</span>
                  <span role="timer" aria-label="Thời gian chờ chuyển bước" className="font-mono text-2xl font-black">{clock(timer.graceSeconds)}</span></>
                : 'Chờ bạn xác nhận đã xong bước'}
            </div>
            {confirmed && nextStepNumber !== undefined && <button type="button" onClick={() => onAction({ type: 'toggleGrace' })}
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800">{advancing ? 'Dừng đếm chuyển' : 'Tiếp tục đếm chuyển'}</button>}
            {nextStepNumber !== undefined && <button type="button" onClick={onNext} className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-bold text-white">Qua ngay</button>}
          </div>
          {confirmed && nextStepNumber !== undefined && <div className="h-1 overflow-hidden rounded-full bg-emerald-100"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${(1 - timer.graceSeconds / timer.delaySeconds) * 100}%` }} /></div>}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-900">
            <span>Chờ sau xác nhận:</span>
            {[15, 30, 60, 120].map((seconds) => <button type="button" key={seconds} aria-pressed={timer.delaySeconds === seconds}
              onClick={() => onAction({ type: 'delay', seconds })}
              className={`rounded-lg border px-2.5 py-1.5 font-semibold ${timer.delaySeconds === seconds ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-200 bg-white'}`}>{seconds < 60 ? `${seconds}s` : `${seconds / 60} phút`}</button>)}
          </div>
        </> : <p className="text-xs text-emerald-800">Bật để đếm 15 giây, 30 giây, 1 phút hoặc 2 phút trước khi qua bước tiếp theo. Chỉ đếm sau khi bạn xác nhận đã xong.</p>}
      </div>
    </section>
  );
}
