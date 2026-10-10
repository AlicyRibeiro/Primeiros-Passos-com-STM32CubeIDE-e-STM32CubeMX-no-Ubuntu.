import React, { useState } from "react";
import {
  Compass,
  Cpu,
  Layers,
  Search,
  BookOpen,
  Keyboard,
  Moon,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Code2,
  FolderTree,
  Terminal,
  MousePointerClick,
  Maximize2,
  Flame,
  ArrowRight,
  ShieldAlert,
  Zap,
} from "lucide-react";

interface GuideHowItWorksProps {
  onNavigateArticle?: (articleId: string) => void;
  onSwitchToGlossaryTerms?: () => void;
}

export const GuideHowItWorks: React.FC<GuideHowItWorksProps> = ({
  onNavigateArticle,
  onSwitchToGlossaryTerms,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  const steps = [
    {
      number: "01",
      title: "Navegação por Módulos & Trilha de Aprendizado",
      subtitle: "Barra lateral organizada em sequência didática recomendada",
      icon: FolderTree,
      badge: "Estrutura",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      description:
        "O guia está estruturado desde a base teórica até a prática avançada no Ubuntu. Você pode recolher/expandir seções, filtrar rapidamente por tópicos ou retrair a barra lateral para ganhar espaço na tela.",
      features: [
        {
          title: "Sequência Didática Passo a Passo",
          text: "Comece pela Introdução e Visão Geral dos Componentes, avance para a Instalação no Ubuntu e finalize com o primeiro projeto 'Blink' com depuração passo a passo.",
        },
        {
          title: "Filtro em Tempo Real na Barra Lateral",
          text: "Digite qualquer palavra no topo da sidebar (ex: 'udev', 'stlink', 'delay') para filtrar instantaneamente os artigos.",
        },
        {
          title: "Controle de Expansão e Colapso",
          text: "Use o atalho Ctrl+B (ou Cmd+B) para colapsar a barra lateral e focar no código ou no diagrama.",
        },
      ],
      quickAction: {
        label: "Ver Visão Geral dos Componentes",
        articleId: "hardware",
      },
    },
    {
      number: "02",
      title: "Diagrama Interativo do ST-Link V2 & Blue Pill",
      subtitle: "Pinout visual, modo 10 pinos vs 4 pinos e detecção de riscos elétricos",
      icon: Cpu,
      badge: "Simulador Visual",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      description:
        "Na aba 'Hardware & Pinout', há um circuito interativo vetorial completo mostrando as ligações exatas entre o gravador USB ST-Link V2 e a placa STM32F103C8T6 (Blue Pill).",
      features: [
        {
          title: "Destaque Bidirecional de Fios e Pinos",
          text: "Passe o cursor ou clique em qualquer fio (SWDIO, SWCLK, GND ou 3.3V) para iluminar simultaneamente o pino correspondente no ST-Link e na placa STM32.",
        },
        {
          title: "Alternância de Pinos (Padrão 10 pinos vs Dongle USB)",
          text: "Alterne com 1 clique se o seu gravador tem a carcaça de alumínio com 10 pinos ou o conector simplificado de 4 pinos.",
        },
        {
          title: "Proteção Contra Queima (Aviso de 5V)",
          text: "Destaque especial em vermelho alertando sobre a tensão de 3.3V e o risco imediato de queima caso os 5V sejam conectados ao VDD do STM32.",
        },
      ],
      quickAction: {
        label: "Abrir Diagrama Interativo",
        articleId: "hardware",
      },
    },
    {
      number: "03",
      title: "Busca Global Rápida com Filtro Inteligente",
      subtitle: "Encontre registradores, comandos bash e dicas em milissegundos",
      icon: Search,
      badge: "Produtividade",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description:
        "Qualquer conceito, regra udev do Ubuntu, código C ou registrador pode ser acessado de qualquer tela com o atalho Ctrl+K ou Cmd+K.",
      features: [
        {
          title: "Atalho Instantâneo (Ctrl+K / Cmd+K)",
          text: "Pressione as teclas para abrir o modal de pesquisa sem precisar tirar as mãos do teclado.",
        },
        {
          title: "Indexação Completa do Conteúdo",
          text: "Busca títulos de artigos, subtópicos, comandos de terminal (`apt`, `st-info`, `udevadm`) e termos de hardware.",
        },
        {
          title: "Navegação por Setas e Enter",
          text: "Use as setas ↑ e ↓ para escolher o resultado e pressione Enter para pular direto para o trecho exato.",
        },
      ],
      quickAction: {
        label: "Testar Busca (Pressione Ctrl+K)",
        onClick: () => {
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
          );
        },
      },
    },
    {
      number: "04",
      title: "Modo Leitura com Progresso, Foco e Copiar Código",
      subtitle: "Leitura sem distrações com barra de progresso no topo",
      icon: Maximize2,
      badge: "Experiência",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      description:
        "Projetado para ser usado em bancada ou laboratório enquanto você programa no Ubuntu.",
      features: [
        {
          title: "Modo Foco Sem Distrações (Alt+F)",
          text: "Oculta a barra lateral e maximiza o artigo em tela cheia para quando você estiver seguindo tutoriais longos de compilação ou depuração.",
        },
        {
          title: "Cópia de Código em 1 Clique",
          text: "Todos os blocos de comando bash e códigos em C possuem botão rápido de cópia e realce de sintaxe.",
        },
        {
          title: "Barra de Progresso de Leitura",
          text: "A linha superior no topo da tela indica a porcentagem já lida do artigo atual em tempo real conforme você rola a página.",
        },
      ],
    },
    {
      number: "05",
      title: "Glossário Técnico & Suporte a Dúvidas",
      subtitle: "Dicionário de periféricos e canal para enviar perguntas",
      icon: BookOpen,
      badge: "Referência",
      badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      description:
        "Consulte termos do manual RM0008 nesta mesma tela ou envie dúvidas técnicas caso encontre dificuldades no Ubuntu.",
      features: [
        {
          title: "Dicionário Técnico Completo",
          text: "Explore GPIO, USART, PWM, ADC, DMA, NVIC, RCC, Watchdog com exemplos práticos em C e referências a registradores.",
        },
        {
          title: "Canal 'Envie sua Dúvida'",
          text: "Uma seção dedicada na barra lateral permite submeter perguntas frequentes sobre gravação, permissões USB e erros no STM32CubeIDE.",
        },
        {
          title: "Tema Escuro / Claro Automático",
          text: "Alterne no topo entre modo escuro (ideal para IDE) e claro (para leitura diurna).",
        },
      ],
      quickAction: {
        label: "Ver Termos do Glossário",
        onClick: onSwitchToGlossaryTerms,
      },
    },
  ];

  const currentStep = steps[activeStepTab];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Intro Hero Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#818cf8 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Compass className="w-5 h-5 text-indigo-400" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-indigo-300">
              Manual Interativo da Plataforma
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Como Esta Página Funciona?
          </h2>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Este ambiente foi construído especificamente para você aprender a configurar, programar e depurar a placa{" "}
            <strong className="text-white">STM32F103 (Blue Pill)</strong> utilizando o gravador{" "}
            <strong className="text-white">ST-Link V2</strong> no sistema operacional{" "}
            <strong className="text-white">Ubuntu Linux</strong>. Abaixo você confere todos os recursos, ferramentas interativas e atalhos disponíveis.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> 5 Pilares de Funcionalidades
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sem Instalação de Extensões
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 font-medium flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-blue-400" /> Atalhos de Teclado Suportados
            </span>
          </div>
        </div>
      </div>

      {/* Step Selector Horizontal Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-blue-500" />
            Selecione uma área para explorar:
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {activeStepTab + 1} de {steps.length}
          </span>
        </div>

        {/* Tab Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepTab === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStepTab(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.number}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? "text-white" : "text-slate-400"
                    }`}
                  />
                </div>
                <div className="text-xs font-semibold leading-tight line-clamp-2">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detailed View */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${currentStep.badgeColor}`}
              >
                {currentStep.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Módulo {currentStep.number}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentStep.subtitle}
            </p>
          </div>

          {currentStep.quickAction && (
            <button
              type="button"
              onClick={() => {
                if (currentStep.quickAction?.articleId && onNavigateArticle) {
                  onNavigateArticle(currentStep.quickAction.articleId);
                } else if (currentStep.quickAction?.onClick) {
                  currentStep.quickAction.onClick();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer flex-shrink-0"
            >
              <span>{currentStep.quickAction.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {currentStep.features.map((feat, fIdx) => (
            <div
              key={fIdx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-start"
            >
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{feat.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Roadmap & Flow Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Fluxo Recomendado de Aprendizagem
            </h4>
          </div>
          <span className="text-xs text-slate-400">4 Etapas Principais</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 relative">
            <div className="text-[10px] font-mono font-bold text-blue-400">PASSO 1</div>
            <div className="text-xs font-bold text-white">Conhecendo o Hardware</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Veja a pinagem da Blue Pill, entenda os jumpers BOOT0 e BOOT1 e evite conectar o pino de 5V.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 relative">
            <div className="text-[10px] font-mono font-bold text-amber-400">PASSO 2</div>
            <div className="text-xs font-bold text-white">Configuração no Ubuntu</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Instale as ferramentas (stlink-tools, openocd), configure as permissões USB com regras udev e instale a IDE.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 relative">
            <div className="text-[10px] font-mono font-bold text-emerald-400">PASSO 3</div>
            <div className="text-xs font-bold text-white">Conexão Física SWD</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ligue os 4 fios (SWDIO, SWCLK, GND, 3.3V) usando o diagrama interativo como referência de pinos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 relative">
            <div className="text-[10px] font-mono font-bold text-purple-400">PASSO 4</div>
            <div className="text-xs font-bold text-white">Primeiro Código & Debug</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Crie o projeto Blink no STM32CubeIDE, compile com gcc-arm-none-eabi e depure com breakpoints na placa.
            </p>
          </div>
        </div>
      </div>

      {/* Useful Keyboard Shortcuts Quick Reference */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-blue-500" />
          Atalhos de Teclado Disponíveis Nesta Página
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Abrir Busca Global
            </span>
            <kbd className="px-2 py-1 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 shadow-2xs font-bold">
              Ctrl + K
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Recolher / Expandir Menu
            </span>
            <kbd className="px-2 py-1 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 shadow-2xs font-bold">
              Ctrl + B
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Modo Foco em Tela Cheia
            </span>
            <kbd className="px-2 py-1 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 shadow-2xs font-bold">
              Alt + F
            </kbd>
          </div>
        </div>
      </div>

      {/* Safety Notice Callout */}
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-900 dark:text-rose-200">
        <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <strong className="font-bold text-rose-700 dark:text-rose-300 block">
            Regra Fundamental de Bancada (Segurança Elétrica):
          </strong>
          <span>
            Nunca alimente a placa simultaneamente pelo pino 5V do ST-Link e pelo cabo micro-USB do computador ao mesmo tempo sem isolador, e{" "}
            <strong>jamais conecte os 5V do ST-Link no pino de 3.3V da Blue Pill</strong>. O STM32F103 opera a 3.3V máximo na linha VDD.
          </span>
        </div>
      </div>
    </div>
  );
};
