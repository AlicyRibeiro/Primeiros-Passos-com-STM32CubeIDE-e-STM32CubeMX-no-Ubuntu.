import React, { useEffect, useState } from "react";

interface ReadingProgressBarProps {
  /** Target article identifier to trigger reset/recalculation on change */
  activeArticleId?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ activeArticleId }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const calculateProgress = () => {
      const article = document.querySelector("article");
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      if (!article) {
        const totalScroll = document.documentElement.scrollHeight - windowHeight;
        if (totalScroll <= 0) {
          setProgress(0);
          return;
        }
        const pct = Math.min(100, Math.max(0, (scrollY / totalScroll) * 100));
        setProgress(pct);
        return;
      }

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + scrollY;
      const articleHeight = rect.height;

      // If article is very short and fits comfortably in viewport
      if (articleHeight <= windowHeight) {
        const totalScroll = document.documentElement.scrollHeight - windowHeight;
        if (totalScroll <= 0) {
          setProgress(100);
        } else {
          setProgress(Math.min(100, Math.max(0, (scrollY / totalScroll) * 100)));
        }
        return;
      }

      // Start at scroll 0, and reach 100% when article bottom is reached
      // articleTop + articleHeight is the bottom of the article in document coordinates
      // When scroll reaches bottom of article (viewport bottom aligns with article bottom):
      const endScroll = Math.max(1, articleTop + articleHeight - windowHeight + 60);

      if (scrollY <= 0) {
        setProgress(0);
      } else if (scrollY >= endScroll) {
        setProgress(100);
      } else {
        const pct = Math.min(100, Math.max(0, (scrollY / endScroll) * 100));
        setProgress(pct);
      }
    };

    const handleScroll = () => {
      calculateProgress();
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateProgress, { passive: true });

    // Initial calculation with small delay to let DOM/markdown render
    const timer = setTimeout(calculateProgress, 60);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateProgress);
      clearTimeout(timer);
      clearTimeout(scrollTimeout);
    };
  }, [activeArticleId]);

  const roundedProgress = Math.round(progress);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none"
      role="progressbar"
      aria-valuenow={roundedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso de leitura do artigo"
    >
      {/* Background subtle track */}
      <div className="w-full h-[3px] bg-slate-200/40 dark:bg-slate-800/40 backdrop-blur-xs">
        {/* Animated fill bar */}
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 dark:from-blue-500 dark:via-indigo-400 dark:to-cyan-300 transition-[width] duration-100 ease-out shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating percentage badge when scrolling and reading */}
      <div
        className={`absolute top-2 right-4 transition-all duration-300 transform ${
          isScrolling && roundedProgress > 0
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-slate-900/80 dark:bg-slate-800/90 text-white backdrop-blur-md border border-slate-700/50 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {roundedProgress}% lido
        </span>
      </div>
    </div>
  );
};
