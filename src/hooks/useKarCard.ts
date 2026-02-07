import { useState, useMemo } from 'react';
import type { VehicleData, CanvasConfig } from '../types';

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
    overlayOpacity: 1,

    brand: { fontSize: 50, offsetX: 0, offsetY: 0 },
    model: { fontSize: 110, offsetX: 0, offsetY: 0 },
    details: { fontSize: 50, offsetX: 0, offsetY: 0 },
    year: { fontSize: 50, offsetX: 0, offsetY: 0 },
    price: { fontSize: 92, offsetX: 0, offsetY: 0 },
    fipe: { fontSize: 22, offsetX: 0, offsetY: 0, width: 350, height: 100, color: '#FFFFFF' },
    economy: { fontSize: 22, offsetX: 0, offsetY: 0, width: 350, height: 100, color: '#CCFF00' },

    // Manter por compatibilidade se algo quebrar, mas idealmente remover
    salePriceFontSize: 120,
};

export function useKarCard() {
    const [image, setImage] = useState<string | null>(null);
    const [data, setData] = useState<VehicleData>(INITIAL_DATA);
    const [config, setConfig] = useState<CanvasConfig>(INITIAL_CONFIG);
    const [format, setFormat] = useState<'story' | 'feed'>('story');

    const discountPercentage = useMemo(() => {
        if (!data.fipePrice || !data.salePrice) return 0;
        if (data.fipePrice <= 0) return 0;

        // discount = (Fipe - Venda) / Fipe
        const discount = ((data.fipePrice - data.salePrice) / data.fipePrice) * 100;
        return Math.max(0, Math.round(discount)); // Nunca retorna negativo e arredonda
    }, [data.fipePrice, data.salePrice]);

    const updateData = (field: keyof VehicleData, value: string | number) => {
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
        format,      // Exportando format
        setFormat,   // Exportando setFormat
    };
}
