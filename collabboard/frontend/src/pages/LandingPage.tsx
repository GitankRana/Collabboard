import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setGuest } = useAuthStore();

  const [guestName, setGuestName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'home' | 'guest' | 'join'>('home');

  const handleGuestSubmit = () => {
    if (!guestName.trim()) {
      toast.error('Please enter a username');
      return;
    }
    setGuest(guestName.trim());
    navigate('/dashboard');
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }
    navigate(`/board/${roomCode.trim()}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-5">
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
        <button
          onClick={() => setMode('guest')}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: 'var(--brand-primary)',
            color: 'white',
          }}
        >
          Get Started
        </button>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{
            background: 'var(--brand-light)',
            color: 'var(--brand-primary)',
          }}
        >
          ✦ Real-time collaborative whiteboard
        </div>

        <h1
          className="text-5xl font-bold mb-4 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Draw, create and
          <br />
          <span style={{ color: 'var(--brand-primary)' }}>collaborate together</span>
        </h1>

        <p
          className="text-lg mb-10 max-w-md"
          style={{ color: 'var(--text-secondary)' }}
        >
          A real-time multiplayer whiteboard. Sketch ideas, plan projects,
          and collaborate with your team — all in one place.
        </p>

        {/* ── Action Buttons / Forms ── */}
        {mode === 'home' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setMode('guest')}
              className="px-6 py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: 'var(--brand-primary)', color: 'white' }}
            >
              Start as Guest
            </button>
            <button
              onClick={() => setMode('join')}
              className="px-6 py-3 rounded-xl font-medium text-sm transition-all"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              Join a Room
            </button>
          </div>
        )}

        {mode === 'guest' && (
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <input
              autoFocus
              type="text"
              placeholder="Enter your username..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuestSubmit()}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={handleGuestSubmit}
              className="px-6 py-3 rounded-xl font-medium text-sm"
              style={{ background: 'var(--brand-primary)', color: 'white' }}
            >
              Continue as Guest →
            </button>
            <button
              onClick={() => setMode('home')}
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              ← Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <input
              autoFocus
              type="text"
              placeholder="Enter room code..."
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={handleJoinRoom}
              className="px-6 py-3 rounded-xl font-medium text-sm"
              style={{ background: 'var(--brand-primary)', color: 'white' }}
            >
              Join Room →
            </button>
            <button
              onClick={() => setMode('home')}
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* ── Feature Pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {[
            '🖊 Freehand drawing',
            '🟦 Shapes & arrows',
            '👥 Live cursors',
            '💬 Built-in chat',
            '↩ Undo / Redo',
            '🌙 Dark mode',
          ].map((f) => (
            <span
              key={f}
              className="px-3 py-1 rounded-full text-xs"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-xs" style={{ color: 'var(--text-muted)' }}>
        CollabBoard © 2024 — Built with React + Socket.IO
      </footer>
    </div>
  );
}