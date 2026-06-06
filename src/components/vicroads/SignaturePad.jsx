import { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, Check } from 'lucide-react';

export default function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState(value ? 'preview' : 'draw'); // 'draw' | 'preview'

  useEffect(() => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      setHasDrawn(false);
    }
  }, [mode]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const onStart = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    drawing.current = true;
    setHasDrawn(true);
  };

  const onMove = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const onEnd = (e) => {
    e.preventDefault();
    drawing.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
    setMode('preview');
  };

  const handleRedo = () => {
    onChange(null);
    setMode('draw');
  };

  if (mode === 'preview' && value) {
    return (
      <div>
        <div className="w-full h-24 rounded-xl border border-gray-200 bg-[#f2f2f7] flex items-center justify-center overflow-hidden relative">
          <img src={value} alt="signature" className="h-full object-contain p-2" />
        </div>
        <button
          onClick={handleRedo}
          className="mt-2 w-full py-2 rounded-xl border border-gray-300 text-[13px] text-gray-600 font-medium"
        >
          Redraw signature
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[12px] text-gray-400 mb-2">Draw your signature below</p>
      <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-white overflow-hidden" style={{ height: 120 }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={240}
          className="w-full h-full touch-none"
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-[13px] text-gray-300 italic">Sign here</p>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 text-[13px] text-gray-600 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
        <button
          onClick={handleSave}
          disabled={!hasDrawn}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-semibold transition-all ${
            hasDrawn ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Check className="w-3.5 h-3.5" /> Save signature
        </button>
      </div>
    </div>
  );
}