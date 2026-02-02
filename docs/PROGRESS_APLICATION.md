# Progresso da Aplicação - KarCard Generator

## Visão Geral
Este documento rastreia o estado atual do desenvolvimento da aplicação **KarCard Generator**, uma ferramenta para criação de carrosséis/stories de venda de veículos.

## Status Atual: 🚀 Versão 1.0 Concluída (Multi-formato & Ajustes Finos)

### Funcionalidades Implementadas
1.  **Core do Editor (Canvas)**
    *   [x] Renderização **Multi-Formato**: Story (9:16) e Feed (4:5).
    *   [x] Upload de Imagem do Veículo (Drag & Drop).
    *   [x] Controles Avançados de Imagem: **Zoom (0.1x a 3x)** e **Pan (X/Y)**.
    *   [x] Background Template Integrado (`assets/backgroudapp.png`).

2.  **Layout & Fidelidade Visual**
    *   [x] **Refatoração "Story Padrão"**:
        *   Layout assimétrico seguindo o guia visual da marca.
        *   **Coluna Esquerda**: Marca (Badge Neon), Modelo (Neon Gigante, Multiline), Detalhes (Branco), Ano (Neon).
        *   **Coluna Direita**: Tabela Fipe (Box Branca), Valor KarCash (Gigante Neon), Abaixo da Fipe (Box Neon).
    *   [x] **Controles de Tipografia & Posição**:
        *   Slider de Tamanho de Fonte para **Modelo**.
        *   Slider de Tamanho de Fonte para **Preço KarCash** (com escala proporcional do símbolo R$).
        *   Slider de **Posição Vertical Extra** para "Configurações e Ano".
    *   [x] Fontes **Ubuntu** substituindo Inter.
    *   [x] Cores Oficiais: Neon (`#CCFF00`), Black (`#000000`), White (`#FFFFFF`).

3.  **Lógica de Negócio**
    *   [x] **Dados Separados**: Campos independentes para Fipe, Venda e "Abaixo da Fipe" (Economy), permitindo inserção manual de valores promocionais.
    *   [x] Formatação monetária (BRL).

4.  **Interface (UI)**
    *   [x] Seletor de Formato (Story/Feed) no Painel de Controle.
    *   [x] Botão de Download com texto branco.
    *   [x] Download instantâneo de PNG em alta resolução.
    *   [x] Nomeação automática de arquivos baseada em Marca/Modelo.

## Próximos Passos (Backlog)
- [ ] Implementar seletor de templates adicionais.
- [ ] Integração com API (futuro).

## Changelog Recente
- **[2026-02-02]** Implementação de suporte Multi-Formatos (Story 9:16 e Feed 4:5).
- **[2026-02-02]** Adição de controles finos de UI (Pan X/Y, Tamanhos de Fonte, Posição Vertical).
- **[2026-02-02]** Separação lógica dos campos de preço (Economy manual).
- **[2026-02-02]** Refatoração da fonte para Ubuntu e ajustes de espaçamento.

