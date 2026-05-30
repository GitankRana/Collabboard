// ─── User ─────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  color: string;
  isGuest: boolean;
  createdAt: string;
}

// ─── Tools ────────────────────────────────────────────────────────

export type ToolType =
  | 'select'
  | 'pencil'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'text'
  | 'eraser'
  | 'sticky'
  | 'image'
  | 'hand';

// ─── Element Styles ───────────────────────────────────────────────

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export type FillStyle   = 'none'  | 'solid'  | 'hatch';

export interface ElementStyle {
  strokeColor: string;
  fillColor:   string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  fillStyle:   FillStyle;
  opacity:     number;
  roughness:   number;
  fontSize?:   number;
  fontFamily?: string;
  textAlign?:  'left' | 'center' | 'right';
}

// ─── Points ───────────────────────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}

// ─── Base Element ─────────────────────────────────────────────────

export interface BaseElement {
  id:        string;
  type:      ToolType;
  x:         number;
  y:         number;
  width:     number;
  height:    number;
  angle:     number;
  style:     ElementStyle;
  userId:    string;
  createdAt: number;
  updatedAt: number;
  locked:    boolean;
  version:   number;
}

// ─── Drawing Elements ─────────────────────────────────────────────

export interface PencilElement extends BaseElement {
  type:   'pencil';
  points: number[][];
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle';
}

export interface EllipseElement extends BaseElement {
  type: 'ellipse';
}

export interface LineElement extends BaseElement {
  type:       'line';
  points:     Point[];
  startArrow: boolean;
  endArrow:   boolean;
}

export interface ArrowElement extends BaseElement {
  type:   'arrow';
  points: Point[];
}

export interface TextElement extends BaseElement {
  type:      'text';
  text:      string;
  isEditing: boolean;
}

export interface StickyElement extends BaseElement {
  type:  'sticky';
  text:  string;
  color: string;
}

export interface ImageElement extends BaseElement {
  type:          'image';
  url:           string;
  naturalWidth:  number;
  naturalHeight: number;
}

export type DrawingElement =
  | PencilElement
  | RectangleElement
  | EllipseElement
  | LineElement
  | ArrowElement
  | TextElement
  | StickyElement
  | ImageElement;

// ─── Room ─────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'editor' | 'viewer';

export interface RoomMember {
  userId:    string;
  username:  string;
  avatar:    string;
  color:     string;
  role:      UserRole;
  joinedAt:  string;
  isOnline:  boolean;
  cursor?:   Point;
  isDrawing: boolean;
}

export interface Room {
  id:          string;
  name:        string;
  description?: string;
  ownerId:     string;
  members:     RoomMember[];
  elements:    DrawingElement[];
  isPublic:    boolean;
  inviteCode:  string;
  createdAt:   string;
  updatedAt:   string;
}

// ─── Socket Events ────────────────────────────────────────────────

export interface CursorUpdate {
  userId:    string;
  roomId:    string;
  cursor:    Point;
  isDrawing: boolean;
}

export interface ElementAdd {
  roomId:  string;
  element: DrawingElement;
}

export interface ElementUpdate {
  roomId:    string;
  elementId: string;
  changes:   Partial<DrawingElement>;
  version:   number;
}

export interface ElementDelete {
  roomId:     string;
  elementIds: string[];
}

// ─── Chat ─────────────────────────────────────────────────────────

export interface ChatMessage {
  id:        string;
  roomId:    string;
  userId:    string;
  username:  string;
  avatar:    string;
  color:     string;
  text:      string;
  timestamp: string;
  type:      'message' | 'system';
}

// ─── API ──────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?:   T;
  error?:  string;
  message?: string;
}

// ─── Canvas View ──────────────────────────────────────────────────

export interface ViewState {
  zoom:    number;
  offsetX: number;
  offsetY: number;
}

export interface HistoryEntry {
  elements:  DrawingElement[];
  timestamp: number;
}