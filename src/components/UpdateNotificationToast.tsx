import React, { useState, useEffect } from "react";
import { Sparkles, X, ArrowRight, BellRing } from "lucide-react";

interface UpdateNotificationToastProps {
  onNavigateArticle: (id: string) => void;
}

const UPDATE_STORAGE_KEY = "stm32_update_notification_v2026_1";

export const UpdateNotificationToast: React.FC<UpdateNotificationToastProps> = ({
  onNavigateArticle,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed this specific update
    const isDismissed = localStorage.getItem(UPDATE_STORAGE_KEY);
    if (!isDismissed) {
      // Delay showing by 1.2s for smooth entrance after page loads
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(UPDATE_STORAGE_KEY, "true");
    }, 250);
  };

  const handleViewUpdate = () => {
    handleDismiss();
    onNavigateArticle("hardware");
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Aviso de atualização do guia"
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-[380px] transition-all duration-300 ease-out transform ${
        isDismissing
          ? "opacity-0 translate-y-4 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-5"
      }`}
    >
      <div className="relative p-4 rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-blue-200 dark:border-blue-900/60 shadow-xl shadow-slate-900/10 dark:shadow-black/40 ring-1 ring-blue-500/10">
        {/* Glowing badge header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-blue-400"></span>
            </span>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200/70 dark:border-blue-800/60">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>Nova Atualização</span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Dispensar aviso"
            aria-label="Fechar notificação de atualização"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-2.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100 dark:border-blue-900/40">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              Novo Guia Visual de Hardware!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Confira a nova aba com o diagrama visual de ligação do <span className="font-semibold text-slate-800 dark:text-slate-200">ST-Link V2</span>, pinout completo da <span className="font-semibold text-slate-800 dark:text-slate-200">Blue Pill</span> e explicação dos jumpers BOOT.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleDismiss}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Depois
          </button>

          <button
            onClick={handleViewUpdate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Ver atualização</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
