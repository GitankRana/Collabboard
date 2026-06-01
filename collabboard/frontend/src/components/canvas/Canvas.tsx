import { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useRoomStore } from '../../store/roomStore';
import { drawElement, drawSelectionBox } from '../../utils/drawing';
import { screenToCanvas, generateId, isPointInElement } from '../../utils/helpers';
import { useKeyboard } from '../../hooks/useKeyboard';
import { emitElementAdd, emitCursorMove, emitElementDelete } from '../../services/socket';
import type {
  DrawingElement,
  Point,
  PencilElement,
  RectangleElement,
  EllipseElement,
  LineElement,
  ArrowElement,
  TextElement,
  StickyElement,
} from '../../types';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useKeyboard();

  const {
    elements,
    activeTool,
    style,
    view,
    selectedElementIds,
    setSelectedIds,
    addElement,
    setView,
    editingElementId,
  } = useCanvasStore();

  const { currentRoom } = useRoomStore();
  const roomId = currentRoom?.id || '';

  const [isDrawing, setIsDrawing]           = useState(false);
  const [startPoint, setStartPoint]         = useState<Point | null>(null);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

  const isPanning = useRef(false);
  const lastPan   = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(view.offsetX, view.offsetY);
    ctx.scale(view.zoom, view.zoom);

    elements.forEach((el) => {
      if (el.id === editingElementId) return;
      drawElement(ctx, el);
    });

    if (currentElement) drawElement(ctx, currentElement);

    selectedElementIds.forEach((id) => {
      const el = elements.find((e) => e.id === id);
      if (el) drawSelectionBox(ctx, el.x, el.y, el.width, el.height);
    });

    ctx.restore();
  }, [elements, currentElement, view, selectedElementIds, editingElementId]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPoint = useCallback((e: React.MouseEvent): Point => {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    return screenToCanvas(
      e.clientX - rect.left,
      e.clientY - rect.top,
      view.zoom,
      view.offsetX,
      view.offsetY
    );
  }, [view]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (editingElementId !== null) return;

    const point = getPoint(e);

    if (activeTool === 'hand' || e.button === 1) {
      isPanning.current = true;
      lastPan.current   = { x: e.clientX, y: e.clientY };
      return;
    }

    if (activeTool === 'select') {
      const clicked = [...elements].reverse().find((el) =>
        isPointInElement(point, el)
      );
      setSelectedIds(clicked ? [clicked.id] : []);
      return;
    }

    if (activeTool === 'eraser') {
      const clicked = [...elements].reverse().find((el) =>
        isPointInElement(point, el)
      );
      if (clicked) {
        useCanvasStore.getState().deleteElements([clicked.id]);
        emitElementDelete(roomId, [clicked.id]);
      }
      return;
    }

    setIsDrawing(true);
    setStartPoint(point);

    const base = {
      id:        generateId(),
      x:         point.x,
      y:         point.y,
      width:     0,
      height:    0,
      angle:     0,
      style:     { ...style },
      userId:    'local',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      locked:    false,
      version:   1,
    };

    switch (activeTool) {
      case 'pencil':
        setCurrentElement({
          ...base,
          type:   'pencil',
          points: [[point.x, point.y, 0.5]],
        } as PencilElement);
        break;

      case 'text': {
        const textEl = {
          ...base,
          type:      'text',
          text:      '',
          isEditing: true,
        } as TextElement;
        addElement(textEl);
        emitElementAdd(roomId, textEl);
        setTimeout(() => {
          useCanvasStore.getState().setEditingId(textEl.id);
        }, 10);
        setIsDrawing(false);
        return;
      }

      case 'sticky': {
        const stickyEl = {
          ...base,
          type:   'sticky',
          text:   '',
          color:  '#fef08a',
          width:  200,
          height: 150,
        } as StickyElement;
        addElement(stickyEl);
        emitElementAdd(roomId, stickyEl);
        setTimeout(() => {
          useCanvasStore.getState().setEditingId(stickyEl.id);
        }, 10);
        setIsDrawing(false);
        return;
      }

      case 'rectangle':
        setCurrentElement({ ...base, type: 'rectangle' } as RectangleElement);
        break;

      case 'ellipse':
        setCurrentElement({ ...base, type: 'ellipse' } as EllipseElement);
        break;

      case 'line':
        setCurrentElement({
          ...base,
          type:       'line',
          points:     [point, point],
          startArrow: false,
          endArrow:   false,
        } as LineElement);
        break;

      case 'arrow':
        setCurrentElement({
          ...base,
          type:   'arrow',
          points: [point, point],
        } as ArrowElement);
        break;
    }
  }, [activeTool, elements, style, getPoint, roomId, editingElementId]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning.current) {
      const dx        = e.clientX - lastPan.current.x;
      const dy        = e.clientY - lastPan.current.y;
      lastPan.current = { x: e.clientX, y: e.clientY };
      setView({ offsetX: view.offsetX + dx, offsetY: view.offsetY + dy });
      return;
    }

    const point = getPoint(e);
    emitCursorMove(roomId, point, isDrawing);

    if (!isDrawing || !currentElement || !startPoint) return;

    switch (currentElement.type) {
      case 'pencil': {
        const el = currentElement as PencilElement;
        setCurrentElement({
          ...el,
          points: [...el.points, [point.x, point.y, 0.5]],
          width:  point.x - el.x,
          height: point.y - el.y,
        });
        break;
      }
      case 'rectangle':
      case 'ellipse': {
        const x = Math.min(startPoint.x, point.x);
        const y = Math.min(startPoint.y, point.y);
        setCurrentElement({
          ...currentElement,
          x,
          y,
          width:  Math.abs(point.x - startPoint.x),
          height: Math.abs(point.y - startPoint.y),
        });
        break;
      }
      case 'line':
      case 'arrow': {
        const el = currentElement as LineElement | ArrowElement;
        setCurrentElement({
          ...el,
          points: [el.points[0], point],
          width:  point.x - startPoint.x,
          height: point.y - startPoint.y,
        });
        break;
      }
    }
  }, [isDrawing, currentElement, startPoint, view, getPoint, roomId]);

  const handleMouseUp = useCallback(() => {
    if (isPanning.current) {
      isPanning.current = false;
      return;
    }

    if (!isDrawing || !currentElement) {
      setIsDrawing(false);
      return;
    }

    const hasSize =
      currentElement.type === 'pencil'
        ? (currentElement as PencilElement).points.length > 2
        : currentElement.width > 2 || currentElement.height > 2;

    if (hasSize) {
      addElement(currentElement);
      emitElementAdd(roomId, currentElement);
    }

    setIsDrawing(false);
    setCurrentElement(null);
    setStartPoint(null);
  }, [isDrawing, currentElement, addElement, roomId]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta      = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom    = Math.min(Math.max(view.zoom * delta, 0.05), 20);
      const canvas     = canvasRef.current!;
      const rect       = canvas.getBoundingClientRect();
      const mouseX     = e.clientX - rect.left;
      const mouseY     = e.clientY - rect.top;
      const newOffsetX = mouseX - (mouseX - view.offsetX) * (newZoom / view.zoom);
      const newOffsetY = mouseY - (mouseY - view.offsetY) * (newZoom / view.zoom);
      setView({ zoom: newZoom, offsetX: newOffsetX, offsetY: newOffsetY });
    } else {
      setView({
        offsetX: view.offsetX - e.deltaX,
        offsetY: view.offsetY - e.deltaY,
      });
    }
  }, [view]);

  const getCursor = () => {
    if (editingElementId)        return 'default';
    if (activeTool === 'hand')   return 'grab';
    if (activeTool === 'eraser') return 'cell';
    if (activeTool === 'text')   return 'text';
    if (activeTool === 'select') return 'default';
    return 'crosshair';
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: getCursor() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      {editingElementId && <TextEditor />}
    </>
  );
}

