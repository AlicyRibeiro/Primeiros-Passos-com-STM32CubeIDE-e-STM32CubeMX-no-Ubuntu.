import React, { useState } from "react";
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  SlidersHorizontal,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  RotateCw,
} from "lucide-react";

interface STLinkConnectionDiagramProps {
  selectedWireId?: number | null;
  onSelectWire?: (wireId: number) => void;
}

export interface WireConnection {
  id: number;
  colorName: string;
  wireColor: string;
  activeColor: string;
  glowColor: string;
  stLinkPinNum: number;
  stLinkAltPinNum?: number;
  stLinkPinLabel: string;
  bluePillPinLabel: string;
  bluePillGpio: string;
  signalName: string;
  functionDesc: string;
  criticalWarning?: string;
}

// 4 Official DuPont Wires for SWD
const WIRE_CONNECTIONS: WireConnection[] = [
  {
    id: 1, // GND
    colorName: "Fio Preto",
    wireColor: "#1e293b",
    activeColor: "#64748b",
    glowColor: "#94a3b8",
    stLinkPinNum: 7,
    stLinkAltPinNum: 2,
    stLinkPinLabel: "GND (Pino 7 ou 2)",
    bluePillPinLabel: "GND (Terra)",
    bluePillGpio: "Referência Comum 0V",
    signalName: "Terra / Ground (0V)",
    functionDesc:
      "Obrigatório para equalizar a referência elétrica de 0V entre o computador (ST-Link) e a placa. Sem aterramento comum, a leitura dos sinais SWDIO e SWCLK sofre ruídos severos.",
  },
  {
    id: 2, // SWCLK
    colorName: "Fio Verde",
    wireColor: "#059669",
    activeColor: "#10b981",
    glowColor: "#34d399",
    stLinkPinNum: 8,
    stLinkPinLabel: "SWCLK (Pino 8)",
    bluePillPinLabel: "SCK / SWCLK",
    bluePillGpio: "Porta PA14 (JTCK/SWCLK)",
    signalName: "Serial Wire Clock (SWCLK)",
    functionDesc:
      "Sinal de clock serial gerado pelo gravador ST-Link. Sincroniza a transferência de cada bit de depuração e escrita na memória Flash do ARM Cortex-M3 (frequências de 500 kHz a 4 MHz).",
  },
  {
    id: 3, // SWDIO
    colorName: "Fio Laranja",
    wireColor: "#ea580c",
    activeColor: "#f97316",
    glowColor: "#fb923c",
    stLinkPinNum: 6,
    stLinkPinLabel: "SWDIO (Pino 6)",
    bluePillPinLabel: "DIO / SWDIO",
    bluePillGpio: "Porta PA13 (JTMS/SWDIO)",
    signalName: "Serial Wire Data (SWDIO)",
    functionDesc:
      "Canal serial de dados bidirecional. Por esta única linha, o STM32CubeIDE envia o firmware compilado (.bin/.hex) para a Flash e lê registradores, memória e variáveis de debug em tempo real.",
  },
  {
    id: 4, // 3.3V
    colorName: "Fio Vermelho",
    wireColor: "#dc2626",
    activeColor: "#ef4444",
    glowColor: "#f87171",
    stLinkPinNum: 9,
    stLinkAltPinNum: 4,
    stLinkPinLabel: "3.3V (Pino 9 ou 4)",
    bluePillPinLabel: "3V3 (Alimentação)",
    bluePillGpio: "Alimentação VDD (+3.3V)",
    signalName: "Alimentação Positiva (+3.3V DC)",
    functionDesc:
      "Alimenta com segurança o microcontrolador STM32F103 (tensão nominal de operação: 2.0V a 3.6V). O gravador fornece a corrente necessária para ligar o chip durante a gravação.",
    criticalWarning:
      "PERIGO: NUNCA conecte a saída de 5V (Pino 5 ou 10) do ST-Link neste pino! A tensão máxima suportada no barramento VDD é 3.6V. Ligar 5V queima o chip instantaneamente.",
  },
];

// Rail pins when board has SWD pins facing LEFT (rotated 180° so SWD faces ST-Link)
const FACING_TOP_RAIL_PINS = [
  "3V3", "G", "5V", "B9", "B8", "B7", "B6", "B5", "B4", "B3",
  "A15", "A12", "A11", "A10", "A9", "A8", "B15", "B14", "B13", "B12"
];

const FACING_BOTTOM_RAIL_PINS = [
  "VB", "C13", "C14", "C15", "A0", "A1", "A2", "A3", "A4", "A5",
  "A6", "A7", "B0", "B1", "B10", "B11", "R", "3V3", "G", "5V"
];

// Standard orientation rail pins (USB on left, SWD on right)
const STD_TOP_RAIL_PINS = [
  "5V", "G", "3V3", "R", "B11", "B10", "B1", "B0", "A7", "A6",
  "A5", "A4", "A3", "A2", "A1", "A0", "C15", "C14", "C13", "VB"
];

const STD_BOTTOM_RAIL_PINS = [
  "B12", "B13", "B14", "B15", "A8", "A9", "A10", "A11", "A12", "A15",
  "B3", "B4", "B5", "B6", "B7", "B8", "B9", "5V", "G", "3V3"
];

// ST-Link 10-pin definitions matching the reference pinout infographic
interface STLinkConnectorPin {
  num: number;
  label: string;
  badgeBg: string;
  textColor: string;
  col: "left" | "right";
  yPos: number;
}

const STLINK_10_PINS: STLinkConnectorPin[] = [
  // Left Column (1 to 5, Notch side)
  { num: 1, label: "RST", badgeBg: "#fbbf24", textColor: "#000000", col: "left", yPos: 140 },
  { num: 2, label: "GND", badgeBg: "#0f172a", textColor: "#ffffff", col: "left", yPos: 172 },
  { num: 3, label: "SWIM", badgeBg: "#38bdf8", textColor: "#000000", col: "left", yPos: 204 },
  { num: 4, label: "3.3V", badgeBg: "#ef4444", textColor: "#ffffff", col: "left", yPos: 236 },
  { num: 5, label: "5V", badgeBg: "#ef4444", textColor: "#ffffff", col: "left", yPos: 268 },

  // Right Column (6 to 10)
  { num: 6, label: "SWDIO", badgeBg: "#38bdf8", textColor: "#000000", col: "right", yPos: 140 },
  { num: 7, label: "GND", badgeBg: "#0f172a", textColor: "#ffffff", col: "right", yPos: 172 },
  { num: 8, label: "SWCLK", badgeBg: "#38bdf8", textColor: "#000000", col: "right", yPos: 204 },
  { num: 9, label: "3.3V", badgeBg: "#ef4444", textColor: "#ffffff", col: "right", yPos: 236 },
  { num: 10, label: "5V", badgeBg: "#ef4444", textColor: "#ffffff", col: "right", yPos: 268 },
];

