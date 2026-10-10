import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Check, Github, ExternalLink } from "lucide-react";
import { DocArticle } from "../types";

interface ArticleFooterProps {
  prevArticle: DocArticle | null;
  nextArticle: DocArticle | null;
  onNavigateArticle: (id: string) => void;
}

export const ArticleFooter: React.FC<ArticleFooterProps> = ({
  prevArticle,
  nextArticle,
  onNavigateArticle,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<"yes" | "no" | null>(null);

  return (
    <footer className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8">
      {/* Helpfulness feedback rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Esta página foi útil?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Seu feedback ajuda a melhorar a documentação técnica.
          </p>
        </div>

        {feedbackGiven ? (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <Check className="w-4 h-4" />
            <span>Obrigado pelo seu feedback!</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFeedbackGiven("yes")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Sim</span>
            </button>
            <button
              onClick={() => setFeedbackGiven("no")}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Não</span>
            </button>
          </div>
        )}
      </div>

      {/* Prev / Next Page Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevArticle ? (
          <button
            onClick={() => onNavigateArticle(prevArticle.id)}
            className="group flex flex-col text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all shadow-2xs"
          >
            <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
              <ChevronLeft className="w-3.5 h-3.5 mr-1 transition-transform group-hover:-translate-x-1" />
              <span>Anterior • {prevArticle.section}</span>
            </div>
            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
              {prevArticle.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextArticle ? (
          <button
            onClick={() => onNavigateArticle(nextArticle.id)}
            className="group flex flex-col text-right sm:items-end p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all shadow-2xs sm:col-start-2"
          >
            <div className="flex items-center justify-end text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
              <span>Próximo • {nextArticle.section}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
              {nextArticle.title}
            </span>
          </button>
        ) : null}
      </div>

      {/* Footer Bottom copyright/attribution + GitHub Profile */}
      <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center sm:text-left space-y-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Guia de Instalação STM32CubeIDE e STM32CubeMX no Ubuntu
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            © 2026 - Desenvolvido por Ana Alicy
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Estudante de Engenharia de Computação | UFC
          </p>
        </div>

        <a
          href="https://github.com/AlicyRibeiro"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700/80 transition-all shadow-2xs group flex-shrink-0"
          title="Ver perfil de Ana Alicy Ribeiro no GitHub"
        >
          <Github className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          <div className="text-left">
            <div className="text-xs font-semibold flex items-center gap-1">
              <span>Ana Alicy Ribeiro</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 opacity-70" />
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              github.com/AlicyRibeiro
            </div>
          </div>
        </a>
      </div>
    </footer>
  );
};
