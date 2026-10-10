import React, { useState } from "react";
import { DocSection } from "../types";
import {
  Home,
  Download,
  Terminal,
  AlertTriangle,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Search,
  HelpCircle,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsRight,
} from "lucide-react";

interface SidebarProps {
  sections: DocSection[];
  activeArticleId: string;
  onSelectArticle: (articleId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeArticleId,
  onSelectArticle,
  isOpenMobile,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionName: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const getSectionIcon = (name: string) => {
    switch (name) {
      case "Início":
        return <Home className="w-4 h-4 text-blue-500" />;
      case "Instalação":
        return <Download className="w-4 h-4 text-emerald-500" />;
      case "Mão na Massa":
        return <Terminal className="w-4 h-4 text-indigo-500" />;
      case "Solução de Problemas":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "Referências e Extras":
        return <Bookmark className="w-4 h-4 text-purple-500" />;
      case "Glossário":
        return <BookOpen className="w-4 h-4 text-sky-500" />;
      case "Dúvidas Frequentes":
      case "Dúvidas":
        return <HelpCircle className="w-4 h-4 text-teal-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredSections = sections.map((sec) => ({
    ...sec,
    articles: sec.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        sec.name.toLowerCase().includes(filterQuery.toLowerCase())
    ),
  })).filter((sec) => sec.articles.length > 0);

  // Full Expanded Sidebar Content
  const expandedSidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar Top Filter + Diminish Button */}
      <div className="px-3 sm:px-4 py-3 border-b border-slate-200/70 dark:border-slate-800/80 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filtrar tópicos..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Diminuir barra lateral (Ctrl+B)"
            aria-label="Diminuir barra lateral"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {filteredSections.map((sec) => {
          const isSecCollapsed = collapsedSections[sec.name];

          return (
            <div key={sec.name} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sec.name)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  {getSectionIcon(sec.name)}
                  <span>{sec.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {sec.articles.length}
                  </span>
                  {isSecCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Section Articles */}
              {!isSecCollapsed && (
                <ul className="space-y-0.5 pt-1 pl-2 border-l border-slate-200/80 dark:border-slate-800/80 ml-2">
                  {sec.articles.map((article) => {
                    const isActive = article.id === activeArticleId;

                    return (
                      <li key={article.id}>
                        <button
                          onClick={() => {
                            onSelectArticle(article.id);
                            onCloseMobile();
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all flex items-center justify-between ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs border-l-2 border-blue-600 dark:border-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <span className="truncate">{article.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer info + Diminish option */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col gap-2 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <span>STM32 Blue Pill</span>
          <span className="text-slate-400 dark:text-slate-500">Ubuntu 20.04 / 22.04</span>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group cursor-pointer"
            title="Diminuir barra lateral"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <PanelLeftClose className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span>Diminuir barra lateral</span>
            </span>
            <kbd className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Ctrl+B
            </kbd>
          </button>
        )}
      </div>
    </div>
  );

  // Compact / Diminished Sidebar Content
  const compactSidebarContent = (
    <div className="flex flex-col h-full items-center justify-between py-3">
      {/* Top: Expand Button */}
      <div className="w-full px-2 pb-3 border-b border-slate-200/70 dark:border-slate-800/80 flex justify-center">
        <button
          onClick={onToggleCollapse}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-800 transition-all shadow-2xs group cursor-pointer"
          title="Expandir barra lateral (Ctrl+B)"
          aria-label="Expandir barra lateral"
        >
          <PanelLeftOpen className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      {/* Middle: Icon Rail for Sections */}
      <nav className="flex-1 w-full overflow-y-auto py-4 flex flex-col items-center space-y-3">
        {sections.map((sec) => {
          const hasActiveArticle = sec.articles.some((a) => a.id === activeArticleId);

          return (
            <div key={sec.name} className="relative group">
              <button
                onClick={() => {
                  const targetArticle =
                    sec.articles.find((a) => a.id === activeArticleId) || sec.articles[0];
                  if (targetArticle) onSelectArticle(targetArticle.id);
                  if (onToggleCollapse) onToggleCollapse();
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  hasActiveArticle
                    ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title={sec.name}
                aria-label={sec.name}
              >
                {getSectionIcon(sec.name)}
              </button>

              {/* Floating Tooltip */}
              <div className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium whitespace-nowrap shadow-xl border border-slate-700/50">
                <span>{sec.name}</span>
                <span className="ml-1.5 text-[10px] text-slate-400">({sec.articles.length})</span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom: Quick Expand Trigger */}
      <div className="w-full px-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex justify-center">
        <button
          onClick={onToggleCollapse}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Expandir barra lateral"
          aria-label="Expandir barra lateral"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Expandable / Collapsible) */}
      <aside
        className={`hidden lg:block flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-[#0b0f17]/50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-72"
        }`}
      >
        {isCollapsed ? compactSidebarContent : expandedSidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex"
          onClick={onCloseMobile}
        >
          <div
            className="w-80 max-w-[85vw] h-full bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {expandedSidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

