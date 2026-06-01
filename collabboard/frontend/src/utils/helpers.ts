import type { DrawingElement, Point } from '../types';

// Generate a short unique ID
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

// Convert screen coords to canvas coords (accounting for zoom/pan)
export function screenToCanvas(
  x: number,
  y: number,
  zoom: number,
  offsetX: number,
  offsetY: number
): Point {
  return {
    x: (x - offsetX) / zoom,
    y: (y - offsetY) / zoom,
  };
}

// Convert canvas coords to screen coords
export function canvasToScreen(
  x: number,
  y: number,
  zoom: number,
  offsetX: number,
  offsetY: number
): Point {
  return {
    x: x * zoom + offsetX,
    y: y * zoom + offsetY,
  };
}

// Check if a point is inside an element's bounding box
export function isPointInElement(
  point: Point,
  element: DrawingElement,
  threshold = 8
): boolean {
  const { x, y, width, height } = element;
  return (
    point.x >= x - threshold &&
    point.x <= x + width + threshold &&
    point.y >= y - threshold &&
    point.y <= y + height + threshold
  );
}

// Get the bounding box of multiple elements
export function getBoundingBox(elements: DrawingElement[]) {
  if (elements.length === 0) return null;

  const xs = elements.flatMap((el) => [el.x, el.x + el.width]);
  const ys = elements.flatMap((el) => [el.y, el.y + el.height]);

  return {
    x:      Math.min(...xs),
    y:      Math.min(...ys),
    width:  Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

// Clamp a number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Distance between two points
export function distance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

// Normalize angle to 0-360
export function normalizeAngle(angle: number): number {
  return ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
}