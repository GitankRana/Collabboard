import { useCanvasStore } from '../../store/canvasStore';
import ToolButton from './ToolButton';
import type { ToolType } from '../../types';

// Tool definitions
const TOOLS: {
  tool: ToolType;
  icon: string;
  label: string;
  shortcut: string;
}[] = [
  { tool: 'select',    icon: '⬚',  label: 'Select',    shortcut: 'S' },
  { tool: 'hand',      icon: '✋',  label: 'Pan',       shortcut: 'H' },
  { tool: 'pencil',    icon: '✏️',  label: 'Pencil',    shortcut: 'P' },
  { tool: 'rectangle', icon: '□',   label: 'Rectangle', shortcut: 'R' },
  { tool: 'ellipse',   icon: '○',   label: 'Ellipse',   shortcut: 'E' },
  { tool: 'line',      icon: '╱',   label: 'Line',      shortcut: 'L' },
  { tool: 'arrow',     icon: '→',   label: 'Arrow',     shortcut: 'A' },
  { tool: 'text',      icon: 'T',   label: 'Text',      shortcut: 'T' },
  { tool: 'eraser',    icon: '⌫',   label: 'Eraser',    shortcut: 'X' },
  { tool: 'sticky', icon: '📝', label: 'Sticky Note', shortcut: 'N' },
];

export default function Toolbar() {
  const { activeTool, setActiveTool, toggleDarkMode, isDarkMode } = useCanvasStore();

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-2xl toolbar"
      style={{ zIndex: 50 }}
    >
      {/* Drawing tools */}
      {TOOLS.map(({ tool, icon, label, shortcut }, index) => (
        <>
          {/* Divider between select/hand and drawing tools */}
          {index === 2 && (
            <div key="divider-1" className="toolbar-divider" />
          )}
          {/* Divider before eraser */}
          {index === TOOLS.length - 1 && (
            <div key="divider-2" className="toolbar-divider" />
          )}
          <ToolButton
            key={tool}
            tool={tool}
            activeTool={activeTool}
            onClick={() => setActiveTool(tool)}
            icon={icon}
            label={label}
            shortcut={shortcut}
          />
        </>
      ))}

      {/* Divider */}
      <div className="toolbar-divider" />

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="toolbar-btn"
        title={isDarkMode ? 'Light mode' : 'Dark mode'}
      >
        <span className="text-base">
          {isDarkMode ? '☀️' : '🌙'}
        </span>
      </button>
    </div>
  );
}