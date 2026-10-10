import React, { useEffect, useState } from "react";
import { DocHeading } from "../types";
import { AlignLeft, Hash } from "lucide-react";

interface TableOfContentsProps {
  headings: DocHeading[];
  activeHeadingSlug?: string;
  onSelectHeading: (slug: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeHeadingSlug,
  onSelectHeading,
}) => {
  const filteredHeadings = headings.filter(
    (h) => h.text.trim().toLowerCase() !== "querying this documentation"
  );
  const [currentSlug, setCurrentSlug] = useState<string>(activeHeadingSlug || "");

  useEffect(() => {
    if (activeHeadingSlug) {
      setCurrentSlug(activeHeadingSlug);
    }
  }, [activeHeadingSlug]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = filteredHeadings.map((h) => ({
        slug: h.slug,
        el: document.getElementById(h.slug),
      })).filter((item): item is { slug: string; el: HTMLElement } => item.el !== null);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const item = headingElements[i];
        if (item.el.offsetTop <= scrollPosition) {
          setCurrentSlug(item.slug);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredHeadings]);

  if (filteredHeadings.length === 0) {
    return null;
  }

  return (
    <nav className="w-56 xl:w-60 flex-shrink-0 hidden xl:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pl-4 pr-1 py-4 border-l border-slate-200/60 dark:border-slate-800/60 select-none">
      <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        <AlignLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Nesta página</span>
      </div>

      <ul className="space-y-1.5 text-sm">
        {filteredHeadings.map((heading, index) => {
          const isActive = currentSlug === heading.slug;
          const isH3 = heading.level === 3;

          return (
            <li
              key={`${heading.slug}-${heading.level}-${index}`}
              className={isH3 ? "pl-3.5" : ""}
            >
              <button
                onClick={() => {
                  onSelectHeading(heading.slug);
                  setCurrentSlug(heading.slug);
                }}
                className={`group flex items-start text-left w-full py-1 text-[13px] leading-snug transition-colors ${
                  isActive
                    ? "font-medium text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Hash
                  className={`w-3 h-3 mt-1 mr-1.5 flex-shrink-0 transition-opacity ${
                    isActive
                      ? "opacity-100 text-blue-600 dark:text-blue-400"
                      : "opacity-0 group-hover:opacity-40"
                  }`}
                />
                <span className="truncate">{heading.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
