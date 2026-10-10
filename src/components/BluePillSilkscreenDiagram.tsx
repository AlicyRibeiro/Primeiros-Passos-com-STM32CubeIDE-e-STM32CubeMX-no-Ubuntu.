import React, { useState } from "react";
import {
  RotateCw,
  Check,
  Copy,
  Sliders,
  CheckCircle2,
  X,
} from "lucide-react";

interface BluePillSilkscreenDiagramProps {
  onPinClick?: (pinName: string) => void;
}

export interface PinMeta {
  code: string;
  fullName: string;
  category: "power" | "adc" | "uart" | "i2c" | "spi" | "gpio" | "swd" | "led";
  is5vTolerant: boolean;
  notes: string;
  isSquare?: boolean;
}

// 20 Pins of Left Rail (when board is held vertically with USB at TOP)
const LEFT_PINS_VERTICAL: PinMeta[] = [
  { code: "5V", fullName: "5V (VBUS / Entrada USB)", category: "power", is5vTolerant: true, notes: "Linha de 5V vinda do conector USB ou pino externo", isSquare: true },
  { code: "G", fullName: "GND (Terra)", category: "power", is5vTolerant: false, notes: "Referência de 0V" },
  { code: "3V3", fullName: "3.3V (Saída Regulador)", category: "power", is5vTolerant: false, notes: "Saída de 3.3V do regulador RT9193 onboard" },
  { code: "R", fullName: "NRST (Reset MCU)", category: "power", is5vTolerant: false, notes: "Reset ativo em nível baixo (puxado a 3.3V)" },
  { code: "B11", fullName: "PB11 / I2C2 SDA / RX3", category: "i2c", is5vTolerant: true, notes: "I2C2 Dados, USART3 RX, Timer 2 Ch 4 (5V Tolerant)" },
  { code: "B10", fullName: "PB10 / I2C2 SCL / TX3", category: "i2c", is5vTolerant: true, notes: "I2C2 Clock, USART3 TX, Timer 2 Ch 3 (5V Tolerant)" },
  { code: "B1", fullName: "PB1 / ADC9 / TIM3_CH4", category: "adc", is5vTolerant: false, notes: "Entrada analógica ADC9, Timer 3 Canal 4 (Máx 3.6V)" },
  { code: "B0", fullName: "PB0 / ADC8 / TIM3_CH3", category: "adc", is5vTolerant: false, notes: "Entrada analógica ADC8, Timer 3 Canal 3 (Máx 3.6V)" },
  { code: "A7", fullName: "PA7 / ADC7 / SPI1 MOSI", category: "spi", is5vTolerant: false, notes: "SPI1 Master Out, ADC Canal 7, Timer 3 Canal 2" },
  { code: "A6", fullName: "PA6 / ADC6 / SPI1 MISO", category: "spi", is5vTolerant: false, notes: "SPI1 Master In, ADC Canal 6, Timer 3 Canal 1" },
  { code: "A5", fullName: "PA5 / ADC5 / SPI1 SCK", category: "spi", is5vTolerant: false, notes: "SPI1 Clock, ADC Canal 5, Timer 2 Canal 1" },
  { code: "A4", fullName: "PA4 / ADC4 / SPI1 NSS", category: "spi", is5vTolerant: false, notes: "SPI1 Chip Select, ADC Canal 4" },
  { code: "A3", fullName: "PA3 / ADC3 / USART2 RX", category: "uart", is5vTolerant: false, notes: "USART2 Recepção, ADC Canal 3, Timer 2 Canal 4" },
  { code: "A2", fullName: "PA2 / ADC2 / USART2 TX", category: "uart", is5vTolerant: false, notes: "USART2 Transmissão, ADC Canal 2, Timer 2 Canal 3" },
  { code: "A1", fullName: "PA1 / ADC1 / TIM2_CH2", category: "adc", is5vTolerant: false, notes: "Entrada analógica ADC1, Timer 2 Canal 2" },
  { code: "A0", fullName: "PA0 / ADC0 / WKUP", category: "adc", is5vTolerant: false, notes: "Entrada analógica ADC0, Timer 2 Canal 1, Wake-up" },
  { code: "C15", fullName: "PC15 / OSC32 OUT (RTC)", category: "gpio", is5vTolerant: false, notes: "Saída do oscilador de 32.768 kHz para relógio de tempo real" },
  { code: "C14", fullName: "PC14 / OSC32 IN (RTC)", category: "gpio", is5vTolerant: false, notes: "Entrada do oscilador de 32.768 kHz para RTC" },
  { code: "C13", fullName: "PC13 (LED Integrado)", category: "led", is5vTolerant: false, notes: "LED de usuário onboard! Active-Low: 0 acende, 1 apaga" },
  { code: "VB", fullName: "VBAT (Bateria RTC)", category: "power", is5vTolerant: false, notes: "Alimentação de backup para registradores de backup e RTC" },
];

