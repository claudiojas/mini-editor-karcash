import { useState, useMemo, useEffect } from 'react';
import type { VehicleData, CanvasConfig, BackgroundConfig, KarCardState } from '../types';
import bgLayerUrl from '../assets/backgroudapp.png';

const STORAGE_KEY = 'karcash_editor_state';

const INITIAL_DATA: VehicleData = {
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    fipePrice: 0,
    salePrice: 0,
    economyPrice: 0,
    detailsText: 'Configurações',
};

const DEFAULT_STORY_CONFIG: CanvasConfig = {
    zoom: 1,
    pan: { x: 0, y: 0 },
    rotation: 0,
    overlayOpacity: 1,
    brand: { fontSize: 50, offsetX: 0, offsetY: 0, fontFamily: 'Archivo', fontWeight: '800' },
    model: { fontSize: 110, offsetX: 0, offsetY: 0, fontFamily: 'Archivo', fontWeight: '900' },
    details: { fontSize: 50, offsetX: 0, offsetY: 0, fontFamily: 'Montserrat', fontWeight: '400' },
    year: { fontSize: 50, offsetX: 0, offsetY: 0, fontFamily: 'Montserrat', fontWeight: '700' },
    price: { fontSize: 92, offsetX: 0, offsetY: 0, fontFamily: 'Montserrat', fontWeight: '700' },
    fipe: { fontSize: 22, offsetX: 0, offsetY: 0, width: 320, height: 110, color: '#FFFFFF', gap: 28, fontFamily: 'Montserrat', fontWeight: '700' },
    economy: { fontSize: 22, offsetX: 0, offsetY: 0, width: 320, height: 110, color: '#CCFF00', gap: 28, fontFamily: 'Montserrat', fontWeight: '700' },
    karcashLogo: { fontSize: 30, offsetX: 0, offsetY: 0, fontFamily: 'Archivo', fontWeight: '800' },
    logoImage: { width: 412, offsetX: -38, offsetY: 129, fontSize: 0 },
    salePriceFontSize: 120,
};

const DEFAULT_POSTER_CONFIG: CanvasConfig = {
    ...DEFAULT_STORY_CONFIG,
    zoom: 1.05,
    brand: { fontSize: 42, offsetX: 0, offsetY: -110, fontFamily: 'Archivo', fontWeight: '800' },
    model: { fontSize: 96, offsetX: 0, offsetY: -120, fontFamily: 'Archivo', fontWeight: '900' },
    details: { fontSize: 38, offsetX: 0, offsetY: -10, fontFamily: 'Montserrat', fontWeight: '400' },
    year: { fontSize: 38, offsetX: 0, offsetY: -15, fontFamily: 'Montserrat', fontWeight: '700' },
    price: { fontSize: 94, offsetX: 0, offsetY: -130, fontFamily: 'Montserrat', fontWeight: '700' },
    fipe: { fontSize: 20, offsetX: 0, offsetY: -110, width: 280, height: 95, color: '#FFFFFF', gap: 28, fontFamily: 'Montserrat', fontWeight: '700' },
    economy: { fontSize: 20, offsetX: 0, offsetY: -110, width: 280, height: 95, color: '#CCFF00', gap: 28, fontFamily: 'Montserrat', fontWeight: '700' },
    karcashLogo: { fontSize: 26, offsetX: 0, offsetY: -127, fontFamily: 'Archivo', fontWeight: '800' },
    logoImage: { width: 360, offsetX: -40, offsetY: 80, fontSize: 0 },
};

const DEFAULT_BACKGROUND: BackgroundConfig = {
    type: 'image',
    value: bgLayerUrl,
    gradient: { colors: ['#CCFF00', '#000000'], direction: 180 }
};

export function useKarCard() {
    // 1. Carregar estado inicial do localStorage ou usar padrões
    const loadInitialState = (): KarCardState => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load saved state', e);
            }
        }
        return {
            image: null,
            data: INITIAL_DATA,
            format: 'story',
            layouts: {
                story: { config: DEFAULT_STORY_CONFIG, background: DEFAULT_BACKGROUND },
                poster: { config: DEFAULT_POSTER_CONFIG, background: DEFAULT_BACKGROUND }
            }
        };
    };

    const [state, setState] = useState<KarCardState>(loadInitialState());

    // 2. Persistência Automática
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // 3. Helpers de Derivação
    const currentLayout = state.layouts[state.format];
    const { config, background } = currentLayout;

    const discountPercentage = useMemo(() => {
        if (!state.data.fipePrice || !state.data.salePrice) return 0;
        if (state.data.fipePrice <= 0) return 0;
        const discount = ((state.data.fipePrice - state.data.salePrice) / state.data.fipePrice) * 100;
        return Math.max(0, Math.round(discount));
    }, [state.data.fipePrice, state.data.salePrice]);

    // Automação da Margem de Lucro
    useEffect(() => {
        const margin = (state.data.fipePrice || 0) - (state.data.salePrice || 0);
        if (state.data.economyPrice !== margin) {
            setState(prev => ({
                ...prev,
                data: { ...prev.data, economyPrice: margin }
            }));
        }
    }, [state.data.fipePrice, state.data.salePrice]);

    // 4. Ações
    const setImage = (url: string | null) => setState(prev => ({ ...prev, image: url }));

    const setFormat = (format: 'story' | 'poster') => setState(prev => ({ ...prev, format }));

    const updateData = (field: keyof VehicleData, value: any) => {
        setState(prev => ({
            ...prev,
            data: { ...prev.data, [field]: value }
        }));
    };

    const updateConfig = (field: keyof CanvasConfig, value: any) => {
        setState(prev => {
            const currentFormat = prev.format;
            const currentLayout = prev.layouts[currentFormat];
            const currentConfig = currentLayout.config;

            let newConfigFieldValue;
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && typeof (currentConfig[field] as any) === 'object') {
                newConfigFieldValue = {
                    ...(currentConfig[field] as any),
                    ...value
                };
            } else {
                newConfigFieldValue = value;
            }

            return {
                ...prev,
                layouts: {
                    ...prev.layouts,
                    [currentFormat]: {
                        ...currentLayout,
                        config: { ...currentConfig, [field]: newConfigFieldValue }
                    }
                }
            };
        });
    };

    const setBackground = (bg: BackgroundConfig) => {
        setState(prev => ({
            ...prev,
            layouts: {
                ...prev.layouts,
                [prev.format]: {
                    ...prev.layouts[prev.format],
                    background: bg
                }
            }
        }));
    };

    const restoreDefaults = () => {
        setState(prev => ({
            ...prev,
            layouts: {
                ...prev.layouts,
                [prev.format]: {
                    config: prev.format === 'story' ? DEFAULT_STORY_CONFIG : DEFAULT_POSTER_CONFIG,
                    background: DEFAULT_BACKGROUND
                }
            }
        }));
    };

    return {
        image: state.image,
        setImage,
        data: state.data,
        updateData,
        config, // Atual para o formato ativo
        updateConfig,
        discountPercentage,
        format: state.format,
        setFormat,
        background, // Atual para o formato ativo
        setBackground,
        restoreDefaults,
        state, // Exportar estado completo se necessário
    };
}
