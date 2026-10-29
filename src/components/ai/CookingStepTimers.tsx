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

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export function CookingStepTimers({
  timer,
  stepNumber,
  nextStepNumber,
  onAction,
  onConfirm,
  onNext,
  onPrevious,
}: Props) {
  const running = timer.status === 'running';
  const confirmed = timer.status === 'confirmed';
  const advancing = timer.graceDeadlineMs !== null;
  const progress = timer.initialSeconds
    ? Math.min(100, Math.max(0, (1 - timer.remainingSeconds / timer.initialSeconds) * 100))
    : 0;

  const status = running
    ? 'Đang đếm'
    : confirmed
    ? 'Đã xác nhận xong'
    : timer.status === 'expired'
    ? 'Hết giờ nấu'
    : timer.status === 'paused'
    ? 'Tạm dừng'
    : 'Chờ bắt đầu';

  return (
    <section
      aria-label="Hẹn giờ và tự chuyển bước"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs"
    >
      {/* 1. KHU VỰC HẸN GIỜ NẤU - TỐI GIẢN MÀU SẮC */}
      <div className="space-y-4 p-4 sm:p-5">
        {/* Tiêu đề & Trạng thái (Text trung tính, không dùng huy hiệu màu) */}
        <div className="flex items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Timer className="w-4 h-4 text-slate-600" />
            <span>Hẹn giờ nấu · Bước {stepNumber}</span>
          </h4>
          <span className="text-xs font-medium text-slate-500">{status}</span>
        </div>

        {/* Số đếm thời gian (Màu đen tinh tế) & Cụm nút Bắt đầu / Reset */}
        <div className="flex items-center justify-between gap-4">
          <p
            role="timer"
            aria-label={`Thời gian nấu bước ${stepNumber}`}
            className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            {clock(timer.remainingSeconds)}
          </p>

          <div className="flex items-center gap-2">
            {/* Nút chính Bắt đầu / Tạm dừng (Duy nhất 1 màu cam chủ đạo của trang) */}
            <button
              type="button"
              aria-label={running ? 'Tạm dừng hẹn giờ' : 'Bắt đầu hẹn giờ'}
              disabled={!timer.remainingSeconds || confirmed}
              onClick={() => onAction({ type: 'toggle' })}
              className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 shadow-xs transition-all active:scale-95 disabled:opacity-40"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{running ? 'Tạm dừng' : timer.status === 'paused' ? 'Tiếp tục' : 'Bắt đầu'}</span>
            </button>

            {/* Nút đặt lại (Màu trắng viền xám trung tính) */}
            <button
              type="button"
              aria-label="Đặt lại thời gian của bước"
              onClick={() => onAction({ type: 'reset' })}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
              title="Đặt lại thời gian"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thanh tiến trình thời gian nấu */}
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-orange-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Phím bấm thời gian nhanh (+30s, +1p, +5p) & Nút xác nhận bước */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <div className="flex items-center gap-1.5">
            {[30, 60, 300].map((seconds) => (
              <button
                type="button"
                key={seconds}
                onClick={() => onAction({ type: 'adjust', seconds })}
                className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all active:scale-95"
              >
                +{seconds < 60 ? `${seconds}s` : `${seconds / 60}p`}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              disabled={timer.stepIndex === 0}
              onClick={onPrevious}
              className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all disabled:opacity-40"
            >
              Bước trước
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmed && nextStepNumber === undefined}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all disabled:opacity-40 active:scale-95 ${
                confirmed
                  ? 'border border-slate-200 bg-slate-100 text-slate-700'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
              }`}
            >
              {confirmed
                ? nextStepNumber === undefined
                  ? 'Đã xong bước cuối'
                  : 'Qua ngay'
                : nextStepNumber === undefined
                ? 'Xong bước cuối'
                : 'Đã xong bước này'}
            </button>
          </div>
        </div>

        {/* Chú thích hướng dẫn (Xám nhạt) */}
        <p className="text-xs leading-relaxed text-slate-400" aria-live="polite">
          {timer.status === 'expired'
            ? 'Hết thời gian dự kiến. Kiểm tra món ăn, thêm thời gian nếu cần hoặc xác nhận đã xong bước.'
            : confirmed
            ? 'Thêm thời gian hoặc đặt lại đồng hồ sẽ hủy đếm chuyển bước.'
            : timer.initialSeconds
            ? 'Đồng hồ lấy thời lượng từ công thức. Hết giờ không tự xác nhận món đã chín.'
            : 'Bước này chưa có thời lượng. Bấm thêm thời gian hoặc xác nhận khi làm xong.'}
        </p>
      </div>

      {/* 2. KHU VỰC TỰ CHUYỂN BƯỚC (NỀN TRẮNG/XÁM TRUNG TÍNH, KHÔNG DÙNG XANH LÁ HOẶC ĐA MÀU) */}
      <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5">
        <label className="flex cursor-pointer items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 select-none">
          <input
            type="checkbox"
            checked={timer.autoEnabled}
            onChange={(event) => onAction({ type: 'auto', enabled: event.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400 accent-slate-800 cursor-pointer"
          />
          <span>Tự chuyển bước sau khi xác nhận xong</span>
        </label>

        {timer.autoEnabled ? (
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="status" className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                {nextStepNumber === undefined ? (
                  <span className="text-slate-600">Bước cuối — xác nhận hoàn thành món khi đã sẵn sàng</span>
                ) : confirmed ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">
                      {advancing ? `Qua Bước ${nextStepNumber} sau:` : 'Đã tạm dừng chuyển:'}
                    </span>
                    <span
                      role="timer"
                      aria-label="Thời gian chờ chuyển bước"
                      className="font-mono text-xl sm:text-2xl font-black text-slate-900"
                    >
                      {clock(timer.graceSeconds)}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-500">Chờ bạn xác nhận đã xong bước</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {confirmed && nextStepNumber !== undefined && (
                  <button
                    type="button"
                    onClick={() => onAction({ type: 'toggleGrace' })}
                    className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors"
                  >
                    {advancing ? 'Dừng đếm chuyển' : 'Tiếp tục đếm'}
                  </button>
                )}
                {nextStepNumber !== undefined && (
                  <button
                    type="button"
                    onClick={onNext}
                    className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 text-xs font-semibold transition-all shadow-xs"
                  >
                    Qua ngay
                  </button>
                )}
              </div>
            </div>

            {/* Thanh tiến trình chuyển bước */}
            {confirmed && nextStepNumber !== undefined && (
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-slate-700 transition-all duration-300 rounded-full"
                  style={{ width: `${(1 - timer.graceSeconds / timer.delaySeconds) * 100}%` }}
                />
              </div>
            )}

            {/* Các tùy chọn thời gian chờ đếm (Đen & Xám trung tính) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
              <span className="text-slate-500">Chờ sau xác nhận:</span>
              {[15, 30, 60, 120].map((seconds) => (
                <button
                  type="button"
                  key={seconds}
                  aria-pressed={timer.delaySeconds === seconds}
                  onClick={() => onAction({ type: 'delay', seconds })}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    timer.delaySeconds === seconds
                      ? 'border border-slate-800 bg-slate-800 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {seconds < 60 ? `${seconds}s` : `${seconds / 60}p`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed">
            Bật để đếm 15 giây, 30 giây, 1 phút hoặc 2 phút trước khi qua bước tiếp theo. Chỉ đếm sau khi bạn xác nhận đã xong.
          </p>
        )}
      </div>
    </section>
  );
}
