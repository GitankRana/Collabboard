import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import toast from 'react-hot-toast';
import type { Room } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { rooms, addRoom } = useRoomStore();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Create a new room with a random ID
  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    const roomId = Math.random().toString(36).slice(2, 9).toUpperCase();

    const newRoom: Room = {
      id: roomId,
      name: roomName.trim(),
      ownerId: user?.id || '',
      members: [],
      elements: [],
      isPublic: false,
      inviteCode: roomId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addRoom(newRoom);
    toast.success('Room created!');
    navigate(`/board/${roomId}`);
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }
    navigate(`/board/${joinCode.trim().toUpperCase()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ── Navbar ── */}
      <nav
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: 'var(--border-default)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'var(--brand-primary)' }}
          >
            C
          </div>
          <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            CollabBoard
          </span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Avatar circle */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ background: user?.color || 'var(--brand-primary)' }}
            >
              {user?.username?.[0]?.toUpperCase() || 'G'}
            </div>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {user?.username || 'Guest'}
            </span>
            {user?.isGuest && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-muted)',
                }}
              >
                Guest
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Your Boards
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Create a new board or join an existing one
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => { setShowJoin(true); setShowCreate(false); }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              Join Room
            </button>
            <button
              onClick={() => { setShowCreate(true); setShowJoin(false); }}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--brand-primary)', color: 'white' }}
            >
              + New Board
            </button>
          </div>
        </div>

        {/* ── Create Room Form ── */}
        {showCreate && (
          <div
            className="p-5 rounded-2xl mb-6"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <h2
              className="font-semibold mb-3 text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              Create New Board
            </h2>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Board name..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
                className="flex-1 px-4 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'var(--brand-primary)', color: 'white' }}
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Join Room Form ── */}
        {showJoin && (
          <div
            className="p-5 rounded-2xl mb-6"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            <h2
              className="font-semibold mb-3 text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              Join a Board
            </h2>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Enter room code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                className="flex-1 px-4 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={handleJoinRoom}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'var(--brand-primary)', color: 'white' }}
              >
                Join
              </button>
              <button
                onClick={() => setShowJoin(false)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Room Cards Grid ── */}
        {rooms.length === 0 ? (
          // Empty state
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{
              border: '2px dashed var(--border-default)',
            }}
          >
            <div className="text-4xl mb-3">🎨</div>
            <p
              className="font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              No boards yet
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Create your first board to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => navigate(`/board/${room.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Room Card Component ──────────────────────────────────────────
function RoomCard({ room, onClick }: { room: Room; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-5 rounded-2xl transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Preview area */}
      <div
        className="w-full h-28 rounded-xl mb-4 flex items-center justify-center"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <span className="text-3xl">🎨</span>
      </div>

      {/* Room info */}
      <p
        className="font-semibold text-sm mb-1 truncate"
        style={{ color: 'var(--text-primary)' }}
      >
        {room.name}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          #{room.id}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date(room.createdAt).toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}