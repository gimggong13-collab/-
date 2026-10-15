import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, RotateCcw, Trash2, Check, Download, Grid, Eye } from 'lucide-react';

interface MathHandwritingCanvasProps {
  initialDrawing?: string;
  onSave: (dataUrl: string) => void;
  title?: string;
}

export const MathHandwritingCanvas: React.FC<MathHandwritingCanvasProps> = ({
  initialDrawing,
  onSave,
  title = '터치펜 수식 및 도형 필기장',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#ffffff');
  const [penWidth, setPenWidth] = useState(2.5);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [hasContent, setHasContent] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on display size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 240 * dpr;
    ctx.scale(dpr, dpr);

    // Initial background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, rect.width, 240);

    // If initial image exists, load it
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, 240);
        saveHistory();
        setHasContent(true);
      };
      img.src = initialDrawing;
    } else {
      saveHistory();
    }
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-10), current]);
    } catch {
      // ignore
    }
  };

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Capture pointer for smooth stylus tracking
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = penWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#09090b' : penColor;
    if (tool === 'eraser') {
      ctx.lineWidth = penWidth * 4;
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDrawing(false);
    saveHistory();

    // Auto-propagate to parent
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const prevImage = newHistory[newHistory.length - 1];
    if (prevImage) {
      ctx.putImageData(prevImage, 0, 0);
      setHistory(newHistory);
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, rect.width, 240);
    setHasContent(false);
    saveHistory();
    onSave('');
  };

  const handleManualSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const colorPalette = [
    { color: '#ffffff', label: '흰색' },
    { color: '#818cf8', label: '인디고' },
    { color: '#34d399', label: '에메랄드' },
    { color: '#fbbf24', label: '앰버' },
    { color: '#f87171', label: '코랄' },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-white/[0.08] space-y-3">
      {/* Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Pen className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-zinc-200">{title}</span>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            (터치펜·마우스 직접 필기)
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Pen / Eraser tool */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setTool('pen')}
              title="펜 모드"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                tool === 'pen' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Pen className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              title="지우개 모드"
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                tool === 'eraser' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color buttons */}
          {tool === 'pen' && (
            <div className="flex items-center gap-1 px-1">
              {colorPalette.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  onClick={() => setPenColor(p.color)}
                  title={p.label}
                  className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                    penColor === p.color ? 'scale-125 border-white ring-1 ring-white/50' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: p.color }}
                />
              ))}
            </div>
          )}

          {/* Thickness selection */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-white/[0.06]">
            {[
              { width: 1.5, label: '가늘게' },
              { width: 2.5, label: '보통' },
              { width: 4.5, label: '굵게' },
            ].map((th) => (
              <button
                key={th.width}
                type="button"
                onClick={() => setPenWidth(th.width)}
                className={`px-2 py-1 text-[10px] rounded transition-colors cursor-pointer ${
                  penWidth === th.width ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            title="격자 눈금 배경 켜기/끄기"
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showGrid
                ? 'bg-zinc-800 text-indigo-300 border-indigo-500/30'
                : 'bg-zinc-900 text-zinc-400 border-white/[0.06] hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            title="되돌리기 (Undo)"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.06] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            title="전체 지우기"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-white/[0.06] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Save button */}
          <button
            type="button"
            onClick={handleManualSave}
            title="수식 스케치 저장"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {savedToast ? <Check className="w-3 h-3 text-emerald-600" /> : null}
            <span>{savedToast ? '저장됨' : '반영'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Drawing Area with touch-action: none to allow stylus drawing without scroll conflict */}
      <div
        className={`relative w-full h-[240px] rounded-xl overflow-hidden border border-white/[0.1] bg-[#09090b] ${
          showGrid
            ? 'bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:16px_16px]'
            : ''
        }`}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />

        {!hasContent && !initialDrawing && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-zinc-600 font-sans">
            터치펜이나 마우스로 수식, 기하 도형, 풀이 과정을 자유롭게 필기하세요
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
        <span>🖊️ 태블릿 터치펜, 스마트폰 스타일러스 및 마우스 드래그를 지원합니다.</span>
        <span>보고서 인쇄 및 플레이 화면에 자동 반영</span>
      </div>
    </div>
  );
};
