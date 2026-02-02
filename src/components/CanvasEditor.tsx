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

    // Dimensões para Stories/Reels (1080x1920) mas escalado para visualização
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1920;

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
        const FONT_EXTRA_BOLD = '900 110px Inter, sans-serif'; // Modelo de Destaque

        // Posições (Ajustadas para o layout superior)
        const LEFT_ALIGN = 80;
        const RIGHT_ALIGN = 1000; // Alinhamento à direita

        const TOP_CONTENT = 600; // Início do bloco de conteúdo (abaixo do logo)

        // --- Esquerda: Dados do Veículo ---

        // 1. Marca (Badge Neon com texto preto)
        const marcaText = (state.data.brand || 'MARCA').toUpperCase();
        ctx.font = 'bold 50px Inter, sans-serif';
        const marcaWidth = ctx.measureText(marcaText).width + 60; // Padding

        ctx.fillStyle = COLOR_NEON;
        ctx.fillRect(LEFT_ALIGN, TOP_CONTENT, marcaWidth, 80);

        ctx.fillStyle = COLOR_BLACK;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(marcaText, LEFT_ALIGN + 30, TOP_CONTENT + 40);

        // 2. Modelo (Texto Gigante Neon)
        const modeloText = (state.data.model || 'MODELO').toUpperCase();
        ctx.font = FONT_EXTRA_BOLD;
        ctx.fillStyle = COLOR_NEON;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        // Quebrar linha se for muito longo (simples)
        const maxWidth = 550; // Metade da tela aprox
        const words = modeloText.split(' ');
        let line = '';
        let y = TOP_CONTENT + 100;

        // Lógica básica de multiline
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, LEFT_ALIGN, y);
                line = words[n] + ' ';
                y += 110; // Line height
            }
            else {
                line = testLine;
            }
        }
        ctx.fillText(line, LEFT_ALIGN, y);

        // Ajustar Y para os proximos elementos baseados na altura do modelo
        let currentY = y + 120;

        // 3. Versão/Configurações (Texto Branco)
        ctx.font = '50px Inter, sans-serif';
        ctx.fillStyle = COLOR_WHITE;
        ctx.fillText("Configurações", LEFT_ALIGN, currentY);

        // 4. Ano (Texto Neon Pequeno)
        const anoText = (state.data.year || 'ANO');
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillStyle = COLOR_NEON;
        ctx.fillText(anoText, LEFT_ALIGN, currentY + 70);


        // --- Direita: Preços ---
        const RIGHT_COLUMN_TOP = TOP_CONTENT;

        const drawRightBox = (label: string, value: number, y: number, isPromo: boolean = false) => {
            const valueText = `R$ ${value.toLocaleString('pt-BR')}`;
            const boxWidth = 450;
            const boxHeight = 130;
            const boxX = RIGHT_ALIGN - boxWidth;

            if (!isPromo) {
                // Estilo Tabela Fipe (Box Branca)
                ctx.fillStyle = COLOR_WHITE;
                ctx.fillRect(boxX, y, boxWidth, boxHeight);

                // Label pequena
                ctx.fillStyle = COLOR_BLACK;
                ctx.font = 'bold 25px Inter, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(label, RIGHT_ALIGN - 20, y + 35);

                // Valor
                ctx.font = '900 65px Inter, sans-serif';
                ctx.fillText(valueText, RIGHT_ALIGN - 20, y + 100);

            } else {
                // Estilo Abaixo da Fipe (Box Neon)
                ctx.fillStyle = COLOR_NEON;
                ctx.fillRect(boxX, y, boxWidth, boxHeight);

                // Label
                ctx.fillStyle = COLOR_BLACK;
                ctx.font = 'bold 25px Inter, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(label, RIGHT_ALIGN - 20, y + 35);

                // Valor (Diferença)
                ctx.font = '900 65px Inter, sans-serif';
                ctx.fillText(valueText, RIGHT_ALIGN - 20, y + 100);
            }
        };

        // 1. Tabela Fipe
        if (state.data.fipePrice > 0) {
            drawRightBox("TABELA FIPE:", state.data.fipePrice, RIGHT_COLUMN_TOP);
        }

        // 2. Preço KarCash (Sem box, gigante)
        const karchashY = RIGHT_COLUMN_TOP + 200;
        ctx.textAlign = 'right';
        ctx.fillStyle = COLOR_WHITE;
        ctx.font = '40px Inter, sans-serif';
        ctx.fillText("KARCASH:", RIGHT_ALIGN, karchashY);

        ctx.fillStyle = COLOR_NEON;
        ctx.font = '900 130px Inter, sans-serif';
        const saleText = `R$ ${state.data.salePrice.toLocaleString('pt-BR')}`;
        ctx.fillText(saleText, RIGHT_ALIGN, karchashY + 130);

        // 3. Abaixo da Fipe
        const economy = state.data.fipePrice - state.data.salePrice;
        if (economy > 0) {
            drawRightBox("ABAIXO DA FIPE:", economy, karchashY + 220, true);
        }
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
