import { useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import type { ToolType } from '../types';

export function useKeyboard() {
  const store = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isEditing = useCanvasStore.getState().editingElementId !== null;

      if (tag === 'INPUT' || tag === 'TEXTAREA' || isEditing) return;

      const toolMap: Record<string, ToolType> = {
        s: 'select',
        h: 'hand',
        p: 'pencil',
        r: 'rectangle',
        e: 'ellipse',
        l: 'line',
        a: 'arrow',
        t: 'text',
        x: 'eraser',
      };

      const key = e.key.toLowerCase();

      if (e.ctrlKey || e.metaKey) {
        switch (key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              store.redo();
            } else {
              store.undo();
            }
            break;
          case 'y':
            e.preventDefault();
            store.redo();
            break;
          case 'a':
            e.preventDefault();
            store.selectAll();
            break;
        }
        return;
      }

      if (key === 'delete' || key === 'backspace') {
        const { selectedElementIds } = useCanvasStore.getState();
        if (selectedElementIds.length > 0) {
          store.deleteElements(selectedElementIds);
        }
        return;
      }

      if (key === 'escape') {
        store.setActiveTool('select');
        return;
      }

      if (toolMap[key]) {
        store.setActiveTool(toolMap[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);
}