export const STLinkConnectionDiagram: React.FC<STLinkConnectionDiagramProps> = ({
  selectedWireId: controlledWireId,
  onSelectWire,
}) => {
  const [internalWireId, setInternalWireId] = useState<number | null>(null);
  const [pinMode, setPinMode] = useState<"standard" | "alternative">("standard");
  const [animateSignals, setAnimateSignals] = useState<boolean>(true);
  // Default: "facing" (Pinos voltados para o ST-Link, no mesmo lado da conexão!)
  const [boardOrientation, setBoardOrientation] = useState<"facing" | "standard">("facing");

  const selectedWire = controlledWireId !== undefined ? controlledWireId : internalWireId;

  const handleWireClick = (id: number) => {
    const nextId = selectedWire === id ? null : id;
    setInternalWireId(nextId);
    onSelectWire?.(nextId || 0);
  };

  const activeConnection = WIRE_CONNECTIONS.find((w) => w.id === selectedWire);

  const gndPinNum = pinMode === "standard" ? 7 : 2;
  const pwrPinNum = pinMode === "standard" ? 9 : 4;

  const isFacing = boardOrientation === "facing";
  const topPins = isFacing ? FACING_TOP_RAIL_PINS : STD_TOP_RAIL_PINS;
  const bottomPins = isFacing ? FACING_BOTTOM_RAIL_PINS : STD_BOTTOM_RAIL_PINS;

  return (
    <div className="space-y-4">
      {/* Schematic Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#080d1a] border border-slate-800 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Header with Title and Mode Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Diagrama de Conexão: ST-Link V2 ➔ STM32 Blue Pill
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Placa STM32 posicionada com os pinos SWD voltados para o ST-Link V2. Clique em qualquer pino ou fio para iluminar simultaneamente o pino correspondente no outro dispositivo (ST-Link ➔ Blue Pill).
            </p>
          </div>

          {/* Quick Control Switches */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            {/* Board Orientation Toggle Button */}
            <button
              type="button"
              onClick={() => setBoardOrientation(isFacing ? "standard" : "facing")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isFacing
                  ? "bg-blue-600/20 border-blue-500 text-blue-300 font-semibold"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
              title="Girar placa Blue Pill para orientar pinos em direção ao ST-Link"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-400" />
              <span>{isFacing ? "Pinos Voltados p/ ST-Link (Frente a Frente)" : "Pinos na Direita"}</span>
            </button>

            {/* Toggle standard 6-7-8-9 vs 2-4-6-8 */}
            <div className="inline-flex items-center p-1 bg-slate-900 border border-slate-700/80 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setPinMode("standard")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  pinMode === "standard"
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Utilizar todos os 4 pinos da coluna direita do ST-Link (6, 7, 8, 9)"
              >
                Pinos 6, 7, 8, 9
              </button>
              <button
                type="button"
                onClick={() => setPinMode("alternative")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  pinMode === "alternative"
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Utilizar pinos 2 (GND) e 4 (3.3V) da coluna esquerda com 6 (SWDIO) e 8 (SWCLK)"
              >
                Pinos 2, 4, 6, 8
              </button>
            </div>

            {/* Animation Toggle */}
            <button
              type="button"
              onClick={() => setAnimateSignals(!animateSignals)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                animateSignals
                  ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
              title="Ativar/desativar pulsos luminosos de sinal nos fios"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{animateSignals ? "Pulsos On" : "Pulsos Off"}</span>
            </button>
          </div>
        </div>

        {/* Interactive Wire Quick Selector Bar */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Destacar:</span>
          <button
            type="button"
            onClick={() => {
              setInternalWireId(null);
              onSelectWire?.(0);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              selectedWire === null
                ? "bg-slate-700 text-white font-semibold"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Todos os Fios
          </button>
          {WIRE_CONNECTIONS.map((w) => {
            const isSelected = selectedWire === w.id;
            return (
              <button
                key={`btn-wire-${w.id}`}
                type="button"
                onClick={() => handleWireClick(w.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "border-white/40 text-white shadow-xs font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800"
                }`}
                style={{
                  backgroundColor: isSelected ? `${w.wireColor}ee` : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: w.wireColor === "#1e293b" ? "#94a3b8" : w.wireColor,
                  }}
                />
                <span>{w.signalName.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Master SVG Circuit and Wires Viewport */}
        <div className="w-full overflow-x-auto py-2">
          <div className="min-w-[880px] max-w-[940px] mx-auto">
            <svg
              viewBox="0 0 920 420"
              className="w-full h-auto select-none"
              style={{
                background: "#080e1c",
                borderRadius: "14px",
                border: "1px solid #1e293b",
              }}
            >
              <defs>
                {/* Metallic Pin Gradient */}
                <linearGradient id="metalPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                {/* Metallic Crystal Gradient */}
                <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="40%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>

                {/* ST-Link Blue Anodized Body Gradient */}
                <linearGradient id="stLinkBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="35%" stopColor="#2563eb" />
                  <stop offset="70%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#172554" />
                </linearGradient>

                {/* Blue Pill Board Background Gradient */}
                <linearGradient id="bluePillPcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b245a" />
                  <stop offset="50%" stopColor="#081e4b" />
                  <stop offset="100%" stopColor="#051535" />
                </linearGradient>

                {/* Wire Glow Filter */}
                <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Pin Highlight Glow Filter */}
                <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComponentTransfer in="blur" result="boost">
                    <feFuncA type="linear" slope="1.8" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="boost" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* =================================================================== */}
              {/* 1. LEFT SIDE: ST-LINK V2 USB PROGRAMMER DONGLE (x: 20 to 330)       */}
              {/* =================================================================== */}
              <g transform="translate(20, 80)">
                {/* Title badge above ST-Link */}
                <text
                  x="130"
                  y="-18"
                  fill="#93c5fd"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  ST-LINK V2 (USB Dongle)
                </text>
                <text
                  x="130"
                  y="-4"
                  fill="#64748b"
                  fontSize="9.5"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  Saída IDC 10 Pinos (com chanfro guia)
                </text>

                {/* USB-A Connector Male Plug (Plugging left towards PC) */}
                <rect x="0" y="70" width="36" height="56" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                <rect x="6" y="78" width="20" height="40" rx="2" fill="#64748b" />
                <rect x="14" y="86" width="6" height="8" fill="#1e293b" />
                <rect x="14" y="102" width="6" height="8" fill="#1e293b" />

                {/* Dongle Aluminum Extrusion Body */}
                <rect
                  x="36"
                  y="48"
                  width="120"
                  height="100"
                  rx="6"
                  fill="url(#stLinkBodyGrad)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Dongle Silk Engravings */}
                <g fill="#ffffff">
                  {/* Stylized ST logo */}
                  <path d="M 52 64 L 62 64 L 58 76 L 68 76 L 64 88 L 54 88 Z" fill="#ffffff" opacity="0.9" />
                  <text x="74" y="74" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                    ST-LINK V2
                  </text>
                  <text x="74" y="86" fontSize="7.5" fill="#bfdbfe" fontFamily="sans-serif">
                    STM8 &amp; STM32 Debugger
                  </text>

                  {/* Dual LED indicators on ST-Link body */}
                  <circle cx="60" cy="118" r="3" fill="#ef4444" />
                  <text x="68" y="121" fontSize="6.5" fill="#fca5a5" fontFamily="monospace">PWR</text>
                  <circle cx="100" cy="118" r="3" fill="#10b981" />
                  <text x="108" y="121" fontSize="6.5" fill="#6ee7b7" fontFamily="monospace">COM</text>
                </g>

                {/* Black Plastic 10-Pin Socket Header Box on right edge of dongle */}
                <rect x="156" y="46" width="16" height="104" rx="2" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />

                {/* ============================================================== */}
                {/* 10-PIN CONNECTOR DETAILED BOX (Zoomed view with Notch)         */}
                {/* ============================================================== */}
                <g transform="translate(172, 10)">
                  {/* Card Background Container */}
                  <rect
                    x="0"
                    y="0"
                    width="156"
                    height="176"
                    rx="10"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />

                  {/* Header title */}
                  <text x="78" y="16" fill="#cbd5e1" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    CONECTOR 10 PINOS COM NOTCH
                  </text>

                  {/* Shroud Box with Guide Notch on the LEFT edge */}
                  <path
                    d="M 52 26 L 104 26 L 104 162 L 52 162 L 52 104 L 58 104 L 58 84 L 52 84 Z"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth="3.5"
                    strokeLinejoin="miter"
                  />

                  {/* Notch text callout */}
                  <text x="46" y="96" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">
                    CHANFRO ➔
                  </text>

                  {/* Left Column Pins (1 to 5) */}
                  {STLINK_10_PINS.filter((p) => p.col === "left").map((pin, idx) => {
                    const py = 40 + idx * 26;
                    const isGnd = pin.num === 2 && pinMode === "alternative";
                    const is3V3 = pin.num === 4 && pinMode === "alternative";
                    const isHighlighted =
                      (selectedWire === 1 && isGnd) ||
                      (selectedWire === 4 && is3V3);
                    const hlColor = selectedWire === 1 ? "#64748b" : "#ef4444";

                    return (
                      <g
                        key={`stl-pin-l-${pin.num}`}
                        className="cursor-pointer group"
                        onClick={() => {
                          if (pin.num === 2) {
                            setPinMode("alternative");
                            handleWireClick(1);
                          } else if (pin.num === 4) {
                            setPinMode("alternative");
                            handleWireClick(4);
                          }
                        }}
                      >
                        {/* Glowing Halo around Pin & Badge when Selected */}
                        {isHighlighted && (
                          <>
                            <circle
                              cx="65.5"
                              cy={py}
                              r="9"
                              fill={hlColor}
                              opacity="0.5"
                              filter="url(#pinGlow)"
                            />
                            <circle
                              cx="65.5"
                              cy={py}
                              r="13"
                              fill="none"
                              stroke={hlColor}
                              strokeWidth="1.5"
                              opacity="0.8"
                            >
                              <animate
                                attributeName="r"
                                values="7;14;7"
                                dur="1.8s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.9;0.1;0.9"
                                dur="1.8s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        )}

                        {/* Pin Metal Dot */}
                        <rect
                          x="63"
                          y={py - 2.5}
                          width="5"
                          height="5"
                          fill={isHighlighted ? hlColor : "#000000"}
                          stroke={isHighlighted ? "#ffffff" : "none"}
                          strokeWidth={isHighlighted ? "1" : "0"}
                        />

                        {/* Label Badge Pill (left side) */}
                        <rect
                          x="12"
                          y={py - 8}
                          width="34"
                          height="16"
                          rx="8"
                          fill={isHighlighted ? hlColor : pin.badgeBg}
                          stroke={isHighlighted ? "#ffffff" : "#000000"}
                          strokeWidth={isHighlighted ? "2.5" : "1"}
                          filter={isHighlighted ? "url(#pinGlow)" : undefined}
                          className="transition-all duration-200"
                        />
                        <text
                          x="29"
                          y={py + 3.5}
                          fill={isHighlighted ? "#ffffff" : pin.textColor}
                          fontSize={isHighlighted ? "8.5" : "8"}
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {pin.label}
                        </text>

                        {/* Pin Number */}
                        <text
                          x="55"
                          y={py + 3}
                          fill={isHighlighted ? "#38bdf8" : "#cbd5e1"}
                          fontSize={isHighlighted ? "9" : "8"}
                          fontWeight="bold"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {pin.num}
                        </text>
                      </g>
                    );
                  })}

                  {/* Right Column Pins (6 to 10) */}
                  {STLINK_10_PINS.filter((p) => p.col === "right").map((pin, idx) => {
                    const py = 40 + idx * 26;
                    const isWire6 = pin.num === 6; // SWDIO
                    const isWire7 = pin.num === 7 && pinMode === "standard"; // GND standard
                    const isWire8 = pin.num === 8; // SWCLK
                    const isWire9 = pin.num === 9 && pinMode === "standard"; // 3.3V standard
                    const isConnected = isWire6 || isWire7 || isWire8 || isWire9;
                    const isHighlighted =
                      (selectedWire === 3 && isWire6) ||
                      (selectedWire === 1 && isWire7) ||
                      (selectedWire === 2 && isWire8) ||
                      (selectedWire === 4 && isWire9);

                    const hlColor =
                      pin.num === 6
                        ? "#f97316"
                        : pin.num === 7
                        ? "#64748b"
                        : pin.num === 8
                        ? "#10b981"
                        : pin.num === 9
                        ? "#ef4444"
                        : "#38bdf8";

                    return (
                      <g
                        key={`stl-pin-r-${pin.num}`}
                        className="cursor-pointer group"
                        onClick={() => {
                          if (pin.num === 6) handleWireClick(3);
                          else if (pin.num === 7) {
                            setPinMode("standard");
                            handleWireClick(1);
                          } else if (pin.num === 8) handleWireClick(2);
                          else if (pin.num === 9) {
                            setPinMode("standard");
                            handleWireClick(4);
                          }
                        }}
                      >
                        {/* Glowing Halo around Pin & Badge when Selected */}
                        {isHighlighted && (
                          <>
                            <circle
                              cx="90.5"
                              cy={py}
                              r="9"
                              fill={hlColor}
                              opacity="0.5"
                              filter="url(#pinGlow)"
                            />
                            <circle
                              cx="90.5"
                              cy={py}
                              r="13"
                              fill="none"
                              stroke={hlColor}
                              strokeWidth="1.5"
                              opacity="0.8"
                            >
                              <animate
                                attributeName="r"
                                values="7;14;7"
                                dur="1.8s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.9;0.1;0.9"
                                dur="1.8s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        )}

                        {/* Pin Metal Dot */}
                        <rect
                          x="88"
                          y={py - 2.5}
                          width="5"
                          height="5"
                          fill={isHighlighted ? hlColor : "#000000"}
                          stroke={isHighlighted ? "#ffffff" : "none"}
                          strokeWidth={isHighlighted ? "1" : "0"}
                        />

                        {/* Pin Number */}
                        <text
                          x="100"
                          y={py + 3}
                          fill={isHighlighted ? "#38bdf8" : "#cbd5e1"}
                          fontSize={isHighlighted ? "9" : "8"}
                          fontWeight="bold"
                          textAnchor="start"
                          fontFamily="monospace"
                        >
                          {pin.num}
                        </text>

                        {/* Label Badge Pill (right side) */}
                        <rect
                          x="110"
                          y={py - 8}
                          width="38"
                          height="16"
                          rx="8"
                          fill={isHighlighted ? hlColor : pin.badgeBg}
                          stroke={isHighlighted ? "#ffffff" : isConnected ? "#38bdf8" : "#000000"}
                          strokeWidth={isHighlighted ? "2.5" : isConnected ? "1.5" : "1"}
                          filter={isHighlighted ? "url(#pinGlow)" : undefined}
                          className="transition-all duration-200"
                        />
                        <text
                          x="129"
                          y={py + 3.5}
                          fill={isHighlighted ? "#ffffff" : pin.textColor}
                          fontSize={isHighlighted ? "8.5" : "8"}
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {pin.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>

              {/* =================================================================== */}
              {/* 2. RIGHT SIDE: STM32 BLUE PILL BOARD                                */}
              {/* When isFacing=true: Board rotated 180° so SWD header is on the LEFT */}
              {/* facing directly towards the ST-Link V2!                             */}
              {/* =================================================================== */}
              <g transform="translate(520, 60)">
                {/* Title above Blue Pill */}
                <text
                  x="185"
                  y="-18"
                  fill="#93c5fd"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  STM32F103C8T6 (Blue Pill)
                </text>
                <text
                  x="185"
                  y="-4"
                  fill="#64748b"
                  fontSize="9.5"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  {isFacing
                    ? "Pinos SWD voltados para o ST-Link (Frente a Frente)"
                    : "Pinos SWD na extremidade direita"}
                </text>

                {/* Blue PCB Board Outline with rounded corners */}
                <rect
                  x="0"
                  y="0"
                  width="370"
                  height="220"
                  rx="10"
                  ry="10"
                  fill="url(#bluePillPcbGrad)"
                  stroke="#1d4ed8"
                  strokeWidth="2.5"
                />

                {/* Silkscreen Lines */}
                <line x1="20" y1="36" x2="350" y2="36" stroke="#22c55e" strokeWidth="0.8" opacity="0.6" />
                <line x1="20" y1="184" x2="350" y2="184" stroke="#22c55e" strokeWidth="0.8" opacity="0.6" />

                {/* Micro-USB Port: */}
                {/* When isFacing is true, Micro-USB is on RIGHT edge! */}
                {/* When isFacing is false, Micro-USB is on LEFT edge! */}
                {isFacing ? (
                  <g transform="translate(360, 85)">
                    <rect x="0" y="0" width="22" height="50" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                    <rect x="5" y="10" width="12" height="30" rx="2" fill="#1e293b" />
                    <text x="14" y="28" fill="#94a3b8" fontSize="6" fontWeight="bold" transform="rotate(-90 14 28)" textAnchor="middle">
                      USB
                    </text>
                  </g>
                ) : (
                  <g transform="translate(-12, 85)">
                    <rect x="0" y="0" width="22" height="50" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                    <rect x="5" y="10" width="12" height="30" rx="2" fill="#1e293b" />
                    <text x="14" y="28" fill="#94a3b8" fontSize="6" fontWeight="bold" transform="rotate(-90 14 28)" textAnchor="middle">
                      USB
                    </text>
                  </g>
                )}

                {/* Top Pin Header Row (20 Pins) with silkscreen names */}
                {topPins.map((pinName, i) => {
                  const px = 20 + i * 16.5;
                  return (
                    <g key={`bp-t-pin-${i}`}>
                      <circle cx={px} cy={22} r="4.2" fill="#0f172a" stroke="#94a3b8" strokeWidth="0.8" />
                      <circle cx={px} cy={22} r="1.8" fill="#64748b" />
                      <text
                        x={px}
                        y={12}
                        fill="#cbd5e1"
                        fontSize="6"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {pinName}
                      </text>
                    </g>
                  );
                })}

                {/* Bottom Pin Header Row (20 Pins) with silkscreen names */}
                {bottomPins.map((pinName, i) => {
                  const px = 20 + i * 16.5;
                  return (
                    <g key={`bp-b-pin-${i}`}>
                      <circle cx={px} cy={198} r="4.2" fill="#0f172a" stroke="#94a3b8" strokeWidth="0.8" />
                      <circle cx={px} cy={198} r="1.8" fill="#64748b" />
                      <text
                        x={px}
                        y={212}
                        fill="#cbd5e1"
                        fontSize="6"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {pinName}
                      </text>
                    </g>
                  );
                })}

                {/* Board Components (Jumpers, Button, MCU, Crystal, LEDs) */}
                {isFacing ? (
                  /* Rotated 180° layout: Jumpers, Button and USB are on the RIGHT; SWD on the LEFT */
                  <>
                    {/* Yellow BOOT0 and BOOT1 Jumpers on the right */}
                    <g transform="translate(280, 80)">
                      <rect x="0" y="0" width="36" height="58" rx="3" fill="#020617" stroke="#1e293b" strokeWidth="1" />
                      <text x="18" y="10" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                        BOOT
                      </text>
                      {/* BOOT1 */}
                      <rect x="5" y="16" width="11" height="36" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                      <text x="10.5" y="37" fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle">0</text>
                      {/* BOOT0 */}
                      <rect x="20" y="16" width="11" height="36" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                      <text x="25.5" y="37" fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle">0</text>
                    </g>

                    {/* Reset Button */}
                    <g transform="translate(236, 94)">
                      <rect x="0" y="0" width="26" height="26" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                      <circle cx="13" cy="13" r="8" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                      <text x="13" y="34" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">RESET</text>
                    </g>

                    {/* STM32F103 Microcontroller IC (Center) */}
                    <g transform="translate(175, 110)">
                      <rect
                        x="-32"
                        y="-32"
                        width="64"
                        height="64"
                        rx="3"
                        transform="rotate(45)"
                        fill="#0a0f1d"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                      />
                      <circle cx="16" cy="0" r="3" fill="#38bdf8" />
                      <text x="0" y="-4" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        STM32F
                      </text>
                      <text x="0" y="7" fill="#93c5fd" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                        103C8T6
                      </text>
                      <text x="0" y="17" fill="#64748b" fontSize="6" textAnchor="middle" fontFamily="monospace">
                        ARM M3
                      </text>
                    </g>

                    {/* 8.000 MHz Crystal */}
                    <g transform="translate(75, 92)">
                      <rect x="0" y="0" width="34" height="18" rx="8" fill="url(#crystalGrad)" stroke="#475569" strokeWidth="1" />
                      <text x="17" y="12" fill="#0f172a" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        8.000
                      </text>
                    </g>

                    {/* LEDs */}
                    <g transform="translate(45, 88)">
                      <circle cx="6" cy="6" r="3" fill="#10b981" />
                      <text x="6" y="17" fill="#6ee7b7" fontSize="5.5" fontWeight="bold" textAnchor="middle">PC13</text>
                      <circle cx="6" cy="28" r="3" fill="#ef4444" />
                      <text x="6" y="39" fill="#fca5a5" fontSize="5.5" fontWeight="bold" textAnchor="middle">PWR</text>
                    </g>

                    {/* ============================================================== */}
                    {/* SWD HEADER ON THE LEFT EDGE (FACING ST-LINK!)                  */}
                    {/* Top to Bottom: 1. 3.3V, 2. DIO, 3. CLK, 4. GND                 */}
                    {/* Pins stick out to the LEFT towards x=-15                       */}
                    {/* ============================================================== */}
                    <g transform="translate(2, 45)">
                      {/* Black Plastic Base on Board */}
                      <rect x="0" y="0" width="16" height="130" rx="2" fill="#020617" stroke="#1e293b" strokeWidth="1" />

                      {/* Pin 1: 3.3V (Top - y=20) */}
                      {(() => {
                        const isHl = selectedWire === 4;
                        const hlCol = "#ef4444";
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(4)}>
                            {isHl && (
                              <>
                                <circle cx="-12" cy="19.5" r="9" fill={hlCol} opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="-12" cy="19.5" r="14" fill="none" stroke={hlCol} strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="-26"
                              y="17"
                              width="28"
                              height="5"
                              fill={isHl ? hlCol : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            {isHl && (
                              <rect x="18" y="10" width="28" height="15" rx="7.5" fill="#ef4444" opacity="0.25" filter="url(#pinGlow)" />
                            )}
                            <text
                              x="22"
                              y="21"
                              fill={isHl ? "#ffffff" : "#ef4444"}
                              fontSize={isHl ? "9" : "8"}
                              fontWeight="bold"
                              textAnchor="start"
                              fontFamily="monospace"
                            >
                              3.3V
                            </text>
                          </g>
                        );
                      })()}

                      {/* Pin 2: DIO / SWDIO (Second - y=52) */}
                      {(() => {
                        const isHl = selectedWire === 3;
                        const hlCol = "#f97316";
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(3)}>
                            {isHl && (
                              <>
                                <circle cx="-12" cy="51.5" r="9" fill={hlCol} opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="-12" cy="51.5" r="14" fill="none" stroke={hlCol} strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="-26"
                              y="49"
                              width="28"
                              height="5"
                              fill={isHl ? hlCol : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            {isHl && (
                              <rect x="18" y="42" width="28" height="15" rx="7.5" fill="#f97316" opacity="0.25" filter="url(#pinGlow)" />
                            )}
                            <text
                              x="22"
                              y="53"
                              fill={isHl ? "#ffffff" : "#f97316"}
                              fontSize={isHl ? "9" : "8"}
                              fontWeight="bold"
                              textAnchor="start"
                              fontFamily="monospace"
                            >
                              DIO
                            </text>
                          </g>
                        );
                      })()}

                      {/* Pin 3: CLK / SWCLK (Third - y=84) */}
                      {(() => {
                        const isHl = selectedWire === 2;
                        const hlCol = "#10b981";
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(2)}>
                            {isHl && (
                              <>
                                <circle cx="-12" cy="83.5" r="9" fill={hlCol} opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="-12" cy="83.5" r="14" fill="none" stroke={hlCol} strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="-26"
                              y="81"
                              width="28"
                              height="5"
                              fill={isHl ? hlCol : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            {isHl && (
                              <rect x="18" y="74" width="28" height="15" rx="7.5" fill="#10b981" opacity="0.25" filter="url(#pinGlow)" />
                            )}
                            <text
                              x="22"
                              y="85"
                              fill={isHl ? "#ffffff" : "#10b981"}
                              fontSize={isHl ? "9" : "8"}
                              fontWeight="bold"
                              textAnchor="start"
                              fontFamily="monospace"
                            >
                              CLK
                            </text>
                          </g>
                        );
                      })()}

                      {/* Pin 4: GND (Bottom - y=116) */}
                      {(() => {
                        const isHl = selectedWire === 1;
                        const hlCol = "#64748b";
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(1)}>
                            {isHl && (
                              <>
                                <circle cx="-12" cy="115.5" r="9" fill={hlCol} opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="-12" cy="115.5" r="14" fill="none" stroke={hlCol} strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="-26"
                              y="113"
                              width="28"
                              height="5"
                              fill={isHl ? "#cbd5e1" : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            {isHl && (
                              <rect x="18" y="106" width="28" height="15" rx="7.5" fill="#64748b" opacity="0.25" filter="url(#pinGlow)" />
                            )}
                            <text
                              x="22"
                              y="117"
                              fill={isHl ? "#ffffff" : "#94a3b8"}
                              fontSize={isHl ? "9" : "8"}
                              fontWeight="bold"
                              textAnchor="start"
                              fontFamily="monospace"
                            >
                              GND
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  </>
                ) : (
                  /* Standard orientation layout: SWD on the RIGHT */
                  <>
                    {/* Yellow BOOT Jumpers */}
                    <g transform="translate(60, 80)">
                      <rect x="0" y="0" width="36" height="58" rx="3" fill="#020617" stroke="#1e293b" strokeWidth="1" />
                      <text x="18" y="10" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                        BOOT
                      </text>
                      <rect x="5" y="16" width="11" height="36" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                      <text x="10.5" y="37" fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle">0</text>
                      <rect x="20" y="16" width="11" height="36" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                      <text x="25.5" y="37" fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle">0</text>
                    </g>

                    {/* Reset Button */}
                    <g transform="translate(112, 94)">
                      <rect x="0" y="0" width="26" height="26" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                      <circle cx="13" cy="13" r="8" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                      <text x="13" y="34" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">RESET</text>
                    </g>

                    {/* STM32 MCU */}
                    <g transform="translate(195, 110)">
                      <rect
                        x="-32"
                        y="-32"
                        width="64"
                        height="64"
                        rx="3"
                        transform="rotate(45)"
                        fill="#0a0f1d"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                      />
                      <circle cx="16" cy="0" r="3" fill="#38bdf8" />
                      <text x="0" y="-4" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        STM32F
                      </text>
                      <text x="0" y="7" fill="#93c5fd" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
                        103C8T6
                      </text>
                      <text x="0" y="17" fill="#64748b" fontSize="6" textAnchor="middle" fontFamily="monospace">
                        ARM M3
                      </text>
                    </g>

                    {/* 8.000 MHz Crystal */}
                    <g transform="translate(262, 92)">
                      <rect x="0" y="0" width="34" height="18" rx="8" fill="url(#crystalGrad)" stroke="#475569" strokeWidth="1" />
                      <text x="17" y="12" fill="#0f172a" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        8.000
                      </text>
                    </g>

                    {/* LEDs */}
                    <g transform="translate(310, 88)">
                      <circle cx="6" cy="6" r="3" fill="#10b981" />
                      <text x="6" y="17" fill="#6ee7b7" fontSize="5.5" fontWeight="bold" textAnchor="middle">PC13</text>
                      <circle cx="6" cy="28" r="3" fill="#ef4444" />
                      <text x="6" y="39" fill="#fca5a5" fontSize="5.5" fontWeight="bold" textAnchor="middle">PWR</text>
                    </g>

                    {/* SWD Header on RIGHT edge */}
                    <g transform="translate(352, 45)">
                      <rect x="0" y="0" width="16" height="130" rx="2" fill="#020617" stroke="#1e293b" strokeWidth="1" />
                      {/* GND */}
                      {(() => {
                        const isHl = selectedWire === 1;
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(1)}>
                            {isHl && (
                              <>
                                <circle cx="28" cy="19.5" r="9" fill="#64748b" opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="28" cy="19.5" r="14" fill="none" stroke="#64748b" strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="14"
                              y="17"
                              width="28"
                              height="5"
                              fill={isHl ? "#cbd5e1" : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            <text x="-4" y="21" fill={isHl ? "#ffffff" : "#94a3b8"} fontSize={isHl ? "9" : "8"} fontWeight="bold" textAnchor="end" fontFamily="monospace">GND</text>
                          </g>
                        );
                      })()}

                      {/* CLK */}
                      {(() => {
                        const isHl = selectedWire === 2;
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(2)}>
                            {isHl && (
                              <>
                                <circle cx="28" cy="51.5" r="9" fill="#10b981" opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="28" cy="51.5" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="14"
                              y="49"
                              width="28"
                              height="5"
                              fill={isHl ? "#10b981" : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            <text x="-4" y="53" fill={isHl ? "#ffffff" : "#10b981"} fontSize={isHl ? "9" : "8"} fontWeight="bold" textAnchor="end" fontFamily="monospace">CLK</text>
                          </g>
                        );
                      })()}

                      {/* DIO */}
                      {(() => {
                        const isHl = selectedWire === 3;
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(3)}>
                            {isHl && (
                              <>
                                <circle cx="28" cy="83.5" r="9" fill="#f97316" opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="28" cy="83.5" r="14" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="14"
                              y="81"
                              width="28"
                              height="5"
                              fill={isHl ? "#f97316" : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            <text x="-4" y="85" fill={isHl ? "#ffffff" : "#f97316"} fontSize={isHl ? "9" : "8"} fontWeight="bold" textAnchor="end" fontFamily="monospace">DIO</text>
                          </g>
                        );
                      })()}

                      {/* 3.3V */}
                      {(() => {
                        const isHl = selectedWire === 4;
                        return (
                          <g className="cursor-pointer group" onClick={() => handleWireClick(4)}>
                            {isHl && (
                              <>
                                <circle cx="28" cy="115.5" r="9" fill="#ef4444" opacity="0.5" filter="url(#pinGlow)" />
                                <circle cx="28" cy="115.5" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.8">
                                  <animate attributeName="r" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                              </>
                            )}
                            <rect
                              x="14"
                              y="113"
                              width="28"
                              height="5"
                              fill={isHl ? "#ef4444" : "url(#metalPinGrad)"}
                              stroke={isHl ? "#ffffff" : "none"}
                              strokeWidth={isHl ? "1" : "0"}
                              rx="1"
                            />
                            <text x="-4" y="117" fill={isHl ? "#ffffff" : "#ef4444"} fontSize={isHl ? "9" : "8"} fontWeight="bold" textAnchor="end" fontFamily="monospace">3.3V</text>
                          </g>
                        );
                      })()}
                    </g>
                  </>
                )}
              </g>

              {/* =================================================================== */}
              {/* 3. THE 4 CONNECTING DUPONT JUMPER WIRES                             */}
              {/* When isFacing=true:                                                 */}
              {/* Pins are right across the central gap from each other!              */}
              {/* ST-Link: x ≈ 336 (or 254)                                           */}
              {/* Blue Pill SWD: x ≈ 494 (pins stick out to the left)                 */}
              {/* =================================================================== */}
              {(() => {
                // ST-Link pin positions
                const stX_right = 336;
                const stX_left = 254;

                const stGndX = pinMode === "standard" ? stX_right : stX_left;
                const stGndY = 156;

                const stClkX = stX_right;
                const stClkY = 182;

                const stDioX = stX_right;
                const stDioY = 130;

                const stPwrX = pinMode === "standard" ? stX_right : stX_left;
                const stPwrY = 208;

                // Blue Pill SWD pin positions
                // When isFacing=true: SWD header is on the left edge of Blue Pill (x=520+2=522), pins extend to x=494
                // Y positions from top: 3.3V(127), DIO(159), CLK(191), GND(223)
                const bpX_facing = 494;
                const bpPwrY_facing = 127;
                const bpDioY_facing = 159;
                const bpClkY_facing = 191;
                const bpGndY_facing = 223;

                // When isFacing=false: SWD header is on right edge (x=886), pins extend to x=910
                const bpX_std = 910;
                const bpGndY_std = 127;
                const bpClkY_std = 159;
                const bpDioY_std = 191;
                const bpPwrY_std = 223;

                const bpX = isFacing ? bpX_facing : bpX_std;
                const bpGndY = isFacing ? bpGndY_facing : bpGndY_std;
                const bpClkY = isFacing ? bpClkY_facing : bpClkY_std;
                const bpDioY = isFacing ? bpDioY_facing : bpDioY_std;
                const bpPwrY = isFacing ? bpPwrY_facing : bpPwrY_std;

                // Path curves
                let pathGnd = "";
                let pathClk = "";
                let pathDio = "";
                let pathPwr = "";

                if (isFacing) {
                  // Direct clean paths across the ~150px gap!
                  // 1. GND: from ST-Link (stGndX, 156) to Blue Pill GND (bpX, 223)
                  pathGnd = `M ${stGndX} ${stGndY} C ${stGndX + 50} ${stGndY + 20}, ${bpX - 50} ${bpGndY}, ${bpX} ${bpGndY}`;

                  // 2. SWCLK: from ST-Link (stClkX, 182) to Blue Pill CLK (bpX, 191)
                  pathClk = `M ${stClkX} ${stClkY} C ${stClkX + 45} ${stClkY}, ${bpX - 45} ${bpClkY}, ${bpX} ${bpClkY}`;

                  // 3. SWDIO: from ST-Link (stDioX, 130) to Blue Pill DIO (bpX, 159)
                  pathDio = `M ${stDioX} ${stDioY} C ${stDioX + 45} ${stDioY}, ${bpX - 45} ${bpDioY}, ${bpX} ${bpDioY}`;

                  // 4. 3.3V: from ST-Link (stPwrX, 208) to Blue Pill 3.3V (bpX, 127)
                  pathPwr = `M ${stPwrX} ${stPwrY} C ${stPwrX + 50} ${stPwrY - 30}, ${bpX - 50} ${bpPwrY}, ${bpX} ${bpPwrY}`;
                } else {
                  // Loop around paths across the board
                  pathGnd = `M ${stGndX} ${stGndY} C ${stGndX + 80} ${stGndY - 100}, ${bpX - 80} ${bpGndY - 60}, ${bpX} ${bpGndY}`;
                  pathClk = `M ${stClkX} ${stClkY} C ${stClkX + 90} ${stClkY + 80}, ${bpX - 120} ${bpClkY - 40}, ${bpX} ${bpClkY}`;
                  pathDio = `M ${stDioX} ${stDioY} C ${stDioX + 110} ${stDioY - 40}, ${bpX - 100} ${bpDioY + 40}, ${bpX} ${bpDioY}`;
                  pathPwr = `M ${stPwrX} ${stPwrY} C ${stPwrX + 80} ${stPwrY + 120}, ${bpX - 90} ${bpPwrY + 80}, ${bpX} ${bpPwrY}`;
                }

                const renderWire = (
                  id: number,
                  pathData: string,
                  color: string,
                  activeColor: string,
                  stX: number,
                  stY: number,
                  bpXPos: number,
                  bpYPos: number,
                  label: string,
                  labelPos: { x: number; y: number }
                ) => {
                  const isSelected = selectedWire === id;
                  const isDimmed = selectedWire !== null && !isSelected;

                  return (
                    <g
                      key={`wire-grp-${id}`}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleWireClick(id)}
                    >
                      {/* Click zone */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="24"
                        strokeLinecap="round"
                      />

                      {/* Halo */}
                      {isSelected && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke={activeColor}
                          strokeWidth="10"
                          strokeLinecap="round"
                          opacity="0.5"
                          filter="url(#wireGlow)"
                        />
                      )}

                      {/* Main Wire Body */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={isSelected ? activeColor : color}
                        strokeWidth={isSelected ? "5.5" : "3.8"}
                        strokeLinecap="round"
                        opacity={isDimmed ? 0.25 : 1}
                      />

                      {/* Animated Signal Dash */}
                      {animateSignals && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth={isSelected ? "2.5" : "1.8"}
                          strokeDasharray="6 14"
                          strokeLinecap="round"
                          opacity={isDimmed ? 0.15 : isSelected ? 0.95 : 0.6}
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            from="40"
                            to="0"
                            dur={id === 2 ? "1.2s" : id === 3 ? "1.6s" : "2.4s"}
                            repeatCount="indefinite"
                          />
                        </path>
                      )}

                      {/* DuPont Female Connector Block at ST-Link end */}
                      {isSelected && (
                        <rect
                          x={stX - 9}
                          y={stY - 7.5}
                          width="18"
                          height="15"
                          rx="3"
                          fill={activeColor}
                          opacity="0.35"
                          filter="url(#pinGlow)"
                        />
                      )}
                      <rect
                        x={stX - 6}
                        y={stY - 4.5}
                        width="12"
                        height="9"
                        rx="1.5"
                        fill="#020617"
                        stroke={isSelected ? activeColor : "#475569"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        opacity={isDimmed ? 0.4 : 1}
                      />
                      <rect
                        x={stX - 2}
                        y={stY - 2.5}
                        width="4"
                        height="5"
                        fill={isSelected ? activeColor : color}
                        opacity={isDimmed ? 0.4 : 1}
                      />

                      {/* DuPont Female Connector Block at Blue Pill end */}
                      {isSelected && (
                        <rect
                          x={isFacing ? bpXPos - 9 : bpXPos - 5}
                          y={bpYPos - 7.5}
                          width="18"
                          height="15"
                          rx="3"
                          fill={activeColor}
                          opacity="0.35"
                          filter="url(#pinGlow)"
                        />
                      )}
                      <rect
                        x={isFacing ? bpXPos - 6 : bpXPos - 2}
                        y={bpYPos - 4.5}
                        width="12"
                        height="9"
                        rx="1.5"
                        fill="#020617"
                        stroke={isSelected ? activeColor : "#475569"}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        opacity={isDimmed ? 0.4 : 1}
                      />
                      <rect
                        x={isFacing ? bpXPos - 2 : bpXPos + 6}
                        y={bpYPos - 2.5}
                        width="4"
                        height="5"
                        fill={isSelected ? activeColor : color}
                        opacity={isDimmed ? 0.4 : 1}
                      />

                      {/* Floating Wire Label Pill */}
                      <g transform={`translate(${labelPos.x}, ${labelPos.y})`} opacity={isDimmed ? 0.3 : 1}>
                        <rect
                          x="-26"
                          y="-9"
                          width="52"
                          height="18"
                          rx="9"
                          fill="#0f172a"
                          stroke={isSelected ? activeColor : color}
                          strokeWidth={isSelected ? "2" : "1.2"}
                        />
                        <text
                          x="0"
                          y="3.5"
                          fill={isSelected ? "#ffffff" : color === "#1e293b" ? "#cbd5e1" : color}
                          fontSize="8.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {label}
                        </text>
                      </g>
                    </g>
                  );
                };

                return (
                  <g id="wires-layer">
                    {/* Wire 1: Black (GND) */}
                    {renderWire(
                      1,
                      pathGnd,
                      "#334155",
                      "#94a3b8",
                      stGndX,
                      stGndY,
                      bpX,
                      bpGndY,
                      "GND (0V)",
                      isFacing ? { x: 415, y: 220 } : { x: 580, y: 35 }
                    )}

                    {/* Wire 2: Green (SWCLK) */}
                    {renderWire(
                      2,
                      pathClk,
                      "#059669",
                      "#34d399",
                      stClkX,
                      stClkY,
                      bpX,
                      bpClkY,
                      "SWCLK",
                      isFacing ? { x: 415, y: 186 } : { x: 490, y: 315 }
                    )}

                    {/* Wire 3: Orange (SWDIO) */}
                    {renderWire(
                      3,
                      pathDio,
                      "#ea580c",
                      "#fb923c",
                      stDioX,
                      stDioY,
                      bpX,
                      bpDioY,
                      "SWDIO",
                      isFacing ? { x: 415, y: 152 } : { x: 450, y: 155 }
                    )}

                    {/* Wire 4: Red (3.3V) */}
                    {renderWire(
                      4,
                      pathPwr,
                      "#dc2626",
                      "#f87171",
                      stPwrX,
                      stPwrY,
                      bpX,
                      bpPwrY,
                      "3.3V VCC",
                      isFacing ? { x: 415, y: 118 } : { x: 620, y: 390 }
                    )}
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Interactive feedback & status bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            {activeConnection ? (
              <span className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">Destaque selecionado:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{
                      backgroundColor:
                        activeConnection.wireColor === "#1e293b"
                          ? "#94a3b8"
                          : activeConnection.activeColor,
                    }}
                  />
                  {activeConnection.colorName} ({activeConnection.signalName})
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  [ST-Link {activeConnection.id === 1 ? `Pino ${gndPinNum}` : activeConnection.id === 4 ? `Pino ${pwrPinNum}` : `Pino ${activeConnection.stLinkPinNum}`} ➔ Blue Pill {activeConnection.bluePillPinLabel}]
                </span>
              </span>
            ) : (
              <span className="text-slate-400">
                Clique nos fios do circuito acima ou nas linhas da tabela abaixo para destacar a conexão e os pinos correspondentes.
              </span>
            )}
          </div>

          {activeConnection && (
            <button
              type="button"
              onClick={() => {
                setInternalWireId(null);
                onSelectWire?.(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] font-medium"
            >
              Mostrar todos os fios
            </button>
          )}
        </div>

        {/* Safety note specifically when 3.3V power wire is selected */}
        {selectedWire === 4 && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>
              <strong>Atenção Crítica:</strong> Conecte apenas na saída de 3.3V (Pino {pwrPinNum}). Nunca conecte a saída de 5V do ST-Link neste pino da Blue Pill para não queimar o microcontrolador!
            </span>
          </div>
        )}
      </div>

      {/* Comprehensive Wiring Reference Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Tabela de Correspondência Pino a Pino (ST-Link V2 ➔ STM32 Blue Pill)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Clique na linha para destacar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Fio Jumper</th>
                <th className="py-2.5 px-3">Sinal Elétrico</th>
                <th className="py-2.5 px-3">Pino no ST-Link V2</th>
                <th className="py-2.5 px-3">Pino na Blue Pill</th>
                <th className="py-2.5 px-3">GPIO MCU</th>
                <th className="py-2.5 px-3">Função no Sistema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr
                onClick={() => handleWireClick(1)}
                className={`cursor-pointer transition-colors ${
                  selectedWire === 1
                    ? "bg-slate-200/70 dark:bg-slate-800 font-semibold ring-1 ring-slate-400/40 inset-ring"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <td className="py-2.5 px-3 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex-shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white">Preto</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">GND (0V)</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-semibold">
                    Pino {gndPinNum} {pinMode === "standard" ? "(ou 2)" : "(ou 7)"}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">GND (Terra)</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">VSS (0V)</td>
                <td className="py-2.5 px-3">Aterramento e referência de tensão comum (0V).</td>
              </tr>

              <tr
                onClick={() => handleWireClick(2)}
                className={`cursor-pointer transition-colors ${
                  selectedWire === 2
                    ? "bg-emerald-100/70 dark:bg-emerald-950/40 font-semibold ring-1 ring-emerald-500/40"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <td className="py-2.5 px-3 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white">Verde</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">SWCLK</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-semibold">
                    Pino 8
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">SCK / SWCLK</td>
                <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">PA14</td>
                <td className="py-2.5 px-3">Clock serial de sincronismo da gravação e depuração.</td>
              </tr>

              <tr
                onClick={() => handleWireClick(3)}
                className={`cursor-pointer transition-colors ${
                  selectedWire === 3
                    ? "bg-orange-100/70 dark:bg-orange-950/40 font-semibold ring-1 ring-orange-500/40"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <td className="py-2.5 px-3 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white">Laranja</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-orange-600 dark:text-orange-400">SWDIO</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-mono font-semibold">
                    Pino 6
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">DIO / SWDIO</td>
                <td className="py-2.5 px-3 font-mono text-orange-600 dark:text-orange-400 font-semibold">PA13</td>
                <td className="py-2.5 px-3">Linha serial de dados bidirecional (gravação e leitura de registradores).</td>
              </tr>

              <tr
                onClick={() => handleWireClick(4)}
                className={`cursor-pointer transition-colors ${
                  selectedWire === 4
                    ? "bg-red-100/70 dark:bg-red-950/40 font-semibold ring-1 ring-red-500/40"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <td className="py-2.5 px-3 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white">Vermelho</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-red-600 dark:text-red-400">+3.3V</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-mono font-semibold">
                    Pino {pwrPinNum} {pinMode === "standard" ? "(ou 4)" : "(ou 9)"}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">3.3V / 3V3</td>
                <td className="py-2.5 px-3 font-mono text-red-600 dark:text-red-400 font-semibold">VDD (+3.3V)</td>
                <td className="py-2.5 px-3">
                  Alimentação regulada do chip STM32F103 (tensão de operação: 2.0V a 3.6V).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