// 20 Pins of Right Rail (when board is held vertically with USB at TOP)
const RIGHT_PINS_VERTICAL: PinMeta[] = [
  { code: "B12", fullName: "PB12 / SPI2 NSS", category: "spi", is5vTolerant: true, notes: "SPI2 Chip Select, Timer 1 Break Input (5V Tolerant)", isSquare: true },
  { code: "B13", fullName: "PB13 / SPI2 SCK", category: "spi", is5vTolerant: true, notes: "SPI2 Clock, Timer 1 Canal 1N (5V Tolerant)" },
  { code: "B14", fullName: "PB14 / SPI2 MISO", category: "spi", is5vTolerant: true, notes: "SPI2 Master In, Timer 1 Canal 2N (5V Tolerant)" },
  { code: "B15", fullName: "PB15 / SPI2 MOSI", category: "spi", is5vTolerant: true, notes: "SPI2 Master Out, Timer 1 Canal 3N (5V Tolerant)" },
  { code: "A8", fullName: "PA8 / MCO / TIM1_CH1", category: "gpio", is5vTolerant: true, notes: "Saída de clock MCO, Timer 1 Canal 1 (5V Tolerant)" },
  { code: "A9", fullName: "PA9 / USART1 TX", category: "uart", is5vTolerant: true, notes: "Transmissor serial principal USART1 TX (5V Tolerant)" },
  { code: "A10", fullName: "PA10 / USART1 RX", category: "uart", is5vTolerant: true, notes: "Receptor serial principal USART1 RX (5V Tolerant)" },
  { code: "A11", fullName: "PA11 / USB DM (D-)", category: "gpio", is5vTolerant: true, notes: "Linha USB Data-, CAN RX (5V Tolerant)" },
  { code: "A12", fullName: "PA12 / USB DP (D+)", category: "gpio", is5vTolerant: true, notes: "Linha USB Data+, CAN TX (5V Tolerant)" },
  { code: "A15", fullName: "PA15 / JTDI", category: "gpio", is5vTolerant: true, notes: "JTAG TDI / SPI1 NSS remapeado (5V Tolerant)" },
  { code: "B3", fullName: "PB3 / JTDO", category: "gpio", is5vTolerant: true, notes: "JTAG TDO / SPI1 SCK remapeado (5V Tolerant)" },
  { code: "B4", fullName: "PB4 / JTRST", category: "gpio", is5vTolerant: true, notes: "JTAG TRST / SPI1 MISO remapeado (5V Tolerant)" },
  { code: "B5", fullName: "PB5 / TIM3_CH2", category: "gpio", is5vTolerant: false, notes: "Timer 3 Canal 2, SPI1 MOSI remapeado" },
  { code: "B6", fullName: "PB6 / I2C1 SCL", category: "i2c", is5vTolerant: true, notes: "I2C1 Clock (SCL), Timer 4 Canal 1 (5V Tolerant)" },
  { code: "B7", fullName: "PB7 / I2C1 SDA", category: "i2c", is5vTolerant: true, notes: "I2C1 Dados (SDA), Timer 4 Canal 2 (5V Tolerant)" },
  { code: "B8", fullName: "PB8 / I2C1 SCL (r)", category: "i2c", is5vTolerant: true, notes: "I2C1 SCL remapeado, CAN RX, Timer 4 Canal 3 (5V FT)" },
  { code: "B9", fullName: "PB9 / I2C1 SDA (r)", category: "i2c", is5vTolerant: true, notes: "I2C1 SDA remapeado, CAN TX, Timer 4 Canal 4 (5V FT)" },
  { code: "5V", fullName: "5V (VBUS / Entrada)", category: "power", is5vTolerant: true, notes: "Entrada/Saída de 5V compartilhada com USB" },
  { code: "G", fullName: "GND (Terra)", category: "power", is5vTolerant: false, notes: "Referência comum de terra (0V)" },
  { code: "3V3", fullName: "3.3V (Saída Regulador)", category: "power", is5vTolerant: false, notes: "Saída de 3.3V da placa" },
];

