import { useCanvasStore } from '../../store/canvasStore';

const COLORS = [
  '#1a1a2e', '#ffffff', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#8b5cf6',
  '#ec4899', '#6b7280',
];

const STROKE_WIDTHS = [1, 2, 4, 8];

export default function StylePanel() {
  const { style, setStyle } = useCanvasStore();

  return (
    <div
      className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-3 rounded-2xl toolbar"
      style={{ zIndex: 50, width: '52px' }}
    >
      {/* Stroke color */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-xs text-center"
          style={{ color: 'var(--text-muted)', fontSize: '9px' }}
        >
          COLOR
        </span>
        <div className="flex flex-col gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setStyle({ strokeColor: color })}
              className="w-7 h-7 rounded-lg mx-auto transition-all hover:scale-110"
              style={{
                background: color,
                border: style.strokeColor === color
                  ? '2px solid var(--brand-primary)'
                  : '2px solid var(--border-default)',
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ background: 'var(--border-default)' }}
      />

      {/* Stroke width */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-xs text-center"
          style={{ color: 'var(--text-muted)', fontSize: '9px' }}
        >
          SIZE
        </span>
        <div className="flex flex-col gap-1.5 items-center">
          {STROKE_WIDTHS.map((width) => (
            <button
              key={width}
              onClick={() => setStyle({ strokeWidth: width })}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: style.strokeWidth === width
                  ? 'var(--brand-light)'
                  : 'transparent',
                border: '1px solid var(--border-default)',
              }}
              title={`${width}px`}
            >
              <div
                className="rounded-full"
                style={{
                  width: `${Math.min(width * 3, 20)}px`,
                  height: `${width}px`,
                  background: 'var(--text-primary)',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}