function TextEditor() {
  const {
    elements,
    editingElementId,
    setEditingId,
    updateElement,
    view,
  } = useCanvasStore();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const element = elements.find(
    (el) => el.id === editingElementId
  ) as TextElement | StickyElement | undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [editingElementId]);

  if (!element) return null;
  if (element.type !== 'text' && element.type !== 'sticky') return null;

  const screenX  = element.x * view.zoom + view.offsetX;
  const screenY  = element.y * view.zoom + view.offsetY;
  const isSticky = element.type === 'sticky';
  const bgColor  = isSticky ? (element as StickyElement).color : 'rgba(99,102,241,0.05)';
  const topPad   = isSticky ? 32 : 0;
  const w        = isSticky ? (element.width  || 200) * view.zoom : undefined;
  const h        = isSticky ? (element.height || 150) * view.zoom : undefined;

  const handleBlur = () => {
    if (!element.text.trim()) {
      useCanvasStore.getState().deleteElements([element.id]);
    }
    setEditingId(null);
  };

  return (
    <textarea
      ref={inputRef}
      value={element.text}
      onChange={(e) => updateElement(element.id, { text: e.target.value })}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Escape') handleBlur();
      }}
      style={{
        position:     'absolute',
        left:         screenX,
        top:          screenY + topPad,
        width:        w,
        height:       h ? h - topPad : undefined,
        fontSize:     (element.style.fontSize || 14) * view.zoom,
        fontFamily:   'Inter, sans-serif',
        color:        isSticky ? '#1a1a2e' : element.style.strokeColor,
        minWidth:     '150px',
        minHeight:    '40px',
        zIndex:       300,
        lineHeight:   '1.4',
        border:       isSticky ? 'none' : '1px dashed #6366f1',
        borderRadius: isSticky ? '0 0 8px 8px' : '4px',
        padding:      '8px',
        background:   bgColor,
        outline:      'none',
        resize:       'none',
      }}
    />
  );
}