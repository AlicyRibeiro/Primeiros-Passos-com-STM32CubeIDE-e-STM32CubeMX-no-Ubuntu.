import React, { useState, useEffect, useRef } from "react";
import { Search, X, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import { DocArticle } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  docs: DocArticle[];
  onSelectArticle: (articleId: string, headingSlug?: string) => void;
}

interface MatchResult {
  article: DocArticle;
  matchedTitle: boolean;
  matchedHeading?: { text: string; slug: string };
  snippet: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  docs,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // handled in parent or opened
        }
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const item = results[selectedIndex];
        if (item) {
          onSelectArticle(item.article.id, item.matchedHeading?.slug);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, onClose]);

  // Compute search results
  const results: MatchResult[] = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: MatchResult[] = [];

    for (const doc of docs) {
      const titleMatch = doc.title.toLowerCase().includes(q);
      const sectionMatch = doc.section.toLowerCase().includes(q);

      // Check headings
      const headingMatch = doc.headings.find((h) =>
        h.text.toLowerCase().includes(q)
      );

      // Check content
      const lowerContent = doc.content.toLowerCase();
      const contentIndex = lowerContent.indexOf(q);

      if (titleMatch || sectionMatch || headingMatch || contentIndex !== -1) {
        let snippet = "";
        if (contentIndex !== -1) {
          const start = Math.max(0, contentIndex - 40);
          const end = Math.min(doc.content.length, contentIndex + q.length + 60);
          snippet = (start > 0 ? "..." : "") + doc.content.slice(start, end).replace(/\n/g, " ") + "...";
        } else if (headingMatch) {
          snippet = `Seção: ${headingMatch.text}`;
        } else {
          snippet = doc.content.slice(0, 100).replace(/\n/g, " ") + "...";
        }

        matches.push({
          article: doc,
          matchedTitle: titleMatch,
          matchedHeading: headingMatch,
          snippet,
        });
      }
    }

    return matches.slice(0, 8);
  }, [query, docs]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#121824] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-2">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Pesquisar páginas, códigos, erros, tópicos..."
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base"
          />

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="px-2 py-0.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                title="Limpar busca"
              >
                Limpar
              </button>
            )}

            {/* ESC shortcut indicator (non-clickable) */}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs select-none pointer-events-none">
              ESC
            </kbd>

            {/* Dedicated clickable X close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
              title="Fechar janela"
              aria-label="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="py-12 px-6 text-center text-slate-400 dark:text-slate-500 text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-400 mb-1">
                Busca Rápida na Documentação
              </p>
              <p>Digite palavras-chave como &quot;Blink&quot;, &quot;udev&quot;, &quot;ST-Link&quot;, &quot;CubeMX&quot; ou &quot;Assembly&quot;.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 px-6 text-center text-slate-400 dark:text-slate-500 text-sm">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((res, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li key={`${res.article.id}-${idx}`}>
                    <button
                      onClick={() => {
                        onSelectArticle(res.article.id, res.matchedHeading?.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl flex items-start justify-between transition-colors ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 border border-blue-200/60 dark:border-blue-800/60"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start space-x-3 overflow-hidden mr-2">
                        <FileText
                          className={`w-4 h-4 mt-1 flex-shrink-0 ${
                            isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                          }`}
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              {res.article.section}
                            </span>
                            <span className="font-semibold text-sm truncate">
                              {res.article.title}
                            </span>
                          </div>
                          {res.matchedHeading && (
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                              ↳ {res.matchedHeading.text}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {res.snippet}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-1 flex items-center text-slate-400">
                        {isSelected ? (
                          <CornerDownLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <ArrowRight className="w-4 h-4 opacity-50" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">↑</kbd>
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">↵</kbd>
              Selecionar
            </span>
          </div>
          <span>
            Pressione <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs select-none pointer-events-none">ESC</kbd> para fechar
          </span>
        </div>
      </div>
    </div>
  );
};
