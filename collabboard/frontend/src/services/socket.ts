import { io, Socket } from 'socket.io-client';
import { useCanvasStore } from '../store/canvasStore';
import { useRoomStore } from '../store/roomStore';
import type { DrawingElement, ChatMessage } from '../types';

let socket: Socket | null = null;

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  socket = io('http://localhost:5001', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    useRoomStore.getState().setConnected(true);
    useRoomStore.getState().setConnecting(false);
    useRoomStore.getState().setConnectionError(null);
  });

  socket.on('disconnect', () => {
    useRoomStore.getState().setConnected(false);
  });

  socket.on('connect_error', (err) => {
    useRoomStore.getState().setConnectionError(err.message);
    useRoomStore.getState().setConnecting(false);
  });

  socket.on('room:joined', ({ elements, members }) => {
    useCanvasStore.getState().setElements(elements);
    useCanvasStore.getState().setRoomMembers(members);
  });

  socket.on('room:user-joined', (member) => {
    const current = useCanvasStore.getState().roomMembers;
    useCanvasStore.getState().setRoomMembers([...current, member]);
  });

  socket.on('room:user-left', ({ userId }) => {
    const current = useCanvasStore.getState().roomMembers;
    useCanvasStore.getState().setRoomMembers(
      current.filter((m) => m.userId !== userId)
    );
    useCanvasStore.getState().removeCursor(userId);
  });

  socket.on('element:added', ({ element }: { element: DrawingElement }) => {
    useCanvasStore.getState().addElement(element);
  });

  socket.on('element:updated', ({ elementId, changes }) => {
    useCanvasStore.getState().updateElement(elementId, changes);
  });

  socket.on('element:deleted', ({ elementIds }: { elementIds: string[] }) => {
    useCanvasStore.getState().deleteElements(elementIds);
  });

  socket.on('canvas:cleared', () => {
    useCanvasStore.getState().clearCanvas();
  });

  socket.on('cursor:moved', ({ userId, cursor, isDrawing }: {
  userId: string;
  username: string;
  color: string;
  cursor: { x: number; y: number };
  isDrawing: boolean;
}) => {
  useCanvasStore.getState().updateCursor(userId, cursor, isDrawing);
});

  socket.on('chat:message', (message: ChatMessage) => {
    useRoomStore.getState().addMessage(message);
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}

export function joinRoom(roomId: string, user: object) {
  socket?.emit('room:join', { roomId, user });
}

export function emitElementAdd(roomId: string, element: DrawingElement) {
  socket?.emit('element:add', { roomId, element });
}

export function emitElementUpdate(roomId: string, elementId: string, changes: Partial<DrawingElement>) {
  socket?.emit('element:update', { roomId, elementId, changes });
}

export function emitElementDelete(roomId: string, elementIds: string[]) {
  socket?.emit('element:delete', { roomId, elementIds });
}

export function emitCursorMove(roomId: string, cursor: { x: number; y: number }, isDrawing: boolean) {
  socket?.emit('cursor:move', { roomId, cursor, isDrawing });
}

export function emitChatMessage(roomId: string, message: ChatMessage) {
  socket?.emit('chat:message', { roomId, message });
}

export function emitClearCanvas(roomId: string) {
  socket?.emit('canvas:clear', { roomId });
}