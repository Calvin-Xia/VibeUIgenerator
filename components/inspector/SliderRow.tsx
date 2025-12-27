'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function SliderRow({ label, value, min, max, step = 1, unit = '', onChange }: SliderRowProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className={cn(
          'text-xs font-mono transition-colors',
          isDragging ? 'text-primary font-semibold' : 'text-muted-foreground'
        )}>
          {typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}{unit}
        </span>
      </div>
      <SliderPrimitive.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([newValue]) => onChange(newValue)}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        className="relative flex h-5 w-full touch-none select-none items-center"
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range 
            className={cn(
              'absolute h-full transition-colors',
              isDragging ? 'bg-primary/90' : 'bg-primary'
            )} 
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb 
          className={cn(
            'block h-4 w-4 rounded-full border border-primary bg-background ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
            isDragging ? 'scale-110 ring-2 ring-primary/20 shadow-lg' : 'hover:scale-105'
          )} 
        />
      </SliderPrimitive.Root>
    </div>
  );
}
