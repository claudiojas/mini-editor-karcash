export interface VehicleData {
    brand: string;
    model: string;
    year: string;
    fipePrice: number;
    salePrice: number;
    economyPrice: number; // Novo campo manual
}

export interface CanvasConfig {
    zoom: number;
    pan: { x: number; y: number };
    overlayOpacity: number;
    modelFontSize: number;
    salePriceFontSize: number; // Novo campo
    detailsOffsetY: number; // Offset vertical
}

export interface KarCardState {
    image: string | null; // URL da imagem carregada
    data: VehicleData;
    config: CanvasConfig;
    format: 'story' | 'feed'; // Novo campo de formato
}
