# 📄 Especificação de Produto: Gerador KarCard

## 1. Motivação e Contexto
O projeto **KarCash** opera no nicho de repasse e venda de veículos abaixo da tabela Fipe. A operação atual do cliente (Gustavo) possui um gargalo crítico: a criação manual de artes para ofertas diárias. 

Atualmente, para cada veículo, são necessárias edições em softwares complexos (Photoshop/GIMP/Photopea), o que consome horas do gestor e impede a escala das postagens, que variam entre **20 a 50 artes por dia**. O cliente expressou frustração com a lentidão dos processos manuais e a dificuldade técnica de operar ferramentas de design.

A motivação deste submódulo é **automatizar a geração de ativos de marketing**, permitindo que o gestor foque na curadoria e precificação, enquanto a tecnologia da **Módulo Web** cuida da padronização e exportação das artes em segundos.

## 2. Visão do Produto
Transformar dados brutos (fotos e preços) em anúncios profissionais prontos para conversão, garantindo:
* **Velocidade:** Redução do tempo de criação de minutos para segundos.
* **Consistência:** Fidelidade total à identidade visual da marca sem riscos de distorção.
* **Autonomia:** Independência total do cliente em relação a designers para o fluxo operacional.

## 3. Análise de Requisitos

### 3.1 Requisitos Funcionais (RF)
* **RF01 - Upload de Ativos:** Permitir o upload de imagens do veículo (JPG, PNG, WebP) via interface drag-and-drop ou seletor.
* **RF02 - Edição de Dados:** Inputs específicos para Marca, Modelo, Ano, Valor Tabela Fipe e Valor KarCash.
* **RF03 - Flexibilidade de Preços:** Campos independentes para Fipe, Valor de Venda e "Abaixo da Fipe", permitindo inserção manual de valores promocionais sem dependência de cálculo automático.
* **RF04 - Manipulação de Imagem (UX):** Ferramentas de **Zoom (0.1x - 3x)** e **Pan (X/Y)** para enquadramento preciso do veículo.
* **RF05 - Exportação Multi-Formato:** Geração de arquivos PNG em alta resolução para **Story (9:16)** e **Feed (4:5)**.
* **RF06 - Ajuste Fino de Tipografia:** Controles deslizantes para tamanho de fonte (Modelo e Preço) e posicionamento vertical de elementos secundários.

### 3.2 Requisitos Não-Funcionais (RNF)
* **RNF01 - Interface Intuitiva:** Design focado em "zero curva de aprendizado" para o usuário final.
* **RNF02 - Nitidez Superior:** Renderização de textos via código (vetorial) para garantir leitura cristalina em qualquer dispositivo.
* **RNF03 - Arquitetura Modular:** Componente React isolado, facilitando a futura integração com o dashboard administrativo do ecossistema principal.

## 4. Pilares Estratégicos (Módulo Web)
* **Autoridade:** Entrega de um layout de altíssimo nível que posiciona a KarCash como especialista.
* **Reciprocidade e Over-delivery:** Resolução de uma dor latente do cliente que não estava prevista no escopo inicial do site, gerando valor inesperado.
* **Oceano Azul:** Substituição de mão de obra manual por tecnologia escalável, fugindo da guerra de preços de "sites simples".

---
*Documento gerado como base de contexto para desenvolvimento via Antigravity/Gemini.*