import React from 'react';
import type { KarCardState } from '../types';

interface ControlPanelProps {
    state: KarCardState;
    onUpdateData: (field: any, value: any) => void;
    onUpdateConfig: (field: any, value: any) => void;
    onUpdateFormat: (format: 'story' | 'feed') => void; // Nova prop
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDownload: () => void;
}

export function ControlPanel({ state, onUpdateData, onUpdateConfig, onUpdateFormat, onImageUpload, onDownload }: ControlPanelProps) {


    return (
        <div className="flex flex-col gap-6 p-6 bg-gray-900 text-white w-full h-full overflow-y-auto border-r border-gray-800">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neon-green">Editor KarCard</h2>
                {/* Logo placeholder */}
            </div>

            {/* Format Switcher */}
            <div className="bg-gray-800/50 p-1 rounded-lg border border-gray-700 flex">
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
                    onClick={() => onUpdateFormat('feed')}
                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${state.format === 'feed'
                        ? 'bg-neon-green text-black shadow-lg shadow-neon-green/20'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Feed (4:5)
                </button>
            </div>

            {/* Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Imagem do Veículo</label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 hover:border-neon-green transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="text-xs text-gray-400">Clique para carregar</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
                    </label>
                </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Zoom: {state.config.zoom.toFixed(1)}x</label>
                <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.05"
                    value={state.config.zoom}
                    onChange={(e) => onUpdateConfig('zoom', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                />
            </div>

            {/* Position Controls */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Posição X: {state.config.pan.x}px</label>
                    <input
                        type="range"
                        min="-1000"
                        max="1000"
                        step="10"
                        value={state.config.pan.x}
                        onChange={(e) => onUpdateConfig('pan', { ...state.config.pan, x: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Posição Y: {state.config.pan.y}px</label>
                    <input
                        type="range"
                        min="-1000"
                        max="1000"
                        step="10"
                        value={state.config.pan.y}
                        onChange={(e) => onUpdateConfig('pan', { ...state.config.pan, y: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                    />
                </div>
            </div>

            {/* Car Data */}
            <div className="space-y-4 border-t border-gray-800 pt-4 grow">
                <h3 className="text-lg font-semibold text-gray-300">Dados do Veículo</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500">Marca</label>
                        <input
                            type="text"
                            value={state.data.brand}
                            onChange={(e) => onUpdateData('brand', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                            placeholder="Ex: Honda"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500">Ano</label>
                        <input
                            type="text"
                            value={state.data.year}
                            onChange={(e) => onUpdateData('year', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                            placeholder="Ex: 2021"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Modelo</label>
                    <input
                        type="text"
                        value={state.data.model}
                        onChange={(e) => onUpdateData('model', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                        placeholder="Ex: Civic Touring 1.5 Turbo"
                    />
                    <div className="pt-2">
                        <label className="text-[10px] text-gray-500 flex justify-between">
                            <span>Tamanho da Fonte</span>
                            <span>{state.config.modelFontSize || 110}px</span>
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="200"
                            step="5"
                            value={state.config.modelFontSize || 110}
                            onChange={(e) => onUpdateConfig('modelFontSize', parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500">Valor Fipe (R$)</label>
                        <input
                            type="number"
                            value={state.data.fipePrice || ''}
                            onChange={(e) => onUpdateData('fipePrice', parseFloat(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                            placeholder="0,00"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 text-neon-green">Valor KarCash (R$)</label>
                        <input
                            type="number"
                            value={state.data.salePrice || ''}
                            onChange={(e) => onUpdateData('salePrice', parseFloat(e.target.value))}
                            className="w-full bg-gray-800 border border-neon-green rounded px-3 py-2 text-sm focus:outline-none font-bold text-white"
                            placeholder="0,00"
                        />
                        <div className="pt-2">
                            <label className="text-[10px] text-gray-500 flex justify-between">
                                <span>Tamanho da Fonte</span>
                                <span>{state.config.salePriceFontSize || 120}px</span>
                            </label>
                            <input
                                type="range"
                                min="80"
                                max="200"
                                step="5"
                                value={state.config.salePriceFontSize || 120}
                                onChange={(e) => onUpdateConfig('salePriceFontSize', parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
                            />
                        </div>
                    </div>
                    {/* Novo campo manual Economy */}
                    <div className="space-y-1 col-span-2">
                        <label className="text-xs text-gray-500">Abaixo da Fipe (R$)</label>
                        <input
                            type="number"
                            value={state.data.economyPrice || ''}
                            onChange={(e) => onUpdateData('economyPrice', parseFloat(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:border-neon-green focus:outline-none"
                            placeholder="0,00"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-gray-800">
                <button
                    onClick={onDownload}
                    className="w-full bg-neon-green text-white font-bold py-4 rounded-lg hover:bg-[#b3e600] transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar Arte (png)
                </button>
            </div>
        </div>
    );
}
