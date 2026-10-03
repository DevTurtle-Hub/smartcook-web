import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home, Sparkles } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[SmartCook ErrorBoundary Caught Error]:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleGoHome = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl border border-rose-200/80 p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Header Icon */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight font-heading">
                  Đã xảy ra sự cố giao diện
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  SmartCook đã bảo vệ phiên làm việc của bạn để tránh mất dữ liệu.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 text-xs space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-rose-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chi tiết lỗi hệ thống:</span>
              </p>
              <p className="font-mono text-[11px] bg-white/80 p-2.5 rounded-xl border border-rose-200/60 break-words max-h-32 overflow-y-auto">
                {this.state.error?.message || 'Lỗi không xác định trong quá trình kết xuất trang.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-1/2 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-1/2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-colors"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
