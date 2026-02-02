# CONTEXTO DE DESENVOLVIMENTO: GERADOR DE CARDS KARCASH

## 🎯 Objetivo
Criar um MVP de um **Gerador de Cards Automático** para eliminar o trabalho manual de design. O sistema deve permitir que o usuário (Gustavo) gere artes profissionais em segundos, apenas inserindo dados e fotos.

## 📂 Referências Visuais
**IMPORTANTE:** As referências de design, cores e posicionamento estão localizadas na pasta:  
`docs/layouts/`  
(Analise os arquivos PNG nesta pasta para extrair a identidade visual e o grid de posicionamento).

## 🛠️ Stack Técnica
- **Framework:** React + TypeScript (Vite).
- **Estilo:** Tailwind CSS.
- **Lib de Exportação:** `html-to-image` ou `modern-screenshot`.
- **Qualidade de Saída:** Pixel Ratio 3 (High Definition).

## 📋 Requisitos do Sistema

### 1. Painel de Controle (Inputs)
- **Upload:** Campo para subir a foto do carro.
- **Textos:** Campos para Marca, Modelo, Ano, Preço Fipe e Preço KarCash.
- **Lógica Automática:** O sistema deve calcular o "Desconto Fipe" (Fipe - Preço KarCash) automaticamente.
- **Ajuste de Imagem:** Slider de Zoom (0.5x a 2.0x) para posicionar o carro perfeitamente no card.

### 2. O Card (Renderização)
- **Base:** Usar o arquivo de fundo da pasta `docs/layouts/` como background absoluto.
- **Camadas:** A foto do carro deve ficar em uma camada intermediária (abaixo dos textos e logotipos).
- **Tipografia:** Identificar e usar fontes similares às dos layouts (ex: Montserrat, Archivo Black).
- **Alinhamento:** Os textos devem estar perfeitamente alinhados sobre os elementos gráficos do fundo (caixas brancas e tarjas verdes).

---

## 🤖 PROMPT PARA O ANTIGRAVITY (COPIAR ABAIXO)

"Aja como um Desenvolvedor Senior Fullstack especializado em ecossistema React. 

Preciso que você desenvolva o componente `CardEditor.tsx`. 

Siga estritamente as referências visuais presentes na pasta `docs/layouts/` para definir as cores, fontes e o posicionamento absoluto de cada elemento de texto.

ESPECIFICAÇÕES:
1. Renderize uma div de 1080x1920 (proporção 9:16) que funcione como o canvas.
2. Utilize o PNG de fundo da pasta de layouts.
3. Crie um formulário lateral para preenchimento de: Marca, Modelo, Ano, Preço Fipe e Preço Especial.
4. Adicione um input de arquivo para a foto do carro e um slider de controle de escala (zoom) para essa foto.
5. Calcule automaticamente: Margem = (Fipe - Preço Especial).
6. Use a biblioteca 'html-to-image' para exportar o resultado. Configure para 'pixelRatio: 3' visando alta qualidade para WhatsApp/Instagram.
7. Garanta que o posicionamento dos textos (Marca, Modelo e Preços) bata exatamente com os campos visuais do layout de referência em `docs/layouts/`.

Foque em um código performático, tipado com TypeScript e estilizado com Tailwind CSS."