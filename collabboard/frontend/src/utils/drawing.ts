import type {
  DrawingElement,
  PencilElement,
  RectangleElement,
  EllipseElement,
  LineElement,
  ArrowElement,
  TextElement,
} from '../types';

// Draw a single element onto a canvas context
export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: DrawingElement
) {
  ctx.save();

  // Apply element styles
  ctx.globalAlpha   = element.style.opacity;
  ctx.strokeStyle   = element.style.strokeColor;
  ctx.lineWidth     = element.style.strokeWidth;
  ctx.fillStyle     = element.style.fillColor === 'transparent'
    ? 'rgba(0,0,0,0)'
    : element.style.fillColor;

  // Apply stroke style
  if (element.style.strokeStyle === 'dashed') {
    ctx.setLineDash([8, 4]);
  } else if (element.style.strokeStyle === 'dotted') {
    ctx.setLineDash([2, 4]);
  } else {
    ctx.setLineDash([]);
  }

  ctx.lineCap  = 'round';
  ctx.lineJoin = 'round';

  // Apply rotation if needed
  if (element.angle !== 0) {
    const cx = element.x + element.width  / 2;
    const cy = element.y + element.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate(element.angle);
    ctx.translate(-cx, -cy);
  }

  switch (element.type) {
    case 'pencil':    drawPencil(ctx,    element); break;
    case 'rectangle': drawRectangle(ctx, element); break;
    case 'ellipse':   drawEllipse(ctx,   element); break;
    case 'line':      drawLine(ctx,      element); break;
    case 'arrow':     drawArrow(ctx,     element); break;
    case 'text':      drawText(ctx,      element); break;
    case 'sticky':    drawSticky(ctx,    element as import('../types').StickyElement); break;
    
  }

  ctx.restore();
}

// ── Pencil ────────────────────────────────────────────────────────
function drawPencil(ctx: CanvasRenderingContext2D, el: PencilElement) {
  if (el.points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(el.points[0][0], el.points[0][1]);

  for (let i = 1; i < el.points.length - 1; i++) {
    // Smooth curve through points
    const mx = (el.points[i][0] + el.points[i + 1][0]) / 2;
    const my = (el.points[i][1] + el.points[i + 1][1]) / 2;
    ctx.quadraticCurveTo(el.points[i][0], el.points[i][1], mx, my);
  }

  const last = el.points[el.points.length - 1];
  ctx.lineTo(last[0], last[1]);
  ctx.stroke();
}

// ── Rectangle ─────────────────────────────────────────────────────
function drawRectangle(ctx: CanvasRenderingContext2D, el: RectangleElement) {
  const { x, y, width, height } = el;

  if (el.style.fillColor !== 'transparent') {
    ctx.fillRect(x, y, width, height);
  }
  ctx.strokeRect(x, y, width, height);
}

// ── Ellipse ───────────────────────────────────────────────────────
function drawEllipse(ctx: CanvasRenderingContext2D, el: EllipseElement) {
  const cx = el.x + el.width  / 2;
  const cy = el.y + el.height / 2;
  const rx = Math.abs(el.width  / 2);
  const ry = Math.abs(el.height / 2);

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);

  if (el.style.fillColor !== 'transparent') ctx.fill();
  ctx.stroke();
}

// ── Line ──────────────────────────────────────────────────────────
function drawLine(ctx: CanvasRenderingContext2D, el: LineElement) {
  if (el.points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(el.points[0].x, el.points[0].y);
  ctx.lineTo(el.points[1].x, el.points[1].y);
  ctx.stroke();
}

// ── Arrow ─────────────────────────────────────────────────────────
function drawArrow(ctx: CanvasRenderingContext2D, el: ArrowElement) {
  if (el.points.length < 2) return;

  const start = el.points[0];
  const end   = el.points[1];

  // Draw line
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  // Draw arrowhead
  const angle  = Math.atan2(end.y - start.y, end.x - start.x);
  const size   = Math.max(el.style.strokeWidth * 4, 12);

  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - size * Math.cos(angle - Math.PI / 6),
    end.y - size * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(
    end.x - size * Math.cos(angle + Math.PI / 6),
    end.y - size * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

// ── Text ──────────────────────────────────────────────────────────
function drawText(ctx: CanvasRenderingContext2D, el: TextElement) {
  if (!el.text) return;

  const fontSize   = el.style.fontSize   || 16;
  const fontFamily = el.style.fontFamily || 'Inter, sans-serif';

  ctx.font      = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = el.style.strokeColor;
  ctx.textAlign = el.style.textAlign || 'left';

  const lines = el.text.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, el.x, el.y + fontSize + i * fontSize * 1.4);
  });
}
export function drawSticky(
  ctx: CanvasRenderingContext2D,
  el: import('../types').StickyElement
) {
  const { x, y, width, height, text, color } = el;
  const w = width  || 200;
  const h = height || 150;

  ctx.save();

  ctx.fillStyle   = color || '#fef08a';
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur  = 8;
  ctx.shadowOffsetY = 3;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  ctx.fillStyle  = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, 28, [8, 8, 0, 0]);
  ctx.fill();

  if (text) {
    ctx.fillStyle  = '#1a1a2e';
    ctx.font       = `14px Inter, sans-serif`;
    ctx.textAlign  = 'left';

    const lines    = text.split('\n');
    const maxWidth = w - 20;

    let currentY = y + 48;
    for (const line of lines) {
      const words    = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine  = currentLine + word + ' ';
        const metrics   = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
          ctx.fillText(currentLine, x + 10, currentY);
          currentLine = word + ' ';
          currentY   += 20;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, x + 10, currentY);
      currentY += 20;
    }
  }

  ctx.restore();
}

// ── Selection highlight ───────────────────────────────────────────
export function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.save();
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth   = 1.5;
  ctx.setLineDash([5, 3]);
  ctx.strokeRect(x - 4, y - 4, width + 8, height + 8);

  // Corner handles
  const handles = [
    [x - 4,         y - 4],
    [x + width + 4, y - 4],
    [x - 4,         y + height + 4],
    [x + width + 4, y + height + 4],
  ];

  ctx.setLineDash([]);
  ctx.fillStyle   = 'white';
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth   = 1.5;

  handles.forEach(([hx, hy]) => {
    ctx.beginPath();
    ctx.rect(hx - 4, hy - 4, 8, 8);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
  
}