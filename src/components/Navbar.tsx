import React, { useState } from "react";
import {
  Cpu,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Share2,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Github,
} from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  onToggleSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapseSidebar?: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  mobileMenuOpen,
  onToggleSidebar,
  isSidebarCollapsed = false,
  onToggleCollapseSidebar,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle (Mobile only & Desktop Collapse/Expand) + Logo / Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile drawer toggle (hidden when in focus mode) */}
          {!isFocusMode && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex lg:hidden items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
              aria-label="Alternar menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Desktop expand/diminish toggle (hidden when in focus mode) */}
          {!isFocusMode && onToggleCollapseSidebar && (
            <button
              onClick={onToggleCollapseSidebar}
              className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 items-center justify-center cursor-pointer"
              title={
                isSidebarCollapsed
                  ? "Expandir barra lateral (Ctrl+B)"
                  : "Diminuir barra lateral (Ctrl+B)"
              }
              aria-label={
                isSidebarCollapsed ? "Expandir barra lateral" : "Diminuir barra lateral"
              }
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          )}

          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  STM32 no Ubuntu
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 rounded">
                  Blue Pill
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight hidden sm:block">
                STM32CubeIDE & STM32CubeMX
              </p>
            </div>
          </a>
        </div>

        {/* Center: Search Trigger */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-xl transition-all shadow-2xs group"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="truncate">Pesquisar na documentação...</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Focus Reading Mode Button */}
          <button
            onClick={onToggleFocusMode}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer border ${
              isFocusMode
                ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700/80 shadow-2xs ring-2 ring-blue-500/20"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
            title={
              isFocusMode
                ? "Sair do modo foco de leitura (Alt+F)"
                : "Ativar modo foco de leitura: remove barras laterais e expande o texto (Alt+F)"
            }
            aria-label={isFocusMode ? "Sair do modo foco" : "Ativar modo foco de leitura"}
            aria-pressed={isFocusMode}
          >
            <BookOpen className={`w-4 h-4 ${isFocusMode ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`} />
            <span className="hidden sm:inline">
              {isFocusMode ? "Sair do Foco" : "Modo Foco"}
            </span>
          </button>

          {/* Share button with Copied message feedback */}
          <div className="relative flex items-center">
            <button
              onClick={handleShare}
              className={`px-2.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                copiedShare
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
              }`}
              title="Compartilhar link"
              aria-label="Compartilhar link da página"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Copiado!
                  </span>
                </>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Floating Toast Notification */}
            {copiedShare && (
              <div className="absolute top-full mt-2 right-0 z-50 whitespace-nowrap px-3 py-1.5 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-lg border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-top-1 duration-150 flex items-center gap-1.5 pointer-events-none">
                <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>Link copiado!</span>
              </div>
            )}
          </div>

          {/* GitHub Profile Link */}
          <a
            href="https://github.com/AlicyRibeiro"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 flex items-center justify-center group"
            title="GitHub de Ana Alicy (@AlicyRibeiro)"
            aria-label="Perfil no GitHub da autora (@AlicyRibeiro)"
          >
            <Github className="w-4 h-4 group-hover:scale-105 transition-transform" />
          </a>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 flex items-center justify-center"
            aria-label={darkMode ? "Alternar para modo claro" : "Alternar para modo escuro"}
            title={darkMode ? "Modo escuro ativo (clique para modo claro)" : "Modo claro ativo (clique para modo escuro)"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
