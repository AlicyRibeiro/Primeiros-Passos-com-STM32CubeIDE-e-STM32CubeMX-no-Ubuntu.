# Fluxo de Trabalho: Do CubeMX à IDE

Entender o ciclo de vida de um projeto STM32 é essencial. Nas versões modernas (2.x.x), o fluxo não é linear, mas sim um ciclo de ida e volta entre o configurador de hardware (CubeMX) e o editor de código (IDE).

---

## 1. O Arquiteto (STM32CubeMX)

O projeto sempre começa aqui. Pense no CubeMX como a planta baixa da sua casa.

Escolha do Chip: Selecione o STM32F103C8 (Blue Pill).
Pinout & Configuration: Clique nos pinos para definir suas funções.
Exemplo: Clique no pino PC13 e selecione GPIO_Output (o LED da placa).
Clock Configuration: Defina o HCLK para 72MHz (o máximo da Blue Pill) e deixe o CubeMX resolver as multiplicações sozinho.
