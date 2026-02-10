import { useState, useMemo, useEffect } from 'react';
import type { VehicleData, CanvasConfig, BackgroundConfig } from '../types';
import bgLayerUrl from '../assets/backgroudapp.png'; // Importar default aqui também se precisar/ou manter só no hook

const INITIAL_DATA: VehicleData = {
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    fipePrice: 0,
    salePrice: 0,
    economyPrice: 0,
    detailsText: 'Configurações',
};

const INITIAL_CONFIG: CanvasConfig = {
    zoom: 1,
    pan: { x: 0, y: 0 },
    rotation: 0,
    overlayOpacity: 1,

    brand: { fontSize: 50, offsetX: 0, offsetY: 0 },
    model: { fontSize: 110, offsetX: 0, offsetY: 0 },
    details: { fontSize: 50, offsetX: 0, offsetY: 0 },
    year: { fontSize: 50, offsetX: 0, offsetY: 0 },
    price: { fontSize: 92, offsetX: 0, offsetY: 0 },
    fipe: { fontSize: 32, offsetX: 0, offsetY: 0, width: 320, height: 110, color: '#FFFFFF', gap: 40 },
    economy: { fontSize: 32, offsetX: 0, offsetY: 0, width: 320, height: 110, color: '#CCFF00', gap: 40 },
    karcashLogo: { fontSize: 30, offsetX: 0, offsetY: 0 },
    logoImage: { width: 412, offsetX: -38, offsetY: 129, fontSize: 0 }, // Inicializar com largura padrão

    // Manter por compatibilidade se algo quebrar, mas idealmente remover
    salePriceFontSize: 120,
};

export function useKarCard() {
    const [image, setImage] = useState<string | null>(null);
    const [data, setData] = useState<VehicleData>(INITIAL_DATA);
    const [config, setConfig] = useState<CanvasConfig>(INITIAL_CONFIG);
    const [background, setBackground] = useState<BackgroundConfig>({
        type: 'image',
        value: bgLayerUrl,
        gradient: { colors: ['#CCFF00', '#000000'], direction: 180 } // Default gradient state
    });
    const [format, setFormat] = useState<'story' | 'poster'>('story');

    const discountPercentage = useMemo(() => {
        if (!data.fipePrice || !data.salePrice) return 0;
        if (data.fipePrice <= 0) return 0;

        // discount = (Fipe - Venda) / Fipe
        const discount = ((data.fipePrice - data.salePrice) / data.fipePrice) * 100;
        return Math.max(0, Math.round(discount)); // Nunca retorna negativo e arredonda
    }, [data.fipePrice, data.salePrice]);

    // Automação da Margem de Lucro: Fipe - Venda = Margem
    useEffect(() => {
        const margin = (data.fipePrice || 0) - (data.salePrice || 0);
        setData(prev => {
            if (prev.economyPrice === margin) return prev;
            return { ...prev, economyPrice: margin };
        });
    }, [data.fipePrice, data.salePrice]);

    const updateData = (field: keyof VehicleData, value: string | number) => {
        // Impedir atualização manual da economia se quiser ser rigoroso, mas vamos apenas deixar fluir
        setData((prev) => ({ ...prev, [field]: value }));
    };

    // Suporta atualização direta ou aninhada (ex: 'brand', { fontSize: 60 })
    const updateConfig = (field: keyof CanvasConfig, value: any) => {
        setConfig((prev) => {
            // Se o valor for um objeto parcial de uma propriedade existente (ex: atualizar só fontSize de brand)
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && typeof prev[field] === 'object') {
                return {
                    ...prev,
                    [field]: {
                        ...prev[field] as any, // Cast necessário pois TS não sabe profundidade
                        ...value
                    }
                };
            }

            return { ...prev, [field]: value };
        });
    };

    return {
        image,
        setImage,
        data,
        updateData,
        config,
        updateConfig,
        discountPercentage,
        format,
        setFormat,
        background,
        setBackground,
    };
}
