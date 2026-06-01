import type { ToolType } from '../../types';

interface ToolButtonProps {
  tool: ToolType;
  activeTool: ToolType;
  onClick: () => void;
  icon: string;
  label: string;
  shortcut?: string;
}

export default function ToolButton({
  tool,
  activeTool,
  onClick,
  icon,
  label,
  shortcut,
}: ToolButtonProps) {
  const isActive = tool === activeTool;

  return (
    <button
      onClick={onClick}
      data-tip={shortcut ? `${label} (${shortcut})` : label}
      className={`toolbar-btn ${isActive ? 'active' : ''}`}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      <span className="text-base leading-none">{icon}</span>
    </button>
  );
}