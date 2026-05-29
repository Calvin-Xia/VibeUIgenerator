'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useVibeStore, useActions } from '@/lib/store/vibeStore';
import { SliderRow } from './SliderRow';

interface ControlPoint {
  x: number;
  y: number;
}

const PRESETS: { name: string; value: string }[] = [
  { name: 'Linear', value: 'linear' },
  { name: 'Ease', value: 'ease' },
  { name: 'Ease In', value: 'ease-in' },
  { name: 'Ease Out', value: 'ease-out' },
  { name: 'Ease In Out', value: 'ease-in-out' }
];

function parseEasing(easing: string): [ControlPoint, ControlPoint] {
  const match = easing.match(/cubic-bezier\(([^)]+)\)/);
  if (match) {
    const values = match[1].split(',').map(Number);
    return [
      { x: values[0], y: values[1] },
      { x: values[2], y: values[3] }
    ];
  }
  return [
    { x: 0, y: 0 },
    { x: 0.58, y: 1 }
  ];
}

function formatEasing(p1: ControlPoint, p2: ControlPoint): string {
  return `cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})`;
}

export function AnimationEditor() {
  const tokens = useVibeStore(state => state.tokens);
  const actions = useActions();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [controlPoints, setControlPoints] = useState<[ControlPoint, ControlPoint]>(() => {
    const [p1, p2] = parseEasing(tokens.interaction.transition.easing);
    return [p1, p2];
  });
  const [dragging, setDragging] = useState<number | null>(null);

  const updateEasing = useCallback((newP1: ControlPoint, newP2: ControlPoint) => {
    setControlPoints([newP1, newP2]);
    actions.setToken('interaction.transition.easing', formatEasing(newP1, newP2));
  }, [actions]);

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.bezierCurveTo(
      padding + controlPoints[0].x * (width - 2 * padding),
      height - padding - controlPoints[0].y * (height - 2 * padding),
      padding + controlPoints[1].x * (width - 2 * padding),
      height - padding - controlPoints[1].y * (height - 2 * padding),
      width - padding,
      padding
    );
    ctx.stroke();

    ctx.fillStyle = '#6366f1';
    [
      { x: padding + controlPoints[0].x * (width - 2 * padding), y: height - padding - controlPoints[0].y * (height - 2 * padding) },
      { x: padding + controlPoints[1].x * (width - 2 * padding), y: height - padding - controlPoints[1].y * (height - 2 * padding) }
    ].forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [controlPoints]);

  useEffect(() => {
    drawCurve();
  }, [drawCurve]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 20;
    const width = canvas.width;
    const height = canvas.height;

    const points = [
      { x: padding + controlPoints[0].x * (width - 2 * padding), y: height - padding - controlPoints[0].y * (height - 2 * padding) },
      { x: padding + controlPoints[1].x * (width - 2 * padding), y: height - padding - controlPoints[1].y * (height - 2 * padding) }
    ];

    for (let i = 0; i < points.length; i++) {
      const dx = x - points[i].x;
      const dy = y - points[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        setDragging(i);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 20;
    const width = canvas.width;
    const height = canvas.height;

    const newX = Math.max(0, Math.min(1, (x - padding) / (width - 2 * padding)));
    const newY = Math.max(0, Math.min(1, (height - padding - y) / (height - 2 * padding)));

    const newPoints = [...controlPoints] as [ControlPoint, ControlPoint];
    newPoints[dragging] = { x: newX, y: newY };
    setControlPoints(newPoints);
  };

  const handleMouseUp = () => {
    if (dragging !== null) {
      actions.setToken('interaction.transition.easing', formatEasing(controlPoints[0], controlPoints[1]));
      setDragging(null);
    }
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="border rounded cursor-crosshair w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="flex flex-wrap gap-2">
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => {
              const [newP1, newP2] = parseEasing(preset.value);
              updateEasing(newP1, newP2);
            }}
            className="px-2 py-1 text-xs rounded bg-secondary hover:bg-secondary/80"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="text-xs font-mono text-muted-foreground">
        {tokens.interaction.transition.easing}
      </div>

      <SliderRow
        label="Duration"
        value={tokens.interaction.transition.duration}
        min={50}
        max={500}
        step={10}
        unit="ms"
        onChange={(value) => actions.setToken('interaction.transition.duration', value)}
      />
    </div>
  );
}
