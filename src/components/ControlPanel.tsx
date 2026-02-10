import React, { useState } from 'react';
import type { KarCardState, ItemConfig, BackgroundConfig } from '../types';
import bgLayerUrl from '../assets/backgroudapp.png'; // Importar para restaurar padrão

interface ControlPanelProps {
    state: KarCardState;
    onUpdateData: (field: any, value: any) => void;
    onUpdateConfig: (field: any, value: any) => void;
    onUpdateFormat: (format: 'story' | 'poster') => void;
    onUpdateBackground: (bg: BackgroundConfig) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDownload: () => void;
}

interface ItemControlProps {
    label: string;
    config: ItemConfig;
    onChange: (key: keyof ItemConfig, value: any) => void;
    showColor?: boolean;
    showDimensions?: boolean;
}

const ItemControl = ({ label, config, onChange, showColor = false, showDimensions = false }: ItemControlProps) => (
    <div className="bg-gray-800 p-3 rounded mb-3 border border-gray-700">
        <h4 className="text-neon-green font-bold text-sm mb-2 uppercase">{label}</h4>
        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="text-gray-400 text-xs block mb-1">Tamanho Fonte</label>
                <input
                    type="number"
                    value={config.fontSize}
                    onChange={(e) => onChange('fontSize', Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                />
            </div>
            {showColor && (
                <div>
                    <label className="text-gray-400 text-xs block mb-1">Cor Fundo</label>
                    <input
                        type="color"
                        value={config.color || '#ffffff'}
                        onChange={(e) => onChange('color', e.target.value)}
                        className="w-full h-[26px] bg-gray-900 border border-gray-600 rounded cursor-pointer"
                    />
                </div>
            )}
            {showDimensions && (
                <>
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">Largura</label>
                        <input
                            type="number"
                            value={config.width || 320}
                            onChange={(e) => onChange('width', Number(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">Altura</label>
                        <input
                            type="number"
                            value={config.height || 100}
                            onChange={(e) => onChange('height', Number(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                        />
                    </div>
                </>
            )}
            <div>
                <label className="text-gray-400 text-xs block mb-1">Pos X</label>
                <input
                    type="range" min="-500" max="500"
                    value={config.offsetX}
                    onChange={(e) => onChange('offsetX', Number(e.target.value))}
                    className="w-full accent-neon-green"
                />
            </div>
            <div>
                <label className="text-gray-400 text-xs block mb-1">Pos Y</label>
                <input
                    type="range" min="-500" max="500"
                    value={config.offsetY}
                    onChange={(e) => onChange('offsetY', Number(e.target.value))}
                    className="w-full accent-neon-green"
                />
            </div>
            {config.gap !== undefined && (
                <div className="col-span-2">
                    <label className="text-gray-400 text-xs block mb-1">Espaçamento (Gap: {config.gap}px)</label>
                    <input
                        type="range" min="0" max="200" step="1"
                        value={config.gap}
                        onChange={(e) => onChange('gap', Number(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                    />
                </div>
            )}
        </div>
    </div>
);

export function ControlPanel({ state, onUpdateData, onUpdateConfig, onUpdateFormat, onUpdateBackground, onImageUpload, onDownload }: ControlPanelProps) {
    const [activeTab, setActiveTab] = useState<'data' | 'texts' | 'prices' | 'bg'>('data');

    const tabs = [
        { id: 'data', label: 'Dados' },
        { id: 'texts', label: 'Textos' },
        { id: 'prices', label: 'Preços' },
        { id: 'bg', label: 'Fundo' },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white w-full overflow-hidden">
            <div className="p-4 bg-gray-900 border-b border-gray-800 shrink-0 z-20">
                <div className="flex justify-between items-center mb-4">
                    <img src="/logo_sec-removebg.webp" alt="Logo Secundária" className="h-10 object-contain mx-auto" />
                </div>

                {/* Format Switcher */}
                <div className="bg-gray-800 p-1 rounded-lg border border-gray-700 flex mb-4">
                    <button
                        onClick={() => onUpdateFormat('story')}
                        className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${state.format === 'story'
                            ? 'bg-neon-green text-black shadow-lg shadow-neon-green/20'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Story (9:16)
                    </button>
                    <button
                        onClick={() => onUpdateFormat('poster')}
                        className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${state.format === 'poster'
                            ? 'bg-neon-green text-black shadow-lg shadow-neon-green/20'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Poster (4:5)
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 pb-2 text-sm font-medium ${activeTab === tab.id ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-400'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {activeTab === 'data' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Imagem</label>
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 hover:border-neon-green transition-colors">
                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    <p className="text-xs text-gray-400">Clique para carregar foto</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
                            </label>

                            {/* Zoom, Rotation & Pan Globais (Imagem) */}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-2">
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Zoom ({state.config.zoom.toFixed(1)}x)</label>
                                    <input
                                        type="range" min="0.1" max="3" step="0.05"
                                        value={state.config.zoom}
                                        onChange={(e) => onUpdateConfig('zoom', parseFloat(e.target.value))}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Rotação ({state.config.rotation || 0}°)</label>
                                    <input
                                        type="range" min="-180" max="180" step="1"
                                        value={state.config.rotation || 0}
                                        onChange={(e) => onUpdateConfig('rotation', parseFloat(e.target.value))}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Posição X</label>
                                    <input
                                        type="range" min="-1000" max="1000" step="10"
                                        value={state.config.pan.x}
                                        onChange={(e) => onUpdateConfig('pan', { ...state.config.pan, x: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Posição Y</label>
                                    <input
                                        type="range" min="-1000" max="1000" step="10"
                                        value={state.config.pan.y}
                                        onChange={(e) => onUpdateConfig('pan', { ...state.config.pan, y: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Car Data */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800 pb-1">Dados Veículo</h3>

                            <div className="space-y-2">
                                <input
                                    type="text" placeholder="Marca (ex: Honda)"
                                    value={state.data.brand} onChange={(e) => onUpdateData('brand', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                                />
                                <input
                                    type="text" placeholder="Modelo (ex: Civic Touring)"
                                    value={state.data.model} onChange={(e) => onUpdateData('model', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text" placeholder="Ano (ex: 2021)"
                                        value={state.data.year} onChange={(e) => onUpdateData('year', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                                    />
                                    <textarea
                                        placeholder="Detalhes (ex: Configurações)"
                                        value={state.data.detailsText || ''} onChange={(e) => onUpdateData('detailsText', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none resize-y min-h-[40px]"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prices Inputs (Data Only) */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase border-b border-gray-800 pb-1">Valores</h3>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">Valor Fipe</label>
                                    <input
                                        type="number" placeholder="0,00" step="0.01"
                                        value={state.data.fipePrice || ''} onChange={(e) => onUpdateData('fipePrice', parseFloat(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-neon-green font-bold">Valor Venda (KarCash)</label>
                                    <input
                                        type="number" placeholder="0,00" step="0.01"
                                        value={state.data.salePrice || ''} onChange={(e) => onUpdateData('salePrice', parseFloat(e.target.value))}
                                        className="w-full bg-gray-800 border border-neon-green rounded px-3 py-2 text-sm focus:outline-none font-bold text-white shadow-sm shadow-neon-green/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Margem de Lucro (Automática)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green text-xs font-bold font-ubuntu">R$</span>
                                        <input
                                            type="text"
                                            value={state.data.economyPrice.toLocaleString('pt-BR')}
                                            readOnly
                                            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg py-2 pl-9 pr-3 text-xs text-neon-green font-bold font-ubuntu cursor-not-allowed focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'texts' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <ItemControl label="Marca" config={state.config.brand} onChange={(k, v) => onUpdateConfig('brand', { [k]: v })} />
                        <ItemControl label="Modelo" config={state.config.model} onChange={(k, v) => onUpdateConfig('model', { [k]: v })} />
                        <ItemControl label="Detalhes" config={state.config.details} onChange={(k, v) => onUpdateConfig('details', { [k]: v })} />
                        <ItemControl label="Ano" config={state.config.year} onChange={(k, v) => onUpdateConfig('year', { [k]: v })} />

                        <div className="bg-gray-800 p-3 rounded mb-3 border border-gray-700">
                            <h4 className="text-neon-green font-bold text-sm mb-2 uppercase">Logo (Imagem)</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-gray-400 text-xs">Largura</label>
                                        <input
                                            type="number"
                                            value={state.config.logoImage?.width || 200}
                                            onChange={(e) => onUpdateConfig('logoImage', { width: Number(e.target.value) })}
                                            className="w-20 bg-gray-900 border border-gray-600 rounded px-2 py-0.5 text-white text-xs text-right"
                                        />
                                    </div>
                                    <input
                                        type="range" min="50" max="600"
                                        value={state.config.logoImage?.width || 200}
                                        onChange={(e) => onUpdateConfig('logoImage', { width: Number(e.target.value) })}
                                        className="w-full accent-neon-green"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-gray-400 text-xs">Pos X</label>
                                        <input
                                            type="number"
                                            value={state.config.logoImage?.offsetX || 0}
                                            onChange={(e) => onUpdateConfig('logoImage', { offsetX: Number(e.target.value) })}
                                            className="w-16 bg-gray-900 border border-gray-600 rounded px-1 py-0.5 text-white text-xs text-right"
                                        />
                                    </div>
                                    <input
                                        type="range" min="-500" max="500"
                                        value={state.config.logoImage?.offsetX || 0}
                                        onChange={(e) => onUpdateConfig('logoImage', { offsetX: Number(e.target.value) })}
                                        className="w-full accent-neon-green"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-gray-400 text-xs">Pos Y</label>
                                        <input
                                            type="number"
                                            value={state.config.logoImage?.offsetY || 0}
                                            onChange={(e) => onUpdateConfig('logoImage', { offsetY: Number(e.target.value) })}
                                            className="w-16 bg-gray-900 border border-gray-600 rounded px-1 py-0.5 text-white text-xs text-right"
                                        />
                                    </div>
                                    <input
                                        type="range" min="-500" max="500"
                                        value={state.config.logoImage?.offsetY || 0}
                                        onChange={(e) => onUpdateConfig('logoImage', { offsetY: Number(e.target.value) })}
                                        className="w-full accent-neon-green"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prices' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <ItemControl
                            label="Tabela Fipe (Box)"
                            config={state.config.fipe}
                            onChange={(k, v) => onUpdateConfig('fipe', { [k]: v })}
                            showColor showDimensions
                        />
                        <ItemControl
                            label="Logo KarCash"
                            config={state.config.karcashLogo}
                            onChange={(k, v) => onUpdateConfig('karcashLogo', { [k]: v })}
                        />
                        <ItemControl
                            label="Valor KarCash"
                            config={state.config.price}
                            onChange={(k, v) => onUpdateConfig('price', { [k]: v })}
                        />
                        <ItemControl
                            label="Margem de Lucro (Box)"
                            config={state.config.economy}
                            onChange={(k, v) => onUpdateConfig('economy', { [k]: v })}
                            showColor showDimensions
                        />
                    </div>
                )}

                {activeTab === 'bg' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                            onClick={() => onUpdateBackground({
                                type: 'image',
                                value: bgLayerUrl,
                                gradient: { colors: ['#CCFF00', '#000000'], direction: 180 }
                            })}
                            className="w-full bg-gray-800 border border-gray-600 text-gray-300 text-xs font-bold uppercase py-2 rounded hover:bg-gray-700 hover:text-white transition-colors mb-4"
                        >
                            Restaurar Padrão
                        </button>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Imagem de Fundo</label>
                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 hover:border-neon-green transition-colors">
                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    <p className="text-xs text-gray-400">Carregar Nova Imagem</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            const url = URL.createObjectURL(e.target.files[0]);
                                            onUpdateBackground({
                                                ...state.background,
                                                type: 'image',
                                                value: url
                                            });
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Cor Sólida</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={state.background.type === 'solid' ? state.background.value : '#000000'}
                                    onChange={(e) => onUpdateBackground({
                                        ...state.background,
                                        type: 'solid',
                                        value: e.target.value
                                    })}
                                    className="w-full h-10 bg-gray-800 border border-gray-600 rounded cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Gradientes</label>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <button
                                    onClick={() => onUpdateBackground({
                                        type: 'gradient',
                                        value: '',
                                        gradient: { colors: ['#CCFF00', '#000000'], direction: 180 }
                                    })}
                                    className="h-10 rounded border border-gray-600 hover:border-neon-green transition-all"
                                    style={{ background: 'linear-gradient(180deg, #CCFF00, #000000)' }}
                                    title="Neon para Preto"
                                />
                                <button
                                    onClick={() => onUpdateBackground({
                                        type: 'gradient',
                                        value: '',
                                        gradient: { colors: ['#333333', '#000000'], direction: 180 }
                                    })}
                                    className="h-10 rounded border border-gray-600 hover:border-neon-green transition-all"
                                    style={{ background: 'linear-gradient(180deg, #333333, #000000)' }}
                                    title="Cinza Industrial"
                                />
                            </div>

                            {state.background.type === 'gradient' && state.background.gradient && (
                                <div className="bg-gray-800 p-3 rounded border border-gray-700 space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] text-gray-400 block mb-1">Cor Inicial</label>
                                            <input
                                                type="color"
                                                value={state.background.gradient.colors[0]}
                                                onChange={(e) => {
                                                    if (!state.background.gradient) return;
                                                    const newColors: [string, string] = [e.target.value, state.background.gradient.colors[1]];
                                                    onUpdateBackground({
                                                        ...state.background,
                                                        gradient: { ...state.background.gradient, colors: newColors }
                                                    });
                                                }}
                                                className="w-full h-8 bg-gray-900 border border-gray-600 rounded cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 block mb-1">Cor Final</label>
                                            <input
                                                type="color"
                                                value={state.background.gradient.colors[1]}
                                                onChange={(e) => {
                                                    if (!state.background.gradient) return;
                                                    const newColors: [string, string] = [state.background.gradient.colors[0], e.target.value];
                                                    onUpdateBackground({
                                                        ...state.background,
                                                        gradient: { ...state.background.gradient, colors: newColors }
                                                    });
                                                }}
                                                className="w-full h-8 bg-gray-900 border border-gray-600 rounded cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">Direção ({state.background.gradient.direction}°)</label>
                                        <input
                                            type="range" min="0" max="360"
                                            value={state.background.gradient.direction}
                                            onChange={(e) => {
                                                if (!state.background.gradient) return;
                                                onUpdateBackground({
                                                    ...state.background,
                                                    gradient: { ...state.background.gradient, direction: Number(e.target.value) }
                                                });
                                            }}
                                            className="w-full accent-neon-green"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900 shrink-0 z-20">
                <button
                    onClick={onDownload}
                    className="w-full bg-neon-green text-black font-black uppercase tracking-wider py-4 rounded-lg hover:bg-[#b3e600] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-neon-green/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar Arte
                </button>
            </div>
        </div>
    );
}
