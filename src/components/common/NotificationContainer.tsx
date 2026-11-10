import React from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { Zap, Award, CheckCircle, Info, X } from 'lucide-react';

export const NotificationContainer: React.FC = () => {
  const { toasts, dismissToast } = useDetective();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isXP = toast.type === 'xp';
        const isBadge = toast.type === 'badge';
        const isCase = toast.type === 'case';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-900/95 p-3.5 shadow-xl shadow-black/40 backdrop-blur transition transform translate-y-0"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                isBadge
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : isCase
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isXP
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-slate-700/40 text-slate-300'
              }`}
            >
              {isBadge ? (
                <Award className="h-4 w-4" />
              ) : isCase ? (
                <CheckCircle className="h-4 w-4" />
              ) : isXP ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Info className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white truncate">{toast.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 transition"
              aria-label="Tutup notifikasi"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
