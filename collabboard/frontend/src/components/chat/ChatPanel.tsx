import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useRoomStore } from '../../store/roomStore';
import { useCanvasStore } from '../../store/canvasStore';
import { emitChatMessage } from '../../services/socket';
import type { ChatMessage } from '../../types';

export default function ChatPanel() {
  const { user }                    = useAuthStore();
  const { messages, currentRoom }   = useRoomStore();
  const { showChat, toggleChat }    = useCanvasStore();
  const [text, setText]             = useState('');
  const bottomRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !user || !currentRoom) return;

    const message: ChatMessage = {
      id:        Math.random().toString(36).slice(2, 9),
      roomId:    currentRoom.id,
      userId:    user.id,
      username:  user.username,
      avatar:    user.avatar,
      color:     user.color,
      text:      text.trim(),
      timestamp: new Date().toISOString(),
      type:      'message',
    };

    emitChatMessage(currentRoom.id, message);
    setText('');
  };

  if (!showChat) {
    return (
      <button
        onClick={toggleChat}
        className="absolute bottom-6 right-6 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{
          background: 'var(--brand-primary)',
          color:      'white',
          zIndex:     50,
        }}
        title="Open chat"
      >
        💬
      </button>
    );
  }

  return (
    <div
      className="absolute bottom-6 right-6 flex flex-col rounded-2xl overflow-hidden toolbar"
      style={{
        width:  '300px',
        height: '400px',
        zIndex: 50,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <span
          className="font-semibold text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          Chat
        </span>
        <button
          onClick={toggleChat}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all hover:opacity-70"
          style={{
            background: 'var(--bg-tertiary)',
            color:      'var(--text-secondary)',
          }}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p
              className="text-xs text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              No messages yet.
              <br />
              Say hello! 👋
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.userId === user?.id}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div
        className="p-3 border-t flex gap-2"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
          style={{
            background: 'var(--bg-secondary)',
            border:     '1px solid var(--border-default)',
            color:      'var(--text-primary)',
          }}
        />
        <button
          onClick={sendMessage}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
          style={{
            background: 'var(--brand-primary)',
            color:      'white',
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: ChatMessage;
  isOwn:   boolean;
}) {
  return (
    <div className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      {!isOwn && (
        <span
          className="text-xs font-medium px-1"
          style={{ color: message.color }}
        >
          {message.username}
        </span>
      )}
      <div
        className="px-3 py-2 rounded-2xl text-sm max-w-[220px] break-words"
        style={
          isOwn
            ? { background: 'var(--brand-primary)', color: 'white' }
            : { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }
        }
      >
        {message.text}
      </div>
      <span
        className="text-xs px-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour:   '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  );
}