import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  ExternalLink,
  Info,
  AlertTriangle,
  Lightbulb,
  ZoomIn,
  Terminal,
  FileCode2,
  Cpu,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-armasm";
import "prismjs/components/prism-ini";
import "prismjs/components/prism-makefile";
import "prismjs/components/prism-json";
import "prismjs/components/prism-diff";

interface MarkdownRendererProps {
  content: string;
  onNavigateArticle: (articleId: string) => void;
  onOpenImage: (src: string, alt: string) => void;
}

// Helper to recursively extract text from ReactNode
const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
};

// Normalize and slugify text
export const slugify = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onNavigateArticle,
  onOpenImage,
}) => {
  // Track heading slugs to guarantee unique DOM IDs per render
  const slugCounts = React.useRef(new Map<string, number>());
  slugCounts.current.clear();

  const getUniqueHeadingSlug = (children: React.ReactNode) => {
    const text = getNodeText(children);
    const baseSlug = slugify(text) || "section";
    const currentCount = slugCounts.current.get(baseSlug) || 0;
    slugCounts.current.set(baseSlug, currentCount + 1);
    return currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount + 1}`;
  };

  // Helper to resolve gitbook url to article id
  const getArticleIdFromHref = (href: string): string | null => {
    if (!href) return null;
    const cleanHref = href.split("#")[0].replace(/\.md$/, "");

    if (cleanHref.includes("introducao") || cleanHref === "/stm32") return "introducao";
    if (cleanHref.includes("instalacao/download") || cleanHref.endsWith("/download")) return "download";
    if (cleanHref.includes("instalacao/stm32cubemx") || cleanHref.endsWith("/stm32cubemx")) return "stm32cubemx";
    if (cleanHref.includes("mao-na-massa/fluxo-trabalho") || cleanHref.endsWith("/fluxo-trabalho")) return "fluxo-trabalho";
    if (cleanHref.includes("mao-na-massa/regras-codigo") || cleanHref.endsWith("/regras-codigo")) return "regras-codigo";
    if (cleanHref.includes("mao-na-massa/blink-led") || cleanHref.endsWith("/blink-led")) return "blink-led";
    if (cleanHref.includes("solucao-de-problemas/solucao") || cleanHref.endsWith("/solucao")) return "solucao";
    if (cleanHref.includes("solucao-de-problemas/erro-interface") || cleanHref.endsWith("/erro-interface")) return "erro-interface";
    if (cleanHref.includes("solucao-de-problemas/permissoes-usb") || cleanHref.endsWith("/permissoes-usb")) return "permissoes-usb";
    if (cleanHref.includes("solucao-de-problemas/bug-assembly") || cleanHref.endsWith("/bug-assembly")) return "bug-assembly";
    if (cleanHref.includes("solucao-de-problemas/abrir-ioc") || cleanHref.endsWith("/abrir-ioc")) return "abrir-ioc";
    if (cleanHref.includes("referencias-e-extras/refe") || cleanHref.endsWith("/refe")) return "refe";
    if (cleanHref.includes("duvidas") || cleanHref.endsWith("/duvidas")) return "duvidas";

    return null;
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            return (
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const slug = getUniqueHeadingSlug(children);
            return (
              <h2
                id={slug}
                className="group text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4 pt-4 scroll-mt-24 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2"
              >
                <span>{children}</span>
                <a
                  href={`#${slug}`}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition-opacity ml-2"
                  aria-label="Link para esta seção"
                >
                  #
                </a>
              </h2>
            );
          },
          h3: ({ children }) => {
            const slug = getUniqueHeadingSlug(children);
            return (
              <h3
                id={slug}
                className="group text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 mt-6 mb-3 scroll-mt-24 flex items-center justify-between"
              >
                <span>{children}</span>
                <a
                  href={`#${slug}`}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition-opacity ml-2 text-sm"
                  aria-label="Link para esta subseção"
                >
                  #
                </a>
              </h3>
            );
          },
          p: ({ children }) => {
            // If the paragraph only contains an image or block element, avoid rendering <p>
            const childrenArray = React.Children.toArray(children);
            const hasBlockChild = childrenArray.some((child) => {
              if (React.isValidElement(child)) {
                // If child is figure, div, or an image rendered with block wrapper
                const type = child.type;
                if (type === "figure" || type === "div" || type === "table") return true;
                if (typeof type === "function" && (type.name === "img" || type.name === "figure")) return true;
              }
              return false;
            });

            if (hasBlockChild) {
              return <div className="my-5">{children}</div>;
            }

            return (
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-5">
                {children}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 mb-5 text-slate-700 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 mb-5 text-slate-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1 marker:text-blue-500 dark:marker:text-blue-400">
              {children}
            </li>
          ),
          hr: () => (
            <hr className="my-8 border-t border-slate-200 dark:border-slate-800" />
          ),
          blockquote: ({ children }) => {
            return (
              <div className="my-5 rounded-xl border-l-4 border-blue-500 bg-blue-50/70 dark:bg-blue-950/20 px-4 py-3.5 text-slate-700 dark:text-slate-300 shadow-xs flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base leading-relaxed w-full">
                  {children}
                </div>
              </div>
            );
          },
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <span className="block my-7 group text-center">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenImage(src, alt || "")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenImage(src, alt || "");
                    }
                  }}
                  className="relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-all inline-block max-w-full text-left"
                >
                  <img
                    src={src}
                    alt={alt || "Imagem STM32"}
                    referrerPolicy="no-referrer"
                    className="max-h-[520px] w-auto max-w-full object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                  <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs text-white p-1.5 rounded-lg flex items-center space-x-1 text-xs">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Ampliar</span>
                  </span>
                </span>
                {alt && (
                  <span className="block text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
                    {alt}
                  </span>
                )}
              </span>
            );
          },
          a: ({ href, children }) => {
            if (!href) return <span>{children}</span>;

            const internalArticleId = getArticleIdFromHref(href);

            if (internalArticleId) {
              return (
                <button
                  type="button"
                  onClick={() => onNavigateArticle(internalArticleId)}
                  className="inline font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-300 dark:decoration-blue-700 underline-offset-2 hover:decoration-2 transition-all cursor-pointer"
                >
                  {children}
                </button>
              );
            }

            if (href.startsWith("#")) {
              return (
                <a
                  href={href}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {children}
                </a>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-2"
              >
                <span>{children}</span>
                <ExternalLink className="w-3 h-3 ml-0.5 inline opacity-70" />
              </a>
            );
          },
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md text-[13px] font-mono font-medium bg-slate-100 dark:bg-slate-800/80 text-blue-700 dark:text-blue-300 border border-slate-200/80 dark:border-slate-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const codeString = String(children).replace(/\n$/, "");
            return <CodeBlock code={codeString} language={match ? match[1] : ""} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Helper to detect and normalize language for Prism.js
const normalizeLanguage = (code: string, lang: string): string => {
  const l = (lang || "").toLowerCase().trim();
  if (l === "c" || l === "h") return "c";
  if (l === "cpp" || l === "c++") return "cpp";
  if (["bash", "sh", "shell", "zsh", "cli", "terminal", "console"].includes(l)) return "bash";
  if (["armasm", "asm", "s"].includes(l)) return "armasm";
  if (["ini", "udev", "rules"].includes(l)) return "ini";
  if (["makefile", "make"].includes(l)) return "makefile";
  if (["json"].includes(l)) return "json";
  if (["diff"].includes(l)) return "diff";

  // Heuristic if language is absent or generic "code" / "text"
  if (!l || l === "code" || l === "text") {
    // C code detection
    if (
      code.includes("/*") ||
      code.includes("HAL_") ||
      code.includes("#include") ||
      /\b(while|for|if)\s*\(/.test(code) ||
      /\b(void|int|uint32_t|uint8_t|GPIO_PIN|GPIOC|GPIO_TypeDef)\b/.test(code)
    ) {
      return "c";
    }
    // Udev rules detection
    if (code.includes("SUBSYSTEM==") || code.includes("ATTRS{idVendor}==")) {
      return "ini";
    }
    // Assembly detection
    if (/^\s*(LDR|STR|MOV|PUSH|POP|BX|BL|B)\b/im.test(code)) {
      return "armasm";
    }
    // Command line detection (cd, chmod, unzip, ./, sudo, etc.)
    if (
      /^\s*(cd|chmod|unzip|sudo|\.\/|export|ls|mkdir|tar|cat|grep|echo|apt|git)\b/m.test(code) ||
      code.startsWith("$ ") ||
      code.startsWith("# ")
    ) {
      return "bash";
    }
    // Default to bash for commands in this documentation
    return "bash";
  }

  return l;
};

// Specialized Code Block with Prism.js syntax highlighting, line numbers, and Copy button
const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const targetLang = useMemo(() => normalizeLanguage(code, language), [code, language]);

  // Highlight code with Prism.js
  const highlightedHtml = useMemo(() => {
    try {
      const grammar =
        Prism.languages[targetLang] ||
        Prism.languages.c ||
        Prism.languages.bash ||
        Prism.languages.clike;

      if (grammar) {
        return Prism.highlight(code, grammar, targetLang);
      }
      return code;
    } catch {
      return code;
    }
  }, [code, targetLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Language metadata for header display
  const langMeta = useMemo(() => {
    switch (targetLang) {
      case "c":
        return { label: "C / STM32 HAL", icon: <FileCode2 className="w-3.5 h-3.5 text-blue-400" />, isCli: false };
      case "cpp":
        return { label: "C++", icon: <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />, isCli: false };
      case "bash":
        return { label: "Terminal / Bash", icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />, isCli: true };
      case "armasm":
        return { label: "ARM Cortex-M Assembly", icon: <Cpu className="w-3.5 h-3.5 text-amber-400" />, isCli: false };
      case "ini":
        return { label: "Regras Udev (USB)", icon: <Terminal className="w-3.5 h-3.5 text-purple-400" />, isCli: true };
      case "makefile":
        return { label: "Makefile", icon: <FileCode2 className="w-3.5 h-3.5 text-slate-400" />, isCli: true };
      default:
        return { label: targetLang.toUpperCase(), icon: <FileCode2 className="w-3.5 h-3.5 text-slate-400" />, isCli: false };
    }
  }, [targetLang]);

  const lines = useMemo(() => code.split("\n"), [code]);
  const showLineNumbers = lines.length > 2;

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-slate-700/60 dark:border-slate-800 shadow-md bg-[#0a0f1d] text-slate-100 font-mono text-[13px] group">
      {/* Code Header Bar with Window Controls & Copy button */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0e1629] border-b border-slate-800/80 text-xs select-none">
        <div className="flex items-center space-x-3">
          {/* macOS / Linux Terminal Window Dots */}
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="h-3 w-px bg-slate-800" />

          {/* Language Badge */}
          <div className="flex items-center space-x-1.5 text-slate-300">
            {langMeta.icon}
            <span className="font-sans font-semibold tracking-wide text-[11px]">
              {langMeta.label}
            </span>
          </div>

          {/* Line Count Indicator */}
          <span className="hidden sm:inline-block font-sans text-[10px] text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
            {lines.length} {lines.length === 1 ? "linha" : "linhas"}
          </span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/50 hover:border-slate-600 active:scale-95"
          title="Copiar código para a área de transferência"
          aria-label="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans font-medium text-[11px]">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-sans text-[11px]">Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Line Numbers and Prism Syntax Highlighting */}
      <div className="flex p-3.5 sm:p-4 overflow-x-auto">
        {showLineNumbers && (
          <div
            className="select-none pr-3 mr-3 text-right text-slate-500/80 font-mono text-[12px] border-r border-slate-800/80 shrink-0 leading-6"
            aria-hidden="true"
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        <pre className="m-0 p-0 bg-transparent flex-1 text-slate-100 font-mono text-[13px] leading-6 overflow-visible">
          <code
            className={`language-${targetLang} font-mono block`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
};
