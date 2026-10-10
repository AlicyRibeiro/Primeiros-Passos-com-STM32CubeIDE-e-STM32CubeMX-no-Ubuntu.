import React, { useState } from "react";
import { BluePillSilkscreenDiagram } from "./BluePillSilkscreenDiagram";
import { STLinkConnectionDiagram } from "./STLinkConnectionDiagram";
import {
  Cpu,
  Zap,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Search,
  ArrowRight,
  ShieldAlert,
  Info,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  FileText,
} from "lucide-react";

interface HardwareComponentsViewProps {
  onNavigateArticle: (id: string) => void;
}

type TabType = "wiring" | "pinout" | "jumpers" | "specs";

interface PinDetail {
  pin: string;
  name: string;
  physical: number;
  type: "power" | "gpio" | "swd" | "uart" | "i2c" | "spi" | "adc" | "boot" | "usb" | "led";
  is5vTolerant: boolean;
  notes: string;
  side: "left" | "right" | "top_swd" | "bottom_boot";
}

const PINOUT_DATA: PinDetail[] = [
  // Top SWD Header (Programming)
  { pin: "3V3", name: "Alimentação 3.3V (SWD)", physical: 1, type: "swd", is5vTolerant: false, notes: "Alimentação via gravador ST-Link V2 (fio vermelho)", side: "top_swd" },
  { pin: "SWCLK", name: "PA14 / SWCLK (Clock)", physical: 2, type: "swd", is5vTolerant: false, notes: "Sinal de clock de depuração (fio verde)", side: "top_swd" },
  { pin: "SWDIO", name: "PA13 / SWDIO (Data I/O)", physical: 3, type: "swd", is5vTolerant: false, notes: "Sinal de dados bidirecional SWD (fio laranja)", side: "top_swd" },
  { pin: "GND", name: "GND (Terra SWD)", physical: 4, type: "swd", is5vTolerant: false, notes: "Referência de terra (fio preto)", side: "top_swd" },

  // Left Rail (top to bottom)
  { pin: "VBAT", name: "VBAT (Bateria RTC)", physical: 1, type: "power", is5vTolerant: false, notes: "Alimentação de backup para o RTC (1.8V - 3.6V)", side: "left" },
  { pin: "PC13", name: "PC13 (LED Integrado)", physical: 2, type: "led", is5vTolerant: false, notes: "LED onboard conectado! Active-Low: 0 acende, 1 apaga", side: "left" },
  { pin: "PC14", name: "PC14 / OSC32 IN", physical: 3, type: "gpio", is5vTolerant: false, notes: "Entrada oscilador de 32.768 kHz para o relógio RTC", side: "left" },
  { pin: "PC15", name: "PC15 / OSC32 OUT", physical: 4, type: "gpio", is5vTolerant: false, notes: "Saída oscilador de 32.768 kHz para o relógio RTC", side: "left" },
  { pin: "PA0", name: "PA0 / ADC0 / WKUP", physical: 10, type: "adc", is5vTolerant: false, notes: "Entrada analógica ADC0, Timer 2 Ch 1, Wake-up", side: "left" },
  { pin: "PA1", name: "PA1 / ADC1", physical: 11, type: "adc", is5vTolerant: false, notes: "Entrada analógica ADC1, Timer 2 Ch 2", side: "left" },
  { pin: "PA2", name: "PA2 / ADC2 / TX2", physical: 12, type: "uart", is5vTolerant: false, notes: "Transmissor USART2 TX, ADC2, Timer 2 Ch 3", side: "left" },
  { pin: "PA3", name: "PA3 / ADC3 / RX2", physical: 13, type: "uart", is5vTolerant: false, notes: "Receptor USART2 RX, ADC3, Timer 2 Ch 4", side: "left" },
  { pin: "PA4", name: "PA4 / ADC4 / NSS1", physical: 14, type: "spi", is5vTolerant: false, notes: "SPI1 Chip Select (NSS), ADC4", side: "left" },
  { pin: "PA5", name: "PA5 / ADC5 / SCK1", physical: 15, type: "spi", is5vTolerant: false, notes: "SPI1 Clock (SCK), ADC5", side: "left" },
  { pin: "PA6", name: "PA6 / ADC6 / MISO1", physical: 16, type: "spi", is5vTolerant: false, notes: "SPI1 MISO (Master In Slave Out), ADC6, Timer 3 Ch 1", side: "left" },
  { pin: "PA7", name: "PA7 / ADC7 / MOSI1", physical: 17, type: "spi", is5vTolerant: false, notes: "SPI1 MOSI (Master Out Slave In), ADC7, Timer 3 Ch 2", side: "left" },
  { pin: "PB0", name: "PB0 / ADC8", physical: 18, type: "adc", is5vTolerant: false, notes: "Entrada analógica ADC8, Timer 3 Ch 3", side: "left" },
  { pin: "PB1", name: "PB1 / ADC9", physical: 19, type: "adc", is5vTolerant: false, notes: "Entrada analógica ADC9, Timer 3 Ch 4", side: "left" },
  { pin: "PB10", name: "PB10 / I2C2 SCL / TX3", physical: 21, type: "i2c", is5vTolerant: true, notes: "I2C2 SCL, USART3 TX (Tolerante a 5V)", side: "left" },
  { pin: "PB11", name: "PB11 / I2C2 SDA / RX3", physical: 22, type: "i2c", is5vTolerant: true, notes: "I2C2 SDA, USART3 RX (Tolerante a 5V)", side: "left" },
  { pin: "RST", name: "NRST (Reset Externo)", physical: 7, type: "power", is5vTolerant: false, notes: "Pino de reset do microcontrolador (ativo em nível baixo)", side: "left" },
  { pin: "3V3", name: "3.3V (Saída Regulador)", physical: 0, type: "power", is5vTolerant: false, notes: "Alimentação positiva de 3.3V", side: "left" },
  { pin: "GND", name: "GND (Terra)", physical: 0, type: "power", is5vTolerant: false, notes: "Pino de terra do circuito", side: "left" },

  // Right Rail (top to bottom)
  { pin: "3V3", name: "3.3V", physical: 0, type: "power", is5vTolerant: false, notes: "Alimentação 3.3V", side: "right" },
  { pin: "GND", name: "GND", physical: 0, type: "power", is5vTolerant: false, notes: "Terra / Comum", side: "right" },
  { pin: "5V", name: "5V (VBUS / Entrada)", physical: 0, type: "power", is5vTolerant: true, notes: "Conectado à porta USB (5V) e à entrada do regulador RT9193", side: "right" },
  { pin: "PB9", name: "PB9 / I2C1 SDA", physical: 46, type: "i2c", is5vTolerant: true, notes: "I2C1 Data (SDA), CAN TX, Timer 4 Ch 4 (Tolerante a 5V)", side: "right" },
  { pin: "PB8", name: "PB8 / I2C1 SCL", physical: 45, type: "i2c", is5vTolerant: true, notes: "I2C1 Clock (SCL), CAN RX, Timer 4 Ch 3 (Tolerante a 5V)", side: "right" },
  { pin: "PB7", name: "PB7 / I2C1 SDA", physical: 43, type: "i2c", is5vTolerant: true, notes: "I2C1 SDA, USART1 RX (remap) (Tolerante a 5V)", side: "right" },
  { pin: "PB6", name: "PB6 / I2C1 SCL", physical: 42, type: "i2c", is5vTolerant: true, notes: "I2C1 SCL, USART1 TX (remap) (Tolerante a 5V)", side: "right" },
  { pin: "PB5", name: "PB5 / SPI1 MOSI (r)", physical: 41, type: "spi", is5vTolerant: false, notes: "SPI1 MOSI remapeado, Timer 3 Ch 2", side: "right" },
  { pin: "PB4", name: "PB4 / JTRST", physical: 40, type: "gpio", is5vTolerant: true, notes: "JTAG TRST (desativar JTAG no CubeMX para usar como GPIO livre)", side: "right" },
  { pin: "PB3", name: "PB3 / JTDO", physical: 39, type: "gpio", is5vTolerant: true, notes: "JTAG TDO (desativar JTAG no CubeMX para usar como GPIO)", side: "right" },
  { pin: "PA15", name: "PA15 / JTDI", physical: 38, type: "gpio", is5vTolerant: true, notes: "JTAG TDI / SPI1 NSS remapeado", side: "right" },
  { pin: "PA12", name: "PA12 / USB DP (D+)", physical: 33, type: "usb", is5vTolerant: true, notes: "USB Data+ (requer pull-up de 1.5k), CAN TX", side: "right" },
  { pin: "PA11", name: "PA11 / USB DM (D-)", physical: 32, type: "usb", is5vTolerant: true, notes: "USB Data-, CAN RX", side: "right" },
  { pin: "PA10", name: "PA10 / USART1 RX", physical: 31, type: "uart", is5vTolerant: true, notes: "Porta Serial principal RX (comunicação com PC/Serial Monitor) (Tolerante a 5V)", side: "right" },
  { pin: "PA9", name: "PA9 / USART1 TX", physical: 30, type: "uart", is5vTolerant: true, notes: "Porta Serial principal TX (comunicação com PC/Serial Monitor) (Tolerante a 5V)", side: "right" },
  { pin: "PA8", name: "PA8 / MCO", physical: 29, type: "gpio", is5vTolerant: true, notes: "Saída do Clock Principal (MCO), Timer 1 Ch 1 (Tolerante a 5V)", side: "right" },
  { pin: "PB15", name: "PB15 / SPI2 MOSI", physical: 28, type: "spi", is5vTolerant: true, notes: "SPI2 MOSI, Timer 1 Ch 3N (Tolerante a 5V)", side: "right" },
  { pin: "PB14", name: "PB14 / SPI2 MISO", physical: 27, type: "spi", is5vTolerant: true, notes: "SPI2 MISO, Timer 1 Ch 2N (Tolerante a 5V)", side: "right" },
  { pin: "PB13", name: "PB13 / SPI2 SCK", physical: 26, type: "spi", is5vTolerant: true, notes: "SPI2 SCK, Timer 1 Ch 1N (Tolerante a 5V)", side: "right" },
  { pin: "PB12", name: "PB12 / SPI2 NSS", physical: 25, type: "spi", is5vTolerant: true, notes: "SPI2 NSS / Chip Select (Tolerante a 5V)", side: "right" },
];

