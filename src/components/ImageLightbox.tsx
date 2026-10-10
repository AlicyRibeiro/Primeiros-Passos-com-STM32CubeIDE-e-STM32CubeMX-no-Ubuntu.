import React, { useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageLightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt, onClose }) => {
  const [scale, setScale] = React.useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls header */}
        <div className="w-full flex items-center justify-between pb-3 text-white/90">
          <p className="text-sm font-medium truncate max-w-md text-slate-300">
            {alt || "Imagem da documentação"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.25, 3))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {scale !== 1 && (
              <button
                onClick={() => setScale(1)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Redefinir zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image wrapper */}
        <div className="overflow-auto max-h-[80vh] flex items-center justify-center rounded-xl bg-slate-950/60 p-2 border border-white/10">
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            style={{ transform: `scale(${scale})`, transition: "transform 0.15s ease-out" }}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {alt && (
          <p className="mt-3 text-xs text-slate-400 text-center max-w-lg">
            {alt}
          </p>
        )}
      </div>
    </div>
  );
};
