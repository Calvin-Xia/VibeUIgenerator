'use client';

import { useState } from 'react';
import { useVibeStore, useActions } from '@/lib/store/vibeStore';
import { generatePalette, PaletteType } from '@/lib/generator/palette';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PALETTE_TYPES: { value: PaletteType; label: string }[] = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split-complementary', label: 'Split Complementary' },
  { value: 'tetradic', label: 'Tetradic' },
  { value: 'monochromatic', label: 'Monochromatic' }
];

export function PaletteGenerator() {
  const accent = useVibeStore(state => state.tokens.theme.palette.accent);
  const actions = useActions();
  const [paletteType, setPaletteType] = useState<PaletteType>('complementary');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const colors = generatePalette(accent, paletteType);

  const copyColor = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({ title: `Copied ${color}` });
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const applyAsAccent = (color: string) => {
    actions.setToken('theme.palette.accent', color);
    toast({ title: 'Applied as accent color' });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Palette Type</label>
        <select
          value={paletteType}
          onChange={(e) => setPaletteType(e.target.value as PaletteType)}
          className="w-full mt-1 p-2 border rounded-md bg-background"
        >
          {PALETTE_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {colors.map((color, index) => (
          <div key={index} className="flex-1">
            <button
              onClick={() => copyColor(color, index)}
              className="w-full aspect-square rounded-lg border-2 border-transparent hover:border-primary transition-colors relative group"
              style={{ backgroundColor: color }}
              title={color}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <Copy className="h-4 w-4 text-white" />
                )}
              </span>
            </button>
            <div className="mt-1 text-xs text-center font-mono truncate">
              {color}
            </div>
            <button
              onClick={() => applyAsAccent(color)}
              className="w-full mt-1 text-xs text-primary hover:underline"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
