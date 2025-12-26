'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ColorPickerRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPickerRow({ label, value, onChange }: ColorPickerRowProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [position, setPosition] = useState<'left' | 'right' | 'center'>('center');
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const pickerWidth = 220;
    const pickerHeight = 280;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 10;

    let horizontalPos: 'left' | 'right' | 'center';
    let topPos = triggerRect.bottom + padding;
    let leftPos = triggerRect.left;

    const spaceOnRight = viewportWidth - triggerRect.right;
    const spaceOnLeft = triggerRect.left;
    const spaceBelow = viewportHeight - triggerRect.bottom;

    if (spaceOnRight >= pickerWidth) {
      horizontalPos = 'right';
      leftPos = triggerRect.right - pickerWidth;
    } else if (spaceOnLeft >= pickerWidth) {
      horizontalPos = 'left';
      leftPos = triggerRect.left;
    } else {
      horizontalPos = 'center';
      leftPos = (viewportWidth - pickerWidth) / 2;
    }

    if (spaceBelow < pickerHeight && triggerRect.top >= pickerHeight) {
      topPos = triggerRect.top - pickerHeight - padding;
    }

    if (leftPos < padding) leftPos = padding;
    if (leftPos + pickerWidth > viewportWidth - padding) {
      leftPos = viewportWidth - pickerWidth - padding;
    }

    setPosition(horizontalPos);
    setCoords({ top: topPos, left: leftPos });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  useEffect(() => {
    if (showPicker) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
    }

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [showPicker, calculatePosition]);

  const presetColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
    '#1e293b', '#64748b', '#94a3b8', '#e2e8f0', '#f1f5f9',
    '#ffffff', '#000000'
  ];

  const handleHexChange = (hex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex);
    }
  };

  const handleColorSelect = (color: string) => {
    onChange(color);
    setShowPicker(false);
  };

  const pickerContent = showPicker ? (
    <motion.div
      ref={pickerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed z-[9999] min-w-[220px] rounded-lg border bg-card p-3 shadow-xl"
      style={{
        top: coords.top,
        left: coords.left,
      }}
    >
      <div className="mb-3">
        <input
          type="text"
          value={value}
          onChange={(e) => handleHexChange(e.target.value)}
          className="w-full rounded border bg-background px-2 py-1.5 text-sm font-mono uppercase"
          placeholder="#000000"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {presetColors.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => handleColorSelect(color)}
            className={cn(
              'h-6 w-6 rounded border transition-transform hover:scale-110',
              value === color && 'ring-2 ring-primary ring-offset-1'
            )}
            style={{ backgroundColor: color, borderColor: color === '#ffffff' ? '#e2e8f0' : color }}
          />
        ))}
      </div>
    </motion.div>
  ) : null;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="h-8 w-8 rounded border-2 cursor-pointer"
            style={{ backgroundColor: value, borderColor: value === '#ffffff' ? '#e2e8f0' : value }}
          />
          {typeof document !== 'undefined' && createPortal(pickerContent, document.body)}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => handleHexChange(e.target.value)}
          className="flex-1 rounded border bg-background px-2 py-1.5 text-sm font-mono uppercase"
        />
      </div>
    </div>
  );
}
