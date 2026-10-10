import { useState, useEffect, useMemo } from "react";
import { DOCS, DOC_SECTIONS } from "./data/docs";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { TableOfContents } from "./components/TableOfContents";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { ArticleFooter } from "./components/ArticleFooter";
import { SearchModal } from "./components/SearchModal";
import { ImageLightbox } from "./components/ImageLightbox";
import { SubmitQuestionView } from "./components/SubmitQuestionView";
import { HardwareComponentsView } from "./components/HardwareComponentsView";
import { GlossaryView } from "./components/GlossaryView";
import { ReadingProgressBar } from "./components/ReadingProgressBar";
import { UpdateNotificationToast } from "./components/UpdateNotificationToast";
import { ChevronRight, Clock, FileCode2, PanelLeftOpen, BookOpen } from "lucide-react";

export default function App() {
  // Theme state: light mode is the primary default ("modo claro como primeiro")
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("stm32_theme");
      return saved === "dark";
    }
    return false;
  });

  // Sync dark mode class on document element and persist in localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      localStorage.setItem("stm32_theme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      localStorage.setItem("stm32_theme", "light");
    }
  }, [darkMode]);

  // Sidebar expanded / diminished state for desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("stm32_sidebar_collapsed") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("stm32_sidebar_collapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Focus reading mode: removes sidebar and table of contents, expanding max text width
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("stm32_focus_mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("stm32_focus_mode", String(isFocusMode));
  }, [isFocusMode]);

  // Active article state
  const [activeArticleId, setActiveArticleId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        const found = DOCS.find((d) => d.id === hash);
        if (found) return found.id;
      }
    }
    return "introducao";
  });

  const [activeHeadingSlug, setActiveHeadingSlug] = useState<string | undefined>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const handleToggleSidebar = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Synchronize hash with active article
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        const found = DOCS.find((d) => d.id === hash);
        if (found) {
          setActiveArticleId(found.id);
        } else {
          // It might be a heading slug on current page
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setActiveHeadingSlug(hash);
          }
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K (search), Cmd+B / Ctrl+B (toggle sidebar), Alt+F / Ctrl+Shift+F (focus mode), and Esc (exit focus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
      if (
        (e.altKey && e.key.toLowerCase() === "f") ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "f")
      ) {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      }
      if (e.key === "Escape" && isFocusMode && !searchOpen && !lightboxImage) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode, searchOpen, lightboxImage]);

  // Current active doc
  const currentDoc = useMemo(() => {
    return DOCS.find((d) => d.id === activeArticleId) || DOCS[0];
  }, [activeArticleId]);

  // Previous and next articles
  const { prevDoc, nextDoc } = useMemo(() => {
    const idx = DOCS.findIndex((d) => d.id === currentDoc.id);
    return {
      prevDoc: idx > 0 ? DOCS[idx - 1] : null,
      nextDoc: idx < DOCS.length - 1 ? DOCS[idx + 1] : null,
    };
  }, [currentDoc.id]);

  const handleSelectArticle = (id: string, headingSlug?: string) => {
    setActiveArticleId(id);
    window.location.hash = id;
    setActiveHeadingSlug(headingSlug);

    if (headingSlug) {
      setTimeout(() => {
        const el = document.getElementById(headingSlug);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectHeading = (slug: string) => {
    setActiveHeadingSlug(slug);
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0b0f17] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Fixed Reading Progress Bar at the top of the page */}
      <ReadingProgressBar activeArticleId={currentDoc.id} />

      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onOpenSearch={() => setSearchOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapseSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
      />

      {/* Main Container with Sticky Sidebar, Article Content, and On-Page TOC */}
      <div
        className={`flex-1 w-full mx-auto flex transition-all duration-300 ${
          isFocusMode ? "max-w-5xl justify-center" : "max-w-[1440px] px-2 sm:px-4 lg:px-6"
        }`}
      >
        {/* Left Navigation Sidebar (hidden in focus mode) */}
        {!isFocusMode && (
          <Sidebar
            sections={DOC_SECTIONS}
            activeArticleId={currentDoc.id}
            onSelectArticle={handleSelectArticle}
            isOpenMobile={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        )}

        {/* Center Main Content Area */}
        <main
          className={`flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 lg:py-10 transition-all ${
            isFocusMode ? "w-full max-w-5xl mx-auto" : ""
          }`}
        >
          <div
            className={`mx-auto transition-all duration-300 ${
              isFocusMode ? "max-w-4xl lg:max-w-5xl" : "max-w-3xl"
            }`}
          >
            {/* Breadcrumbs + Expand button / Focus Mode Status */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6 gap-2">
              <div className="flex items-center space-x-2 truncate">
                <span className="hover:text-slate-700 dark:hover:text-slate-200">Documentação</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {currentDoc.section}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 dark:text-white font-medium truncate max-w-[180px] sm:max-w-none">
                  {currentDoc.title}
                </span>
              </div>

              {isFocusMode ? (
                <button
                  onClick={() => setIsFocusMode(false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-all border border-blue-200/80 dark:border-blue-800/80 shadow-2xs group cursor-pointer flex-shrink-0"
                  title="Sair do modo foco de leitura (Alt+F ou Esc)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Modo Foco Ativo</span>
                  <span className="text-[10px] text-blue-500 dark:text-blue-400 underline font-normal">Sair</span>
                </button>
              ) : isSidebarCollapsed ? (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all border border-slate-200/80 dark:border-slate-700/80 shadow-2xs group cursor-pointer flex-shrink-0"
                  title="Expandir barra lateral (Ctrl+B)"
                >
                  <PanelLeftOpen className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>Expandir barra lateral</span>
                  <kbd className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Ctrl+B</kbd>
                </button>
              ) : null}
            </div>

            {/* Metadata Bar */}
            <div className="flex items-center gap-4 pb-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                <span>STM32F103C8T6</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Ubuntu 22.04 / 24.04 LTS</span>
              </div>
            </div>

            {/* Main Article Content */}
            <article>
              {currentDoc.id === "duvidas" ? (
                <SubmitQuestionView />
              ) : currentDoc.id === "hardware" ? (
                <HardwareComponentsView onNavigateArticle={handleSelectArticle} />
              ) : currentDoc.id === "glossario" ? (
                <GlossaryView onNavigateArticle={handleSelectArticle} />
              ) : (
                <MarkdownRenderer
                  content={currentDoc.content}
                  onNavigateArticle={handleSelectArticle}
                  onOpenImage={(src, alt) => setLightboxImage({ src, alt })}
                />
              )}
            </article>

            {/* Article Footer with Prev/Next Navigation */}
            <ArticleFooter
              prevArticle={prevDoc}
              nextArticle={nextDoc}
              onNavigateArticle={handleSelectArticle}
            />
          </div>
        </main>

        {/* Right On-Page Table of Contents (hidden in focus mode) */}
        {!isFocusMode && (
          <TableOfContents
            headings={currentDoc.headings}
            activeHeadingSlug={activeHeadingSlug}
            onSelectHeading={handleSelectHeading}
          />
        )}
      </div>

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        docs={DOCS}
        onSelectArticle={handleSelectArticle}
      />

      {/* Image Lightbox Modal */}
      <ImageLightbox
        src={lightboxImage ? lightboxImage.src : null}
        alt={lightboxImage ? lightboxImage.alt : ""}
        onClose={() => setLightboxImage(null)}
      />

      {/* Floating Bottom Toast for Guide Updates */}
      <UpdateNotificationToast onNavigateArticle={handleSelectArticle} />
    </div>
  );
}
