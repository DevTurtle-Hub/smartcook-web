import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) => string;
  error: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) => string;
  warning: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) => string;
  info: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Global dispatcher for non-react calls (e.g. Axios interceptors)
let globalShowToast: ((toast: Omit<ToastItem, 'id'>) => string) | null = null;

export const toast = {
  success: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
    globalShowToast?.({ type: 'success', message, ...options }),
  error: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
    globalShowToast?.({ type: 'error', message, ...options }),
  warning: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
    globalShowToast?.({ type: 'warning', message, ...options }),
  info: (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
    globalShowToast?.({ type: 'info', message, ...options }),
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const duration = item.duration ?? 4000;

      const newToast: ToastItem = { ...item, id, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Bind global helper
  globalShowToast = showToast;

  const success = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
      showToast({ type: 'success', message, ...options }),
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
      showToast({ type: 'error', message, ...options }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
      showToast({ type: 'warning', message, ...options }),
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<Omit<ToastItem, 'id' | 'type' | 'message'>>) =>
      showToast({ type: 'info', message, ...options }),
    [showToast]
  );

  const contextValue = useMemo(
    () => ({ toasts, showToast, removeToast, success, error, warning, info }),
    [toasts, showToast, removeToast, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Container rendered at top-right
const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onRemove={() => onRemove(item.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{
  item: ToastItem;
  onRemove: () => void;
}> = ({ item, onRemove }) => {
  const config = {
    success: {
      bg: 'bg-emerald-50/95 border-emerald-300 text-emerald-900',
      iconBg: 'bg-emerald-500 text-white',
      badge: 'Thành công',
      bar: 'bg-emerald-500',
      Icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-50/95 border-rose-300 text-rose-900',
      iconBg: 'bg-rose-500 text-white',
      badge: 'Lỗi',
      bar: 'bg-rose-500',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50/95 border-amber-300 text-amber-900',
      iconBg: 'bg-amber-500 text-white',
      badge: 'Lưu ý',
      bar: 'bg-amber-500',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-sky-50/95 border-sky-300 text-sky-900',
      iconBg: 'bg-sky-500 text-white',
      badge: 'Thông tin',
      bar: 'bg-sky-500',
      Icon: Info,
    },
  }[item.type];

  const IconComponent = config.Icon;

  return (
    <div
      role="alert"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md p-3.5 transition-all duration-300 animate-in slide-in-from-top-3 fade-in flex items-start gap-3 ${config.bg}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${config.iconBg}`}>
        <IconComponent className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider opacity-75">
            {item.title || config.badge}
          </span>
        </div>
        <p className="text-xs font-semibold leading-relaxed break-words">{item.message}</p>

        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick();
              onRemove();
            }}
            className="mt-2 text-xs font-black underline hover:opacity-80 transition-opacity"
          >
            {item.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
        title="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress timer bar */}
      {item.duration && item.duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${config.bar} opacity-60 animate-[progress_linear_forwards]`}
          style={{ animationDuration: `${item.duration}ms` }}
        />
      )}
    </div>
  );
};
