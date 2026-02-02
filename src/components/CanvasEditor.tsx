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
        // Configurações de estilo
        const PADDING = 60;

        // -- Gradiente removido para permitir visualização do background --
        // const gradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - 900, 0, CANVAS_HEIGHT);
        // ...
        // ctx.fillRect(0, CANVAS_HEIGHT - 900, CANVAS_WIDTH, 900);


        // -- Header: Logo KarCash (Removido a pedido) --
        // ctx.fillStyle = '#CCFF00'; // Neon Green
        // ctx.font = 'bold 60px Inter, sans-serif';
        // ctx.textAlign = 'center';
        // ctx.fillText('KarCash', CANVAS_WIDTH / 2, 120);


        // -- Informações do Veículo --
        ctx.textAlign = 'left';

        // Marca e Modelo
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 80px Inter, sans-serif';
        const title = `${state.data.brand} ${state.data.model}`.trim() || 'Marca Modelo';
        ctx.fillText(title, PADDING, CANVAS_HEIGHT - 500);

        // Ano
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '50px Inter, sans-serif';
        ctx.fillText(state.data.year || 'Ano', PADDING, CANVAS_HEIGHT - 430);

        // -- Preços --
        const priceY = CANVAS_HEIGHT - 250;

        // Tabela Fipe (Riscado ou menor)
        ctx.fillStyle = '#888888';
        ctx.font = '40px Inter, sans-serif';
        ctx.fillText('Tabela Fipe:', PADDING, priceY - 60);
        ctx.font = 'bold 40px Inter, sans-serif';
        ctx.fillText(`R$ ${state.data.fipePrice.toLocaleString('pt-BR')}`, PADDING + 240, priceY - 60);

        // Valor KarCash (Gigante e Neon)
        ctx.fillStyle = '#CCFF00';
        ctx.font = 'bold 100px Inter, sans-serif';
        const priceText = `R$ ${state.data.salePrice.toLocaleString('pt-BR')}`;
        ctx.fillText(priceText, PADDING, priceY + 40);

        // --- Badge de Desconto ---
        if (discountPercentage > 0) {
            const badgeText = `${discountPercentage}% OFF`;
            ctx.font = 'bold 60px Inter, sans-serif';
            const badgeWidth = ctx.measureText(badgeText).width + 60;

            // Fundo do Badge
            ctx.fillStyle = '#CCFF00';
            ctx.beginPath();
            // @ts-ignore - roundRect pode não estar no type def padrão do TS antigo, mas funciona em browsers modernos
            if (ctx.roundRect) {
                ctx.roundRect(CANVAS_WIDTH - PADDING - badgeWidth, priceY - 50, badgeWidth, 100, 50);
            } else {
                ctx.rect(CANVAS_WIDTH - PADDING - badgeWidth, priceY - 50, badgeWidth, 100);
            }
            ctx.fill();

            // Texto do Badge
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(badgeText, CANVAS_WIDTH - PADDING - (badgeWidth / 2), priceY);
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
