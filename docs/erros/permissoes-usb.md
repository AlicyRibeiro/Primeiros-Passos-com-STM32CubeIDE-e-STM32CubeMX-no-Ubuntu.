# Problemas de conexão e gravação

**ST-Link não encontrado ou erro de permissão**

Um dos erros mais comuns no Linux acontece quando a IDE ou o programador não conseguem acessar o ST-Link.

Mensagens típicas:

- ST-Link not found
- Permission denied
- No debug probe detected

---

## Possível causa

Falta de permissão de acesso ao dispositivo USB.

---

# Solução

Instale as regras udev da ST para permitir o acesso correto ao programador.

Depois disso:

- recarregue as regras do udev;
- desconecte e conecte novamente o ST-Link;
- reinicie a IDE.

Se necessário, também reinicie o computador.

---

# “Target not found” mesmo com a placa conectada

Às vezes a IDE reconhece o gravador, mas não consegue se conectar ao microcontrolador.


## Possíveis causas

- mau contato nos fios;
- alimentação incorreta;
- placa presa em um estado de erro;
- problema no reset durante a conexão.

---

# Solução

Verifique primeiro:

- alimentação da placa;
- conexões SWD;
- pino de reset;
- cabo USB ou programador.

Se o problema continuar, tente a opção Connect under Reset nas configurações de debug.

Outra tentativa útil é:

- pressionar e segurar o botão Reset da placa;
- iniciar a gravação ou debug;
- soltar o botão no momento da conexão.

---

## Placa aparentemente travada após gravar o código

Esse problema pode acontecer quando os pinos de debug são reconfigurados como GPIO comuns no CubeMX. Nesse caso, a interface SWD deixa de funcionar e a gravação normal pode parar de responder.

## Possível causa

Os pinos usados para debug foram desabilitados no projeto.

---

## Solução

Use o STM32CubeProgrammer para tentar recuperar o microcontrolador.

Uma das abordagens mais comuns é:

- conectar a placa por um modo alternativo;
- acessar o chip;
- executar um Full Chip Erase.

Depois disso, gere novamente o projeto mantendo a configuração correta de debug.

> Atenção: sempre que possível, mantenha a opção de debug corretamente configurada no CubeMX e Cubeidde para evitar esse tipo de bloqueio.
