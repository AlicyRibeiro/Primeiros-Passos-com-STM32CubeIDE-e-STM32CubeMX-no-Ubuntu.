import { DocArticle, DocSection } from "../types";

export const DOCS: DocArticle[] = [
  {
    "id": "introducao",
    "title": "Guia de Instalação STM32CubeIDE e STM32CubeMX no Ubuntu",
    "section": "Início",
    "content": "# Guia de Instalação STM32CubeIDE e STM32CubeMX no Ubuntu\n\n![Capa do Guia de Instalação STM32 e Fluxo de Trabalho com Blue Pill](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-8f3801b122b3cd66121d3edd87d1e80f7ab5b9f4%2Fcapa_intro.png?alt=media)\n\nA STM32F103C8T6, popularmente conhecida através da placa Blue Pill, é uma das opções mais acessíveis e utilizadas para quem deseja iniciar no desenvolvimento de sistemas embarcados com microcontroladores ARM.\n\nEla pertence à família STM32 da STMicroelectronics e utiliza um processador baseado na arquitetura ARM Cortex-M3, oferecendo um bom equilíbrio entre desempenho, baixo custo e grande quantidade de recursos integrados.\n\nEntre suas principais características estão:\n\n* Clock de até 72 MHz\n* 64 KB de memória Flash\n* 20 KB de memória RAM\n* GPIOs configuráveis\n* Timers\n* Comunicação UART, SPI e I2C\n* Conversor ADC de 12 bits\n* Baixo consumo de energia\n\nPor ser uma placa muito popular, existe uma grande quantidade de exemplos, tutoriais e bibliotecas disponíveis na internet, o que facilita bastante o aprendizado.\n\nEste guia foi desenvolvido como material de apoio para a disciplina de Microcontroladores da Universidade Federal do Ceará, com o objetivo de auxiliar estudantes nos primeiros contatos com a plataforma STM32.\n\nAo longo deste material, será apresentado o passo a passo para configurar o ambiente de desenvolvimento, instalar as ferramentas necessárias, criar o primeiro projeto e entender o fluxo básico de trabalho utilizando a STM32F103C8T6.\n\n***\n\n## O que vamos construir?\n\nO objetivo deste GitBook é levar você do download da ferramenta até o seu primeiro firmware funcional. Ao final desta leitura, você terá:\n\n* O STM32CubeIDE instalado e pronto para uso no seu Ubuntu.\n* Conhecimento sobre a estrutura básica de um projeto STM32.\n* O seu primeiro Blink LED rodando diretamente no hardware.\n\n***\n\n## O que você vai precisar?\n\nPara aproveitar ao máximo este guia, recomendamos ter em mãos:\n\n1. Hardware: Uma placa Blue Pill e um gravador (ST-Link V2 ou compatível).\n2. Sistema: Computador com Ubuntu instalado (preferencialmente versões LTS).\n\n***\n\n## Contexto Acadêmico\n\nEste projeto é uma iniciativa para apoiar os estudantes de Sistemas Embarcados da UFC Quixadá. A ideia é padronizar o ambiente de desenvolvimento para que todos possam focar na lógica de programação e na arquitetura dos microcontroladores, garantindo que a ferramenta de software seja uma aliada no processo de aprendizagem.\n\n**Dica**: Utilize o menu lateral para navegar entre os capítulos. Você pode conferir o guia visual completo em [Componentes: STM32 & ST-Link](#hardware) para ver a pinagem e ligação do gravador, ou avançar direto para a instalação básica.",
    "headings": [
      {
        "level": 2,
        "text": "O que vamos construir?",
        "slug": "o-que-vamos-construir"
      },
      {
        "level": 2,
        "text": "O que você vai precisar?",
        "slug": "o-que-voc-vai-precisar"
      },
      {
        "level": 2,
        "text": "Contexto Acadêmico",
        "slug": "contexto-acadmico"
      }
    ],
    "index": 0
  },
  {
    "id": "hardware",
    "title": "Componentes: STM32 & ST-Link",
    "section": "Início",
    "content": "# Componentes: STM32 Blue Pill & Gravador ST-Link V2\n\n> ⚠️ **Recomendação Essencial de Engenharia:** Em qualquer projeto com sistemas embarcados, **é sempre fundamental e altamente recomendado consultar o manual e o datasheet oficial dos componentes** antes de energizar circuitos ou conectar periféricos externos. Esses documentos informam os limites elétricos absolutos de tensão, corrente máxima de 25 mA por GPIO, dissipação de calor e pinos tolerantes a 5V vs. pinos analógicos de 3.6V máx.\n\nNesta seção visual, você encontra o diagrama completo de ligação entre o gravador ST-Link V2 e a placa STM32F103C8T6 (Blue Pill), além do mapa interativo de pinagem (Pinout) e das instruções de configuração dos jumpers BOOT0 e BOOT1.\n\n***\n\n## Ligação ST-Link V2 para Blue Pill\n\nA conexão entre o gravador USB ST-Link V2 e a placa Blue Pill utiliza o protocolo de depuração SWD (Serial Wire Debug) e necessita de apenas 4 fios:\n\n* **Fio Vermelho (Alimentação 3.3V):** Conecte o pino 4 ou 9 (+3.3V) do ST-Link ao pino 3.3V da barra SWD na extremidade da Blue Pill. Cuidado: NUNCA conecte o pino 5 ou 10 (+5V) do ST-Link ao 3.3V da placa sob risco de queimar o microcontrolador!\n* **Fio Verde (Clock SWD):** Conecte o pino 8 (SWCLK) do ST-Link ao pino SWCLK / DCLK da Blue Pill (porta PA14).\n* **Fio Laranja (Dados SWD):** Conecte o pino 6 (SWDIO) do ST-Link ao pino SWDIO / DIO da Blue Pill (porta PA13).\n* **Fio Preto (Referência GND):** Conecte o pino 2 ou 7 (GND) do ST-Link ao pino GND da Blue Pill.\n\n***\n\n## Jumpers BOOT0 e BOOT1\n\n* **Modo Flash (Padrão para desenvolvimento):** BOOT0 = 0 e BOOT1 = 0. Nesta posição (ambos os jumpers amarelos posicionados mais perto do conector micro-USB), o microcontrolador carrega e executa o código gravado na memória Flash.\n* **Modo System Memory (Bootloader):** BOOT0 = 1 e BOOT1 = 0. Utilizado para gravação serial via adaptador USB-UART nos pinos PA9 e PA10 sem gravador ST-Link.\n\n***\n\n## Destaques da Placa Blue Pill\n\n* **LED Integrado no PC13:** Conectado em lógica invertida (Active-Low). Nível lógico 0 liga o LED, e nível lógico 1 desliga.\n* **Cristal Externo de 8.000 MHz (HSE):** Oscilador que alimenta o circuito PLL interno para alcançar a velocidade máxima de 72 MHz.\n* **Pinos Tolerantes a 5V (FT):** Várias portas GPIO digitais toleram sinais de 5V, mas os pinos com função de conversão analógica (ADC) suportam no máximo 3.6V.",
    "headings": [
      {
        "level": 2,
        "text": "Ligação ST-Link V2 para Blue Pill",
        "slug": "ligacao-st-link-v2-para-blue-pill"
      },
      {
        "level": 2,
        "text": "Jumpers BOOT0 e BOOT1",
        "slug": "jumpers-boot0-e-boot1"
      },
      {
        "level": 2,
        "text": "Destaques da Placa Blue Pill",
        "slug": "destaques-da-placa-blue-pill"
      }
    ],
    "index": 1
  },
  {
    "id": "download",
    "title": "Download e Instalação do IDE",
    "section": "Instalação",
    "content": "# Download e Instalção do IDE\n\n## 📥 Download e Instalação\n\nNesta página, vamos cobrir o processo completo para obter o STM32CubeIDE e instalá-lo corretamente no Ubuntu, garantindo que as permissões de hardware sejam configuradas logo de início.\n\n***\n\n## 1. Fazendo o Download\n\nO primeiro passo é acessar a zona de desenvolvedores da ST e escolher a versão correta para o ecossistema Linux.\n\n1. Acesse o site oficial: [STM32CUBE - IDE](https://www.st.com/content/st_com/en/stm32-mcu-developer-zone.html)\n2. Selecione a ferramenta: Vá em Develop and debug e escolha a opção STM32CubeIDE.\n3. Escolha a versão: Procure pelo instalador Generic Linux (`ex: Versão 11.1.0 ou superior`).\n\n![opção de instalação](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-849d94122aa1db8c0654fd15982b20cb4106c4e0%2Fbaixando.png?alt=media)\n\n5. Inicie o download: Você pode fazer login ou baixar como convidado. Após preencher seus dados, um link de download será enviado para o seu e-mail.\n\n![opção de instalação](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-7fd7654a739cab1d435475d279dd71469d6dc0b1%2Flogin.png?alt=media)\n\n6. Arquivo: Você receberá um arquivo .zip (`ex: en.st-stm32cubeide_1.x.x_xxxx_x86_64.sh.zip`) na sua pasta de Downloads.\n\n![arquivo baixado](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-364651dbdfd8c56b5e687b38bc15785a903e427b%2Fbaixado.png?alt=media)\n\n***\n\n## 2. Instalação via Terminal\n\nCom o arquivo baixado, vamos utilizar o terminal para descompactar e executar o instalador.\n\n**Passo 1:** Navegue até a pasta\n\n```\ncd ~/Downloads\n```\n\n**Passo 2:** Descompacte o arquivo\n\nLembre-se de ajustar o nome do arquivo para a versão exata que você baixou:\n\n```\nunzip st-stm32cubeide_2.1.0_27993_20260219_1630_amd64.sh.zip\n```\n\n**Passo 3:** Conceda permissão de execução\n\n```\nchmod +x st-stm32cubeide_2.1.0_27993_20260219_1630_amd64.sh\n```\n\n**Passo 4:** Execute o instalador\n\n```\n./st-stm32cubeide_2.1.0_27993_20260219_1630_amd64.sh\n```\n\n***💡 Durante a Instalação:*** > \\* Aceite o contrato de licença.\n\n* Escolha o diretório de instalação (`Ex: /home/ana-ribeiro/st/stm32cubeide_2.1.0`).\n* **Importante:** Quando o instalador perguntar: \"Do you want to install Segger J-Link udev rules? \\[Y/n]\", digite Y. Isso configura as permissões necessárias para que seu computador acesse o hardware (gravador) via USB sem erros de permissão.\n\n![contrato de licença](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-37647230bfcfea1b777ebbafc4e1359a37394260%2Flicenca.png?alt=media)\n\n***\n\n## 3. Executando e Criando Atalho\n\nApós concluir a instalação, você tem duas formas principais de abrir o IDE.\n\n**Opção 1:** Execução Direta\n\nVocê pode navegar até a pasta e rodar o binário:\n\n```\ncd /home/ana-ribeiro/st/stm32cubeide_2.1.0\n./stm32cubeide\n```\n\n![opção de atalho](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-5b903e42e1913c397f983659545a28db677f90f0%2Fatalho1.png?alt=media)\n\n***\n\n**Opção 2**: Menu de Aplicativos (Interface Gráfica)\n\nSe você aceitou todas as opções durante a instalação via terminal, o Ubuntu automaticamente registrará o STM32CubeIDE na sua lista de programas.\n\n* Pressione a tecla Super (a tecla com o logo do Windows) no seu teclado.\n* Digite \"STM32\" na barra de pesquisa.\n* O ícone azul da IDE deve aparecer. Você pode clicar com o botão direito e selecionar \"Adicionar aos Favoritos\" para que ele fique sempre visível na sua barra lateral (Dock).\n\n  ⚠️ Nota para Usuários de Ubuntu Moderno: Se o ícone não aparecer imediatamente, tente reiniciar sua sessão (Log out e Log in). O sistema às vezes precisa desse \"refresh\" para indexar o novo atalho criado pelo instalador.",
    "headings": [
      {
        "level": 2,
        "text": "📥 Download e Instalação",
        "slug": "-download-e-instalao"
      },
      {
        "level": 2,
        "text": "1. Fazendo o Download",
        "slug": "1-fazendo-o-download"
      },
      {
        "level": 2,
        "text": "2. Instalação via Terminal",
        "slug": "2-instalao-via-terminal"
      },
      {
        "level": 2,
        "text": "3. Executando e Criando Atalho",
        "slug": "3-executando-e-criando-atalho"
      }
    ],
    "index": 1
  },
  {
    "id": "stm32cubemx",
    "title": "Instalando o STM32CubeMX",
    "section": "Instalação",
    "content": "# Instalando o STM32CubeMX\n\n## STM32CubeMX: O Configurador Gráfico\n\nO STM32CubeMX é o cérebro por trás da arquitetura ARM da ST. Ele é um gerador de código visual: você configura o hardware (pinos e clocks) e ele escreve os drivers complexos para você.\n\nExistem duas formas de utilizá-lo:\n\n1. Integrado: Já vem dentro do STM32CubeIDE (abre automaticamente ao clicar em arquivos .ioc).\n2. Standalone (Avulso): Uma ferramenta separada, ideal para quem quer apenas planejar o hardware ou usar compiladores diferentes.\n\n**⚠️ Mudança Crítica (Versão 2.0.0+):** Nas versões atuais, a ST separou o CubeMX da IDE. Embora ainda exista a versão integrada, o uso da versão Standalone tornou-se o fluxo mais estável e recomendado para evitar erros de compilação no Linux.\n\n***\n\n## Download\n\n1. Acesse o site: [STM32CubeMX Official Page.](https://www.st.com/en/development-tools/stm32cubemx.html?dl=redirect)\n2. Get Software: Escolha a opção STM32CubeMX (Linux).\n\n![opção de download](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-8459da3b17b3da649474d3963504ac269f7eccf4%2FcubeMX.png?alt=media)\n\n3. E-mail: Assim como na IDE, você receberá um link de download por e-mail após preencher os dados de convidado.\n\n![arquivo baixado](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-f9ad652a73ca6628ecd340cdc1103e2c4b745d14%2Fmx_baixado.png?alt=media)\n\n***\n\n## Instalação no Ubuntu\n\nO instalador do CubeMX para Linux utiliza Java para rodar a interface gráfica. Siga os passos abaixo para garantir que o instalador abra corretamente.\n\n### Opção 1: Via Terminal\n\n**Passo 1. Extrair e Preparar**\n\nAbra o terminal e prepare o ambiente:\n\n```\ncd ~/Downloads\nunzip en.stm32cubemx-lin-v*.zip\n```\n\n```\n# Entre na pasta extraída\ncd mx_pasta_extraida\n```\n\n```\n# Conceda permissão de execução (ajuste para a sua versão)\nchmod +x SetupSTM32CubeMX-6.16.1.linux\n```\n\n**Passo 2. Executando o Instalador Gráfico**\n\nApós dar a permissão, você pode executar o arquivo como um programa:\n\n```\n./SetupSTM32CubeMX-6.16.1\n```\n\nAssim que você executar este comando, a janela de instalação da ST será aberta. Basta seguir o assistente (Next/Avançar), aceitar os termos e escolher a pasta de destino.\n\n***\n\n### Opção 2: Via Interface Gráfica (Manual)\n\nSe você prefere não usar o terminal, pode fazer o processo manualmente como eu fiz:\n\n1. **Extração:** Vá até a sua pasta de Downloads, clique com o botão direito no arquivo .zip e selecione \"Extrair\".\n2. **Execução:** Entre na pasta extraída, localize o arquivo SetupSTM32CubeMX-6.16.1, clique com o botão direito nele e vá em `Executar como um programa` .\n\n![executando como um programa](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-76778e75f2b530d3afce4e739c74f393e52e7016%2Fprograma.png?alt=media)\n\n3. **Instalação:** Após executar como um prgrama ira abrir uma janela do terminal e logo depois a janela de instalação\n\n![janela de instalação](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-d445008a8e70a7220ce133363b1a53fa2a4b7d6c%2Finstala%C3%A7%C3%A3o.png?alt=media)\n\n#### Caso não apaceça a opção de executar como um prhrama faça o seguinte:\n\n1. **Extração:** Vá até a sua pasta de Downloads, clique com o botão direito no arquivo .zip e selecione \"Extrair Aqui\".\n2. **Permissão de Execução:** Entre na pasta extraída, localize o arquivo SetupSTM32CubeMX-6.16.1.linux, clique com o botão direito nele e vá em Propriedades.\n3. **Aba Permissões:** Marque a caixa que diz \"Permitir execução do arquivo como programa\".\n4. **Executar:** Feche a janela de propriedades e dê um duplo clique no arquivo (ou clique com o botão direito e selecione \"Executar\").\n\n**Nota:** Assim que você executar (por qualquer um dos métodos), a janela de instalação oficial da ST será aberta. Basta seguir o assistente (Next/Avançar), aceitar os termos e escolher a pasta de destino.\n\nApós a instalação o cubeMX ira aparecer na gaveta de aplicativos, essa será sua tela inicial\n\n![Tela incial do STM32CubeMX](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-d3ce1313553ac1b21a77788ec587c7d758d00344%2Fmx_pronto.png?alt=media)",
    "headings": [
      {
        "level": 2,
        "text": "STM32CubeMX: O Configurador Gráfico",
        "slug": "stm32cubemx-o-configurador-grfico"
      },
      {
        "level": 2,
        "text": "Download",
        "slug": "download"
      },
      {
        "level": 2,
        "text": "Instalação no Ubuntu",
        "slug": "instalao-no-ubuntu"
      },
      {
        "level": 3,
        "text": "Opção 1: Via Terminal",
        "slug": "opo-1-via-terminal"
      },
      {
        "level": 3,
        "text": "Opção 2: Via Interface Gráfica (Manual)",
        "slug": "opo-2-via-interface-grfica-manual"
      }
    ],
    "index": 2
  },
  {
    "id": "fluxo-trabalho",
    "title": "Fluxo de Trabalho: Do CubeMX à IDE",
    "section": "Mão na Massa",
    "content": "# Fluxo de Trabalho: Do CubeMX à IDE\n\nAntes de começar a programar a STM32, é importante entender qual é o papel de cada software utilizado durante o desenvolvimento.\n\nNo fluxo básico com STM32, normalmente são usadas duas ferramentas principais:\n\n* STM32CubeMX\n* STM32CubeIDE\n\nCada uma possui uma função diferente.\n\n***\n\n## STM32CubeMX\n\nO STM32CubeMX é a ferramenta utilizada para configurar o microcontrolador.\n\nNele, você escolhe:\n\n* O modelo da placa ou microcontrolador\n* Quais pinos serão usados\n* Quais periféricos estarão ativos\n* Configurações de clock\n* Configurações de comunicação, como UART, SPI e I2C\n* Timers, ADC, PWM e outros recursos\n\nO CubeMX funciona como uma ferramenta gráfica de configuração.\n\nAo final, ele gera automaticamente a estrutura inicial do projeto, incluindo arquivos, bibliotecas e funções de inicialização.\n\nEm outras palavras, o CubeMX é responsável por preparar o projeto antes da programação.\n\n![Tela principal do STM32CubeMX](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-d3ce1313553ac1b21a77788ec587c7d758d00344%2Fmx_pronto.png?alt=media)\n\n***\n\n## STM32CubeIDE\n\nA STM32CubeIDE é o ambiente onde o código será escrito.\n\nDepois que o projeto é gerado no CubeMX, ele pode ser aberto na IDE.\n\nNa STM32CubeIDE, você poderá:\n\n* Escrever o código da aplicação\n* Compilar o projeto\n* Corrigir erros\n* Gravar o programa na placa\n* Fazer debug\n* Acompanhar variáveis e execução do código\n\nA IDE reúne editor de código, compilador, gravador e depurador em um único ambiente.\n\n![Tela principal da STM32CubeIDE](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-e5b5ebc81850be87fe8d6fbe214cf4794e5befa6%2Fcubeide-main.png?alt=media)\n\n***\n\n## Como as duas ferramentas trabalham juntas\n\nO fluxo normalmente funciona desta forma:\n\n1. Criar o projeto no STM32CubeMX\n2. Configurar os pinos e periféricos\n3. Gerar o código\n4. Abrir o projeto na STM32CubeIDE\n5. Escrever a lógica da aplicação\n6. Compilar\n7. Gravar na placa\n8. Testar e depurar\n\n![Fluxo CubeMX para CubeIDE](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-44d46327e5481692b264157a7abd77507103faa4%2Fworkflow.png?alt=media)\n\n***\n\n## Diferença entre configuração e programação\n\nNo CubeMX, você configura o hardware do microcontrolador, definindo quais pinos e periféricos serão utilizados.\n\nNa IDE, você escreve a lógica da aplicação, dizendo o que o microcontrolador deve fazer.\n\nPor exemplo:\n\n* CubeMX: configurar PC13 como saída\n* IDE: escrever o código para acender e apagar o LED\n\n***\n\n## O que acontece quando o código é gerado\n\nQuando o CubeMX gera o projeto, vários arquivos e pastas são criados automaticamente.\n\nOs principais são:\n\n* `Core/Inc`: arquivos de cabeçalho\n* `Core/Src`: arquivos de código-fonte\n* `Drivers`: bibliotecas da STM32\n* `main.c`: arquivo principal da aplicação\n\nNo início, você usará principalmente o arquivo `main.c`, mas com o tempo aprenderá a trabalhar com outros arquivos do projeto.\n\n***\n\n## Exemplo prático\n\nImagine que você deseja fazer um LED piscar.\n\nNesse caso:\n\n* No CubeMX, você configura o pino PC13 como saída\n* O CubeMX gera o código inicial\n* Na IDE, você escreve o código para alternar o estado do LED\n* Depois, compila e grava na placa\n\nOu seja, o CubeMX prepara a estrutura e a IDE é usada para programar e executar o projeto.\n\n***\n\n## Resumo\n\nDe forma simplificada:\n\n* CubeMX = configuração do hardware e geração automática do projeto\n* STM32CubeIDE = escrita do código, compilação, gravação e debug\n\nEntender a função de cada ferramenta ajuda bastante no início, porque evita confundir configuração de hardware com programação da aplicação.",
    "headings": [
      {
        "level": 2,
        "text": "STM32CubeMX",
        "slug": "stm32cubemx"
      },
      {
        "level": 2,
        "text": "STM32CubeIDE",
        "slug": "stm32cubeide"
      },
      {
        "level": 2,
        "text": "Como as duas ferramentas trabalham juntas",
        "slug": "como-as-duas-ferramentas-trabalham-juntas"
      },
      {
        "level": 2,
        "text": "Diferença entre configuração e programação",
        "slug": "diferena-entre-configurao-e-programao"
      },
      {
        "level": 2,
        "text": "O que acontece quando o código é gerado",
        "slug": "o-que-acontece-quando-o-cdigo-gerado"
      },
      {
        "level": 2,
        "text": "Exemplo prático",
        "slug": "exemplo-prtico"
      },
      {
        "level": 2,
        "text": "Resumo",
        "slug": "resumo"
      }
    ],
    "index": 3
  },
  {
    "id": "regras-codigo",
    "title": "Regras de Ouro: Onde escrever seu código",
    "section": "Mão na Massa",
    "content": "# Regras de Ouro: Onde escrever seu código\n\nSe existe uma página que merece atenção especial, é esta.\n\nNos projetos STM32, o código escrito por você e o código gerado automaticamente pelo STM32CubeMX ficam no mesmo projeto e, muitas vezes, no mesmo arquivo. Porém, cada um possui seu espaço específico.\n\nQuando o CubeMX gera ou atualiza um projeto, ele recria automaticamente partes do código relacionadas à configuração dos periféricos, inicialização do hardware e estrutura básica do programa.\n\nPor isso, é muito importante saber exatamente onde escrever seu código.\n\n***\n\n## Regiões reservadas para o usuário\n\nOs arquivos gerados pelo CubeMX possuem áreas especiais marcadas com comentários como:\n\n```c\n/* USER CODE BEGIN */\n\n/* USER CODE END */\n```\n\nEssas regiões existem justamente para que você possa adicionar seu código sem correr o risco de perdê-lo quando o projeto for regenerado.\n\nExemplo:\n\n```c\n/* USER CODE BEGIN 2 */\nHAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);\n/* USER CODE END 2 */\n```\n\nSempre que precisar adicionar variáveis, funções, inicializações ou lógica da aplicação, utilize essas áreas.\n\n![Regiões USER CODE dentro do arquivo main.c](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-5ecb71ea4de9acbd5272c07fda2eec242b664374%2Fuser-code-regions.png?alt=media)\n\n*Figura 1. Exemplo de várias regiões `USER CODE BEGIN` e `USER CODE END` dentro do arquivo `main.c`.*\n\n***\n\n## Locais mais comuns para escrever código\n\nAlgumas regiões aparecem com mais frequência no arquivo `main.c`:\n\n* `USER CODE BEGIN Includes` → inclusão de bibliotecas extras\n* `USER CODE BEGIN PV` → variáveis globais\n* `USER CODE BEGIN 0` → funções auxiliares\n* `USER CODE BEGIN 2` → configurações logo após a inicialização\n* `USER CODE BEGIN WHILE` → código que será executado repetidamente\n* `USER CODE BEGIN 3` → final do loop principal\n\n***\n\n## Exemplo prático\n\n```c\nwhile (1)\n{\n  /* USER CODE BEGIN WHILE */\n  HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);\n  HAL_Delay(500);\n  /* USER CODE END WHILE */\n\n  /* USER CODE BEGIN 3 */\n  /* USER CODE END 3 */\n}\n```\n\nNesse exemplo, o LED conectado ao PC13 muda de estado a cada 500 ms.\n\n***\n\n## O que pode acontecer se você escrever fora dessas regiões\n\nSe você escrever código fora das áreas `USER CODE`, o CubeMX pode apagar esse trecho quando gerar novamente o projeto.\n\nIsso acontece porque o software entende que todo o restante do arquivo pertence à estrutura automática do projeto.\n\nPor exemplo, se você adicionar uma função manualmente entre duas partes geradas pelo CubeMX, ela pode desaparecer na próxima atualização.\n\n***\n\n## Boa prática\n\nAntes de escrever qualquer código em um projeto STM32, procure primeiro uma região `USER CODE BEGIN` apropriada.\n\nEssa é uma das práticas mais importantes no início, porque evita perder trabalho e facilita bastante a organização do projeto.\n\n***\n\n> ⚠️ Nunca escreva código fora das regiões `USER CODE BEGIN` e `USER CODE END`, pois ele pode ser perdido ao regenerar o projeto.",
    "headings": [
      {
        "level": 2,
        "text": "Regiões reservadas para o usuário",
        "slug": "regies-reservadas-para-o-usurio"
      },
      {
        "level": 2,
        "text": "Locais mais comuns para escrever código",
        "slug": "locais-mais-comuns-para-escrever-cdigo"
      },
      {
        "level": 2,
        "text": "Exemplo prático",
        "slug": "exemplo-prtico"
      },
      {
        "level": 2,
        "text": "O que pode acontecer se você escrever fora dessas regiões",
        "slug": "o-que-pode-acontecer-se-voc-escrever-fora-dessas-regies"
      },
      {
        "level": 2,
        "text": "Boa prática",
        "slug": "boa-prtica"
      }
    ],
    "index": 4
  },
  {
    "id": "blink-led",
    "title": "Primeiro Blink (PC13)",
    "section": "Mão na Massa",
    "content": "# Primeiro Blink (PC13)\n\nDepois de configurar o ambiente e entender o papel do STM32CubeMX e da STM32CubeIDE, um dos primeiros testes mais importantes é fazer o LED piscar.\n\nEsse exemplo é útil porque permite verificar se o projeto foi criado corretamente, se o pino foi configurado como saída digital e se o código está sendo gravado e executado na placa como esperado. O tutorial da Eletrogate usa esse fluxo com a Blue Pill, configurando o **PC13** como saída e inserindo o código do blink dentro do `while (1)`.\n\n***\n\n## Objetivo\n\nNeste exemplo, o pino **PC13** será configurado como saída digital para controlar o LED da placa.\n\nAo final, o programa fará o LED alternar entre ligado e desligado em um intervalo fixo.\n\n![Tela inicial do projeto na STM32CubeIDE](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-7a1b1882ad6f0bcf971adb73a169474ae420722f%2Ftela-inicial-projeto.png?alt=media)\n\n*Figura 1. Tela inicial da STM32CubeMX para criação de um novo projeto.*\n\n***\n\n## Configuração no STM32CubeMX\n\nAntes de escrever o código, é necessário configurar o projeto.\n\n***\n\n### 1. Criar o projeto\n\nExistem duas formas mais comuns de iniciar um projeto STM32:\n\n**Opção 1: STM32CubeIDE com CubeMX integrado (versões 1.x.x)**\n\nNa STM32CubeIDE, clique em:\n\nFile -> New -> STM32 Project\n\nEm seguida, selecione o microcontrolador da placa e avance para a tela de configuração. O projeto foi iniciado buscando o alvo **STM32F103C6T6A** no seletor da IDE.\n\n![Seleção do microcontrolador no início do projeto](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-b5a343f1e0e28ee4fbfc19ce8def2a235f99146a%2Fselecao-microcontrolador.png?alt=media)\n\n*Figura 2. Seleção do microcontrolador ou da placa no assistente de criação do projeto.*\n\n**Opção 2: STM32CubeMX separado**\n\nSe estiver usando o CubeMX separado da IDE:\n\n1. Abra o STM32CubeMX\n2. Clique em Access to MCU Selector\n\n![Access to MCU Selector](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-1f2ba32c410dc61d77d5c12d2b6a19847a561a1b%2FMCU.png?alt=media)\n\n3. Escolha o microcontrolador desejado\n\n![Seleção do microcontrolador no início do projeto](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-b5a343f1e0e28ee4fbfc19ce8def2a235f99146a%2Fselecao-microcontrolador.png?alt=media)\n\nNos dois casos, ao final você chegará na mesma tela de configuração de pinos, clocks e periféricos.\n\n***\n\n### 2. Configurar o sistema\n\nNa seção **System core**, vá ate **SYS** defina:\n\n* **Debug** como `Serial Wire`\n* **Timebase Source** como `SysTick`\n\n![Configuração da seção SYS](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-a3621d9d0872440912b72a89fdba316529152fca%2Fconfig-sys.png?alt=media)\n\n*Figura 3. Configuração da seção SYS com Serial Wire e SysTick.*\n\n***\n\n### 3. Configurar o clock\n\nNa seção **RCC** ainda em **System core** , selecione:\n\n* **High Speed Clock (HSE)** como `Crystal/Ceramic Resonator`\n\n![Configuração do clock no CubeMX](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-2603e7de092d0e5c6b84f9d4118236a9abdff140%2Fconfig-clock.png?alt=media)\n\n***\n\n### 4. Configurar o pino PC13\n\nNo campo **Pinout View**, clique no pino **PC13** e selecione a função **GPIO\\_Output** para configurá-lo como saída digital.\n\n![Configuração do PC13 como GPIO\\_Output](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-6b688fcd8657cadcf30ba7a95ffbfcd76fb1b703%2Fconfig-pc13.png?alt=media)\n\n*Figura 5. Configuração do pino PC13 como saída digital.*\n\nEm seguida, clique, sobre o mesmo pino, com o botão direito do mouse, fazendo com que seja exibido o respectivo menu. Neste, clique em “Enter User Label”.\n\nNo campo agora aberto, digite “pinoLED”.\n\n![label do pino](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-b9d06688f780a375268f45aa5bca573465a9918b%2Flabel.png?alt=media)\n\n***\n\n### 5. Clock Configuration\n\nDepois, na aba **Clock Configuration**, ajuste a fonte do PLL e o clock do sistema. O fluxo usa **HSE** como fonte do PLL e **PLLCLK** como clock do sistema.\n\n![Configuração do clock no CubeMX](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-48ca783dec24fd452f668468d3c84158c4cff9c9%2Fconfig-clock2.png?alt=media)\n\n*Figura 4. Ajuste do clock do sistema na aba Clock Configuration.*\n\n***\n\n### 6. Gerar o código\n\nDepois de concluir as configurações, salve o projeto para gerar automaticamente os arquivos. Tecle “Ctrl+S”, para salvar as configurações. Isso fará surgir uma janela questionando se o código correspondente a estas configurações deve ser criado. Clique em “Yes”.\n\nCaso você esteja usando o CubeMX separado do CubeIDE siga os seguintes passos:\n\n1. Siga para a aba **Project Manager**.\n2. Na opção **Project Name** coloque o nome da prática.\n\n> È importante que seja nomeado pois o CubeMX não deixará gerar o codigo sem nome\n\n3. Na opção **Project Location** coloque o caminho da pasta que você quer usar para a prática.\n4. na opção **Toolchain/IDE** selecione **STM32CubeIDE**\n\n![Project Manager](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-3af7da3f69482d4300f153896edc1be874709804%2FProject_Manager.png?alt=media)\n\n5. Após seguir esses passos na aba **Project Manager** clique na opçao que fica no carto superior esquerdo chamada **GENERATE CODE**\n\n![Janela de geração de código](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-9af3357728261a4333ff41db224eaa067da60db8%2Fgeracao-codigo.png?alt=media)\n\n*Figura 6. Janela de geração automática do código do projeto.*\n\n***\n\n## Código do blink\n\nDepois da geração do projeto, a estrutura básica do `main.c` já estará pronta. O projeto inicial chama funções como `HAL_Init()`, `SystemClock_Config()` e `MX_GPIO_Init()` antes de entrar no laço principal, deixando o `while (1)` como local natural para a lógica da aplicação.\n\nNesse exemplo, o blink é implementado com `HAL_GPIO_TogglePin()` e `HAL_Delay(500)`.\n\n```c\nwhile (1)\n{\n  HAL_GPIO_TogglePin(pinoLED_GPIO_Port, pinoLED_Pin);\n  HAL_Delay(500);\n}\n```\n\n![Trecho do main.c com o código do blink](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-1a2c1721dbe55ee6a79212c25fd6b698c6037f93%2Fcodigo-blink-main.png?alt=media)\n\n*Figura 7. Código do blink inserido no `while (1)` do arquivo `main.c`.*\n\n***\n\n## O que esse código faz\n\nA função `HAL_GPIO_TogglePin()` alterna o estado lógico do pino configurado como saída. Já a função `HAL_Delay()` cria uma espera em milissegundos. O DeepBlueEmbedded usa exatamente essa ideia para demonstrar o controle de uma saída digital com a HAL.\n\nNesse caso:\n\n* `HAL_GPIO_TogglePin(...)` muda o estado atual do LED\n* `HAL_Delay(500)` espera 500 ms\n* o processo se repete continuamente dentro do `while (1)`\n\nAssim, o LED pisca em intervalos regulares.\n\n***\n\n## Outra forma de fazer\n\nAlém de `HAL_GPIO_TogglePin()`, o DeepBlueEmbedded também mostra que o mesmo efeito pode ser obtido com `HAL_GPIO_WritePin()`, ligando e desligando o pino manualmente.\n\n```c\nwhile (1)\n{\n  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_SET);\n  HAL_Delay(500);\n\n  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_RESET);\n  HAL_Delay(500);\n}\n```\n\nAs duas abordagens servem para o mesmo objetivo. Para um primeiro teste, a versão com `HAL_GPIO_TogglePin()` costuma ser mais simples.\n\n![Exemplo alternativo com HAL\\_GPIO\\_WritePin](https://3518464650-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhxPGla0guUEihyS9DKDV%2Fuploads%2Fgit-blob-0b9dbc2dccfd56fe4112adc0e0e4e37b31591fcd%2Fcodigo-writepin.png?alt=media)\n\n*Figura 8. Alternativa usando `HAL_GPIO_WritePin()` para controlar o LED.*\n\n***\n\n## Onde escrever esse código\n\nEsse trecho deve ser colocado dentro da região reservada ao usuário no `while (1)`, respeitando as marcações `USER CODE BEGIN` e `USER CODE END`.\n\n```c\n/* USER CODE BEGIN WHILE */\nwhile (1)\n{\n  HAL_GPIO_TogglePin(pinoLED_GPIO_Port, pinoLED_Pin);\n  HAL_Delay(500);\n  /* USER CODE END WHILE */\n\n  /* USER CODE BEGIN 3 */\n}\n```\n\n***\n\n## Código completo\n\nAbaixo está um exemplo completo do trecho principal do `while (1)` utilizando `HAL_GPIO_TogglePin()`:\n\n```c\n/* USER CODE BEGIN WHILE */\nwhile (1)\n{\n  HAL_GPIO_TogglePin(pinoLED_GPIO_Port, pinoLED_Pin);\n  HAL_Delay(500);\n\n  /* USER CODE END WHILE */\n\n  /* USER CODE BEGIN 3 */\n}\n```\n\nCaso prefira controlar manualmente os estados do LED, também é possível usar `HAL_GPIO_WritePin()`:\n\n```c\n/* USER CODE BEGIN WHILE */\nwhile (1)\n{\n  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_SET);\n  HAL_Delay(500);\n\n  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_RESET);\n  HAL_Delay(500);\n\n  /* USER CODE END WHILE */\n\n  /* USER CODE BEGIN 3 */\n}\n```\n\n***\n\n## Resultado esperado\n\nSe tudo estiver configurado corretamente, após compilar, gravar e executar o projeto, o LED conectado ao **PC13** deverá alternar seu estado continuamente.\n\nEsse é um dos testes mais importantes do início, porque confirma que:\n\n* o projeto foi criado corretamente;\n* o GPIO foi configurado como saída;\n* a geração de código funcionou;\n* a placa está executando o programa.\n\n*Figura 10. Resultado esperado após a gravação do programa na placa.*\n\n***\n\n## Primeira execução e configuração de debug\n\nNa primeira vez que o projeto for executado, a STM32CubeIDE pode abrir uma janela para criar uma configuração de debug. **Na versão 2.1.0 vai abrir uma janela com á seguir**\n\nNormalmente, basta:\n\n* Selecionar `STM32 Cortex-M C/C++ Application`\n* Confirmar o arquivo `.elf` do projeto\n* Escolher o programador conectado, como ST-Link\n* Clicar em `Debug` ou `Run`\n\nDepois da primeira configuração, a IDE costuma reutilizar essas opções automaticamente nas próximas execuções.\n\n***\n\n## Resumo\n\nNeste exemplo, o CubeMX é usado para configurar o **PC13 como saída digital** e gerar a estrutura inicial do projeto. Depois, na IDE, o arquivo `main.c` recebe o código da aplicação que faz o LED piscar com `HAL_GPIO_TogglePin()` ou `HAL_GPIO_WritePin()`. Esse fluxo aparece nos dois materiais usados como base para esta página.",
    "headings": [
      {
        "level": 2,
        "text": "Objetivo",
        "slug": "objetivo"
      },
      {
        "level": 2,
        "text": "Configuração no STM32CubeMX",
        "slug": "configurao-no-stm32cubemx"
      },
      {
        "level": 3,
        "text": "1. Criar o projeto",
        "slug": "1-criar-o-projeto"
      },
      {
        "level": 3,
        "text": "2. Configurar o sistema",
        "slug": "2-configurar-o-sistema"
      },
      {
        "level": 3,
        "text": "3. Configurar o clock",
        "slug": "3-configurar-o-clock"
      },
      {
        "level": 3,
        "text": "4. Configurar o pino PC13",
        "slug": "4-configurar-o-pino-pc13"
      },
      {
        "level": 3,
        "text": "5. Clock Configuration",
        "slug": "5-clock-configuration"
      },
      {
        "level": 3,
        "text": "6. Gerar o código",
        "slug": "6-gerar-o-cdigo"
      },
      {
        "level": 2,
        "text": "Código do blink",
        "slug": "cdigo-do-blink"
      },
      {
        "level": 2,
        "text": "O que esse código faz",
        "slug": "o-que-esse-cdigo-faz"
      },
      {
        "level": 2,
        "text": "Outra forma de fazer",
        "slug": "outra-forma-de-fazer"
      },
      {
        "level": 2,
        "text": "Onde escrever esse código",
        "slug": "onde-escrever-esse-cdigo"
      },
      {
        "level": 2,
        "text": "Código completo",
        "slug": "cdigo-completo"
      },
      {
        "level": 2,
        "text": "Resultado esperado",
        "slug": "resultado-esperado"
      },
      {
        "level": 2,
        "text": "Primeira execução e configuração de debug",
        "slug": "primeira-execuo-e-configurao-de-debug"
      },
      {
        "level": 2,
        "text": "Resumo",
        "slug": "resumo"
      }
    ],
    "index": 5
  },
  {
    "id": "solucao",
    "title": "Soluções",
    "section": "Solução de Problemas",
    "content": "# Soluções\n\nDurante a configuração do ambiente e os primeiros testes com a STM32F103C8T6, alguns problemas podem aparecer. Na maioria dos casos, isso não significa que a placa está com defeito ou que o projeto foi perdido.\n\nEsta seção reúne alguns dos erros mais comuns encontrados no início e apresenta soluções práticas para cada situação.",
    "headings": [],
    "index": 6
  },
  {
    "id": "erro-interface",
    "title": "Interface: Tela Branca ou Vazia",
    "section": "Solução de Problemas",
    "content": "# Interface: Tela Branca ou Vazia\n\n**Tela branca, cinza ou travamento ao selecionar o microcontrolador**\n\nEm alguns sistemas Linux, especialmente no Ubuntu com Wayland, a STM32CubeIDE pode apresentar falhas gráficas ao abrir a seleção de microcontroladores ou ao usar o configurador do CubeMX.\n\nOs sintomas mais comuns são:\n\n* tela branca ou cinza;\n* janela travada;\n* falha ao renderizar a interface gráfica.\n\n### Causa provável\n\nEsse comportamento costuma estar relacionado ao backend gráfico Wayland utilizado pelo sistema.\n\n***\n\n## Solução: Forçar Backend X11\n\n1. Execute a IDE forçando o uso do `X11` com o comando:\n\n```bash\nGDK_BACKEND=x11 stm32cubeide\n```\n\n2. Se a IDE não estiver no PATH, use o caminho completo do executável.\n3. Também pode ser interessante ajustar o atalho de inicialização para sempre abrir dessa forma.\n\n***\n\n## Ícones e interface muito pequenos (HiDPI e 4K)\n\nEm monitores com alta resolução, como telas 2K ou 4K, alguns elementos da STM32CubeIDE podem ficar muito pequenos, dificultando a leitura.\n\n***\n\n## Solução: Ajuste de escala no stm32cubeide.ini\n\nEdite o arquivo stm32cubeide.ini e ajuste a escala da interface. Você pode adicionar ou alterar um parâmetro como:\n\n```ini\n-Dswt.autoScale=200\n```\n\nO valor pode variar conforme a necessidade. Em alguns casos, `150` ou `175` já melhora bastante.",
    "headings": [
      {
        "level": 3,
        "text": "Causa provável",
        "slug": "causa-provavel"
      },
      {
        "level": 2,
        "text": "Solução: Forçar Backend X11",
        "slug": "solucao-forcar-backend-x11"
      },
      {
        "level": 2,
        "text": "Ícones e interface muito pequenos (HiDPI e 4K)",
        "slug": "icones-e-interface-muito-pequenos-hidpi-e-4k"
      },
      {
        "level": 2,
        "text": "Solução: Ajuste de escala no stm32cubeide.ini",
        "slug": "solucao-ajuste-de-escala-no-stm32cubeideini"
      }
    ],
    "index": 7
  },
  {
    "id": "permissoes-usb",
    "title": "Conexão: ST-Link e Permissões USB",
    "section": "Solução de Problemas",
    "content": "# Conexão: ST-Link e Permissões USB\n\n## Problemas de conexão e gravação\n\n**ST-Link não encontrado ou erro de permissão**\n\nUm dos erros mais comuns no Linux acontece quando a IDE ou o programador não conseguem acessar o ST-Link.\n\nMensagens típicas:\n\n* ST-Link not found\n* Permission denied\n* No debug probe detected\n\n***\n\n### Causa provável: Permissões USB\n\nFalta de permissão de acesso ao dispositivo USB.\n\n***\n\n### Solução: Instalar regras udev da ST\n\nInstale as regras udev da ST para permitir o acesso correto ao programador.\n\nDepois disso:\n\n* recarregue as regras do udev;\n* desconecte e conecte novamente o ST-Link;\n* reinicie a IDE.\n\nSe necessário, também reinicie o computador.\n\n***\n\n## “Target not found” mesmo com a placa conectada\n\nÀs vezes a IDE reconhece o gravador, mas não consegue se conectar ao microcontrolador.\n\n### Causas prováveis: Fiação e alimentação\n\n* mau contato nos fios;\n* alimentação incorreta;\n* placa presa em um estado de erro;\n* problema no reset durante a conexão.\n\n***\n\n### Solução: Verificação física e Connect under Reset\n\nVerifique primeiro:\n\n* alimentação da placa;\n* conexões SWD;\n* pino de reset;\n* cabo USB ou programador.\n\nSe o problema continuar, tente a opção Connect under Reset nas configurações de debug.\n\nOutra tentativa útil é:\n\n* pressionar e segurar o botão Reset da placa;\n* iniciar a gravação ou debug;\n* soltar o botão no momento da conexão.\n\n***\n\n## Placa aparentemente travada após gravar o código\n\nEsse problema pode acontecer quando os pinos de debug são reconfigurados como GPIO comuns no CubeMX. Nesse caso, a interface SWD deixa de funcionar e a gravação normal pode parar de responder.\n\n### Causa provável: Pinos de debug desabilitados\n\nOs pinos usados para debug foram desabilitados no projeto.\n\n***\n\n### Solução: Recuperação com STM32CubeProgrammer\n\nUse o STM32CubeProgrammer para tentar recuperar o microcontrolador.\n\nUma das abordagens mais comuns é:\n\n* conectar a placa por um modo alternativo;\n* acessar o chip;\n* executar um Full Chip Erase.\n\nDepois disso, gere novamente o projeto mantendo a configuração correta de debug.\n\n> Atenção: sempre que possível, mantenha a opção de debug corretamente configurada no CubeMX e Cubeidde para evitar esse tipo de bloqueio.",
    "headings": [
      {
        "level": 2,
        "text": "Problemas de conexão e gravação",
        "slug": "problemas-de-conexao-e-gravacao"
      },
      {
        "level": 3,
        "text": "Causa provável: Permissões USB",
        "slug": "causa-provavel-permissoes-usb"
      },
      {
        "level": 3,
        "text": "Solução: Instalar regras udev da ST",
        "slug": "solucao-instalar-regras-udev-da-st"
      },
      {
        "level": 2,
        "text": "“Target not found” mesmo com a placa conectada",
        "slug": "target-not-found-mesmo-com-a-placa-conectada"
      },
      {
        "level": 3,
        "text": "Causas prováveis: Fiação e alimentação",
        "slug": "causas-provaveis-fiacao-e-alimentacao"
      },
      {
        "level": 3,
        "text": "Solução: Verificação física e Connect under Reset",
        "slug": "solucao-verificacao-fisica-e-connect-under-reset"
      },
      {
        "level": 2,
        "text": "Placa aparentemente travada após gravar o código",
        "slug": "placa-aparentemente-travada-apos-gravar-o-codigo"
      },
      {
        "level": 3,
        "text": "Causa provável: Pinos de debug desabilitados",
        "slug": "causa-provavel-pinos-de-debug-desabilitados"
      },
      {
        "level": 3,
        "text": "Solução: Recuperação com STM32CubeProgrammer",
        "slug": "solucao-recuperacao-com-stm32cubeprogrammer"
      }
    ],
    "index": 8
  },
  {
    "id": "bug-assembly",
    "title": "IDE: Bug do Arquivo Assembly (.s)",
    "section": "Solução de Problemas",
    "content": "# IDE: Bug do Arquivo Assembly (.s)\n\n**A IDE abre um arquivo Assembly após gravar o programa**\n\nEm algumas versões da STM32CubeIDE, especialmente da linha 2.1.x, ao iniciar o debug a IDE pode abrir automaticamente um arquivo como startup\\_stm32xxxx.s.\n\nIsso pode dar a impressão de que algo deu errado.\n\n***\n\n## O que isso significa\n\nNa prática, muitas vezes esse comportamento é apenas visual. O programa pode ter sido gravado normalmente e estar executando na placa.\n\n***\n\n## O que fazer\n\nAntes de assumir que houve erro:\n\n* verifique se o código realmente foi gravado;\n* observe o comportamento da placa;\n* confira se o LED está piscando ou se o programa esperado está rodando.\n\nSe tudo estiver funcionando, esse comportamento pode ser ignorado.\n\n***\n\n## Arquivo .ioc abrindo como XML\n\nO arquivo .ioc é o arquivo de configuração gráfica do projeto STM32. Em alguns casos, a IDE pode abrir esse arquivo como texto ou XML, em vez de mostrar a interface visual do CubeMX.\n\n***\n\n## Solução: Restaurar abertura com Device Configuration Tool\n\nClique com o botão direito sobre o arquivo .ioc e escolha:\n\n```\nOpen With -> Device Configuration Tool\n```\n\nIsso normalmente restaura a abertura correta do configurador gráfico.",
    "headings": [
      {
        "level": 2,
        "text": "O que isso significa",
        "slug": "o-que-isso-significa"
      },
      {
        "level": 2,
        "text": "O que fazer",
        "slug": "o-que-fazer"
      },
      {
        "level": 2,
        "text": "Arquivo .ioc abrindo como XML",
        "slug": "arquivo-ioc-abrindo-como-xml"
      },
      {
        "level": 2,
        "text": "Solução: Restaurar abertura com Device Configuration Tool",
        "slug": "solucao-restaurar-abertura-com-device-configuration-tool"
      }
    ],
    "index": 9
  },
  {
    "id": "abrir-ioc",
    "title": "Arquivos: O arquivo .ioc não abre o gráfico",
    "section": "Solução de Problemas",
    "content": "# Arquivos: O arquivo .ioc não abre o gráfico\n\n**Erro ao baixar o Firmware Package da família F1**\n\nAo criar um projeto da STM32F103C8T6, a IDE pode tentar baixar automaticamente o pacote de firmware da família STM32F1. Em alguns ambientes, como redes de universidade ou laboratório, esse download pode falhar.\n\n***\n\n## Possíveis causas\n\n* bloqueio por firewall;\n* instabilidade de rede;\n* restrição de acesso ao servidor.\n\n***\n\n## Solução: Importação manual do firmware package\n\nFaça o download manual do pacote de firmware e depois importe localmente na IDE ou no CubeMX.\n\nO processo geral é:\n\n* baixar o pacote da família STM32F1 em formato .zip;\n* abrir o gerenciador de pacotes embarcados;\n* escolher a opção de instalação local;\n* importar o arquivo baixado.\n\nNa ferramenta, esse caminho costuma aparecer em:\n\n```\nHelp -> Manage Embedded Software Packages -> From Local\n```\n\n***\n\n## Dicas finais de verificação\n\nSe algum erro aparecer durante os primeiros testes, tente seguir esta ordem de verificação:\n\n* confira cabos e alimentação;\n* veja se a placa está sendo reconhecida;\n* revise as configurações de debug;\n* confirme se o projeto foi gerado corretamente;\n* teste a gravação novamente;\n* reinicie a IDE, o programador ou o sistema, se necessário.\n\nMuitos problemas iniciais são de configuração e têm solução simples. O mais importante é verificar cada etapa com calma.",
    "headings": [
      {
        "level": 2,
        "text": "Possíveis causas",
        "slug": "possiveis-causas"
      },
      {
        "level": 2,
        "text": "Solução: Importação manual do firmware package",
        "slug": "solucao-importacao-manual-do-firmware-package"
      },
      {
        "level": 2,
        "text": "Dicas finais de verificação",
        "slug": "dicas-finais-de-verificacao"
      }
    ],
    "index": 10
  },
  {
    "id": "refe",
    "title": "Referências",
    "section": "Referências e Extras",
    "content": "# Referências\n\nEste guia foi construído com base na documentação oficial da STM32, em tutoriais da comunidade e em materiais complementares voltados para iniciantes no desenvolvimento com microcontroladores.\n\nAlgumas referências úteis incluem:\n\n* [Repositório do Guia e Materiais no GitHub (@AlicyRibeiro)](https://github.com/AlicyRibeiro/Guia-Instalacao-stm32)\n* [Perfil da Autora no GitHub (@AlicyRibeiro)](https://github.com/AlicyRibeiro)\n* [Documentação oficial da STMicroelectronics](https://github.com/AlicyRibeiro/Guia-Instalacao-stm32/tree/main/Material%20sobre%20o%20STM32f103c8-20260401)\n* [Tutoriais da Eletrogate](https://blog.eletrogate.com/bluepill-com-stm32cubeide/)\n* [Materiais do site DeepBlueEmbedded](https://deepbluembedded.com/stm32-gpio-write-pin-digital-output-lab/)\n* [Fóruns e discussões da comunidade STM32](https://www.linkedin.com/pulse/how-download-install-stm32cubeide-ubuntu-jos%C3%A9-manuel-barajas-ram%C3%ADrez-t2rwc/)\n* [Vídeo Auxiliar de Instalação](https://www.youtube.com/watch?v=6zpMXbjjNs8)",
    "headings": [
      {
        "level": 2,
        "text": "Materiais Recomendados",
        "slug": "materiais-recomendados"
      }
    ],
    "index": 11
  },
  {
    "id": "duvidas",
    "title": "Envie sua Dúvida",
    "section": "Dúvidas",
    "content": "# Envie sua Dúvida\n\nTem dúvidas sobre a instalação do STM32CubeIDE no Ubuntu, conexões com o gravador ST-Link V2 ou execução do primeiro código na Blue Pill? Disponibilizamos este canal direto para envio de dúvidas por e-mail.\n\n***\n\n## Formulário de Envio\n\nUtilize o assistente interativo desta página para montar a mensagem com todas as informações necessárias (nome, categoria, versão do sistema operacional Ubuntu, placa e descrição detalhada do erro). Você pode abrir diretamente no Gmail Web, no seu cliente de e-mail padrão ou copiar o texto formatado.\n\n***\n\n## O que incluir no e-mail\n\nPara que possamos identificar o problema com precisão, tente anexar ou descrever os seguintes pontos:\n\n1. **Mensagens de Erro e Saída de Terminal:** Copie e cole a mensagem exata do erro que aparece no Console da IDE ou a saída dos comandos `lsusb` e `dmesg | tail -n 20`.\n2. **Foto das Conexões Físicas:** Se o erro for de comunicação com a placa, envie uma foto nítida mostrando os 4 cabos do ST-Link (SWDIO, SWCLK, GND, 3.3V) e a posição dos jumpers amarelos BOOT0 e BOOT1.\n3. **Ambiente de Execução:** Informe se está usando Ubuntu nativo ou em máquina virtual (VirtualBox / WSL2).\n4. **Trecho de Código:** Caso a dúvida seja sobre código, anexe a função `main()` e o laço `while(1)` do `main.c`.\n\n***\n\n## Dúvidas Frequentes Rápidas\n\n### ST-Link aparece no lsusb mas a IDE diz 'No target connected'?\nQuase sempre é falta de permissões udev ou conexões SWD invertidas. Verifique `/etc/udev/rules.d/49-stlinkv2.rules` e segure o botão RESET ao clicar em Debug.\n\n### Posição dos Jumpers BOOT0 e BOOT1\nPara gravação e execução padrão via ST-Link (SWD), ambos os jumpers amarelos devem permanecer na posição 0.\n\n### Código sumiu após mexer no CubeMX\nEscreva sempre estritamente dentro dos blocos comentados `/* USER CODE BEGIN ... */` e `/* USER CODE END ... */`.\n\n### LED onboard (PC13) funciona invertido\nO LED da Blue Pill é Active-Low: nível lógico 0 acende e 1 apaga.",
    "headings": [
      {
        "level": 2,
        "text": "Formulário de Envio",
        "slug": "formulario-de-envio"
      },
      {
        "level": 2,
        "text": "O que incluir no e-mail",
        "slug": "o-que-incluir-no-e-mail"
      },
      {
        "level": 2,
        "text": "Dúvidas Frequentes Rápidas",
        "slug": "duvidas-frequentes-rapidas"
      }
    ],
    "index": 12
  },
  {
    "id": "glossario",
    "title": "Glossário de Termos & Como Funciona a Página",
    "section": "Glossário",
    "content": "# Glossário de Termos & Como Funciona a Página\n\nConsulte definições técnicas, registradores e conceitos essenciais de hardware encontrados nos manuais de referência STM32 (RM0008, datasheets e manuais de programação ARM Cortex-M), ou veja a aba 'Como Esta Página Funciona' para explorar todos os recursos e atalhos da plataforma.\n\n***\n\n## Como Esta Página Funciona (Guia da Plataforma)\n\nEntenda os 5 pilares do guia: navegação por módulos didáticos, diagrama elétrico interativo do ST-Link V2, busca global instantânea com Ctrl+K, modo foco e atalhos de teclado.\n\n***\n\n## Periféricos e E/S (GPIO, AFIO, EXTI)\n\nDefinições completas de portas de entrada e saída digitais, modos Push-Pull, Open-Drain, resistores de pull-up/pull-down e interrupções externas.\n\n***\n\n## Comunicação Serial (USART, SPI, I2C)\n\nProtocolos seriais síncronos e assíncronos, taxas de baud rate, barramentos mestres e escravos, e configurações de pinos.\n\n***\n\n## Temporização e Sinais (PWM, Timers, SysTick)\n\nFuncionamento dos timers de hardware, registradores PSC, ARR e CCR, modulação de largura de pulso (PWM), Duty Cycle e base de tempo do SysTick.\n\n***\n\n## Analógico e Conversores (ADC, SAR)\n\nConversão analógica para digital de 12 bits, calibração de offset, amostragem e limites de tensão segura de 3.3V.\n\n***\n\n## Sistema, Clock e Memória (RCC, PLL, DMA, Flash, SRAM)\n\nDistribuição de árvores de clock, multiplicador PLL para 72 MHz, acesso direto à memória (DMA) e organização de memórias Flash e SRAM.\n\n***\n\n## Interrupções e Segurança (NVIC, ISR, Watchdog)\n\nControlador NVIC de prioridades, rotinas de tratamento de interrupção (ISR) e cães de guarda (IWDG e WWDG).\n\n***\n\n## Gravação, Debug e Boot (SWD, JTAG, BOOT0/BOOT1)\n\nProtocolo de depuração serial SWD de 2 fios, pinos de seleção de boot da Blue Pill e conexão com o ST-Link V2.",
    "headings": [
      {
        "level": 2,
        "text": "Como Esta Página Funciona (Guia da Plataforma)",
        "slug": "como-esta-pagina-funciona"
      },
      {
        "level": 2,
        "text": "Periféricos e E/S (GPIO, AFIO, EXTI)",
        "slug": "perifericos-e-es-gpio-afio-exti"
      },
      {
        "level": 2,
        "text": "Comunicação Serial (USART, SPI, I2C)",
        "slug": "comunicacao-serial-usart-spi-i2c"
      },
      {
        "level": 2,
        "text": "Temporização e Sinais (PWM, Timers, SysTick)",
        "slug": "temporizacao-e-sinais-pwm-timers-systick"
      },
      {
        "level": 2,
        "text": "Analógico e Conversores (ADC, SAR)",
        "slug": "analogico-e-conversores-adc-sar"
      },
      {
        "level": 2,
        "text": "Sistema, Clock e Memória (RCC, PLL, DMA, Flash, SRAM)",
        "slug": "sistema-clock-e-memoria-rcc-pll-dma-flash-sram"
      },
      {
        "level": 2,
        "text": "Interrupções e Segurança (NVIC, ISR, Watchdog)",
        "slug": "interrupcoes-e-seguranca-nvic-isr-watchdog"
      },
      {
        "level": 2,
        "text": "Gravação, Debug e Boot (SWD, JTAG, BOOT0/BOOT1)",
        "slug": "gravacao-debug-e-boot-swd-jtag-boot0-boot1"
      }
    ],
    "index": 13
  }
];

export const DOC_SECTIONS: DocSection[] = [
  {
    name: "Início",
    articles: DOCS.filter(d => d.section === "Início")
  },
  {
    name: "Glossário",
    articles: DOCS.filter(d => d.section === "Glossário")
  },
  {
    name: "Instalação",
    articles: DOCS.filter(d => d.section === "Instalação")
  },
  {
    name: "Mão na Massa",
    articles: DOCS.filter(d => d.section === "Mão na Massa")
  },
  {
    name: "Solução de Problemas",
    articles: DOCS.filter(d => d.section === "Solução de Problemas")
  },
  {
    name: "Referências e Extras",
    articles: DOCS.filter(d => d.section === "Referências e Extras")
  },
  {
    name: "Dúvidas",
    articles: DOCS.filter(d => d.section === "Dúvidas")
  }
];
