import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { KarCardState } from '../types';
import bgLayerUrl from '../assets/backgroudapp.png';

interface CanvasEditorProps {
    state: KarCardState;
    discountPercentage: number;
}

export interface CanvasEditorRef {
    downloadImage: () => void;
}

export const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(({ state, discountPercentage }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Configuração de Layouts
    const LAYOUTS = {
        story: {
            width: 1080,
            height: 1920,
            topContent: 575,
            rightColumnTop: 470,
        },
        feed: {
            width: 1080,
            height: 1350,
            topContent: 400,
            rightColumnTop: 320,
        }
    };

    const layout = LAYOUTS[state.format] || LAYOUTS.story;

    const CANVAS_WIDTH = layout.width;
    const CANVAS_HEIGHT = layout.height;

    // Escala de visualização no navegador (ex: exibir menor na tela)
    const DISPLAY_SCALE = 0.35;

    useImperativeHandle(ref, () => ({
        downloadImage: () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // Criar link temporário
            const link = document.createElement('a');
            link.download = `karcash-${state.data.brand}-${state.data.model}.png`.toLowerCase().replace(/\s+/g, '-');
            link.href = canvas.toDataURL('image/png', 1.0); // Qualidade máxima
            link.click();
        }
    }));

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = async () => {
            // 1. Limpar canvas
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // 2. Carregar Background Template
            try {
                const bgImg = await loadImage(bgLayerUrl);
                ctx.drawImage(bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            } catch (e) {
                console.error("Erro ao carregar background", e);
            }

            // 3. Imagem do Veículo
            if (state.image) {
                try {
                    const userImg = await loadImage(state.image);

                    // Calcular aspecto
                    const scale = Math.max(CANVAS_WIDTH / userImg.width, CANVAS_HEIGHT / userImg.height) * state.config.zoom;

                    const centerX = (CANVAS_WIDTH - userImg.width * scale) / 2;
                    const centerY = (CANVAS_HEIGHT - userImg.height * scale) / 2;

                    const x = centerX + state.config.pan.x;
                    const y = centerY + state.config.pan.y;

                    ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);
                } catch (e) {
                    console.error("Erro ao carregar imagem do veículo", e);
                }
            }

            // 4. Overlays (Texto e Gradientes Gerados)
            drawOverlay(ctx);
        };

        render();

    }, [state, discountPercentage]);

    const drawOverlay = (ctx: CanvasRenderingContext2D) => {
        // Cores
        const COLOR_NEON = '#CCFF00';
        const COLOR_WHITE = '#FFFFFF';
        const COLOR_BLACK = '#000000';

        // Fontes

        // Posições (Ajustadas para o layout superior)
        const LEFT_ALIGN = 80;
        // Alinhamento à direita (base)
        const RIGHT_COLUMN_X = 1000;
        const TOP_CONTENT = layout.topContent; // Dinâmico

        // --- Esquerda: Dados do Veículo ---

        // 1. Marca (Badge Neon com texto preto)
        const marcaText = (state.data.brand || 'MARCA').toUpperCase();
        ctx.font = 'bold 50px Ubuntu, sans-serif';
        const marcaWidth = ctx.measureText(marcaText).width + 60; // Padding

        ctx.fillStyle = COLOR_NEON;
        ctx.fillRect(LEFT_ALIGN, TOP_CONTENT, marcaWidth, 80);

        ctx.fillStyle = COLOR_BLACK;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(marcaText, LEFT_ALIGN + 30, TOP_CONTENT + 40);

        // 2. Modelo (Texto Gigante Neon)
        const modeloText = (state.data.model || 'MODELO').toUpperCase();

        // Tamanho da fonte dinâmico
        const fontSize = state.config.modelFontSize || 110;
        ctx.font = `900 ${fontSize}px Ubuntu, sans-serif`;

        ctx.fillStyle = COLOR_NEON;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        // Quebrar linha se for muito longo (simples)
        const maxWidth = 550; // Metade da tela aprox
        const words = modeloText.split(' ');
        let line = '';
        let y = TOP_CONTENT + 100;

        // Lógica básica de multiline
        const lineHeight = fontSize * 1.0; // Altura da linha proporcional

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, LEFT_ALIGN, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        ctx.fillText(line, LEFT_ALIGN, y);

        // Ajustar Y para os proximos elementos baseados na altura do modelo + Offset Manual
        const detailsOffset = state.config.detailsOffsetY || 0;
        let currentY = y + 120 + detailsOffset;

        // 3. Versão/Configurações (Texto Branco)
        ctx.font = '50px Ubuntu, sans-serif';
        ctx.fillStyle = COLOR_WHITE;
        ctx.fillText("Configurações", LEFT_ALIGN, currentY);

        // 4. Ano (Texto Neon Pequeno)
        const anoText = (state.data.year || 'ANO');
        ctx.font = 'bold 50px Ubuntu, sans-serif';
        ctx.fillStyle = COLOR_NEON;
        ctx.fillText(anoText, LEFT_ALIGN, currentY + 70);


        // --- Direita: Preços ---
        // Ajuste fino de posicionamento baseado no Template Story Padrão
        // Ajuste fino de posicionamento baseado no Template Story Padrão
        const RIGHT_COLUMN_TOP = layout.rightColumnTop; // Dinâmico

        const drawPriceBox = (label: string, value: number, y: number, type: 'fipe' | 'economy') => {
            // Dimensões exatas do "quadrado" (retângulo)
            const boxWidth = 320;
            const boxHeight = 100;
            const boxX = RIGHT_COLUMN_X - boxWidth;

            // Cores
            const bgColor = type === 'fipe' ? COLOR_WHITE : COLOR_NEON;
            const textColor = COLOR_BLACK;

            // Desenhar Box
            ctx.fillStyle = bgColor;
            ctx.fillRect(boxX, y, boxWidth, boxHeight);

            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';

            // Label "TABELA FIPE:" ou "ABAIXO DA FIPE:"
            // No modelo: Pequeno, Bold, alinhado à direita, cor preta
            ctx.fillStyle = textColor;
            ctx.font = 'bold 22px Ubuntu, sans-serif';
            ctx.fillText(label, RIGHT_COLUMN_X - 25, y + 25);

            // Valor "R$ XX.XXX"
            // Separar R$ do valor para tamanhos diferentes
            const priceValue = value.toLocaleString('pt-BR');
            const currencySym = 'R$';

            ctx.fillStyle = textColor;

            // 1. Renderizar Valor Numérico (Grande)
            ctx.font = '900 65px Ubuntu, sans-serif';
            const valX = RIGHT_COLUMN_X - 20;
            const valY = y + 65;
            ctx.fillText(priceValue, valX, valY);

            // 2. Renderizar R$ (Pequeno)
            const valMetrics = ctx.measureText(priceValue);
            ctx.font = 'bold 30px Ubuntu, sans-serif';
            ctx.fillText(currencySym, valX - valMetrics.width - 10, valY + 2); // Leve ajuste Y para alinhar visualmente
        };

        // 1. Tabela Fipe (Box Branca)
        // 1. Tabela Fipe (Box Branca)
        // Sempre visível
        drawPriceBox("TABELA FIPE:", state.data.fipePrice, RIGHT_COLUMN_TOP, 'fipe');

        // 2. Preço KarCash (Sem box, gigante, Neon)
        // No modelo, o valor KarCash fica bem no meio, entre Fipe e Abaixo da Fipe
        // Espaçamento generoso
        // Espaçamento generoso (Reduzido proporcionalmente)
        const karcashY = RIGHT_COLUMN_TOP + 150;

        ctx.textBaseline = 'top';
        ctx.textAlign = 'right';

        // Label "KARCASH:" (Branca, pequena)
        ctx.fillStyle = COLOR_WHITE;
        ctx.font = 'bold 30px Ubuntu, sans-serif';
        ctx.fillText("KARCASH:", RIGHT_COLUMN_X, karcashY);

        // Valor Gigante Neon
        // Valor Gigante Neon
        ctx.fillStyle = COLOR_NEON;

        const kValue = state.data.salePrice.toLocaleString('pt-BR');
        const kSym = 'R$';

        // Tamanho Dinâmico
        const kFontSize = state.config.salePriceFontSize || 120;

        // 1. Valor Numérico
        ctx.font = `900 ${kFontSize}px Ubuntu, sans-serif`;
        const kY = karcashY + 43;
        ctx.fillText(kValue, RIGHT_COLUMN_X, kY);

        // 2. Símbolo R$ (Menor e Proporcional)
        // Antes: 120px valor -> 50px R$ (aprox 0.42)
        const symFontSize = Math.round(kFontSize * 0.42);

        const kMetrics = ctx.measureText(kValue);
        ctx.font = `bold ${symFontSize}px Ubuntu, sans-serif`;
        // Ajuste Y do símbolo era +50 fixo
        // Se 120 -> 50, então offset aprox 0.4 * FontSize
        const symYOffset = kFontSize * 0.42;

        ctx.fillText(kSym, RIGHT_COLUMN_X - kMetrics.width - 15, kY + symYOffset);

        // 3. Abaixo da Fipe (Box Neon)
        // Espaço abaixo do valor KarCash
        const economy = state.data.economyPrice; // Valor manual
        // Sempre visível
        // karcashY + gap (180 aprox altura texto) + gap extra
        // karcashY + gap (Reduzido proporcionalmente)
        const economyY = karcashY + 180;
        drawPriceBox("ABAIXO DA FIPE:", economy, economyY, 'economy');
    };

    return (
        <div className="flex justify-center items-center p-4 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{
                    width: `${CANVAS_WIDTH * DISPLAY_SCALE}px`,
                    height: `${CANVAS_HEIGHT * DISPLAY_SCALE}px`,
                    maxWidth: '100%',
                    objectFit: 'contain'
                }}
                className="shadow-black drop-shadow-2xl"
            />
        </div>
    );
});
