import React, { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  Send,
  ExternalLink,
  HelpCircle,
  Terminal,
  Camera,
  Cpu,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const SUPPORT_EMAIL = "anaalicyribeiro20@gmail.com";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "O ST-Link aparece no comando 'lsusb', mas a IDE dá 'No target connected'?",
    answer:
      "Isso quase sempre é falta de permissões udev ou conexões SWD invertidas. Verifique se criou o arquivo de regras em '/etc/udev/rules.d/49-stlinkv2.rules' e se os pinos SWDIO, SWCLK, GND e 3.3V estão firmes. Uma dica de ouro: segure o botão RESET da Blue Pill, clique no botão Debug da IDE e solte o botão assim que a gravação iniciar.",
  },
  {
    question: "Qual a posição correta dos jumpers BOOT0 e BOOT1?",
    answer:
      "Para gravação e execução padrão via ST-Link (SWD), ambos os jumpers amarelos (BOOT0 e BOOT1) devem permanecer na posição '0' (mais próximos dos pinos da placa). Se BOOT0 estiver em '1', a placa entra no modo bootloader serial.",
  },
  {
    question: "Por que parte do meu código sumiu após alterar configurações no CubeMX?",
    answer:
      "Toda alteração de pinos ou relógios regera os arquivos 'main.c' e 'main.h'. Para que seu código não seja apagado, escreva sempre estritamente dentro dos blocos comentados '/* USER CODE BEGIN ... */' e '/* USER CODE END ... */'.",
  },
  {
    question: "Por que o comando de ligar o pino PC13 apaga o LED onboard da Blue Pill?",
    answer:
      "O LED onboard da Blue Pill é conectado em lógica invertida (Active-Low): o catodo do LED vai para o pino PC13 e o anodo está no 3.3V. Portanto, colocar PC13 em nível baixo (RESET / 0) acende o LED, e colocá-lo em nível alto (SET / 1) apaga o LED.",
  },
];

export const SubmitQuestionView: React.FC = () => {
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("ST-Link / Gravação");
  const [environment, setEnvironment] = useState("Ubuntu 24.04 LTS (Nativo)");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const generateEmailBody = () => {
    const lines = [
      `Olá, gostaria de tirar uma dúvida sobre o Guia STM32 no Ubuntu.`,
      ``,
      `--- DADOS DA DÚVIDA ---`,
      `Nome / Aluno: ${name.trim() || "Não informado"}`,
      `Categoria: ${category}`,
      `Ambiente / SO: ${environment}`,
      `Assunto: ${subject.trim() || "Dúvida geral STM32"}`,
      ``,
      `--- DESCRIÇÃO DO PROBLEMA / DETALHES ---`,
      description.trim() || "[Descreva aqui os detalhes, mensagens de erro e o que já tentou]",
      ``,
      `---`,
      `Enviado a partir do Guia STM32 Ubuntu`,
    ];
    return lines.join("\n");
  };

  const emailSubject = `[Dúvida STM32] ${subject.trim() || category}`;
  const emailBody = generateEmailBody();

  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyFormattedMessage = () => {
    const fullText = `Para: ${SUPPORT_EMAIL}\nAssunto: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="space-y-10">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Canal de Suporte e Comunicação</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Envie sua Dúvida
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Ficou com alguma dúvida durante a instalação do STM32CubeIDE no Ubuntu,
          configuração do gravador ST-Link V2 ou gravação do código na Blue Pill?
          Disponibilizamos este canal direto para envio de dúvidas por e-mail.
        </p>
      </div>

      {/* Interactive Helper / Form to Compose Email */}
      <div
        id="formulario-de-envio"
        className="scroll-mt-24 p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Assistente de Envio de Dúvidas</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Preencha os campos abaixo para que sua dúvida já chegue organizada e com todas as informações necessárias.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Seu Nome / Identificação (opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: João da Silva (UFC Quixadá)"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Categoria da Dúvida
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="ST-Link / Gravação">ST-Link / Gravação / No target connected</option>
              <option value="Instalação / STM32CubeIDE">Instalação / STM32CubeIDE no Ubuntu</option>
              <option value="STM32CubeMX / Configuração de Pinos (.ioc)">STM32CubeMX / Configuração de Pinos (.ioc)</option>
              <option value="Código C / Biblioteca HAL / GPIO">Código C / Biblioteca HAL / GPIO / Blink LED</option>
              <option value="Hardware / Pinagem / Alimentação">Hardware / Pinagem / Jumpers BOOT</option>
              <option value="Outro">Outro assunto</option>
            </select>
          </div>

          {/* Ambiente */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Seu Sistema Operacional / Ambiente
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="Ubuntu 24.04 LTS (Nativo)">Ubuntu 24.04 LTS (Nativo)</option>
              <option value="Ubuntu 22.04 LTS (Nativo)">Ubuntu 22.04 LTS (Nativo)</option>
              <option value="Ubuntu 20.04 LTS (Nativo)">Ubuntu 20.04 LTS (Nativo)</option>
              <option value="Máquina Virtual (VirtualBox / VMware)">Máquina Virtual (VirtualBox / VMware)</option>
              <option value="WSL2 / Windows Subsystem for Linux">WSL2 / Windows Subsystem for Linux</option>
              <option value="Outra Distribuição Linux (Debian/Mint/Arch/Fedora)">Outra Distribuição Linux</option>
            </select>
          </div>

          {/* Assunto */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Assunto / Título do Problema
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex.: Erro ao tentar dar debug pela primeira vez"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Descrição detalhada da dúvida ou mensagem de erro
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o que estava tentando fazer, qual erro apareceu na tela ou terminal, e quais testes você já fez..."
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Buttons to send */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={gmailWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Enviar pelo Gmail Web</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <a
            href={mailtoUrl}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all"
          >
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Abrir no Cliente de E-mail</span>
          </a>

          <button
            onClick={handleCopyFormattedMessage}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            {copiedMessage ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Texto Copiado!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar Texto Completo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Guidelines: What to include */}
      <div
        id="o-que-incluir-no-e-mail"
        className="scroll-mt-24 space-y-4"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/60 pb-2">
          O que incluir no e-mail para receber ajuda mais rápida
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Para que possamos identificar o problema com precisão, tente anexar ou descrever os seguintes pontos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Terminal className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Mensagens de Erro e Saída de Terminal
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Copie e cole a mensagem exata do erro que aparece na aba <strong>Console</strong> da IDE ou execute no terminal os comandos <code>lsusb</code> e <code>dmesg | tail -n 20</code>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Camera className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Foto das Conexões Físicas
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Se o erro for de comunicação com a placa, tire uma foto nítida mostrando os 4 cabos do ST-Link (SWDIO, SWCLK, GND, 3.3V) e a posição dos jumpers amarelos <strong>BOOT0 e BOOT1</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ambiente de Execução
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Avise se está usando o Ubuntu instalado diretamente no computador ou em uma Máquina Virtual (VirtualBox/WSL2), pois máquinas virtuais exigem repasse de porta USB.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Trecho de Código do main.c
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Caso a dúvida seja sobre acionamento de GPIO ou funcionamento da lógica, anexe o trecho da função <code>main()</code> e do laço <code>while(1)</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick FAQ to resolve immediately before emailing */}
      <div
        id="duvidas-frequentes-rapidas"
        className="scroll-mt-24 space-y-4 pt-2"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Respostas Rápidas para Dúvidas Comuns
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Veja se o seu problema já possui uma solução imediata antes mesmo de enviar o e-mail:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-medium text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 bg-slate-50/50 dark:bg-slate-950/20">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
