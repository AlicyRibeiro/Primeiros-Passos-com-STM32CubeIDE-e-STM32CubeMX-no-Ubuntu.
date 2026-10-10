# Guia Prático STM32 no Ubuntu & Blue Pill

<p align="center">
  <img src="https://img.shields.io/badge/STM32-ARM%20Cortex--M3-002B49?style=for-the-badge&logo=stmicroelectronics&logoColor=white" alt="STM32" />
  <img src="https://img.shields.io/badge/Ubuntu-22.04%20%7C%2024.04-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

Plataforma interativa e documentação visual completa para desenvolvedores que desejam configurar o ecossistema **STM32 (STM32CubeIDE e STM32CubeMX)** no sistema operacional **Ubuntu Linux**, com foco prático na placa de desenvolvimento **STM32F103C8T6 (Blue Pill)** e no gravador/depurador **ST-Link V2**.

---

##  Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Diagramas Interativos](#-diagramas-interativos)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Licença](#-licença)

---

##  Visão Geral

Desenvolver para microcontroladores ARM no Linux muitas vezes apresenta barreiras iniciais: configuração de permissões `udev` para gravadores USB, dependências de pacotes `.deb` do STM32CubeIDE, pinagem do conector SWD e cuidados elétricos (como evitar queimar o microcontrolador alimentando com 5V).

Este projeto reúne:
1. **Passo a passo testado** de instalação e solução de problemas comuns no Ubuntu.
2. **Diagramas vetoriais interativos** que ensinam visualmente a ligação física e a pinagem.
3. **Glossário técnico interativo** para termos de sistemas embarcados (GPIO, USART, NVIC, DMA, etc.).
4. **Guia de fluxo de trabalho completo**: do CubeMX à depuração passo a passo com breakpoints no CubeIDE.

---

##  Funcionalidades Principais

-  **Busca Rápida Global (`Ctrl + K` / `Cmd + K`)**: Encontre instantaneamente comandos de terminal, tutoriais, pinos e tópicos técnicos.
-  **Diagramas SVG Interativos**:
  - **Pinagem ST-Link V2 ➔ Blue Pill**: Conexão SWD (3.3V, GND, SWCLK, SWDIO) com clique de inspeção detalhada de cada fio e pino.
  - **Silkscreen & Pinout Blue Pill**: Diagrama visual da placa com identificação de cada pino, jumpers de boot (`BOOT0` e `BOOT1`), LEDs onboard e botão de Reset.
-  **Glossário Técnico com Filtros**: Termos essenciais da arquitetura STM32 categorizados por Comunicação, Periféricos, Memória, Temporização e Debug.
-  **Modo Escuro / Claro (Dark & Light Mode)** com suporte ao tema do sistema operacional.
-  **Modo Foco (Zen Mode)**: Oculte sidebars e barras laterais para uma experiência de leitura limpa.
-  **Índice na Página (On-Page TOC)** com rastreamento de rolagem ativo (*scroll spy*).
-  **Códigos de Terminal com 1-Clique para Copiar**: Comandos formatados com syntax highlighting prontos para colar no bash do Ubuntu.

---

##  Diagramas Interativos

### 1. Conexão SWD (ST-Link V2 ➔ Blue Pill)

| Pino ST-Link | Pino Blue Pill | Função | Descrição Elétrica |
|:---:|:---:|:---:|:---|
| **Pino 9 / 4** | **3.3V / 3V3** | Alimentação VDD | **3.3V DC**. *(Nunca conecte 5V ao VDD!)* |
| **Pino 7** | **GND** | Referência 0V | Aterramento comum indispensável para integridade do sinal |
| **Pino 8** | **SWCLK / DCLK** | Serial Wire Clock | Sincronismo de clock serial gerado pelo depurador |
| **Pino 6** | **SWDIO / DIO** | Serial Wire Data | Barramento de dados bidirecional de gravação e debug |

---

##  Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6+](https://vite.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações**: [Motion](https://motion.dev/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Renderização Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown) + [Remark GFM](https://github.com/remarkjs/remark-gfm)
- **Syntax Highlighting**: [PrismJS](https://prismjs.com/)

---

##  Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para obter mais detalhes.
