import React, { useState, useMemo } from "react";
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
  GlossaryTerm,
  GlossaryCategory,
} from "../data/glossaryData";
import {
  Search,
  BookOpen,
  Tag,
  Cpu,
  Layers,
  Code2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Compass,
} from "lucide-react";
import { GuideHowItWorks } from "./GuideHowItWorks";

interface GlossaryViewProps {
  onNavigateArticle?: (articleId: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onNavigateArticle }) => {
  const [activeMainTab, setActiveMainTab] = useState<"terms" | "guide">("terms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory>("Todos");
  const [expandedTermIds, setExpandedTermIds] = useState<Record<string, boolean>>(() => {
    // Expand first 4 terms by default for immediate preview
    return {
      gpio: true,
      usart: true,
      pwm: true,
      adc: true,
    };
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTermIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    GLOSSARY_TERMS.forEach((t) => {
      allExpanded[t.id] = true;
    });
    setExpandedTermIds(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedTermIds({});
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered terms
  const filteredTerms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return GLOSSARY_TERMS.filter((item) => {
      // Category check
      if (selectedCategory !== "Todos" && item.category !== selectedCategory) {
        return false;
      }

      // Search query check
      if (!q) return true;

      const inTerm = item.term.toLowerCase().includes(q);
      const inFullName = item.fullName.toLowerCase().includes(q);
      const inSummary = item.summary.toLowerCase().includes(q);
      const inDetails = item.details.toLowerCase().includes(q);
      const inManual = item.manualRef.toLowerCase().includes(q);
      const inTip = item.engineeringTip.toLowerCase().includes(q);
      const inRegisters = item.registersOrHal?.registers?.some((r) =>
        r.toLowerCase().includes(q)
      );
      const inHal = item.registersOrHal?.halFunctions?.some((f) =>
        f.toLowerCase().includes(q)
      );

      return (
        inTerm ||
        inFullName ||
        inSummary ||
        inDetails ||
        inManual ||
        inTip ||
        Boolean(inRegisters) ||
        Boolean(inHal)
      );
    });
  }, [searchQuery, selectedCategory]);

  // Alphabetical grouped navigation
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    GLOSSARY_TERMS.forEach((t) => {
      const firstLetter = t.term[0].toUpperCase();
      if (/[A-Z]/.test(firstLetter)) set.add(firstLetter);
    });
    return Array.from(set).sort();
  }, []);

  const handleLetterClick = (letter: string) => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    // Find the first term starting with this letter
    const target = GLOSSARY_TERMS.find(
      (t) => t.term[0].toUpperCase() === letter
    );
    if (target) {
      setExpandedTermIds((prev) => ({ ...prev, [target.id]: true }));
      const el = document.getElementById(`term-${target.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleSelectRelatedTerm = (relatedTermName: string) => {
    // Find the term by term label or acronym
    const found = GLOSSARY_TERMS.find(
      (t) =>
        t.term.toLowerCase() === relatedTermName.toLowerCase() ||
        t.term.toLowerCase().includes(relatedTermName.toLowerCase()) ||
        relatedTermName.toLowerCase().includes(t.term.toLowerCase())
    );

    if (found) {
      setSelectedCategory("Todos");
      setSearchQuery("");
      setExpandedTermIds((prev) => ({ ...prev, [found.id]: true }));
      setTimeout(() => {
        const el = document.getElementById(`term-${found.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
    } else {
      setSearchQuery(relatedTermName);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMainTab("terms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMainTab === "terms"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Glossário de Termos STM32</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono">
              {GLOSSARY_TERMS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab("guide")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMainTab === "guide"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Como Esta Página Funciona</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono">
              Guia
            </span>
          </button>
        </div>

        <span className="hidden sm:inline-flex text-[11px] text-slate-400 font-mono items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Manual STM32 & ST-Link</span>
        </span>
      </div>

      {/* Tab 2: Como Funciona a Página */}
      {activeMainTab === "guide" && (
        <GuideHowItWorks
          onNavigateArticle={onNavigateArticle}
          onSwitchToGlossaryTerms={() => setActiveMainTab("terms")}
        />
      )}

      {/* Tab 1: Glossário de Termos Técnicos */}
      {activeMainTab === "terms" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-slate-800 text-white shadow-xl relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <BookOpen className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-400">
                  Referência Técnica &middot; STM32F103 & ARM Cortex-M
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Glossário de Termos dos Manuais STM32
              </h1>

              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Consulte o significado exato de siglas, registradores de controle e conceitos técnicos
                frequentemente citados no manual de referência <strong>RM0008</strong>, no datasheet e nas
                bibliotecas HAL da STMicroelectronics.
              </p>

              {/* Quick Metrics Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    <strong className="text-white">{GLOSSARY_TERMS.length}</strong> termos documentados
                  </span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    <strong className="text-white">{GLOSSARY_CATEGORIES.length - 1}</strong> categorias de hardware
                  </span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Exemplos em C & HAL STM32</span>
                </div>
              </div>
            </div>
          </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por termo, registrador, função HAL ou conceito (ex: GPIO, NVIC, PWM, baud rate)..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                title="Limpar busca"
              >
                &times;
              </button>
            )}
          </div>

          {/* Expand / Collapse Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              Expandir todos
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              Recolher
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </span>
          {GLOSSARY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Alphabetical Jump Index */}
        <div className="flex items-center gap-1 flex-wrap pt-1 text-xs text-slate-400">
          <span className="text-[11px] font-mono uppercase mr-1">Índice A-Z:</span>
          {availableLetters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => handleLetterClick(letter)}
              className="w-6 h-6 flex items-center justify-center rounded-md font-mono font-semibold text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Current Filter Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
        <span>
          Mostrando <strong>{filteredTerms.length}</strong> de {GLOSSARY_TERMS.length} termos
          {selectedCategory !== "Todos" && ` na categoria "${selectedCategory}"`}
          {searchQuery && ` correspondentes a "${searchQuery}"`}
        </span>
        {(searchQuery || selectedCategory !== "Todos") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
            }}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Redefinir filtros</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredTerms.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Nenhum termo encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Não encontramos resultados para &quot;{searchQuery}&quot;. Tente buscar por siglas como
            GPIO, ADC, PWM, USART, DMA ou redefina os filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver todos os termos</span>
          </button>
        </div>
      )}

      {/* Glossary Terms List */}
      <div className="space-y-4">
        {filteredTerms.map((item) => {
          const isExpanded = Boolean(expandedTermIds[item.id]);

          return (
            <div
              key={item.id}
              id={`term-${item.id}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden"
            >
              {/* Card Header (Clickable to Expand/Collapse) */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight">
                      {item.term}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      &bull; {item.manualRef.split(":")[0]}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.fullName}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                    {item.summary}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0 mt-1 cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expandable Deep Dive Body */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150 text-xs">
                  {/* Detailed Description */}
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider block text-slate-500">
                      Funcionamento e Detalhes Técnicos:
                    </span>
                    <p>{item.details}</p>
                  </div>

                  {/* Manual Citation */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>
                        <strong>Referência Oficial:</strong> {item.manualRef}
                      </span>
                    </div>
                  </div>

                  {/* Associated Registers & HAL APIs */}
                  {item.registersOrHal && (
                    <div className="space-y-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider block text-slate-500">
                        Registradores de Hardware & Funções HAL:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.registersOrHal.registers?.map((reg) => (
                          <span
                            key={reg}
                            className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 font-semibold"
                          >
                            {reg}
                          </span>
                        ))}
                        {item.registersOrHal.halFunctions?.map((fn) => (
                          <span
                            key={fn}
                            className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {fn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code Example Snippet */}
                  {item.codeExample && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-purple-500" />
                          <span>Exemplo Prático de Código (C / HAL):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.id, item.codeExample!)}
                          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                          title="Copiar código"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500 font-medium">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                        <code>{item.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  {/* Engineering Tip / Attention Box */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <strong className="font-semibold block text-amber-800 dark:text-amber-300 mb-0.5">
                        Dica de Engenharia / Atenção Prática:
                      </strong>
                      {item.engineeringTip}
                    </div>
                  </div>

                  {/* Related Terms Navigation */}
                  {item.relatedTerms && item.relatedTerms.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
                      <span className="text-slate-400 font-semibold">Termos Relacionados:</span>
                      {item.relatedTerms.map((rel) => (
                        <button
                          key={rel}
                          type="button"
                          onClick={() => handleSelectRelatedTerm(rel)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-700 dark:hover:text-blue-200 transition-colors cursor-pointer font-medium"
                        >
                          {rel} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cross-Link Card to Pinout & Installation */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Precisa consultar o esquema de pinos da placa física?</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acesse o diagrama interativo com a pinagem completa da STM32 Blue Pill e a ligação do gravador ST-Link V2.
          </p>
        </div>
        {onNavigateArticle && (
          <button
            type="button"
            onClick={() => onNavigateArticle("hardware")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex-shrink-0"
          >
            <span>Ver Pinout & Hardware</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
        </div>
      )}
    </div>
  );
};
