
import React, { useRef } from 'react';
import { useKarCard } from './hooks/useKarCard';
import { CanvasEditor, type CanvasEditorRef } from './components/CanvasEditor';
import { ControlPanel } from './components/ControlPanel';

function App() {
  const canvasRef = useRef<CanvasEditorRef>(null);
  const {
    image,
    setImage, // Precisamos expor o setImage no hook se não estiver (está!)
    data,
    updateData,
    config,
    updateConfig,
    discountPercentage
  } = useKarCard();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    }
  };

  const handleDownload = () => {
    canvasRef.current?.downloadImage();
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Sidebar de Controles */}
      <aside className="w-[400px] shrink-0 h-full border-r border-gray-800 bg-gray-900 z-10 shadow-xl">
        <ControlPanel
          state={{ image, data, config }}
          onUpdateData={updateData}
          onUpdateConfig={updateConfig}
          onImageUpload={handleImageUpload}
          onDownload={handleDownload}
        />
      </aside>

      {/* Área de Visualização */}
      <main className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative">
        {/* Grid Background para dar um toque técnico */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>

        <div className="z-10 flex flex-col items-center gap-4">
          <CanvasEditor
            ref={canvasRef}
            state={{ image, data, config }}
            discountPercentage={discountPercentage}
          />
          <p className="text-gray-500 text-sm">Preview • 1080x1920 (9:16)</p>
        </div>
      </main>
    </div>
  );
}

export default App;
