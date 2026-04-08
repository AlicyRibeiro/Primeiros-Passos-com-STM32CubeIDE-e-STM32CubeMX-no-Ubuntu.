# Problemas ao baixar pacotes e bibliotecas

**Erro ao baixar o Firmware Package da família F1**

Ao criar um projeto da STM32F103C8T6, a IDE pode tentar baixar automaticamente o pacote de firmware da família STM32F1. Em alguns ambientes, como redes de universidade ou laboratório, esse download pode falhar.

---

## Possíveis causas:

- bloqueio por firewall;
- instabilidade de rede;
- restrição de acesso ao servidor.

---

## Solução

Faça o download manual do pacote de firmware e depois importe localmente na IDE ou no CubeMX.

O processo geral é:

- baixar o pacote da família STM32F1 em formato .zip;
- abrir o gerenciador de pacotes embarcados;
- escolher a opção de instalação local;
- importar o arquivo baixado.

Na ferramenta, esse caminho costuma aparecer em:

```
Help -> Manage Embedded Software Packages -> From Local
Dicas finais
```

Se algum erro aparecer durante os primeiros testes, tente seguir esta ordem de verificação:

- confira cabos e alimentação;
- veja se a placa está sendo reconhecida;
- revise as configurações de debug;
- confirme se o projeto foi gerado corretamente;
- teste a gravação novamente;
- reinicie a IDE, o programador ou o sistema, se necessário.

Muitos problemas iniciais são de configuração e têm solução simples. O mais importante é verificar cada etapa com calma.
