# Regras de Ouro: Onde escrever seu código

Se existe uma página que merece atenção especial, é esta.

Nos projetos STM32, o código escrito por você e o código gerado automaticamente pelo STM32CubeMX ficam no mesmo projeto e, muitas vezes, no mesmo arquivo. Porém, cada um possui seu espaço específico.

Quando o CubeMX gera ou atualiza um projeto, ele recria automaticamente partes do código relacionadas à configuração dos periféricos, inicialização do hardware e estrutura básica do programa.

Por isso, é muito importante saber exatamente onde escrever seu código.

---

## Regiões reservadas para o usuário

Os arquivos gerados pelo CubeMX possuem áreas especiais marcadas com comentários como:

```c
/* USER CODE BEGIN */

/* USER CODE END */
```

Essas regiões existem justamente para que você possa adicionar seu código sem correr o risco de perdê-lo quando o projeto for regenerado.


Exemplo:

```c
/* USER CODE BEGIN 2 */
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
/* USER CODE END 2 */
```

Sempre que precisar adicionar variáveis, funções, inicializações ou lógica da aplicação, utilize essas áreas.

![Regiões USER CODE dentro do arquivo main.c](../imagens/user-code-regions.png)

*Figura 1. Exemplo de várias regiões `USER CODE BEGIN` e `USER CODE END` dentro do arquivo `main.c`.*


---

## Locais mais comuns para escrever código

Algumas regiões aparecem com mais frequência no arquivo `main.c`:

* `USER CODE BEGIN Includes` → inclusão de bibliotecas extras
* `USER CODE BEGIN PV` → variáveis globais
* `USER CODE BEGIN 0` → funções auxiliares
* `USER CODE BEGIN 2` → configurações logo após a inicialização
* `USER CODE BEGIN WHILE` → código que será executado repetidamente
* `USER CODE BEGIN 3` → final do loop principal


---

## Exemplo prático

```c
while (1)
{
  /* USER CODE BEGIN WHILE */
  HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
  HAL_Delay(500);
  /* USER CODE END WHILE */

  /* USER CODE BEGIN 3 */
  /* USER CODE END 3 */
}
```

Nesse exemplo, o LED conectado ao PC13 muda de estado a cada 500 ms.

---

## O que pode acontecer se você escrever fora dessas regiões

Se você escrever código fora das áreas `USER CODE`, o CubeMX pode apagar esse trecho quando gerar novamente o projeto.

Isso acontece porque o software entende que todo o restante do arquivo pertence à estrutura automática do projeto.

Por exemplo, se você adicionar uma função manualmente entre duas partes geradas pelo CubeMX, ela pode desaparecer na próxima atualização.


---

## Boa prática

Antes de escrever qualquer código em um projeto STM32, procure primeiro uma região `USER CODE BEGIN` apropriada.

Essa é uma das práticas mais importantes no início, porque evita perder trabalho e facilita bastante a organização do projeto.

---

> ⚠️ Nunca escreva código fora das regiões `USER CODE BEGIN` e `USER CODE END`, pois ele pode ser perdido ao regenerar o projeto.

