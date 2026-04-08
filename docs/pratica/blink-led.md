# Blink LED (PC13)

Depois de configurar o ambiente e entender o papel do STM32CubeMX e da STM32CubeIDE, um dos primeiros testes mais importantes é fazer o LED piscar.

Esse exemplo é útil porque permite verificar se o projeto foi criado corretamente, se o pino foi configurado como saída digital e se o código está sendo gravado e executado na placa como esperado. O tutorial da Eletrogate usa esse fluxo com a Blue Pill, configurando o **PC13** como saída e inserindo o código do blink dentro do `while (1)`. ([Blog Eletrogate][1])

---

## Objetivo

Neste exemplo, o pino **PC13** será configurado como saída digital para controlar o LED da placa.

Ao final, o programa fará o LED alternar entre ligado e desligado em um intervalo fixo.

![Tela inicial do projeto na STM32CubeIDE](../imagens/tela-inicial-projeto.png)

*Figura 1. Tela inicial da STM32CubeIDE para criação de um novo projeto.*


---

## Configuração no STM32CubeMX

Antes de escrever o código, é necessário configurar o projeto.

---

### 1. Criar o projeto

Abra a STM32CubeIDE e inicie um novo projeto STM32. Em seguida, selecione o microcontrolador da placa e avance para a tela de configuração. No material da Eletrogate, o projeto foi iniciado buscando o alvo **STM32F103C6T6A** no seletor da IDE. ([Blog Eletrogate][1])

![Seleção do microcontrolador no início do projeto](../imagensselecao-microcontrolador.png)

*Figura 2. Seleção do microcontrolador ou da placa no assistente de criação do projeto.*

---
### 2. Configurar o sistema

Na seção **SYS**, defina:

* **Debug** como `Serial Wire`
* **Timebase Source** como `SysTick`

Essas opções aparecem no passo a passo mostrado pela Eletrogate para a configuração inicial do projeto. ([Blog Eletrogate][1])

![Configuração da seção SYS](../imagens/config-sys.png)

*Figura 3. Configuração da seção SYS com Serial Wire e SysTick.*

---

### 3. Configurar o clock

Na seção **RCC**, selecione:

* **High Speed Clock (HSE)** como `Crystal/Ceramic Resonator`

Depois, na aba **Clock Configuration**, ajuste a fonte do PLL e o clock do sistema. No exemplo da Eletrogate, o fluxo usa **HSE** como fonte do PLL e **PLLCLK** como clock do sistema. ([Blog Eletrogate][1])

![Configuração do clock no CubeMX](../imagens/config-clock.png)

*Figura 4. Ajuste do clock do sistema na aba Clock Configuration.*

---

### 4. Configurar o pino PC13

No campo **Pinout View**, clique no pino **PC13** e selecione a função **GPIO_Output**. O tutorial da Eletrogate usa exatamente esse pino para o exemplo do LED e também sugere atribuir um rótulo ao pino para facilitar a leitura do código gerado. ([Blog Eletrogate][1])

![Configuração do PC13 como GPIO\_Output](../imagens/config-pc13.png)

*Figura 5. Configuração do pino PC13 como saída digital.*

---

### 5. Gerar o código

Depois de concluir as configurações, salve o projeto para gerar automaticamente os arquivos. A Eletrogate mostra que, ao salvar, a IDE pergunta se o código deve ser criado, e o CubeMX gera toda a estrutura inicial necessária para o projeto. ([Blog Eletrogate][1])

![Janela de geração de código](../imagens/geracao-codigo.png)

*Figura 6. Janela de geração automática do código do projeto.*

---

## Código do blink

Depois da geração do projeto, a estrutura básica do `main.c` já estará pronta. O material do DeepBlueEmbedded destaca que o projeto inicial chama funções como `HAL_Init()`, `SystemClock_Config()` e `MX_GPIO_Init()` antes de entrar no laço principal, deixando o `while (1)` como local natural para a lógica da aplicação. ([DeepBlue][2])

No exemplo da Eletrogate, o blink é implementado com `HAL_GPIO_TogglePin()` e `HAL_Delay(500)`. ([Blog Eletrogate][1])

```c
while (1)
{
  HAL_GPIO_TogglePin(pinoLED_GPIO_Port, pinoLED_Pin);
  HAL_Delay(500);
}
```

![Trecho do main.c com o código do blink](../imagens/codigo-blink-main.png)

*Figura 7. Código do blink inserido no `while (1)` do arquivo `main.c`.*

---

## O que esse código faz

