import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import CursorOverlay from '../components/presence/CursorOverlay';
import MembersList from '../components/presence/MembersList';
import toast from 'react-hot-toast';
import Toolbar from '../components/toolbar/Toolbar';
import Canvas from '../components/canvas/Canvas';
import { useSocket } from '../hooks/useSocket';
import StylePanel from '../components/toolbar/StylePanel';
import ChatPanel from '../components/chat/ChatPanel';
import ZoomControls from '../components/toolbar/ZoomControls';

export default function BoardPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRoom, setCurrentRoom, isConnected } = useRoomStore();

    useSocket();


  useEffect(() => {
    if (!roomId) {
      toast.error('Invalid room');
      navigate('/dashboard');
      return;
    }

    // Set a placeholder room while we connect
    setCurrentRoom({
      id: roomId,
      name: `Room ${roomId}`,
      ownerId: user?.id || '',
      members: [],
      elements: [],
      isPublic: false,
      inviteCode: roomId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return () => {
      setCurrentRoom(null);
    };
  }, [roomId]);

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--canvas-bg)' }}
    >
      {/* ── Top Bar ── */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{
          background: 'var(--toolbar-bg)',
          borderBottom: '1px solid var(--border-default)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left — logo + room name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'var(--brand-primary)' }}
            >
              C
            </div>
          </button>

          <div
            className="w-px h-4"
            style={{ background: 'var(--border-default)' }}
          />

          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentRoom?.name || 'Loading...'}
          </span>

          {/* Connection status dot */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isConnected ? '#22c55e' : '#f59e0b',
              }}
            />
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Right — room code + user */}
        <div className="flex items-center gap-3">
          {/* Room code badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-lg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Room:
            </span>
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {roomId}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId || '');
                toast.success('Room code copied!');
              }}
              className="text-xs hover:opacity-70 transition-opacity"
              style={{ color: 'var(--brand-primary)' }}
            >
              Copy
            </button>
          </div>

          {/* User avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: user?.color || 'var(--brand-primary)' }}
          >
            {user?.username?.[0]?.toUpperCase() || 'G'}
          </div>
        </div>
      </div>

      {/* ── Canvas Area (placeholder for now) ── */}
      <div className="flex-1 relative canvas-grid">
        <Toolbar />
        <Canvas />
        <CursorOverlay />
        <ChatPanel />
        <ZoomControls />
        <StylePanel />
        <MembersList />
      </div>
    </div>
  );
}