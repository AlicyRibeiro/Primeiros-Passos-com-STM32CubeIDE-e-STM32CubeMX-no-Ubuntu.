# Problemas de interface e exibição

**Tela branca, cinza ou travamento ao selecionar o microcontrolador**

Em alguns sistemas Linux, especialmente no Ubuntu com Wayland, a STM32CubeIDE pode apresentar falhas gráficas ao abrir a seleção de microcontroladores ou ao usar o configurador do CubeMX.

Os sintomas mais comuns são:

- tela branca ou cinza;
- janela travada;
- falha ao renderizar a interface gráfica.
- Possível causa

Esse comportamento costuma estar relacionado ao backend gráfico utilizado pelo sistema.

---

## Solução

1. Execute a IDE forçando o uso do `X11` com o comando:

```
GDK_BACKEND=x11 stm32cubeide
```

2. Se a IDE não estiver no PATH, use o caminho completo do executável.
3. Também pode ser interessante ajustar o atalho de inicialização para sempre abrir dessa forma.
4. Ícones e interface muito pequenos
5. Em monitores com alta resolução, como telas 2K ou 4K, alguns elementos da STM32CubeIDE podem ficar muito pequenos, dificultando a leitura.

---

## Solução

Edite o arquivo stm32cubeide.ini e ajuste a escala da interface. Você pode adicionar ou alterar um parâmetro como:

```
-Dswt.autoScale=200
```

O valor pode variar conforme a necessidade. Em alguns casos, `150` ou `175`já melhora bastante.
