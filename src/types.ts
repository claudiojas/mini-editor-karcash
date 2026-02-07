export interface VehicleData {
    brand: string;
    model: string;
    year: string;
    fipePrice: number;
    salePrice: number;
    economyPrice: number; // Novo campo manual
    detailsText?: string; // Novo: Texto customizável para configurações
}

export interface ItemConfig {
    fontSize: number;
    offsetX: number;
    offsetY: number;
    align?: 'left' | 'center' | 'right';
    width?: number; // Novo: Largura (para boxes)
    height?: number; // Novo: Altura (para boxes)
    color?: string; // Novo: Cor de fundo (para boxes)
}

export interface CanvasConfig {
    zoom: number;
    pan: { x: number; y: number };
    overlayOpacity: number;

    // Elementos Individuais
    brand: ItemConfig;
    model: ItemConfig;
    details: ItemConfig;
    year: ItemConfig;
    price: ItemConfig; // Valor KarCash
    fipe: ItemConfig; // Novo: Tabela Fipe Box
    economy: ItemConfig; // Novo: Abaixo da Fipe Box
    karcashLogo: ItemConfig; // Novo: Logo/Texto KarCash

    // Legado ou Específico (ainda úteis?)
    salePriceFontSize?: number; // Depreciar em favor de price.fontSize se possível, mas manter compatibilidade por enquanto
}

export interface BackgroundConfig {
    type: 'image' | 'solid' | 'gradient';
    value: string; // URL da imagem ou Cor Sólida
    gradient?: {
        colors: [string, string];
        direction: number; // graus (0-360)
    };
}

export interface KarCardState {
    image: string | null; // URL da imagem carregada (Carro)
    data: VehicleData;
    config: CanvasConfig;
    background: BackgroundConfig; // Novo: Configuração de fundo
    format: 'story' | 'feed';
}
