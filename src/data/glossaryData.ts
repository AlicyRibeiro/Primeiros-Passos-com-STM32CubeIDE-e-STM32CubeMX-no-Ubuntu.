export interface GlossaryTerm {
  id: string;
  term: string;
  fullName: string;
  category:
    | "Periféricos & E/S"
    | "Comunicação Serial"
    | "Temporização & PWM"
    | "Analógico & Sinais"
    | "Sistema, Clock & CPU"
    | "Interrupções & Controle"
    | "Gravação & Debug";
  manualRef: string;
  summary: string;
  details: string;
  registersOrHal?: {
    registers?: string[];
    halFunctions?: string[];
  };
  codeExample?: string;
  engineeringTip: string;
  relatedTerms: string[];
}

export const GLOSSARY_CATEGORIES = [
  "Todos",
  "Periféricos & E/S",
  "Comunicação Serial",
  "Temporização & PWM",
  "Analógico & Sinais",
  "Sistema, Clock & CPU",
  "Interrupções & Controle",
  "Gravação & Debug",
] as const;

export type GlossaryCategory = (typeof GLOSSARY_CATEGORIES)[number];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "gpio",
    term: "GPIO",
    fullName: "General Purpose Input/Output (Entrada/Saída de Uso Geral)",
    category: "Periféricos & E/S",
    manualRef: "RM0008 - Capítulo 9: General-purpose and alternate-function I/Os",
    summary:
      "Pinos bidirecionais configuráveis por software para leitura ou envio de sinais digitais de nível lógico alto (3.3V) ou baixo (0V).",
    details:
      "No microcontrolador STM32F103, os pinos GPIO são agrupados em portas de 16 pinos (GPIOA, GPIOB, GPIOC, etc.). Cada pino individual pode ser configurado em 8 modos de operação: Entrada analógica, Entrada flutuante, Entrada com Pull-up/Pull-down, Saída Push-Pull, Saída Open-Drain, Função alternativa Push-Pull e Função alternativa Open-Drain. Além disso, a velocidade de comutação (slew rate) pode ser definida em 2 MHz, 10 MHz ou 50 MHz para minimizar interferência eletromagnética (EMI).",
    registersOrHal: {
      registers: ["GPIOx_CRL", "GPIOx_CRH", "GPIOx_IDR", "GPIOx_ODR", "GPIOx_BSRR", "GPIOx_BRR"],
      halFunctions: [
        "HAL_GPIO_WritePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin, GPIO_PinState PinState)",
        "HAL_GPIO_ReadPin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)",
        "HAL_GPIO_TogglePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin)",
      ],
    },
    codeExample: `// Piscar o LED onboard da Blue Pill (conectado no pino PC13)
HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
HAL_Delay(500); // 500 ms de pausa`,
    engineeringTip:
      "Pinos marcados como 'FT' (Five-Volt Tolerant) no datasheet toleram entrada de 5V quando configurados em modo digital. Porém, pinos com função de entrada analógica (ADC) suportam no máximo 3.6V (tensão VDD) sob risco de dano ao silício.",
    relatedTerms: ["AFIO", "EXTI", "Open-Drain", "Push-Pull", "Pull-Up / Pull-Down"],
  },
  {
    id: "usart",
    term: "USART / UART",
    fullName:
      "Universal Synchronous/Asynchronous Receiver-Transmitter (Transmissor/Receptor Serial Síncrono/Assíncrono)",
    category: "Comunicação Serial",
    manualRef: "RM0008 - Capítulo 27: Universal synchronous asynchronous receiver transmitter",
    summary:
      "Interface de comunicação serial ponto a ponto utilizada para comunicação com computadores, módulos Bluetooth, GPS e depuração de console.",
    details:
      "A USART permite troca de dados serial em modo assíncrono (UART padrão com linhas TX e RX) ou modo síncrono (com envio de sinal de clock externo). O STM32F103C8T6 possui até 3 canais: USART1 (barramento APB2, clock até 72 MHz, pinos PA9/PA10) e USART2/USART3 (barramento APB1, clock até 36 MHz). Suporta controle de fluxo por hardware (RTS/CTS), comunicação multiprocessador, modo LIN, Smartcard e transferências aceleradas via DMA.",
    registersOrHal: {
      registers: ["USART_SR", "USART_DR", "USART_BRR", "USART_CR1", "USART_CR2", "USART_CR3"],
      halFunctions: [
        "HAL_UART_Transmit(UART_HandleTypeDef *huart, const uint8_t *pData, uint16_t Size, uint32_t Timeout)",
        "HAL_UART_Receive(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout)",
        "HAL_UART_Transmit_IT() / HAL_UART_Transmit_DMA()",
      ],
    },
    codeExample: `// Envio de mensagem serial assíncrona pela USART1 (ex: 115200 bps)
char msg[] = "Status: STM32 Operando\\r\\n";
HAL_UART_Transmit(&huart1, (uint8_t*)msg, strlen(msg), 100);`,
    engineeringTip:
      "Para mensagens sem bloqueio da CPU, prefira o modo DMA (HAL_UART_Transmit_DMA) com buffer circular em vez de HAL_UART_Transmit com timeout em laços rápidos.",
    relatedTerms: ["Baud Rate", "DMA", "NVIC", "SPI", "I2C"],
  },
  {
    id: "pwm",
    term: "PWM",
    fullName: "Pulse Width Modulation (Modulação por Largura de Pulso)",
    category: "Temporização & PWM",
    manualRef: "RM0008 - Capítulo 15: General-purpose timers (TIM2 to TIM5) - Output compare mode",
    summary:
      "Técnica digital que gera uma onda quadrada periódica modulando a razão entre o tempo ligado e o período total para controlar potência média.",
    details:
      "No STM32, o PWM é gerado através dos módulos de temporizador (TIM1, TIM2, TIM3, TIM4) configurados no modo Output Compare PWM (Modo 1 ou Modo 2). O sinal é governado por três parâmetros chave: o Prescaler (PSC) que reduz a frequência do clock mestre, o Auto-Reload Register (ARR) que define o período/frequência final da onda, e o Capture/Compare Register (CCR) que determina o tempo em nível alto (Duty Cycle).",
    registersOrHal: {
      registers: ["TIMx_PSC", "TIMx_ARR", "TIMx_CCRx", "TIMx_CCMRx", "TIMx_CCER", "TIMx_CR1"],
      halFunctions: [
        "HAL_TIM_PWM_Start(TIM_HandleTypeDef *htim, uint32_t Channel)",
        "HAL_TIM_PWM_Stop(TIM_HandleTypeDef *htim, uint32_t Channel)",
        "__HAL_TIM_SET_COMPARE(TIM_HandleTypeDef *htim, uint32_t Channel, uint32_t Compare)",
      ],
    },
    codeExample: `// Iniciar PWM no Canal 1 do Timer 2 e ajustar duty cycle dinamicamente
HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);

// Duty cycle a 50% se ARR for 999:
__HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, 500);`,
    engineeringTip:
      "A fórmula da frequência é: Freq = Fclk / ((PSC + 1) * (ARR + 1)). Para servomotores analógicos padrão, configure a frequência em 50 Hz (período de 20 ms) e pulse widths de 1 ms a 2 ms.",
    relatedTerms: ["Duty Cycle", "TIM / Timers", "PSC / ARR / CCR", "SysTick", "GPIO"],
  },
  {
    id: "adc",
    term: "ADC",
    fullName: "Analog-to-Digital Converter (Conversor Analógico para Digital)",
    category: "Analógico & Sinais",
    manualRef: "RM0008 - Capítulo 11: Analog-to-digital converter (ADC)",
    summary:
      "Periférico de aproximações sucessivas (SAR) de 12 bits que converte tensões analógicas contínuas em valores numéricos discretos entre 0 e 4095.",
    details:
      "O STM32F103 possui até 2 conversores ADC independentes (ADC1 e ADC2) compartilhando até 16 canais externos (conectados nas portas PA0-PA7, PB0-PB1). Possui taxa de amostragem de até 1 MSPS (mega amostra por segundo), tempo de amostragem programável por canal, sensor de temperatura interno acoplado e canal interno de tensão de referência (VREFINT = 1.20V). Suporta modo de conversão única (Single), modo contínuo, modo de varredura (Scan) e canais injetados (Injected) acionados por eventos de temporizador.",
    registersOrHal: {
      registers: ["ADC_SR", "ADC_CR1", "ADC_CR2", "ADC_SMPR1", "ADC_SMPR2", "ADC_DR"],
      halFunctions: [
        "HAL_ADC_Start(ADC_HandleTypeDef* hadc)",
        "HAL_ADC_PollForConversion(ADC_HandleTypeDef* hadc, uint32_t Timeout)",
        "HAL_ADC_GetValue(ADC_HandleTypeDef* hadc)",
        "HAL_ADCEx_Calibration_Start(ADC_HandleTypeDef* hadc)",
      ],
    },
    codeExample: `// Leitura analógica de 12 bits com calibração prévia
HAL_ADCEx_Calibration_Start(&hadc1); // Recomendado no boot

HAL_ADC_Start(&hadc1);
if (HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK) {
    uint32_t valorADC = HAL_ADC_GetValue(&hadc1); // Retorna 0 a 4095
    float tensao = (valorADC * 3.3f) / 4095.0f;
}`,
    engineeringTip:
      "SEMPRE execute HAL_ADCEx_Calibration_Start(&hadc1) uma vez após a inicialização para zerar o offset interno do conversor. O pino de entrada não tolera tensões acima de VDD (3.3V).",
    relatedTerms: ["DMA", "TIM / Timers", "GPIO", "RCC"],
  },
  {
    id: "dma",
    term: "DMA",
    fullName: "Direct Memory Access (Acesso Direto à Memória)",
    category: "Sistema, Clock & CPU",
    manualRef: "RM0008 - Capítulo 13: Direct memory access controller (DMA)",
    summary:
      "Controlador de hardware dedicado que transfere blocos de dados entre periféricos e memória RAM sem sobrecarregar ou interromper o núcleo ARM Cortex-M.",
    details:
      "O controlador DMA1 no STM32F103 gerencia 7 canais independentes com prioridades configuráveis. Ele permite transferências periférico-memória (ex: ADC para array RAM, USART RX para buffer), memória-periférico (ex: RAM para USART TX, RAM para PWM/DAC) e memória-memória. Possui suporte nativo a buffer circular (Circular Mode), gerando interrupções automáticas de Meia Transferência (HT) e Transferência Completa (TC).",
    registersOrHal: {
      registers: ["DMA_ISR", "DMA_IFCR", "DMA_CCRx", "DMA_CNDTRx", "DMA_CPARx", "DMA_CMARx"],
      halFunctions: [
        "HAL_ADC_Start_DMA(ADC_HandleTypeDef* hadc, uint32_t* pData, uint32_t Length)",
        "HAL_UART_Receive_DMA(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size)",
      ],
    },
    codeExample: `// Ler 4 canais analógicos continuamente via DMA sem gastar clock da CPU
uint16_t adc_buffer[4];
HAL_ADC_Start_DMA(&hadc1, (uint32_t*)adc_buffer, 4);
// Os dados em adc_buffer são atualizados no plano de fundo automaticamente!`,
    engineeringTip:
      "Em sistemas com múltiplos canais ADC ou transmissão USART contínua, o DMA é essencial para evitar perda de dados por overrun (ORE) e manter a CPU livre para algoritmos de controle.",
    relatedTerms: ["ADC", "USART / UART", "NVIC", "Flash Memory & SRAM"],
  },
  {
    id: "spi",
    term: "SPI",
    fullName: "Serial Peripheral Interface (Interface Serial de Periféricos)",
    category: "Comunicação Serial",
    manualRef: "RM0008 - Capítulo 25: Serial peripheral interface (SPI)",
    summary:
      "Barramento serial síncrono Full-Duplex de 4 fios (SCK, MOSI, MISO, NSS) de alta velocidade, muito usado para displays TFT/OLED, memórias Flash e sensores SPI.",
    details:
      "O barramento opera no modelo Mestre-Escravo (Master/Slave). No STM32F103, a interface SPI1 opera no barramento rápido APB2 alcançando taxas de clock de até 18 MHz (fPCLK/2), enquanto SPI2 opera no APB1. A sincronização de dados é parametrizada pela polaridade do clock (CPOL) e fase do clock (CPHA), definindo os 4 modos padrão SPI (Modo 0 a 3). Permite quadros de 8 ou 16 bits de dados.",
    registersOrHal: {
      registers: ["SPIx_CR1", "SPIx_CR2", "SPIx_SR", "SPIx_DR", "SPIx_CRCPR"],
      halFunctions: [
        "HAL_SPI_Transmit(SPI_HandleTypeDef *hspi, uint8_t *pData, uint16_t Size, uint32_t Timeout)",
        "HAL_SPI_TransmitReceive(SPI_HandleTypeDef *hspi, uint8_t *pTxData, uint8_t *pRxData, uint16_t Size, uint32_t Timeout)",
      ],
    },
    codeExample: `// Envio de comando para display OLED/TFT via SPI1
uint8_t cmd = 0xAF; // Display ON
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET); // CS/NSS Low
HAL_SPI_Transmit(&hspi1, &cmd, 1, 10);
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);   // CS/NSS High`,
    engineeringTip:
      "O pino de seleção de chip (CS/NSS) é frequentemente controlado manualmente por um pino GPIO convencional em vez do pino de hardware NSS para garantir compatibilidade com chips escravos mais exigentes.",
    relatedTerms: ["I2C", "USART / UART", "DMA", "GPIO"],
  },
  {
    id: "i2c",
    term: "I2C",
    fullName: "Inter-Integrated Circuit (Comunicação Inter-Circuitos Integrados)",
    category: "Comunicação Serial",
    manualRef: "RM0008 - Capítulo 26: Inter-integrated circuit (I2C) interface",
    summary:
      "Barramento serial síncrono de 2 fios (SDA para dados e SCL para clock) baseado em coletores abertos (Open-Drain) e endereçamento mestre-multiescravo.",
    details:
      "Projetado para conectar sensores (acelerômetros, giroscópios, barômetros, displays LCD 16x2 com PCF8574 e memórias EEPROM). Opera com taxas de 100 kHz (Standard Mode) ou 400 kHz (Fast Mode). Utiliza endereçamento de 7 bits ou 10 bits. Como as linhas SDA e SCL operam em dreno aberto, é mandatório o uso de resistores de pull-up (tipicamente entre 2.2 kΩ e 4.7 kΩ para 3.3V) conectados à linha de alimentação.",
    registersOrHal: {
      registers: ["I2C_CR1", "I2C_CR2", "I2C_OAR1", "I2C_DR", "I2C_SR1", "I2C_SR2", "I2C_CCR"],
      halFunctions: [
        "HAL_I2C_Master_Transmit(I2C_HandleTypeDef *hi2c, uint16_t DevAddress, uint8_t *pData, uint16_t Size, uint32_t Timeout)",
        "HAL_I2C_Mem_Read(I2C_HandleTypeDef *hi2c, uint16_t DevAddress, uint16_t MemAddress, uint16_t MemAddSize, uint8_t *pData, uint16_t Size, uint32_t Timeout)",
      ],
    },
    codeExample: `// Leitura do registrador WHO_AM_I de um sensor MPU6050 (endereço 0x68 << 1 = 0xD0)
uint8_t chipId = 0;
HAL_I2C_Mem_Read(&hi2c1, 0xD0, 0x75, I2C_MEMADD_SIZE_8BIT, &chipId, 1, 100);`,
    engineeringTip:
      "Na biblioteca HAL do STM32, o endereço I2C de 7 bits precisa ser deslocado 1 bit para a esquerda (ex: endereço 0x68 vira 0xD0) porque o bit menos significativo (LSB) é reservado para a flag de Leitura/Escrita (R/W).",
    relatedTerms: ["Open-Drain vs Push-Pull", "Pull-Up / Pull-Down", "SPI", "DMA"],
  },
  {
    id: "nvic",
    term: "NVIC",
    fullName: "Nested Vectored Interrupt Controller (Controlador de Interrupções Vetorizadas Aninhadas)",
    category: "Interrupções & Controle",
    manualRef: "PM0056 - Capítulo 4.3: Nested vectored interrupt controller (NVIC)",
    summary:
      "Controlador de hardware integrado no núcleo ARM Cortex-M3 que gerencia prioridades e desvio de execução para rotinas de tratamento de interrupção (ISR).",
    details:
      "O NVIC permite baixíssima latência de atendimento a interrupções (apenas 12 ciclos de clock). Ele implementa o conceito de aninhamento (uma interrupção de maior prioridade pode interromper a execução de uma interrupção de menor prioridade). Divide as prioridades em Preemption Priority (prioridade de preempção) e Subpriority (subprioridade de desempate). Salva automaticamente os registradores da CPU na pilha (stack) durante o chaveamento de contexto.",
    registersOrHal: {
      registers: ["NVIC_ISERx", "NVIC_ICERx", "NVIC_ISPRx", "NVIC_ICPRx", "NVIC_IPRx"],
      halFunctions: [
        "HAL_NVIC_SetPriority(IRQn_Type IRQn, uint32_t PreemptPriority, uint32_t SubPriority)",
        "HAL_NVIC_EnableIRQ(IRQn_Type IRQn)",
        "HAL_NVIC_DisableIRQ(IRQn_Type IRQn)",
      ],
    },
    codeExample: `// Configurar prioridade da interrupção do Timer 2 e habilitá-la
HAL_NVIC_SetPriority(TIM2_IRQn, 2, 0);
HAL_NVIC_EnableIRQ(TIM2_IRQn);`,
    engineeringTip:
      "Nunca execute chamadas bloqueantes com HAL_Delay() dentro de uma ISR! Como HAL_Delay depende da interrupção do SysTick, se a sua ISR tiver prioridade igual ou superior ao SysTick, o sistema entrará em travamento permanente (deadlock).",
    relatedTerms: ["EXTI", "SysTick", "ISR", "RCC"],
  },
  {
    id: "exti",
    term: "EXTI",
    fullName: "External Interrupt/Event Controller (Controlador de Interrupções e Eventos Externos)",
    category: "Interrupções & Controle",
    manualRef: "RM0008 - Capítulo 10: Interrupts and events (EXTI)",
    summary:
      "Módulo capaz de monitorar variações de nível lógico em pinos GPIO e disparar interrupções instantâneas por borda de subida ou descida.",
    details:
      "O EXTI possui 20 linhas de detecção de eventos/interrupções. As linhas 0 a 15 são conectadas aos pinos de GPIO com a mesma numeração (por exemplo: EXTI0 pode monitorar PA0, PB0 ou PC0 via multiplexador AFIO). Cada linha possui detectores de borda independentes para subida (Rising edge), descida (Falling edge) ou ambas, ideal para leitura de botões, sensores digitais de presença e encoders.",
    registersOrHal: {
      registers: ["EXTI_IMR", "EXTI_EMR", "EXTI_RTSR", "EXTI_FTSR", "EXTI_SWIER", "EXTI_PR"],
      halFunctions: [
        "HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)",
        "HAL_GPIO_EXTI_IRQHandler(uint16_t GPIO_Pin)",
      ],
    },
    codeExample: `// Callback padrão chamado quando ocorre interrupção em um pino configurado
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_0) {
        // Botão pressionado no pino 0: alternar LED
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
    }
}`,
    engineeringTip:
      "Não é possível utilizar simultaneamente PA0 e PB0 como interrupções EXTI separadas, pois ambos concorrem pela mesma linha EXTI0 através do registrador AFIO_EXTICR1.",
    relatedTerms: ["GPIO", "AFIO", "NVIC", "ISR"],
  },
  {
    id: "rcc",
    term: "RCC",
    fullName: "Reset and Clock Control (Controle de Reset e Distribuição de Clock)",
    category: "Sistema, Clock & CPU",
    manualRef: "RM0008 - Capítulo 7: Reset and clock control (RCC)",
    summary:
      "Unidade central responsável pela geração, multiplicação e distribuição das árvores de clock para o processador e todos os periféricos internos.",
    details:
      "Por padrão de economia de energia, todos os periféricos do STM32 têm seu clock desligado após o reset. O RCC gerencia 4 fontes primárias: HSI (oscilador interno RC de 8 MHz), HSE (cristal oscilador externo de alta precisão, tipicamente 8 MHz na Blue Pill), LSI (interno de 40 kHz para o Watchdog) e LSE (cristal de 32.768 kHz para o RTC). Ele utiliza um circuito PLL (Phase-Locked Loop) para multiplicar o clock até a velocidade máxima de 72 MHz (SYSCLK) e divide os barramentos AHB (72 MHz), APB1 (máx 36 MHz) e APB2 (máx 72 MHz).",
    registersOrHal: {
      registers: ["RCC_CR", "RCC_CFGR", "RCC_CIR", "RCC_APB2ENR", "RCC_APB1ENR", "RCC_AHBENR"],
      halFunctions: [
        "SystemClock_Config()",
        "__HAL_RCC_GPIOA_CLK_ENABLE()",
        "__HAL_RCC_USART1_CLK_ENABLE()",
        "__HAL_RCC_TIM2_CLK_ENABLE()",
      ],
    },
    codeExample: `// Todo periférico STM32 precisa ter seu clock ligado antes de ser acessado!
__HAL_RCC_GPIOC_CLK_ENABLE(); // Habilita o clock da porta C
__HAL_RCC_USART1_CLK_ENABLE(); // Habilita o clock da USART1`,
    engineeringTip:
      "Tentar ler ou escrever em registradores de um periférico cujo clock não foi previamente habilitado no RCC causa uma falha de barramento imediata (HardFault ou BusFault exception).",
    relatedTerms: ["PLL", "SysTick", "TIM / Timers", "Flash Memory & SRAM"],
  },
  {
    id: "pll",
    term: "PLL",
    fullName: "Phase-Locked Loop (Malha de Captura de Fase / Multiplicador de Frequência)",
    category: "Sistema, Clock & CPU",
    manualRef: "RM0008 - Capítulo 7.2: Clocks - PLL",
    summary:
      "Circuito eletrônico sintetizador que multiplica a frequência de osciladores de entrada (como o cristal externo de 8 MHz) para atingir os 72 MHz máximos do microcontrolador.",
    details:
      "Na placa STM32 Blue Pill, o cristal oscilador de quartzo HSE possui frequência de 8 MHz. Para que o ARM Cortex-M3 opere em sua capacidade nominal máxima (72 MHz), o RCC ativa o multiplicador PLL com fator x9 (8 MHz * 9 = 72 MHz). O sinal resultante é então roteado como SYSCLK e distribuído para o barramento de alta velocidade AHB.",
    registersOrHal: {
      registers: ["RCC_CFGR (PLLSRC, PLLXTPRE, PLLMUL bits)"],
      halFunctions: ["HAL_RCC_OscConfig(RCC_OscInitTypeDef *RCC_OscInitStruct)"],
    },
    engineeringTip:
      "Ao configurar o PLL para 72 MHz, é indispensável ajustar a latência da memória Flash (Flash Latency Wait States) para 2 ciclos no registrador FLASH_ACR, pois a memória Flash interna não consegue acompanhar 72 MHz sem wait-states.",
    relatedTerms: ["RCC", "SysTick", "Flash Memory & SRAM"],
  },
  {
    id: "systick",
    term: "SysTick",
    fullName: "System Tick Timer (Temporizador de Tick do Sistema)",
    category: "Temporização & PWM",
    manualRef: "PM0056 - Capítulo 4.4: SysTick timer (STK)",
    summary:
      "Contador decrescente de 24 bits integrado diretamente no núcleo ARM Cortex-M3, utilizado como base de tempo padrão para funções de atraso e sistemas operacionais de tempo real (RTOS).",
    details:
      "O SysTick é configurado pelo STM32CubeIDE para gerar uma interrupção periódica a cada 1 milissegundo (1 kHz). A rotina de interrupção SysTick_Handler incrementa uma variável global de 32 bits (uwTick), que serve de base para as funções HAL_GetTick() e HAL_Delay(). Em aplicações com FreeRTOS, o SysTick atua como o motor do escalonador de tarefas (preemptive task switcher).",
    registersOrHal: {
      registers: ["STK_CTRL", "STK_LOAD", "STK_VAL", "STK_CALIB"],
      halFunctions: [
        "HAL_GetTick(void)",
        "HAL_Delay(uint32_t Delay)",
        "HAL_IncTick(void)",
      ],
    },
    codeExample: `// Temporização não-bloqueante (evita travar a CPU como HAL_Delay)
static uint32_t ultimoTempo = 0;
if (HAL_GetTick() - ultimoTempo >= 1000) {
    ultimoTempo = HAL_GetTick();
    HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13); // Executa a cada 1 segundo
}`,
    engineeringTip:
      "A variável uwTick de 32 bits estoura (overflow) a cada aproximadamente 49.7 dias de operação contínua. Subtrações do tipo (HAL_GetTick() - ultimoTempo >= intervalo) tratam o overflow automaticamente pela aritmética de inteiros sem sinal.",
    relatedTerms: ["TIM / Timers", "NVIC", "ISR", "RCC"],
  },
  {
    id: "swd",
    term: "SWD",
    fullName: "Serial Wire Debug (Depuração Serial a Dois Fios)",
    category: "Gravação & Debug",
    manualRef: "RM0008 - Capítulo 31: Debug support (DBG) - Serial wire JTAG debug port (SWJ-DP)",
    summary:
      "Protocolo bidirecional desenvolvido pela ARM para gravação da memória Flash e depuração em tempo real utilizando apenas duas linhas de sinal: SWDIO e SWCLK.",
    details:
      "O SWD substitui o tradicional barramento JTAG de 5 pinos, liberando pinos de E/S para a aplicação. Conecta o gravador ST-Link V2 ao núcleo da Blue Pill através do pino PA13 (SWDIO - Serial Wire Data Input/Output) e PA14 (SWCLK - Serial Wire Clock). Permite programar a memória Flash, ler registradores da CPU, definir breakpoints por hardware e inspecionar variáveis na memória RAM durante a execução sem parar o chip.",
    registersOrHal: {
      registers: ["AFIO_MAPR (SWJ_CFG bits)", "DBGMCU_CR"],
      halFunctions: ["__HAL_AFIO_REMAP_SWJ_NOJTAG()"],
    },
    codeExample: `// No STM32CubeMX, configure sempre em:
// System Core -> SYS -> Debug: Serial Wire
// Isso garante que PA13 e PA14 não sejam acidentalmente reconfigurados como GPIOs!`,
    engineeringTip:
      "Se você esquecer de habilitar o 'Debug: Serial Wire' no CubeMX, o firmware desativará as portas SWD na inicialização e o ST-Link não conseguirá mais conectar. Para recuperar, segure o botão RESET da placa, clique em 'Debug/Run' na IDE e solte o botão assim que o OpenOCD iniciar.",
    relatedTerms: ["JTAG", "BOOT0 / BOOT1", "GPIO", "AFIO"],
  },
  {
    id: "jtag",
    term: "JTAG",
    fullName: "Joint Test Action Group (Padrão IEEE 1149.1 de Teste e Depuração)",
    category: "Gravação & Debug",
    manualRef: "RM0008 - Capítulo 31.3: JTAG TAP connection",
    summary:
      "Padrão clássico de interface de teste de limites e depuração de circuitos integrados composto por 5 linhas (TDI, TDO, TMS, TCK, TRST).",
    details:
      "O STM32F103 possui a interface combinada SWJ-DP (Serial Wire / JTAG Debug Port). No modo JTAG completo, são ocupados 5 pinos (PA13, PA14, PA15, PB3, PB4). Como a placa Blue Pill utiliza gravação SWD, o modo 'JTAG-DP Disabled and SW-DP Enabled' pode ser selecionado no CubeMX para liberar os pinos PA15, PB3 e PB4 para uso como GPIO normais na aplicação.",
    engineeringTip:
      "Para utilizar os pinos PB3, PB4 e PA15 como pinos digitais comuns, é obrigatório remapear o periférico AFIO usando a macro __HAL_AFIO_REMAP_SWJ_NOJTAG().",
    relatedTerms: ["SWD", "AFIO", "GPIO"],
  },
  {
    id: "hal-ll",
    term: "HAL vs LL",
    fullName: "Hardware Abstraction Layer vs Low-Layer (Camadas de Software ST)",
    category: "Sistema, Clock & CPU",
    manualRef: "UM1850 - Description of STM32F1 HAL and low-layer drivers",
    summary:
      "As duas bibliotecas oficiais da STMicroelectronics para programação: a HAL prioriza portabilidade e facilidade; a LL prioriza máxima velocidade e menor footprint de memória.",
    details:
      "A biblioteca HAL (Hardware Abstraction Layer) oferece APIs de alto nível com estruturas de dados completas, timeouts e rotinas de callback padronizadas entre toda a família STM32 (F1, F4, G4, H7). A biblioteca LL (Low-Layer) atua quase como montagem em C puro, manipulando registradores diretamente via macros inline sem custo de overhead de execução, gerando códigos binários extremamente compactos e rápidos.",
    registersOrHal: {
      halFunctions: [
        "HAL: HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);",
        "LL:  LL_GPIO_SetOutputPin(GPIOC, LL_GPIO_PIN_13);",
      ],
    },
    codeExample: `// Comparação direta de acionamento de pino:
// Abordagem HAL (com validação e abstração):
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);

// Abordagem LL (escrita direta de 1 ciclo no registrador BSRR):
LL_GPIO_ResetOutputPin(GPIOC, LL_GPIO_PIN_13);`,
    engineeringTip:
      "Você pode mesclar HAL e LL no mesmo projeto CubeIDE: use HAL para inicialização rápida no CubeMX e adote drivers LL para partes críticas de performance (como laços de controle e interrupções rápidas).",
    relatedTerms: ["GPIO", "RCC", "NVIC"],
  },
  {
    id: "afio",
    term: "AFIO",
    fullName: "Alternate Function I/O (Multiplexador de Funções Alternativas de E/S)",
    category: "Periféricos & E/S",
    manualRef: "RM0008 - Capítulo 9.3: Alternate function I/O and debug configuration",
    summary:
      "Controlador que gerencia o remapeamento de periféricos internos para pinos físicos alternativos e a vinculação de linhas de interrupção externa (EXTI).",
    details:
      "No STM32F103, vários periféricos compartilham os mesmos pinos físicos. O registrador AFIO permite remapear periféricos para outros pinos (por exemplo: mover a USART1 de PA9/PA10 para PB6/PB7, ou o barramento I2C1 de PB6/PB7 para PB8/PB9). Também é responsável por selecionar qual porta de GPIO (A, B, C...) aciona as interrupções externas EXTI0 a EXTI15.",
    registersOrHal: {
      registers: ["AFIO_EVCR", "AFIO_MAPR", "AFIO_EXTICR1", "AFIO_EXTICR2", "AFIO_MAPR2"],
      halFunctions: [
        "__HAL_RCC_AFIO_CLK_ENABLE()",
        "__HAL_AFIO_REMAP_USART1_ENABLE()",
      ],
    },
    engineeringTip:
      "Sempre que você for remapear pinos de periféricos ou configurar interrupções EXTI por registradores, lembre-se de habilitar o clock do AFIO com __HAL_RCC_AFIO_CLK_ENABLE().",
    relatedTerms: ["GPIO", "EXTI", "SWD", "USART / UART"],
  },
  {
    id: "timers",
    term: "TIM / Timers",
    fullName: "Hardware Timers (Temporizadores e Contadores de Propósito Geral)",
    category: "Temporização & PWM",
    manualRef: "RM0008 - Capítulo 14 e 15: Advanced-control and General-purpose timers",
    summary:
      "Contadores de hardware de 16 bits baseados em clock interno que realizam contagem de tempo, geração de PWM, medição de pulsos (Input Capture) e sincronismo.",
    details:
      "A Blue Pill possui o TIM1 (Timer de controle avançado com saídas complementares e tempo morto para controle de motores) e os Timers de uso geral TIM2, TIM3 e TIM4. Cada timer possui 4 canais independentes que podem ser usados como: Entrada de captura (para medir largura de pulso ou frequência), Saída de comparação, Gerador de PWM ou Interface para decodificador de encoder em quadratura.",
    registersOrHal: {
      registers: ["TIMx_CR1", "TIMx_DIER", "TIMx_SR", "TIMx_CNT", "TIMx_PSC", "TIMx_ARR"],
      halFunctions: [
        "HAL_TIM_Base_Start_IT(TIM_HandleTypeDef *htim)",
        "HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)",
      ],
    },
    codeExample: `// Interrupção periódica gerada quando o Timer estoura o período (ARR):
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim) {
    if (htim->Instance == TIM2) {
        // Executado com precisão absoluta de tempo a cada período configurado
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
    }
}`,
    engineeringTip:
      "Para medir a rotação de encoders rotativos mecânicos ou ópticos, ative o 'Encoder Mode' do TIM2/TIM3 no CubeMX. O hardware conta pulsos nos canais 1 e 2 sem consumir nenhuma instrução da CPU.",
    relatedTerms: ["PWM", "PSC / ARR / CCR", "SysTick", "NVIC"],
  },
  {
    id: "psc-arr-ccr",
    term: "PSC / ARR / CCR",
    fullName: "Prescaler / Auto-Reload / Capture-Compare Registers",
    category: "Temporização & PWM",
    manualRef: "RM0008 - Capítulo 15.4: TIMx functional description",
    summary:
      "Os três registradores fundamentais que definem a velocidade, o período e a largura de pulso de qualquer temporizador de hardware STM32.",
    details:
      "1) PSC (Prescaler, 16 bits): Divide o clock do barramento por (PSC + 1). Se o clock for 72 MHz e PSC = 71, o contador incrementa a 1 MHz (1 us por incremento). 2) ARR (Auto-Reload Register, 16 bits): Determina o valor máximo de contagem antes do contador reiniciar a zero. Define o período da onda. 3) CCR (Capture/Compare Register, 16 bits): Define o limiar em que a saída digital comuta de nível, determinando o Duty Cycle do sinal PWM.",
    registersOrHal: {
      registers: ["TIMx_PSC", "TIMx_ARR", "TIMx_CCR1", "TIMx_CCR2", "TIMx_CCR3", "TIMx_CCR4"],
    },
    engineeringTip:
      "Tanto PSC quanto ARR trabalham com soma de 1 na divisão. Para dividir exatamente por 1000, coloque 999 no registrador.",
    relatedTerms: ["PWM", "TIM / Timers", "SysTick"],
  },
  {
    id: "iwdg-wwdg",
    term: "IWDG & WWDG",
    fullName: "Independent & Window Watchdog (Cães de Guarda contra Travamentos)",
    category: "Interrupções & Controle",
    manualRef: "RM0008 - Capítulos 18 e 19: Independent and Window watchdog",
    summary:
      "Temporizadores de segurança que resetam o microcontrolador automaticamente se o código travar em um loop infinito ou sofrer desvio por ruído elétrico.",
    details:
      "O IWDG (Independent Watchdog) é acionado por um oscilador RC interno próprio de 40 kHz (LSI), funcionando mesmo que o clock principal do microcontrolador falhe completamente. O firmware precisa executar 'HAL_IWDG_Refresh()' periodicamente antes do contador zerar. O WWDG (Window Watchdog) é mais estrito: o reset deve ser atualizado dentro de uma 'janela' temporal exata (nem cedo demais, nem tarde demais).",
    registersOrHal: {
      registers: ["IWDG_KR", "IWDG_PR", "IWDG_RLR", "WWDG_CR", "WWDG_CFR"],
      halFunctions: ["HAL_IWDG_Refresh(IWDG_HandleTypeDef *hiwdg)"],
    },
    codeExample: `// Dentro do loop principal while(1), alimente o watchdog regularmente:
while (1) {
    executar_tarefas_do_sistema();
    HAL_IWDG_Refresh(&hiwdg); // Evita o reset por watchdog
}`,
    engineeringTip:
      "Nunca alimente o Watchdog dentro de interrupções de timer! Se o código principal travar mas a interrupção continuar rodando, o watchdog continuará sendo alimentado e o travamento passará despercebido.",
    relatedTerms: ["RCC", "NVIC", "SysTick"],
  },
  {
    id: "rtc",
    term: "RTC",
    fullName: "Real-Time Clock (Relógio de Tempo Real)",
    category: "Temporização & PWM",
    manualRef: "RM0008 - Capítulo 17: Real-time clock (RTC)",
    summary:
      "Contador contínuo de segundos mantido energizado por uma bateria externa de botão conectada ao pino VBAT, mesmo com a placa desligada.",
    details:
      "O periférico RTC do STM32F103 opera com um oscilador de 32.768 kHz conectado aos pinos PC14 e PC15 (LSE - Low-Speed External Crystal). O registrador de pré-escala divide o sinal por 32768 para produzir um pulso exato de 1 segundo (1 Hz). Possui registradores de alarme para acordar o microcontrolador de modos de baixo consumo (Standby/Stop) e registradores de backup para guardar dados sensíveis que não podem ser perdidos.",
    registersOrHal: {
      registers: ["RTC_CRH", "RTC_CRL", "RTC_PRLH", "RTC_PRLL", "RTC_CNTH", "RTC_CNTL", "RTC_ALRH"],
      halFunctions: [
        "HAL_RTC_GetTime(RTC_HandleTypeDef *hrtc, RTC_TimeTypeDef *sTime, uint32_t Format)",
        "HAL_RTC_SetTime(RTC_HandleTypeDef *hrtc, RTC_TimeTypeDef *sTime, uint32_t Format)",
      ],
    },
    engineeringTip:
      "A placa Blue Pill já inclui a furação e pistas para o cristal oscilador de 32.768 kHz cilíndrico na parte inferior, permitindo implementação de relógio de parede e calendários.",
    relatedTerms: ["RCC", "SysTick", "BOOT0 / BOOT1"],
  },
  {
    id: "boot-pins",
    term: "BOOT0 / BOOT1",
    fullName: "Boot Mode Pins (Pinos de Configuração de Inicialização)",
    category: "Gravação & Debug",
    manualRef: "RM0008 - Capítulo 3.4: Boot modes",
    summary:
      "Pinos físicos com jumpers amarelos que selecionam em qual endereço de memória o processador busca o vetor de reset ao ser energizado.",
    details:
      "O estado dos pinos BOOT0 e BOOT1 é lido pela CPU no quarto ciclo de clock após o sinal de Reset ser liberado: 1) Modo Flash Principal (BOOT0 = 0, BOOT1 = X): O código gravado na memória Flash (0x08000000) é executado normalmente. 2) Modo System Memory (BOOT0 = 1, BOOT1 = 0): O microcontrolador executa o bootloader ROM de fábrica da ST, permitindo gravação serial via pinos PA9/PA10. 3) Modo Embedded SRAM (BOOT0 = 1, BOOT1 = 1): O código é carregado e executado direto da memória RAM (0x20000000).",
    engineeringTip:
      "No desenvolvimento padrão com gravador ST-Link V2, mantenha AMBOS os jumpers BOOT0 e BOOT1 na posição 0 (mais próximos do conector micro-USB).",
    relatedTerms: ["SWD", "Flash Memory & SRAM", "JTAG"],
  },
  {
    id: "flash-sram",
    term: "Flash Memory & SRAM",
    fullName: "Non-Volatile Flash & Static RAM (Memórias de Programa e Dados)",
    category: "Sistema, Clock & CPU",
    manualRef: "RM0008 - Capítulo 3: Embedded memory",
    summary:
      "A Flash armazena o binário do firmware compilado permanentemente; a SRAM armazena variáveis em tempo de execução, a pilha e a heap.",
    details:
      "O microcontrolador STM32F103C8T6 possui oficialmente 64 KB de memória Flash (iniciando no endereço 0x08000000) organizada em páginas de 1 KB, e 20 KB de memória SRAM estática (iniciando no endereço 0x20000000). A Flash requer 'wait states' dependendo do clock: 0 ciclos para clocks até 24 MHz, 1 ciclo entre 24 e 48 MHz, e 2 ciclos entre 48 e 72 MHz. Permite gravação em tempo de execução para salvar configurações persistentes sem perder ao reiniciar.",
    registersOrHal: {
      registers: ["FLASH_ACR", "FLASH_KEYR", "FLASH_SR", "FLASH_CR", "FLASH_AR"],
      halFunctions: [
        "HAL_FLASH_Unlock()",
        "HAL_FLASH_Program(uint32_t TypeProgram, uint32_t Address, uint64_t Data)",
        "HAL_FLASH_Lock()",
      ],
    },
    engineeringTip:
      "Para gravar dados persistentes na Flash, é obrigatório apagar a página inteira (1024 bytes) antes de escrever os novos valores, pois memórias Flash só conseguem mudar bits de 1 para 0 durante a escrita.",
    relatedTerms: ["BOOT0 / BOOT1", "DMA", "RCC", "PLL"],
  },
  {
    id: "open-drain-push-pull",
    term: "Open-Drain vs Push-Pull",
    fullName: "Topologias de Saída de Pinos Digitais",
    category: "Periféricos & E/S",
    manualRef: "RM0008 - Capítulo 9.1: GPIO Functional description",
    summary:
      "Diferença entre o acionamento simétrico (Push-Pull: puxa para 3.3V ou 0V) e o dreno aberto (Open-Drain: apenas puxa para 0V ou deixa flutuar).",
    details:
      "Em Push-Pull, o pino possui um par de transistores complementares (um PMOS superior e um NMOS inferior). Ele força ativamente tanto nível lógico alto (3.3V) quanto nível baixo (0V). Em Open-Drain, o transistor PMOS superior é desativado: o pino só consegue conduzir para 0V (GND). Para ir a nível alto, necessita de um resistor de pull-up externo ou interno. O modo Open-Drain é essencial em barramentos compartilhados como I2C e 1-Wire para evitar curtos-circuitos quando múltiplos dispositivos transmitem simultaneamente.",
    engineeringTip:
      "Nunca configure um pino em modo Push-Pull ao conectar uma linha de barramento I2C ou ao fazer a leitura de múltiplos botões em paralelo (wired-AND).",
    relatedTerms: ["GPIO", "I2C", "Pull-Up / Pull-Down"],
  },
  {
    id: "pullup-pulldown",
    term: "Pull-Up / Pull-Down",
    fullName: "Resistores Internos de Polarização de Nível Lógico",
    category: "Periféricos & E/S",
    manualRef: "RM0008 - Capítulo 9.1: Input modes",
    summary:
      "Resistores internos integrados no silício do STM32 (valor típico entre 30 kΩ e 50 kΩ) que garantem nível lógico estável quando nenhuma chave está pressionada.",
    details:
      "Pinos digitais de entrada em alta impedância (flutuantes) funcionam como pequenas antenas, captando ruído eletromagnético e alternando aleatoriamente entre 0 e 1. Ao ativar o resistor de Pull-Up interno no CubeMX, o pino é puxado para 3.3V quando aberto; ao pressionar um botão ligado ao GND, o pino vai a 0V de forma limpa. Já o Pull-Down puxa o pino para 0V por padrão.",
    codeExample: `// Configuração típica de botão no CubeMX:
// GPIO Mode: Input mode
// GPIO Pull-up/Pull-down: Pull-up
// Leitura com botão ligado ao GND:
if (HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_RESET) {
    // Botão pressionado!
}`,
    engineeringTip:
      "Utilizar o Pull-Up interno elimina a necessidade de soldar resistores externos na protoboard para cada botão do seu projeto.",
    relatedTerms: ["GPIO", "Open-Drain vs Push-Pull", "EXTI"],
  },
  {
    id: "baud-rate",
    term: "Baud Rate",
    fullName: "Taxa de Modulação / Velocidade de Comunicação Serial",
    category: "Comunicação Serial",
    manualRef: "RM0008 - Capítulo 27.3.4: Fractional baud rate generation",
    summary:
      "Número de símbolos transmitidos por segundo em um canal serial assíncrono (comum em 9600, 115200, 921600 bps).",
    details:
      "No STM32, a taxa de transmissão é gerada por um registrador de divisão fracionária de 16 bits (USART_BRR), composto por uma mantissa de 12 bits e uma fração de 4 bits. Isso permite ajustar a velocidade serial com erro percentual inferior a 0.5% a partir do clock do barramento APB. Para que a comunicação entre a Blue Pill e o computador funcione, a velocidade configurada no firmware deve ser idêntica à configurada no terminal serial (como Putty, Minicom ou STM32CubeIDE Serial Monitor).",
    engineeringTip:
      "A taxa mais recomendada para depuração no STM32 é 115200 bps: oferece excelente velocidade de transferência sem apresentar erros de tolerância de clock.",
    relatedTerms: ["USART / UART", "RCC"],
  },
  {
    id: "duty-cycle",
    term: "Duty Cycle",
    fullName: "Ciclo de Trabalho (Razão Cíclica de Sinal Periódico)",
    category: "Temporização & PWM",
    manualRef: "RM0008 - Capítulo 15.3.10: PWM mode",
    summary:
      "Percentual de tempo em que um sinal periódico PWM permanece em nível lógico alto durante um ciclo completo.",
    details:
      "Varia de 0% (sempre desligado / 0V) a 100% (sempre ligado / 3.3V). A tensão média entregue à carga é proporcional ao duty cycle: V_medio = VDD * (DutyCycle / 100). Em um timer STM32, o cálculo é dado por: DutyCycle (%) = (CCR / ARR) * 100. É utilizado para variar o brilho de LEDs, velocidade de rotação de motores DC e posição angular de servomotores.",
    engineeringTip:
      "Se o seu registrador ARR estiver configurado em 1000, cada incremento de 10 unidades no CCR corresponde exatamente a 1% de variação no Duty Cycle.",
    relatedTerms: ["PWM", "TIM / Timers", "PSC / ARR / CCR"],
  },
  {
    id: "isr",
    term: "ISR",
    fullName: "Interrupt Service Routine (Rotina de Tratamento de Interrupção)",
    category: "Interrupções & Controle",
    manualRef: "PM0056 - Capítulo 2.3: Exception model",
    summary:
      "Função especial em C executada automaticamente pelo processador quando um evento de hardware (timer, botão, byte serial recebido) ocorre.",
    details:
      "Quando uma interrupção é disparada e aceita pelo NVIC, o ARM Cortex-M3 suspende o fluxo normal do código (loop while), salva o estado dos registradores na pilha e salta imediatamente para o endereço do vetor correspondente (definido na tabela de vetores de interrupção no arquivo startup_stm32f103c8tx.s). As ISRs devem ser o mais curtas e rápidas possível, apenas sinalizando flags globais declaradas como 'volatile'.",
    codeExample: `// Variável global sinalizadora (SEMPRE usar volatile com ISRs!)
volatile uint8_t flagBotao = 0;

void EXTI0_IRQHandler(void) {
    HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_0);
}

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_0) {
        flagBotao = 1; // Sinalização rápida
    }
}`,
    engineeringTip:
      "Qualquer variável modificada dentro de uma ISR e lida no laço principal deve ser qualificada com a palavra-chave 'volatile' para impedir que o otimizador do compilador GCC mantenha o valor antigo em cache de registrador.",
    relatedTerms: ["NVIC", "EXTI", "TIM / Timers", "SysTick"],
  },
];
