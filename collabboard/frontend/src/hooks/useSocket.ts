import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import {
  connectSocket,
  disconnectSocket,
  joinRoom,
} from '../services/socket';

export function useSocket() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthStore();
  const { setConnecting } = useRoomStore();

  useEffect(() => {
    if (!roomId || !user) return;

    setConnecting(true);

    const socket = connectSocket();

    socket.on('connect', () => {
      joinRoom(roomId, user);
    });

    if (socket.connected) {
      joinRoom(roomId, user);
    }

    return () => {
      disconnectSocket();
    };
  }, [roomId, user]);
}