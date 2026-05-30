import { create } from 'zustand';
import type {
  DrawingElement,
  ToolType,
  ElementStyle,
  ViewState,
  HistoryEntry,
  Point,
  RoomMember,
} from '../types';

const DEFAULT_STYLE: ElementStyle = {
  strokeColor: '#1a1a2e',
  fillColor:   'transparent',
  strokeWidth: 2,
  strokeStyle: 'solid',
  fillStyle:   'none',
  opacity:     1,
  roughness:   1,
  fontSize:    16,
  fontFamily:  'Inter, sans-serif',
  textAlign:   'left',
};

const MAX_HISTORY = 50;

interface CanvasStore {
  // Elements on the canvas
  elements: DrawingElement[];
  selectedElementIds: string[];
  editingElementId: string | null;

  // Current tool and style
  activeTool: ToolType;
  style: ElementStyle;

  // Zoom and pan
  view: ViewState;

  // Undo/redo history
  history: HistoryEntry[];
  historyIndex: number;

  // Who is in the room
  roomMembers: RoomMember[];
  cursors: Record<string, { point: Point; isDrawing: boolean }>;

  // UI toggles
  showChat: boolean;
  isDarkMode: boolean;

  // Element actions
  addElement:     (element: DrawingElement) => void;
  updateElement:  (id: string, changes: Partial<DrawingElement>) => void;
  deleteElements: (ids: string[]) => void;
  setElements:    (elements: DrawingElement[]) => void;
  clearCanvas:    () => void;

  // Selection
  setSelectedIds: (ids: string[]) => void;
  setEditingId:   (id: string | null) => void;
  selectAll:      () => void;

  // Tool
  setActiveTool: (tool: ToolType) => void;
  setStyle:      (updates: Partial<ElementStyle>) => void;

  // View
  setView:       (view: Partial<ViewState>) => void;
  zoomIn:        () => void;
  zoomOut:       () => void;
  resetView:     () => void;

  // History
  pushHistory: () => void;
  undo:        () => void;
  redo:        () => void;
  canUndo:     () => boolean;
  canRedo:     () => boolean;

  // Presence
  setRoomMembers: (members: RoomMember[]) => void;
  updateCursor:   (userId: string, point: Point, isDrawing: boolean) => void;
  removeCursor:   (userId: string) => void;

  // UI
  toggleChat:    () => void;
  toggleDarkMode: () => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  elements:           [],
  selectedElementIds: [],
  editingElementId:   null,
  activeTool:         'select',
  style:              DEFAULT_STYLE,
  view:               { zoom: 1, offsetX: 0, offsetY: 0 },
  history:            [],
  historyIndex:       -1,
  roomMembers:        [],
  cursors:            {},
  showChat:           false,
  isDarkMode:         false,

  // ─── Elements ──────────────────────────────────────────────

  addElement: (element) => {
    set((s) => ({ elements: [...s.elements, element] }));
    get().pushHistory();
  },

  updateElement: (id, changes) => {
  set((s) => ({
    elements: s.elements.map((el) =>
      el.id === id
        ? ({ ...el, ...changes, updatedAt: Date.now(), version: el.version + 1 } as DrawingElement)
        : el
    ),
  }));
},

  deleteElements: (ids) => {
    set((s) => ({
      elements: s.elements.filter((el) => !ids.includes(el.id)),
      selectedElementIds: s.selectedElementIds.filter((id) => !ids.includes(id)),
    }));
    get().pushHistory();
  },

  setElements: (elements) => set({ elements }),

  clearCanvas: () => {
    set({ elements: [], selectedElementIds: [], editingElementId: null });
    get().pushHistory();
  },

  // ─── Selection ─────────────────────────────────────────────

  setSelectedIds: (ids) => set({ selectedElementIds: ids }),
  setEditingId:   (id)  => set({ editingElementId: id }),
  selectAll: () => {
    set((s) => ({ selectedElementIds: s.elements.map((el) => el.id) }));
  },

  // ─── Tool ──────────────────────────────────────────────────

  setActiveTool: (tool) => set({ activeTool: tool, selectedElementIds: [] }),
  setStyle: (updates) =>
    set((s) => ({ style: { ...s.style, ...updates } })),

  // ─── View ──────────────────────────────────────────────────

  setView: (updates) =>
    set((s) => ({ view: { ...s.view, ...updates } })),

  zoomIn: () => {
    const zoom = Math.min(get().view.zoom * 1.2, 20);
    set((s) => ({ view: { ...s.view, zoom } }));
  },

  zoomOut: () => {
    const zoom = Math.max(get().view.zoom / 1.2, 0.05);
    set((s) => ({ view: { ...s.view, zoom } }));
  },

  resetView: () => set({ view: { zoom: 1, offsetX: 0, offsetY: 0 } }),

  // ─── History ───────────────────────────────────────────────

  pushHistory: () => {
    const { elements, history, historyIndex } = get();
    const newEntry: HistoryEntry = {
      elements:  JSON.parse(JSON.stringify(elements)),
      timestamp: Date.now(),
    };
    const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const entry = history[historyIndex - 1];
    set({
      elements:           JSON.parse(JSON.stringify(entry.elements)),
      historyIndex:       historyIndex - 1,
      selectedElementIds: [],
    });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const entry = history[historyIndex + 1];
    set({
      elements:           JSON.parse(JSON.stringify(entry.elements)),
      historyIndex:       historyIndex + 1,
      selectedElementIds: [],
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // ─── Presence ──────────────────────────────────────────────

  setRoomMembers: (members) => set({ roomMembers: members }),

  updateCursor: (userId, point, isDrawing) =>
    set((s) => ({
      cursors: { ...s.cursors, [userId]: { point, isDrawing } },
    })),

  removeCursor: (userId) =>
    set((s) => {
      const { [userId]: _, ...rest } = s.cursors;
      return { cursors: rest };
    }),

  // ─── UI ────────────────────────────────────────────────────

  toggleChat: () => set((s) => ({ showChat: !s.showChat })),

  toggleDarkMode: () =>
    set((s) => {
      const newMode = !s.isDarkMode;
      document.documentElement.classList.toggle('dark', newMode);
      return { isDarkMode: newMode };
    }),
}));