A função `HAL_GPIO_TogglePin()` alterna o estado lógico do pino configurado como saída. Já a função `HAL_Delay()` cria uma espera em milissegundos. O DeepBlueEmbedded usa exatamente essa ideia para demonstrar o controle de uma saída digital com a HAL. ([DeepBlue][2])

Nesse caso:

* `HAL_GPIO_TogglePin(...)` muda o estado atual do LED
* `HAL_Delay(500)` espera 500 ms
* o processo se repete continuamente dentro do `while (1)`

Assim, o LED pisca em intervalos regulares.

---

## Outra forma de fazer

Além de `HAL_GPIO_TogglePin()`, o DeepBlueEmbedded também mostra que o mesmo efeito pode ser obtido com `HAL_GPIO_WritePin()`, ligando e desligando o pino manualmente. ([DeepBlue][2])

```c
while (1)
{
  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_SET);
  HAL_Delay(500);

  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_RESET);
  HAL_Delay(500);
}
```

As duas abordagens servem para o mesmo objetivo. Para um primeiro teste, a versão com `HAL_GPIO_TogglePin()` costuma ser mais simples.

![Exemplo alternativo com HAL\_GPIO\_WritePin](../imagens/codigo-writepin.png)

*Figura 8. Alternativa usando `HAL_GPIO_WritePin()` para controlar o LED.*

---

## Onde escrever esse código

Esse trecho deve ser colocado dentro da região reservada ao usuário no `while (1)`, respeitando as marcações `USER CODE BEGIN` e `USER CODE END`. A própria Eletrogate mostra o código do blink inserido dentro da área da aplicação no `main.c`. ([Blog Eletrogate][1])

```c
/* USER CODE BEGIN WHILE */
while (1)
{
  HAL_GPIO_TogglePin(pinoLED_GPIO_Port, pinoLED_Pin);
  HAL_Delay(500);
  /* USER CODE END WHILE */

  /* USER CODE BEGIN 3 */
}
```

![Região USER CODE dentro do while](../imagens/user-code-while.png)

*Figura 9. Região correta para inserir a lógica do blink no `main.c`.*

---

## Código completo

Abaixo está um exemplo completo do trecho principal do `while (1)` utilizando `HAL_GPIO_TogglePin()`:

```c
/* USER CODE BEGIN WHILE */
while (1)
{
  HAL_GPIO_TogglePin(pinoLED_GPIO_Port, pinoLED_Pin);
  HAL_Delay(500);

  /* USER CODE END WHILE */

  /* USER CODE BEGIN 3 */
}
```

Caso prefira controlar manualmente os estados do LED, também é possível usar `HAL_GPIO_WritePin()`:

```c
/* USER CODE BEGIN WHILE */
while (1)
{
  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_SET);
  HAL_Delay(500);

  HAL_GPIO_WritePin(pinoLED_GPIO_Port, pinoLED_Pin, GPIO_PIN_RESET);
  HAL_Delay(500);

  /* USER CODE END WHILE */

  /* USER CODE BEGIN 3 */
}
```

---

## Resultado esperado

Se tudo estiver configurado corretamente, após compilar, gravar e executar o projeto, o LED conectado ao **PC13** deverá alternar seu estado continuamente.

Esse é um dos testes mais importantes do início, porque confirma que:

* o projeto foi criado corretamente;
* o GPIO foi configurado como saída;
* a geração de código funcionou;
* a placa está executando o programa.

![Resultado esperado do blink na placa](../imagens/resultado-blink.png)

*Figura 10. Resultado esperado após a gravação do programa na placa.*

---

## Primeira execução e configuração de debug

Na primeira vez que o projeto for executado, a STM32CubeIDE pode abrir uma janela para criar uma configuração de debug.

Normalmente, basta:

* Selecionar `STM32 Cortex-M C/C++ Application`
* Confirmar o arquivo `.elf` do projeto
* Escolher o programador conectado, como ST-Link
* Clicar em `Debug` ou `Run`

Depois da primeira configuração, a IDE costuma reutilizar essas opções automaticamente nas próximas execuções.

![Janela de configuração de debug da STM32CubeIDE](../imagens/config-debug.png)

*Figura 10. Janela de configuração de debug exibida na primeira execução do projeto.*

---

## Resumo

Neste exemplo, o CubeMX é usado para configurar o **PC13 como saída digital** e gerar a estrutura inicial do projeto. Depois, na IDE, o arquivo `main.c` recebe o código da aplicação que faz o LED piscar com `HAL_GPIO_TogglePin()` ou `HAL_GPIO_WritePin()`. Esse fluxo aparece nos dois materiais usados como base para esta página. 
