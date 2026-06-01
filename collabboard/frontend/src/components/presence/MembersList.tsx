import { useCanvasStore } from '../../store/canvasStore';
import { useAuthStore } from '../../store/authStore';

export default function MembersList() {
  const { roomMembers, cursors } = useCanvasStore();
  const { user } = useAuthStore();

  const allMembers = [
    ...(user
      ? [{
          userId:    user.id,
          username:  user.username,
          color:     user.color,
          isOnline:  true,
          isDrawing: false,
        }]
      : []),
    ...roomMembers.filter((m) => m.userId !== user?.id),
  ];

  return (
    <div className="flex items-center gap-1">
      {allMembers.slice(0, 5).map((member) => {
        const isDrawing = cursors[member.userId]?.isDrawing || false;

        return (
          <div
            key={member.userId}
            className="relative"
            title={member.username}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{
                background:  member.color,
                outline:     isDrawing ? `2px solid ${member.color}` : '2px solid transparent',
                outlineOffset: '1px',
              }}
            >
              {member.username?.[0]?.toUpperCase()}
            </div>

            {isDrawing && (
              <div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 drawing-indicator"
                style={{
                  background:  member.color,
                  borderColor: 'var(--bg-primary)',
                }}
              />
            )}
          </div>
        );
      })}

      {allMembers.length > 5 && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
          style={{
            background: 'var(--bg-tertiary)',
            color:      'var(--text-secondary)',
          }}
        >
          +{allMembers.length - 5}
        </div>
      )}
    </div>
  );
}