import { useCanvasStore } from '../../store/canvasStore';
import { useAuthStore } from '../../store/authStore';

export default function CursorOverlay() {
  const { cursors, roomMembers, view } = useCanvasStore();
  const { user } = useAuthStore();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 40 }}>
      {Object.entries(cursors).map(([userId, { point, isDrawing }]) => {
        if (userId === user?.id) return null;

        const member = roomMembers.find((m) => m.userId === userId);
        const color  = member?.color || '#6366f1';
        const name   = member?.username || 'User';

        const screenX = point.x * view.zoom + view.offsetX;
        const screenY = point.y * view.zoom + view.offsetY;

        return (
          <div
            key={userId}
            className="presence-cursor"
            style={{ left: screenX, top: screenY }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M0 0L0 11L3.5 8.5L5.5 13L7 12.5L5 7.5L9 7.5L0 0Z"
                fill={color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>

            <div
              className="cursor-label"
              style={{ background: color, color: 'white' }}
            >
              {isDrawing ? `${name} drawing...` : name}
            </div>
          </div>
        );
      })}
    </div>
  );
}