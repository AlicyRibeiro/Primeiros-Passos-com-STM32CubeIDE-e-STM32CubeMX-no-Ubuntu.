
A STM32F103C8T6, popularmente conhecida através da placa Blue Pill, é uma das opções mais acessíveis e utilizadas para quem deseja iniciar no desenvolvimento de sistemas embarcados com microcontroladores ARM.

Ela pertence à família STM32 da STMicroelectronics e utiliza um processador baseado na arquitetura ARM Cortex-M3, oferecendo um bom equilíbrio entre desempenho, baixo custo e grande quantidade de recursos integrados.

Entre suas principais características estão:

* Clock de até 72 MHz
* 64 KB de memória Flash
* 20 KB de memória RAM
* GPIOs configuráveis
* Timers
* Comunicação UART, SPI e I2C
* Conversor ADC de 12 bits
* Baixo consumo de energia

Por ser uma placa muito popular, existe uma grande quantidade de exemplos, tutoriais e bibliotecas disponíveis na internet, o que facilita bastante o aprendizado.

Este guia foi desenvolvido como material de apoio para a disciplina de Microcontroladores da Universidade Federal do Ceará, com o objetivo de auxiliar estudantes nos primeiros contatos com a plataforma STM32.

Ao longo deste material, será apresentado o passo a passo para configurar o ambiente de desenvolvimento, instalar as ferramentas necessárias, criar o primeiro projeto e entender o fluxo básico de trabalho utilizando a STM32F103C8T6.

---

# O que vamos construir?
O objetivo deste GitBook é levar você do download da ferramenta até o seu primeiro firmware funcional. Ao final desta leitura, você terá:

- O STM32CubeIDE instalado e pronto para uso no seu Ubuntu.
- Conhecimento sobre a estrutura básica de um projeto STM32.
- O seu primeiro Blink LED rodando diretamente no hardware.

---

# O que você vai precisar?
Para aproveitar ao máximo este guia, recomendamos ter em mãos:

1. Hardware: Uma placa Blue Pill e um gravador (ST-Link V2 ou compatível).
2. Sistema: Computador com Ubuntu instalado (preferencialmente versões LTS).

---

# Contexto Acadêmico
Este projeto é uma iniciativa para apoiar os estudantes de Sistemas Embarcados da UFC Quixadá. A ideia é padronizar o ambiente de desenvolvimento para que todos possam focar na lógica de programação e na arquitetura dos microcontroladores, garantindo que a ferramenta de software seja uma aliada no processo de aprendizagem.

**Dica**: Utilize o menu lateral para navegar entre os capítulos. Começaremos pelo processo de download e instalação básica.
