import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Store, X } from 'lucide-react';
import { NearbyStoresPanel, type ShoppingIngredient } from './NearbyStoresPanel';

interface NearbySupermarketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  neededIngredients?: ShoppingIngredient[];
}

export function NearbySupermarketsModal({ isOpen, onClose, neededIngredients }: NearbySupermarketsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], select, input, iframe, [tabindex="0"]') || []);
      if (!controls.length) { event.preventDefault(); return; }
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); previousFocus?.focus(); };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-5" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="nearby-stores-title" className="w-full max-w-6xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-white shadow-2xl outline-none">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-white/95 backdrop-blur px-5 py-4 border-b border-slate-100">
          <h2 id="nearby-stores-title" className="text-base font-bold text-slate-900 flex items-center gap-2"><Store className="w-5 h-5 text-orange-500" />Siêu thị gần bạn</h2>
          <button onClick={onClose} aria-label="Đóng bản đồ siêu thị" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 sm:p-6"><NearbyStoresPanel neededIngredients={neededIngredients} /></div>
      </div>
    </div>, document.body,
  );
}
