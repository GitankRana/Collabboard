import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app    = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin:      process.env.CLIENT_URL || 'http://localhost:5173',
    methods:     ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json({ success: true, data: room });
});

interface MemberData {
  userId:    string;
  username:  string;
  color:     string;
  socketId:  string;
  isDrawing: boolean;
  cursor:    { x: number; y: number };
}

interface RoomData {
  id:        string;
  name:      string;
  elements:  unknown[];
  members:   Map<string, MemberData>;
  createdAt: string;
}

const rooms = new Map<string, RoomData>();

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  let currentRoomId = '';
  let currentUser: MemberData | null = null;

  socket.on('room:join', ({ roomId, user }) => {
    currentRoomId = roomId;
    currentUser = {
      userId:    user.id,
      username:  user.username,
      color:     user.color,
      socketId:  socket.id,
      isDrawing: false,
      cursor:    { x: 0, y: 0 },
    };

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id:        roomId,
        name:      `Room ${roomId}`,
        elements:  [],
        members:   new Map(),
        createdAt: new Date().toISOString(),
      });
    }

    const room = rooms.get(roomId)!;
    room.members.set(user.id, currentUser);
    socket.join(roomId);

    socket.emit('room:joined', {
      roomId,
      elements: room.elements,
      members:  Array.from(room.members.values()),
    });

    socket.to(roomId).emit('room:user-joined', currentUser);
    console.log(`${user.username} joined room ${roomId}`);
  });

  socket.on('element:add', ({ roomId, element }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.elements.push(element);
    socket.to(roomId).emit('element:added', { element });
  });

  socket.on('element:update', ({ roomId, elementId, changes }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.elements = room.elements.map((el: any) =>
      el.id === elementId ? { ...el, ...changes } : el
    );
    socket.to(roomId).emit('element:updated', { elementId, changes });
  });

  socket.on('element:delete', ({ roomId, elementIds }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.elements = room.elements.filter(
      (el: any) => !elementIds.includes(el.id)
    );
    socket.to(roomId).emit('element:deleted', { elementIds });
  });

  socket.on('canvas:clear', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.elements = [];
    socket.to(roomId).emit('canvas:cleared');
  });

  socket.on('cursor:move', ({ roomId, cursor, isDrawing }) => {
    if (!currentUser) return;
    currentUser.cursor    = cursor;
    currentUser.isDrawing = isDrawing;
    socket.to(roomId).emit('cursor:moved', {
      userId:    currentUser.userId,
      username:  currentUser.username,
      color:     currentUser.color,
      cursor,
      isDrawing,
    });
  });

  socket.on('chat:message', ({ roomId, message }) => {
    io.to(roomId).emit('chat:message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
    if (currentRoomId && currentUser) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.members.delete(currentUser.userId);
        socket.to(currentRoomId).emit('room:user-left', {
          userId: currentUser.userId,
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});