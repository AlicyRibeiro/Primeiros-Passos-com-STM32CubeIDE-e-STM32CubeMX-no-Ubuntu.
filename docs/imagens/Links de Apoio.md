# 🔗 Links de Apoio

- [Guia Original (LinkedIn)](https://www.linkedin.com/pulse/how-download-install-stm32cubeide-ubuntu-jos%C3%A9-manuel-barajas-ram%C3%ADrez-t2rwc/)

- [Tutorial BluePill (Eletrogate)](https://blog.eletrogate.com/bluepill-com-stm32cubeide/)

- [Vídeo Auxiliar de Instalação]()


🚀 Dicas de Bancada (Baseadas na Versão 2.1.0)

Aqui estão dois detalhes que costumam assustar quem está começando a disciplina de Microcontroladores:
1. O Bug do Arquivo .s (Assembly)

Ao gravar o código na sua placa (Flash), a IDE pode abrir subitamente um arquivo chamado startup_stm32f103c8tx.s.

    Não entre em pânico: Isso é um bug visual conhecido da versão 2.1.0. O seu código foi gravado com sucesso. Basta fechar a aba do arquivo assembly e continuar o seu trabalho.

2. Gerenciamento de Memória

Rodar a IDE e o CubeMX ao mesmo tempo consome bastante memória RAM.

    Sugestão: Se o seu computador estiver lento, após clicar em Generate Code no CubeMX e abrir o projeto na IDE, você pode fechar o CubeMX para liberar recursos para a compilação.

3. Sincronização do .ioc

Nas novas versões, ao clicar duas vezes no arquivo .ioc dentro da IDE, ele deve abrir o configurador normalmente. Se isso abrir um editor de texto (XML), significa que a associação de arquivos do seu Ubuntu falhou. Use sempre o botão direito -> Open with STM32CubeMX.


🛠️ Solução de Problemas (Linux & IDE 2.1.0)

Esta página reúne os erros mais comuns relatados por estudantes e pela comunidade técnica ao utilizar o STM32CubeIDE no Ubuntu.
1. O Bug do Arquivo .s (Assembly) ao Gravar

Sintoma: Logo após você clicar no ícone de "Run" ou "Debug", a IDE abre automaticamente um arquivo de texto estranho chamado startup_stm32xxxx.s ou um arquivo de vetores em C.

    O que está acontecendo: Este é um bug visual conhecido da versão 2.1.0. A IDE "se perde" ao tentar mostrar onde o código começou a rodar.

    Solução: Não entre em pânico. O seu código foi gravado com sucesso na Blue Pill. Basta fechar a aba desse arquivo e seguir com o seu código no main.c.

    Dica: Se isso te incomodar muito, verifique se o projeto foi buildado sem erros antes de tentar gravar de novo.

2. Lentidão e Consumo de Memória (RAM)

Sintoma: O computador trava ou fica extremamente lento ao usar o CubeMX e a IDE ao mesmo tempo.

    Causa: Nas versões novas (2.x.x), o CubeMX e a IDE rodam como processos separados, o que exige o dobro de memória RAM do que as versões antigas.

    Solução: 1. Configure seu hardware no CubeMX Standalone.
    2. Clique em Generate Code.
    3. Assim que o projeto abrir na IDE, feche o CubeMX. Você só precisará dele novamente se quiser mudar algum pino.

3. Arquivo .ioc abrindo como Texto (XML)

Sintoma: Ao clicar duas vezes no arquivo .ioc dentro da IDE, ele abre um monte de códigos em vez de abrir a interface gráfica do chip.

    Solução: 1. Clique com o botão direito no arquivo .ioc.
    2. Vá em Open With (Abrir com).
    3. Selecione STM32CubeConfigurator ou Device Configuration Tool.
    4. Geralmente, após fazer isso uma vez, a IDE "aprende" e volta ao normal.

4. Seletor de Chips Vazio (O Erro do Wayland)

Sintoma: Ao tentar criar um projeto novo ou trocar de chip, a janela de seleção aparece totalmente branca ou cinza, sem mostrar nenhum modelo.

    Causa: Incompatibilidade do motor gráfico da IDE com o gerenciador de janelas moderno do Ubuntu (Wayland).

    Solução Definitiva: Você deve iniciar a IDE forçando o uso do servidor X11. Use o comando no terminal:
    Bash

    GDK_BACKEND=x11 stm32cubeide

    Dica: Siga o nosso guia na seção Atalho no Terminal para automatizar essa correção!