// SWD 4-pin bottom header
const SWD_PINS_VERTICAL: PinMeta[] = [
  { code: "GND", fullName: "GND (Terra SWD - Pino 4)", category: "swd", is5vTolerant: false, notes: "Fio Preto: Referência de 0V do gravador ST-Link" },
  { code: "SCK", fullName: "SWCLK / PA14 (Clock - Pino 3)", category: "swd", is5vTolerant: false, notes: "Fio Verde: Clock de sincronismo SWD" },
  { code: "DIO", fullName: "SWDIO / PA13 (Dados - Pino 2)", category: "swd", is5vTolerant: false, notes: "Fio Laranja: Linha de dados bidirecional SWD" },
  { code: "3V3", fullName: "3.3V (Alimentação SWD - Pino 1)", category: "swd", is5vTolerant: false, notes: "Fio Vermelho: Alimentação positiva do ST-Link V2 (Nunca 5V!)" },
];

export const BluePillSilkscreenDiagram: React.FC<BluePillSilkscreenDiagramProps> = ({
  onPinClick,
}) => {
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [colorMode, setColorMode] = useState<"silkscreen" | "dark">("silkscreen");
  const [hoveredPin, setHoveredPin] = useState<PinMeta | null>(null);
  const [selectedPin, setSelectedPin] = useState<PinMeta | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  const isDark = colorMode === "dark";
  const activePin = hoveredPin || selectedPin;

  const handleCopy = () => {
    if (activePin) {
      navigator.clipboard.writeText(activePin.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSelectPin = (pin: PinMeta) => {
    // Keep pin fixed in place, toggling selection or updating
    if (selectedPin?.code === pin.code) {
      setSelectedPin(null);
    } else {
      setSelectedPin(pin);
      onPinClick?.(pin.code);
    }
  };

  const isPinActive = (pin: PinMeta) => {
    return hoveredPin?.code === pin.code || selectedPin?.code === pin.code;
  };

  // Peripheral count stats for the interactive breakdown chart
  const peripheralStats = [
    { label: "GPIOs Livres", count: 32, cat: "gpio", color: "#3b82f6", desc: "Portas de entrada e saída digital configuráveis" },
    { label: "ADC 12-bit", count: 10, cat: "adc", color: "#f59e0b", desc: "10 entradas analógicas (PA0-PA7, PB0, PB1 - Máx 3.6V)" },
    { label: "5V Tolerant (FT)", count: 16, cat: "ft", color: "#10b981", desc: "Pinos que aceitam nível lógico 5V diretamente" },
    { label: "USART / Serial", count: 3, cat: "uart", color: "#6366f1", desc: "USART1 (PA9/10), USART2 (PA2/3), USART3 (PB10/11)" },
    { label: "I2C Bus", count: 2, cat: "i2c", color: "#06b6d4", desc: "I2C1 (PB6/PB7) e I2C2 (PB10/PB11)" },
    { label: "SPI Bus", count: 2, cat: "spi", color: "#ec4899", desc: "SPI1 (PA4-PA7) e SPI2 (PB12-PB15)" },
    { label: "Programação SWD", count: 4, cat: "swd", color: "#a855f7", desc: "3.3V, SWCLK, SWDIO, GND na barra de gravação" },
    { label: "LED Usuário", count: 1, cat: "led", color: "#10b981", desc: "PC13 (Lógica invertida / Active-Low)" },
  ];

  // Static Pin Rendering Helper: Guaranteed ZERO movement/scale/jitter
  const renderStaticPin = (pin: PinMeta, px: number, py: number) => {
    const active = isPinActive(pin);
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : selectedCategory === "ft"
        ? pin.is5vTolerant
        : selectedCategory === pin.category;

    // Stroke Color logic
    let strokeColor = "#64748b";
    let strokeWidth = 1.5;

    if (active) {
      strokeColor = "#9333ea"; // Vibrant Purple for active pin
      strokeWidth = 3;
    } else if (selectedCategory !== "all" && matchesCategory) {
      strokeColor = selectedCategory === "ft" ? "#10b981" : "#3b82f6";
      strokeWidth = 2.5;
    }

    const opacity = selectedCategory !== "all" && !matchesCategory && !active ? 0.35 : 1;

    return (
      <g
        key={`pin-shape-${pin.code}-${px}-${py}`}
        className="cursor-pointer"
        opacity={opacity}
        onMouseEnter={() => setHoveredPin(pin)}
        onMouseLeave={() => setHoveredPin(null)}
        onClick={() => handleSelectPin(pin)}
      >
        {/* Completely static outer ring when active (Zero transform, zero movement) */}
        {active && (
          pin.isSquare ? (
            <rect
              x={px - 18}
              y={py - 18}
              width="36"
              height="36"
              rx="4"
              fill="none"
              stroke="#9333ea"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              pointerEvents="none"
            />
          ) : (
            <circle
              cx={px}
              cy={py}
              r="18"
              fill="none"
              stroke="#9333ea"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              pointerEvents="none"
            />
          )
        )}

        {/* Pin Pad: Position is 100% stationary */}
        {pin.isSquare ? (
          <rect
            x={px - 14}
            y={py - 14}
            width="28"
            height="28"
            fill="url(#vPadGrad)"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        ) : (
          <circle
            cx={px}
            cy={py}
            r="14"
            fill="url(#vPadGrad)"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}

        {/* Center Drilled Hole */}
        <circle cx={px} cy={py} r="6.5" fill="url(#vHoleGrad)" pointerEvents="none" />
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-600 animate-pulse"></div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Gráfico Interativo de Pinagem da Blue Pill
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Desenho técnico da placa posicionado na vertical, fiel à serigrafia original e sem medidas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Orientation switch */}
          <button
            onClick={() => setOrientation(orientation === "vertical" ? "horizontal" : "vertical")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-purple-200 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-all cursor-pointer shadow-2xs"
            title="Alternar entre orientação vertical e horizontal"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Orientação: {orientation === "vertical" ? "Vertical (Padrão)" : "Horizontal"}</span>
          </button>

          {/* Theme switch */}
          <button
            onClick={() => setColorMode(colorMode === "silkscreen" ? "dark" : "silkscreen")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            {isDark ? "🌙 Modo CAD Escuro" : "📄 Silkscreen Branco"}
          </button>
        </div>
      </div>

      {/* Interactive Peripherals Distribution Chart (Filter Buttons) */}
      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
            <span>Destaque por Função Periférica (Clique para destacar na placa):</span>
          </span>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Limpar Filtro
            </button>
          )}
        </div>

        {/* Distribution Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {peripheralStats.map((stat) => (
            <button
              key={stat.cat}
              onClick={() => setSelectedCategory(selectedCategory === stat.cat ? "all" : stat.cat)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                selectedCategory === stat.cat
                  ? "bg-white dark:bg-slate-800 ring-2 ring-purple-500 shadow-sm border-transparent"
                  : "bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-300"
              }`}
              title={stat.desc}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">
                  {stat.label}
                </span>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: stat.color }}
                ></span>
              </div>
              <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                {stat.count} <span className="text-[10px] font-normal text-slate-400">pinos</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pin Detail Banner */}
      <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-black px-2.5 py-1 rounded-lg bg-purple-600 text-white shadow-2xs flex-shrink-0">
            {activePin ? activePin.code : "PC13"}
          </span>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
              <span>{activePin ? activePin.fullName : "PC13 (LED Integrado - Active-Low)"}</span>
              {activePin?.is5vTolerant && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  5V Tolerant (FT)
                </span>
              )}
              {selectedPin && (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Fixado
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400">
              {activePin ? activePin.notes : "Clique ou passe o mouse nos pinos da placa para inspecionar cada sinal."}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {selectedPin && (
            <button
              onClick={() => setSelectedPin(null)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Desmarcar pino fixado"
            >
              <X className="w-3 h-3" />
              <span>Desafixar</span>
            </button>
          )}

          {activePin && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copiado!" : "Copiar"}</span>
            </button>
          )}
        </div>
      </div>

      {/* DRAWING CONTAINER: VERTICAL vs HORIZONTAL */}
      <div className="w-full rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-xl bg-white dark:bg-[#070b14] p-4 sm:p-8 flex justify-center overflow-x-auto">
        {orientation === "vertical" ? (
          /* ========================================================================= */
          /* VERTICAL BLUE PILL BOARD DRAWING (Natural breadboard orientation)        */
          /* ========================================================================= */
          <div className="w-full max-w-[540px] flex justify-center">
            <svg
              viewBox="0 0 540 1060"
              className="w-full h-auto select-none"
              style={{
                background: isDark ? "#0b1120" : "#ffffff",
                borderRadius: "16px",
              }}
            >
              <defs>
                <radialGradient id="vPadGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="65%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
                <radialGradient id="vHoleGrad" cx="45%" cy="45%" r="50%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
              </defs>

              {/* Outer Board Outline in Purple (Vertical aspect ratio) */}
              <rect
                x="50"
                y="30"
                width="440"
                height="980"
                rx="20"
                ry="20"
                fill={isDark ? "#0f172a" : "#ffffff"}
                stroke="#800080"
                strokeWidth="5.5"
              />

              {/* Vertical Green Silkscreen Separation Lines */}
              <line x1="125" y1="40" x2="125" y2="920" stroke="#008000" strokeWidth="4.5" />
              <line x1="415" y1="40" x2="415" y2="920" stroke="#008000" strokeWidth="4.5" />

              {/* TOP: MICRO-USB CONNECTOR */}
              <g>
                <rect x="230" y="32" width="80" height="40" rx="4" fill="#334155" />
                <rect x="242" y="38" width="56" height="28" rx="2" fill="#cbd5e1" />
                <rect x="252" y="44" width="36" height="16" rx="1" fill="#475569" />
                {/* Micro USB SMD pads in Red */}
                <g fill="#e11d48">
                  <rect x="235" y="76" width="10" height="14" />
                  <rect x="250" y="76" width="10" height="14" />
                  <rect x="265" y="76" width="10" height="14" />
                  <rect x="280" y="76" width="10" height="14" />
                  <rect x="295" y="76" width="10" height="14" />
                </g>
              </g>

              {/* JUMPERS NRST & BOOT0 SECTION */}
              <g transform="translate(180, 115)">
                {/* NRST Silkscreen */}
                <text x="50" y="24" fill="#008000" fontSize="18" fontWeight="900" fontFamily="sans-serif">
                  NRST
                </text>
                {/* Jumper 1: NRST */}
                <rect x="10" y="32" width="76" height="42" rx="4" fill="none" stroke="#008000" strokeWidth="3" />
                <rect x="24" y="38" width="48" height="30" rx="12" fill="none" stroke="#008000" strokeWidth="2.5" />
                <rect x="2" y="40" width="10" height="12" fill="#e11d48" />
                <rect x="84" y="40" width="10" height="12" fill="#e11d48" />

                {/* Jumper 2: BOOT0 */}
                <rect x="10" y="86" width="76" height="42" rx="4" fill="none" stroke="#008000" strokeWidth="3" />
                <rect x="24" y="92" width="48" height="30" rx="12" fill="none" stroke="#008000" strokeWidth="2.5" />
                <rect x="2" y="94" width="10" height="12" fill="#e11d48" />
                <rect x="84" y="94" width="10" height="12" fill="#e11d48" />
                {/* BOOT0 Silkscreen */}
                <text x="48" y="145" fill="#008000" fontSize="18" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
                  BOOT0
                </text>
              </g>

              {/* CENTER: STM32F103 MICROCONTROLLER (LQFP-48 Diamond) */}
              <g transform="translate(270, 420)">
                <rect
                  x="-65"
                  y="-65"
                  width="130"
                  height="130"
                  rx="4"
                  transform="rotate(45)"
                  fill={isDark ? "#1e293b" : "#ffffff"}
                  stroke="#008000"
                  strokeWidth="4"
                />
                <circle cx="0" cy="46" r="7" fill="#008000" />
                <text x="0" y="4" fill="#008000" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  STM32
                </text>

                {/* 48 RED PINS (12 on each of the 4 angled sides) */}
                <g transform="rotate(45)" fill="#e11d48">
                  {[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((pos, i) => (
                    <React.Fragment key={`v-ic-${i}`}>
                      <rect x="70" y={pos - 2.5} width="20" height="5" />
                      <rect x={pos - 2.5} y="70" width="5" height="20" />
                      <rect x="-90" y={pos - 2.5} width="20" height="5" />
                      <rect x={pos - 2.5} y="-90" width="5" height="20" />
                    </React.Fragment>
                  ))}
                </g>
              </g>

              {/* CRYSTALS, BUTTON KEY, LED PWR */}
              <g transform="translate(190, 600)">
                {/* Crystal 8MHz */}
                <rect x="52" y="10" width="56" height="24" rx="12" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                <text x="80" y="26" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="mono">
                  8.000
                </text>
                {/* PB2 */}
                <text x="24" y="60" fill="#008000" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                  PB2
                </text>

                {/* KEY / Reset button */}
                <rect x="42" y="80" width="76" height="42" rx="4" fill="none" stroke="#008000" strokeWidth="3" />
                <rect x="54" y="86" width="52" height="30" rx="12" fill="none" stroke="#008000" strokeWidth="2.5" />
                <rect x="34" y="88" width="10" height="12" fill="#e11d48" />
                <rect x="116" y="88" width="10" height="12" fill="#e11d48" />
                <text x="24" y="106" fill="#008000" fontSize="14" fontWeight="900" fontFamily="sans-serif">
                  KEY
                </text>

                {/* PWR LED */}
                <text x="32" y="150" fill="#008000" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                  PWR
                </text>
                <rect x="80" y="138" width="12" height="14" fill="#e11d48" />
              </g>

              {/* BOTTOM: SWD 4-PIN CONNECTOR */}
              <g transform="translate(170, 870)">
                <rect x="20" y="10" width="160" height="32" rx="4" fill="#008000" />
                <circle cx="50" cy="26" r="8" fill="url(#vPadGrad)" stroke="#475569" strokeWidth="1" />
                <circle cx="100" cy="26" r="8" fill="url(#vPadGrad)" stroke="#475569" strokeWidth="1" />
                <circle cx="150" cy="26" r="8" fill="url(#vPadGrad)" stroke="#475569" strokeWidth="1" />

                {/* 4 SWD Pins */}
                {SWD_PINS_VERTICAL.map((pin, i) => {
                  const px = 25 + i * 42;
                  const active = isPinActive(pin);
                  return (
                    <g
                      key={`swd-${pin.code}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPin(pin)}
                      onMouseLeave={() => setHoveredPin(null)}
                      onClick={() => handleSelectPin(pin)}
                    >
                      <polyline
                        points={`${px - 14},48 ${px - 14},86 ${px + 14},86 ${px + 14},48`}
                        fill="none"
                        stroke={active ? "#9333ea" : "#008000"}
                        strokeWidth={active ? "3.5" : "2.5"}
                      />
                      <text
                        x={px}
                        y={72}
                        fill={active ? "#9333ea" : "#008000"}
                        fontSize="13"
                        fontWeight="900"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {pin.code}
                      </text>
                    </g>
                  );
                })}
                <text x="180" y="72" fill="#008000" fontSize="16" fontWeight="900" fontFamily="sans-serif">
                  SW
                </text>
              </g>

              {/* 20 LEFT PINS & SILK LABELS (Vertical rail: y = 80 to 860, step = 41.5px) */}
              {LEFT_PINS_VERTICAL.map((pin, index) => {
                const py = 82 + index * 41.5;
                const px = 90;
                const active = isPinActive(pin);
                return (
                  <g key={`v-left-grp-${pin.code}-${index}`}>
                    {/* Silkscreen Pin Name (inside board) */}
                    <text
                      x="142"
                      y={py + 6}
                      fill={active ? "#9333ea" : "#008000"}
                      fontSize={pin.code.length > 2 ? "16" : "18"}
                      fontWeight="900"
                      fontFamily="system-ui, sans-serif"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPin(pin)}
                      onMouseLeave={() => setHoveredPin(null)}
                      onClick={() => handleSelectPin(pin)}
                    >
                      {pin.code}
                    </text>

                    {/* Pad Render: Pure stationary */}
                    {renderStaticPin(pin, px, py)}
                  </g>
                );
              })}

              {/* 20 RIGHT PINS & SILK LABELS (Vertical rail: y = 80 to 860, step = 41.5px) */}
              {RIGHT_PINS_VERTICAL.map((pin, index) => {
                const py = 82 + index * 41.5;
                const px = 450;
                const active = isPinActive(pin);
                return (
                  <g key={`v-right-grp-${pin.code}-${index}`}>
                    {/* Silkscreen Pin Name (inside board) */}
                    <text
                      x="398"
                      y={py + 6}
                      fill={active ? "#9333ea" : "#008000"}
                      fontSize={pin.code.length > 2 ? "16" : "18"}
                      fontWeight="900"
                      textAnchor="end"
                      fontFamily="system-ui, sans-serif"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPin(pin)}
                      onMouseLeave={() => setHoveredPin(null)}
                      onClick={() => handleSelectPin(pin)}
                    >
                      {pin.code}
                    </text>

                    {/* Pad Render: Pure stationary */}
                    {renderStaticPin(pin, px, py)}
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* ========================================================================= */
          /* HORIZONTAL BLUE PILL BOARD DRAWING                                        */
          /* ========================================================================= */
          <div className="min-w-[780px] max-w-[940px] w-full">
            <svg
              viewBox="0 0 940 910"
              className="w-full h-auto select-none"
              style={{
                background: isDark ? "#0b1120" : "#ffffff",
                borderRadius: "16px",
              }}
            >
              <defs>
                <radialGradient id="vPadGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="65%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
                <radialGradient id="vHoleGrad" cx="45%" cy="45%" r="50%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
              </defs>

              {/* Purple Outer Box */}
              <rect
                x="70"
                y="60"
                width="820"
                height="790"
                rx="18"
                ry="18"
                fill={isDark ? "#0f172a" : "#ffffff"}
                stroke="#800080"
                strokeWidth="5.5"
              />

              {/* Horizontal Green Silkscreen Lines */}
              <line x1="76" y1="205" x2="840" y2="205" stroke="#008000" strokeWidth="5" />
              <line x1="76" y1="705" x2="840" y2="705" stroke="#008000" strokeWidth="5" />

              {/* Top Row Pins & Labels */}
              {LEFT_PINS_VERTICAL.map((pin, i) => {
                const px = 92 + i * 40;
                const py = 164;
                const active = isPinActive(pin);
                return (
                  <g key={`h-top-${pin.code}-${i}`}>
                    <text
                      x={px}
                      y={118}
                      fill={active ? "#9333ea" : "#008000"}
                      fontSize={pin.code.length > 2 ? "19" : "21"}
                      fontWeight="900"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPin(pin)}
                      onMouseLeave={() => setHoveredPin(null)}
                      onClick={() => handleSelectPin(pin)}
                    >
                      {pin.code}
                    </text>
                    {renderStaticPin(pin, px, py)}
                  </g>
                );
              })}

              {/* Bottom Row Pins & Labels */}
              {RIGHT_PINS_VERTICAL.map((pin, i) => {
                const px = 92 + i * 40;
                const py = 746;
                const active = isPinActive(pin);
                return (
                  <g key={`h-btm-${pin.code}-${i}`}>
                    <text
                      x={px}
                      y={796}
                      fill={active ? "#9333ea" : "#008000"}
                      fontSize={pin.code.length > 2 ? "19" : "21"}
                      fontWeight="900"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPin(pin)}
                      onMouseLeave={() => setHoveredPin(null)}
                      onClick={() => handleSelectPin(pin)}
                    >
                      {pin.code}
                    </text>
                    {renderStaticPin(pin, px, py)}
                  </g>
                );
              })}

              {/* Left USB area */}
              <rect x="110" y="270" width="26" height="42" rx="4" fill="#334155" />
              <rect x="175" y="270" width="26" height="42" rx="4" fill="#334155" />
              <rect x="110" y="598" width="26" height="42" rx="4" fill="#334155" />
              <rect x="175" y="598" width="26" height="42" rx="4" fill="#334155" />

              {/* NRST & BOOT0 */}
              <text x="320" y="266" fill="#008000" fontSize="24" fontWeight="900" fontFamily="sans-serif">
                NRST
              </text>
              <rect x="284" y="306" width="72" height="88" rx="6" fill="none" stroke="#008000" strokeWidth="4" />
              <rect x="294" y="320" width="52" height="60" rx="18" fill="none" stroke="#008000" strokeWidth="3.5" />

              <rect x="284" y="464" width="72" height="88" rx="6" fill="none" stroke="#008000" strokeWidth="4" />
              <rect x="294" y="478" width="52" height="60" rx="18" fill="none" stroke="#008000" strokeWidth="3.5" />
              <text x="320" y="600" fill="#008000" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                BOOT0
              </text>

              {/* Center MCU */}
              <g transform="translate(485, 455)">
                <rect
                  x="-70"
                  y="-70"
                  width="140"
                  height="140"
                  rx="4"
                  transform="rotate(45)"
                  fill={isDark ? "#1e293b" : "#ffffff"}
                  stroke="#008000"
                  strokeWidth="4"
                />
                <circle cx="50" cy="0" r="8" fill="#008000" />
                <g transform="rotate(45)" fill="#e11d48">
                  {[-55, -45, -35, -25, -15, -5, 5, 15, 25, 35, 45, 55].map((pos, i) => (
                    <React.Fragment key={`h-ic-${i}`}>
                      <rect x="75" y={pos - 2.5} width="22" height="5" />
                      <rect x={pos - 2.5} y="75" width="5" height="22" />
                      <rect x="-97" y={pos - 2.5} width="22" height="5" />
                      <rect x={pos - 2.5} y="-97" width="5" height="22" />
                    </React.Fragment>
                  ))}
                </g>
              </g>

              {/* Right SWD Connector */}
              <g>
                <rect x="796" y="345" width="30" height="175" rx="5" fill="#008000" />
                <circle cx="811" cy="380" r="9" fill="url(#vPadGrad)" stroke="#475569" strokeWidth="1.5" />
                <circle cx="811" cy="432" r="9" fill="url(#vPadGrad)" stroke="#475569" strokeWidth="1.5" />
                <circle cx="811" cy="485" r="9" fill="url(#vPadGrad)" stroke="#475569" strokeWidth="1.5" />
                <polyline points="840,265 858,265 858,630 840,630" fill="none" stroke="#008000" strokeWidth="5" />
                <text x="895" y="278" fill="#008000" fontSize="22" fontWeight="900" fontFamily="sans-serif">GND</text>
                <text x="895" y="358" fill="#008000" fontSize="22" fontWeight="900" fontFamily="sans-serif">SCK</text>
                <text x="895" y="440" fill="#008000" fontSize="22" fontWeight="900" fontFamily="sans-serif">DIO</text>
                <text x="895" y="525" fill="#008000" fontSize="22" fontWeight="900" fontFamily="sans-serif">3V3</text>
                <text x="888" y="620" fill="#008000" fontSize="24" fontWeight="900" fontFamily="sans-serif">SW</text>
              </g>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
