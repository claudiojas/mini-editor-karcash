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
    modelFontSize: number; // Novo campo
}

export interface KarCardState {
    image: string | null; // URL da imagem carregada
    data: VehicleData;
    config: CanvasConfig;
}
