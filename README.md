# KarCard Generator 🚗💨

> **Usina de Artes para Venda Automotiva**

O **KarCard Generator** é uma aplicação web focada em produtividade para revendedores de veículos. Ele automatiza a criação de artes profissionais para Stories (Instagram/WhatsApp) e Feed, garantindo fidelidade visual à marca **KarCash** e destacando a proposta de valor "Abaixo da Fipe".

![Badge](https://img.shields.io/badge/Status-Versão%201.0-brightgreen)
![Tech](https://img.shields.io/badge/Stack-React%20|%20TypeScript%20|%20Tailwind-blue)

---

## 🚀 Funcionalidades Principais

### 🎨 Formatos Flexíveis
- **Story (9:16)**: Layout otimizado para tela cheia (1080x1920).
- **Feed (4:5)**: Layout condensado para posts e anúncios (1080x1350).
- **Troca Rápida**: Alterne entre formatos com um clique sem perder os dados preenchidos.

### 🖼️ Editor Visual Poderoso
- **Upload Inteligente**: Arraste e solte fotos do veículo.
- **Ajustes de Imagem**: Controles manuais de **Zoom (0.1x a 3x)** e **Pan (X/Y)** para enquadramento perfeito.
- **Tipografia Dinâmica**: Ajuste o tamanho da fonte do **Modelo** e do **Preço** para acomodar nomes longos ou dar destaque.
- **Ajuste Vertical**: Controle fino da posição dos elementos "Configurações" e "Ano" para evitar sobreposições.

### 💰 Estratégia Comercial
- **Campos Independentes**: Insira manualmente o preço da **Tabela Fipe**, **Valor de Venda** e o valor **Abaixo da Fipe**.
- **Destaque Visual**: Cores Neon (`#CCFF00`) para chamar atenção nos valores e modelos.

### 📱 Mobile First
- Interface 100% responsiva.
- No celular, edite visualizando o preview no topo e os controles logo abaixo com rolagem fluida.

---

## 🛠️ Tecnologias Utilizadas

- **React + Vite**: Performance e desenvolvimento rápido.
- **TypeScript**: Segurança de tipos e escalabilidade.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **HTML5 Canvas API**: Renderização e exportação de imagens em alta definição no navegador (Client-side).

---

## 📦 Como Usar

1. **Upload**: Carregue a foto do carro.
2. **Dados**: Preencha Marca, Modelo, Ano e Preços.
3. **Ajustes**:
    - Use o **Zoom/Pan** para focar no carro.
    - Use os sliders de **Fonte** se o texto for muito grande.
    - Escolha entre **Story** ou **Feed**.
4. **Exportar**: Clique em **"Baixar Arte (png)"**. O arquivo será salvo automaticamente com o nome `karcash-marca-modelo.png`.

---

## 💻 Instalação e Execução

Clone o repositório e instale as dependências:

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

O projeto rodará em `http://localhost:5173`.

---

## 👤 Autor

Desenvolvido para **KarCash** por **Módulo Web**.
*Foco em automação, design e conversão.*
