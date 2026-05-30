import { create } from 'zustand';
import type { Room, ChatMessage } from '../types';


interface RoomStore {
  currentRoom:     Room | null;
  rooms:           Room[];
  messages:        ChatMessage[];
  isConnected:     boolean;
  isConnecting:    boolean;
  connectionError: string | null;

  setCurrentRoom:     (room: Room | null) => void;
  setRooms:           (rooms: Room[]) => void;
  addRoom:            (room: Room) => void;
  addMessage:         (message: ChatMessage) => void;
  setMessages:        (messages: ChatMessage[]) => void;
  setConnected:       (connected: boolean) => void;
  setConnecting:      (connecting: boolean) => void;
  setConnectionError: (error: string | null) => void;
  clearRoom:          () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom:     null,
  rooms:           [],
  messages:        [],
  isConnected:     false,
  isConnecting:    false,
  connectionError: null,

  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRooms:       (rooms) => set({ rooms }),
  addRoom:        (room) => set((s) => ({ rooms: [room, ...s.rooms] })),
  addMessage:     (message) => set((s) => ({ messages: [...s.messages, message] })),
  setMessages:    (messages) => set({ messages }),
  setConnected:   (isConnected) => set({ isConnected }),
  setConnecting:  (isConnecting) => set({ isConnecting }),
  setConnectionError: (connectionError) => set({ connectionError }),

  clearRoom: () =>
    set({
      currentRoom:     null,
      messages:        [],
      isConnected:     false,
      isConnecting:    false,
      connectionError: null,
    }),
}));