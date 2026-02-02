import { useState, useMemo } from 'react';
import type { VehicleData, CanvasConfig } from '../types';

const INITIAL_DATA: VehicleData = {
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    fipePrice: 0,
    salePrice: 0,
    economyPrice: 0,
};

const INITIAL_CONFIG: CanvasConfig = {
    zoom: 1,
    pan: { x: 0, y: 0 },
    overlayOpacity: 1,
    modelFontSize: 110,
};

export function useKarCard() {
    const [image, setImage] = useState<string | null>(null);
    const [data, setData] = useState<VehicleData>(INITIAL_DATA);
    const [config, setConfig] = useState<CanvasConfig>(INITIAL_CONFIG);

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

    const updateConfig = (field: keyof CanvasConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [field]: value }));
    };

    return {
        image,
        setImage,
        data,
        updateData,
        config,
        updateConfig,
        discountPercentage,
    };
}