export const HardwareComponentsView: React.FC<HardwareComponentsViewProps> = ({
  onNavigateArticle,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("wiring");
  const [selectedWire, setSelectedWire] = useState<number | null>(null);
  const [pinFilter, setPinFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBootMode, setSelectedBootMode] = useState<"flash" | "system" | "sram">("flash");

  // Filtered pins
  const filteredPins = PINOUT_DATA.filter((p) => {
    const matchesCategory =
      pinFilter === "all"
        ? true
        : pinFilter === "swd"
        ? p.type === "swd"
        : pinFilter === "uart"
        ? p.type === "uart"
        : pinFilter === "i2c_spi"
        ? p.type === "i2c" || p.type === "spi"
        : pinFilter === "adc"
        ? p.type === "adc"
        : pinFilter === "power"
        ? p.type === "power"
        : true;

    const matchesSearch =
      searchQuery === "" ||
      p.pin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Intro */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 mb-3">
          <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Guia Visual de Hardware</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Componentes: STM32 Blue Pill & Gravador ST-Link V2
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Entenda a disposição dos pinos, a anatomia da placa e o esquema de ligação correto com o
          gravador ST-Link V2 para evitar danos ao microcontrolador e garantir gravações sem erros no
          Ubuntu.
        </p>

        {/* Engineering Warning & Recommendation Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="font-bold flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <span>⚠️ Recomendação Essencial de Engenharia: Leitura de Manuais e Datasheets</span>
              </div>
              <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed text-xs sm:text-sm">
                Em qualquer projeto de engenharia e sistemas embarcados, <strong>é sempre fundamental e altamente recomendado ler e consultar os manuais e datasheets oficiais dos componentes</strong> antes de energizar circuitos ou conectar periféricos.
                Esses documentos contêm os limites elétricos absolutos (tensão máxima tolerada por pino, corrente contínua máxima de 25 mA por GPIO, dissipação de potência e mapas de registradores).
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium">
                <span className="text-amber-800 dark:text-amber-300 font-semibold">Documentação Oficial da ST:</span>
                <a
                  href="https://www.st.com/resource/en/datasheet/stm32f103c8.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/60 dark:bg-amber-900/50 hover:bg-amber-300/70 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 transition-colors"
                >
                  <FileText className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                  <span>Datasheet STM32F103x8/B</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
                <a
                  href="https://www.st.com/resource/en/reference_manual/rm0008-stm32f101xx-stm32f102xx-stm32f103xx-stm32f105xx-and-stm32f107xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/60 dark:bg-amber-900/50 hover:bg-amber-300/70 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 transition-colors"
                >
                  <FileText className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                  <span>Reference Manual (RM0008)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
                <a
                  href="https://www.st.com/resource/en/user_manual/um1075-stlinkv2-incircuit-debuggerprogrammer-for-stm8-and-stm32-stmicroelectronics.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/60 dark:bg-amber-900/50 hover:bg-amber-300/70 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 transition-colors"
                >
                  <FileText className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                  <span>Manual do ST-Link V2 (UM1075)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
          <button
            onClick={() => setActiveTab("wiring")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === "wiring"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Ligação ST-Link V2 ➔ Blue Pill</span>
          </button>

          <button
            onClick={() => setActiveTab("pinout")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === "pinout"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Pinout e Anatomia da Placa</span>
          </button>

          <button
            onClick={() => setActiveTab("jumpers")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === "jumpers"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Jumpers BOOT0 & BOOT1</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === "specs"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <Info className="w-4 h-4 text-emerald-500" />
            <span>Especificações & Segurança</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WIRING DIAGRAM (ST-LINK V2 -> BLUE PILL) */}
      {activeTab === "wiring" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Critical Safety Callout */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-semibold block text-amber-800 dark:text-amber-300">
                Atenção Crítica de Alimentação (3.3V vs 5V):
              </strong>
              Alimente o microcontrolador conectando o fio de energia no pino <strong>3.3V</strong>{" "}
              do ST-Link. <strong>NUNCA</strong> conecte o pino de 5V do gravador no pino de 3.3V da
              Blue Pill, pois isso queimará imediatamente o chip STM32F103!
            </div>
          </div>

          {/* Master Physical Connection Diagram (Faithful to image.png) */}
          <STLinkConnectionDiagram
            selectedWireId={selectedWire}
            onSelectWire={(id) => setSelectedWire(id || null)}
          />

          {/* Checklist before plugging in USB */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Checklist de Verificação Antes de Plugar no Computador</span>
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              <li>
                <strong>Jumpers Amarelos:</strong> Ambos os jumpers (BOOT0 e BOOT1) devem estar na posição{" "}
                <strong>0</strong> (mais próximos do conector micro-USB).
              </li>
              <li>
                <strong>Fios não cruzados:</strong> Confirme que SWCLK está ligado em SWCLK e SWDIO em SWDIO. Inverter esses dois pinos faz o OpenOCD dar erro de <em>"No target connected"</em>.
              </li>
              <li>
                <strong>Cabo USB do ST-Link:</strong> Conecte diretamente em uma porta USB da máquina (evite hubs USB passivos sem fonte externa).
              </li>
              <li>
                <strong>Alimentação Dupla:</strong> Se estiver alimentando a placa pelo ST-Link (fio 3.3V), <strong>não conecte</strong> o cabo micro-USB da placa ao mesmo tempo durante os primeiros testes para evitar conflito de alimentação.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: PINOUT & BOARD ANATOMY */}
      {activeTab === "pinout" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Exact PCB Silkscreen Layout Diagram (without dimension lines) */}
          <BluePillSilkscreenDiagram onPinClick={(pin) => setSearchQuery(pin)} />

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                Filtrar:
              </span>
              {[
                { id: "all", label: "Todos os Pinos" },
                { id: "swd", label: "SWD (Gravação)" },
                { id: "uart", label: "Serial (UART)" },
                { id: "i2c_spi", label: "I2C & SPI" },
                { id: "adc", label: "Analógicos (ADC)" },
                { id: "power", label: "Alimentação" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPinFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    pinFilter === f.id
                      ? "bg-blue-600 text-white shadow-2xs font-semibold"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pino (ex: PC13, PA9)..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-56"
              />
            </div>
          </div>

          {/* Key Board Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase">
                  Pino PC13 (LED Integrado)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                O LED verde onboard da Blue Pill está no pino <strong>PC13</strong> com lógica{" "}
                <strong>Active-Low</strong>: colocar nível lógico <code>0</code> (Reset/LOW) acende o
                LED, e colocar <code>1</code> (Set/HIGH) apaga o LED.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase">
                  Tolerância a 5V (FT)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Muitos pinos GPIO são <strong>5V Tolerant (FT)</strong> (ex: PA9, PA10, PB6, PB7, PB8, PB9).
                Pinos com função analógica (ADC) <strong>NUNCA</strong> toleram 5V (máximo 3.6V).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase">
                  Oscilador Cristal 8 MHz
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A placa possui cristal HSE de <strong>8.000 MHz</strong>. No STM32CubeMX, ative o{" "}
                <em>Crystal/Ceramic Resonator</em> no RCC e configure o multiplicador PLL para 9x
                para atingir o clock máximo de <strong>72 MHz</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Pinout Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/60 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Pino</th>
                    <th className="px-4 py-3">Identificação / Função</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Tolerância 5V</th>
                    <th className="px-4 py-3">Notas e Utilização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPins.map((p, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {p.pin}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                        {p.name}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            p.type === "swd"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                              : p.type === "led"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : p.type === "uart"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : p.type === "i2c" || p.type === "spi"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              : p.type === "adc"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {p.is5vTolerant ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Sim (5V FT)
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">3.3V Máx</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                        {p.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPins.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhum pino encontrado para a busca selecionada.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: JUMPERS BOOT0 & BOOT1 */}
      {activeTab === "jumpers" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Como funcionam os Jumpers Amarelos (BOOT0 e BOOT1)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              A arquitetura ARM Cortex-M3 da STM32 verifica o nível lógico dos pinos BOOT0 e BOOT1
              no exato momento em que o microcontrolador sai de um estado de Reset. A posição desses
              jumpers determina de onde o microprocessador carrega o vetor de inicialização.
            </p>

            {/* Mode Switcher Buttons */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedBootMode("flash")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedBootMode === "flash"
                    ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Modo 1 (Recomendado)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    BOOT0=0 · BOOT1=0
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Memória Flash Principal</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Executa o programa gravado pelo ST-Link. Deve ficar nesta posição 99% do tempo.
                </p>
              </button>

              <button
                onClick={() => setSelectedBootMode("system")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedBootMode === "system"
                    ? "bg-amber-50 dark:bg-amber-950/50 border-amber-500 dark:border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Modo 2 (Bootloader)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                    BOOT0=1 · BOOT1=0
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">System Memory (DFU / UART)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Executa a ROM de fábrica da ST para gravação serial via adaptador USB-UART (PA9/PA10).
                </p>
              </button>

              <button
                onClick={() => setSelectedBootMode("sram")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedBootMode === "sram"
                    ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/20 shadow-xs"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Modo 3</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    BOOT0=1 · BOOT1=1
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Memória SRAM</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Executa código direto da memória RAM. Usado para testes rápidos de fábrica e depurações avançadas.
                </p>
              </button>
            </div>

            {/* Visual Jumper State Representation */}
            <div className="mt-6 p-6 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                {/* Visual Representation of Jumper Pins */}
                <div className="flex items-center gap-6">
                  {/* BOOT0 Jumper */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-amber-300 mb-2">BOOT0</span>
                    <div className="w-10 h-24 bg-blue-900/70 border-2 border-blue-500 rounded-lg p-2 flex flex-col items-center justify-between relative">
                      <span className="text-[9px] font-mono text-slate-400">1</span>
                      {/* Jumper Shunt */}
                      <div
                        className={`w-6 h-8 rounded bg-amber-400 border border-amber-600 shadow-md flex items-center justify-center text-[10px] font-bold text-slate-900 transition-all ${
                          selectedBootMode === "flash" ? "translate-y-8" : "translate-y-0"
                        }`}
                      >
                        {selectedBootMode === "flash" ? "0" : "1"}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">0</span>
                    </div>
                  </div>

                  {/* BOOT1 Jumper */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-amber-300 mb-2">BOOT1</span>
                    <div className="w-10 h-24 bg-blue-900/70 border-2 border-blue-500 rounded-lg p-2 flex flex-col items-center justify-between relative">
                      <span className="text-[9px] font-mono text-slate-400">1</span>
                      {/* Jumper Shunt */}
                      <div
                        className={`w-6 h-8 rounded bg-amber-400 border border-amber-600 shadow-md flex items-center justify-center text-[10px] font-bold text-slate-900 transition-all ${
                          selectedBootMode === "sram" ? "translate-y-0" : "translate-y-8"
                        }`}
                      >
                        {selectedBootMode === "sram" ? "1" : "0"}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-sm font-bold text-white">
                    {selectedBootMode === "flash" && "✅ Configuração Padrão para este Tutorial (Flash)"}
                    {selectedBootMode === "system" && "⚠️ Modo Bootloader USART (Gravação Serial)"}
                    {selectedBootMode === "sram" && "⚙️ Execução em Memória Volátil (SRAM)"}
                  </div>
                  <p className="text-slate-300 leading-relaxed max-w-md">
                    {selectedBootMode === "flash" &&
                      "Os dois jumpers amarelos devem ficar posicionados para o lado do número 0 (lado do conector micro-USB). Toda gravação feita pelo STM32CubeIDE via ST-Link utiliza este modo."}
                    {selectedBootMode === "system" &&
                      "Coloque BOOT0 em 1 apenas se não tiver o ST-Link e for gravar a placa via conversor FTDI/CH340 conectado aos pinos PA9 (TX) e PA10 (RX) usando o software STM32CubeProgrammer."}
                    {selectedBootMode === "sram" &&
                      "Neste modo o código não é gravado na memória Flash e se perde ao desligar a alimentação."}
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <button
                  onClick={() => setSelectedBootMode("flash")}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Restaurar para Modo Flash (0, 0)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPECS & SAFETY */}
      {activeTab === "specs" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Comparison Cards: Blue Pill vs Arduino Uno */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Comparativo Técnico: STM32 Blue Pill vs. Arduino Uno
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-blue-700 dark:text-blue-300">
                    STM32F103C8T6 (Blue Pill)
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    ARM Cortex-M3 (32 bits)
                  </span>
                </div>
                <dl className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between py-1 border-b border-blue-200/50 dark:border-blue-900/50">
                    <dt>Frequência Máxima:</dt>
                    <dd className="font-mono font-bold text-slate-800 dark:text-slate-100">72 MHz (4.5x mais rápido)</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-200/50 dark:border-blue-900/50">
                    <dt>Memória Flash:</dt>
                    <dd className="font-mono font-bold text-slate-800 dark:text-slate-100">64 KB (até 128 KB)</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-200/50 dark:border-blue-900/50">
                    <dt>Memória RAM:</dt>
                    <dd className="font-mono font-bold text-slate-800 dark:text-slate-100">20 KB (10x mais RAM)</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-200/50 dark:border-blue-900/50">
                    <dt>Resolução do ADC:</dt>
                    <dd className="font-mono font-bold text-slate-800 dark:text-slate-100">12 bits (4096 níveis)</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Depuração Hardware:</dt>
                    <dd className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Sim (SWD em tempo real com breakpoints)</dd>
                  </div>
                </dl>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                    ATmega328P (Arduino Uno R3)
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    AVR 8-bit Clássico
                  </span>
                </div>
                <dl className="space-y-1.5 text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <dt>Frequência Máxima:</dt>
                    <dd className="font-mono">16 MHz</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <dt>Memória Flash:</dt>
                    <dd className="font-mono">32 KB</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <dt>Memória RAM:</dt>
                    <dd className="font-mono">2 KB</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <dt>Resolução do ADC:</dt>
                    <dd className="font-mono">10 bits (1024 níveis)</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Depuração Hardware:</dt>
                    <dd className="font-mono text-slate-400">Não nativo (apenas Serial.print)</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* 5 Golden Rules */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>5 Regras de Ouro para Não Queimar a Placa</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-amber-400 block mb-1">1. Atenção à Linha de 5V</span>
                Nunca injete 5V nos pinos analógicos (PA0 a PA7 e PB0, PB1). Esses pinos queimam acima de 3.6V.
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-amber-400 block mb-1">2. Cuidado com Curto na Barra SWD</span>
                Os 4 pinos da extremidade ficam muito próximos. Certifique-se de que os conectores fêmea estejam bem isolados para não encostar 3.3V no GND.
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-amber-400 block mb-1">3. Corrente Máxima por Pino</span>
                Cada GPIO do STM32 suporta até 25 mA (máximo total de 150 mA somando todos os pinos). Use transistores ou drivers para cargas pesadas.
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-amber-400 block mb-1">4. Não force pinos JTAG como GPIO sem desativar</span>
                Pinos PA15, PB3 e PB4 são compartilhados com o JTAG. Para usá-los como GPIO no CubeMX, configure o Debug para <em>Serial Wire</em>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Step Banner */}
      <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/15">
        <div>
          <h3 className="text-base font-bold">Hardware montado e pronto?</h3>
          <p className="text-xs text-blue-100 mt-0.5">
            O próximo passo é baixar e instalar o STM32CubeIDE no seu sistema Ubuntu.
          </p>
        </div>
        <button
          onClick={() => onNavigateArticle("download")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-700 hover:bg-blue-50 active:scale-95 transition-all shadow cursor-pointer flex-shrink-0"
        >
          <span>Ir para Download e Instalação</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
