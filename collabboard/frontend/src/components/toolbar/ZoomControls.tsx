import { useCanvasStore } from '../../store/canvasStore';

export default function ZoomControls() {
  const { view, zoomIn, zoomOut, resetView } = useCanvasStore();

  const zoomPercent = Math.round(view.zoom * 100);

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-xl toolbar"
      style={{ zIndex: 50 }}
    >
      {/* Zoom out */}
      <button
        onClick={zoomOut}
        className="toolbar-btn"
        title="Zoom out"
      >
        <span className="text-base">−</span>
      </button>

      {/* Zoom level — click to reset */}
      <button
        onClick={resetView}
        className="px-2 py-1 rounded-lg text-xs font-mono font-medium min-w-[52px] text-center transition-all hover:opacity-70"
        style={{ color: 'var(--text-primary)' }}
        title="Reset zoom"
      >
        {zoomPercent}%
      </button>

      {/* Zoom in */}
      <button
        onClick={zoomIn}
        className="toolbar-btn"
        title="Zoom in"
      >
        <span className="text-base">+</span>
      </button>
    </div>
  );
}