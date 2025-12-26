'use client';

import { useEffect, useMemo } from 'react';
import { useVibeStore } from '@/lib/store/vibeStore';
import { loadPresets } from '@/lib/presets/builtIn';
import { ColorPickerRow } from './ColorPickerRow';
import { SliderRow } from './SliderRow';
import { ToggleRow } from './ToggleRow';
import { SelectRow } from './SelectRow';
import { AccessibilityHint } from './AccessibilityHint';
import { getContrastRating } from '@/lib/generator/color';
import * as Accordion from '@radix-ui/react-accordion';
import { createActions } from '@/lib/store/vibeStore';

export function InspectorPanel() {
  const tokens = useVibeStore(state => state.tokens);
  const presets = useVibeStore(state => state.presets);

  const actions = useMemo(() => 
    createActions(
      (fn) => useVibeStore.setState(fn),
      () => useVibeStore.getState()
    ),
  []);

  useEffect(() => {
    if (!presets.builtIn || presets.builtIn.length === 0) {
      actions.setBuiltIn(loadPresets());
    }
  }, [presets.builtIn, actions]);

  const contrastInfo = getContrastRating(tokens.theme.palette.text, tokens.theme.palette.bg);

  const handleSetToken = (path: string, value: unknown) => {
    actions.setToken(path, value);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b p-4">
        <h2 className="font-semibold">Inspector</h2>
        <p className="text-xs text-muted-foreground">Customize your vibe</p>
      </div>

      <div className="flex-1 overflow-y-auto vibe-scroll">
        <Accordion.Root type="multiple" defaultValue={['theme', 'effects', 'button']} className="divide-y">
          <Accordion.Item value="accessibility" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Accessibility</span>
              {contrastInfo.aa ? (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                  AA {contrastInfo.ratio}:1
                </span>
              ) : (
                <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  {contrastInfo.ratio}:1
                </span>
              )}
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <AccessibilityHint contrast={contrastInfo} />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="theme" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Theme</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <SelectRow
                label="Mode"
                value={tokens.theme.mode}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' }
                ]}
                onChange={(value) => handleSetToken('theme.mode', value)}
              />
              <div className="text-xs font-medium text-muted-foreground mt-4">Palette</div>
              <div className="space-y-4 mt-2">
                <ColorPickerRow
                  label="Accent"
                  value={tokens.theme.palette.accent}
                  onChange={(value) => handleSetToken('theme.palette.accent', value)}
                />
                <ColorPickerRow
                  label="Background"
                  value={tokens.theme.palette.bg}
                  onChange={(value) => handleSetToken('theme.palette.bg', value)}
                />
                <ColorPickerRow
                  label="Surface"
                  value={tokens.theme.palette.surface}
                  onChange={(value) => handleSetToken('theme.palette.surface', value)}
                />
                <ColorPickerRow
                  label="Text"
                  value={tokens.theme.palette.text}
                  onChange={(value) => handleSetToken('theme.palette.text', value)}
                />
                <ColorPickerRow
                  label="Muted Text"
                  value={tokens.theme.palette.mutedText}
                  onChange={(value) => handleSetToken('theme.palette.mutedText', value)}
                />
                <ColorPickerRow
                  label="Border"
                  value={tokens.theme.palette.border}
                  onChange={(value) => handleSetToken('theme.palette.border', value)}
                />
              </div>
              <div className="text-xs font-medium text-muted-foreground">Typography</div>
              <SliderRow
                label="Font Size"
                value={tokens.theme.typography.fontSize}
                min={10}
                max={24}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('theme.typography.fontSize', value)}
              />
              <SliderRow
                label="Font Weight"
                value={tokens.theme.typography.fontWeight}
                min={300}
                max={700}
                step={100}
                onChange={(value) => handleSetToken('theme.typography.fontWeight', value)}
              />
              <SliderRow
                label="Base Radius"
                value={tokens.theme.radius.baseRadius}
                min={0}
                max={32}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('theme.radius.baseRadius', value)}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="effects" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Effects</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="text-xs font-medium text-muted-foreground">Shadow</div>
              <SliderRow
                label="Elevation"
                value={tokens.effects.shadow.elevation}
                min={0}
                max={24}
                step={1}
                onChange={(value) => handleSetToken('effects.shadow.elevation', value)}
              />
              <SliderRow
                label="Softness"
                value={tokens.effects.shadow.softness}
                min={0}
                max={1}
                step={0.05}
                onChange={(value) => handleSetToken('effects.shadow.softness', value)}
              />
              <div className="text-xs font-medium text-muted-foreground">Glass</div>
              <ToggleRow
                label="Enabled"
                checked={tokens.effects.glass.enabled}
                onChange={(checked) => handleSetToken('effects.glass.enabled', checked)}
              />
              {tokens.effects.glass.enabled && (
                <>
                  <SliderRow
                    label="Blur"
                    value={tokens.effects.glass.blur}
                    min={0}
                    max={24}
                    step={1}
                    unit="px"
                    onChange={(value) => handleSetToken('effects.glass.blur', value)}
                  />
                  <SliderRow
                    label="Opacity"
                    value={tokens.effects.glass.opacity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(value) => handleSetToken('effects.glass.opacity', value)}
                  />
                </>
              )}
              <div className="text-xs font-medium text-muted-foreground">Glow</div>
              <ToggleRow
                label="Enabled"
                checked={tokens.effects.glow.enabled}
                onChange={(checked) => handleSetToken('effects.glow.enabled', checked)}
              />
              {tokens.effects.glow.enabled && (
                <>
                  <SliderRow
                    label="Size"
                    value={tokens.effects.glow.size}
                    min={0}
                    max={60}
                    step={1}
                    unit="px"
                    onChange={(value) => handleSetToken('effects.glow.size', value)}
                  />
                  <SliderRow
                    label="Opacity"
                    value={tokens.effects.glow.opacity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(value) => handleSetToken('effects.glow.opacity', value)}
                  />
                </>
              )}
              <div className="text-xs font-medium text-muted-foreground">Gradient</div>
              <ToggleRow
                label="Enabled"
                checked={tokens.effects.gradient.enabled}
                onChange={(checked) => handleSetToken('effects.gradient.enabled', checked)}
              />
              {tokens.effects.gradient.enabled && (
                <SliderRow
                  label="Angle"
                  value={tokens.effects.gradient.angle}
                  min={0}
                  max={360}
                  step={1}
                  unit="°"
                  onChange={(value) => handleSetToken('effects.gradient.angle', value)}
                />
              )}
              <div className="text-xs font-medium text-muted-foreground">Noise</div>
              <ToggleRow
                label="Enabled"
                checked={tokens.effects.noise.enabled}
                onChange={(checked) => handleSetToken('effects.noise.enabled', checked)}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="button" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Button</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <SelectRow
                label="Variant"
                value={tokens.button.variant}
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'outline', label: 'Outline' },
                  { value: 'ghost', label: 'Ghost' }
                ]}
                onChange={(value) => handleSetToken('button.variant', value)}
              />
              <SliderRow
                label="Height"
                value={tokens.button.height}
                min={32}
                max={80}
                step={4}
                unit="px"
                onChange={(value) => handleSetToken('button.height', value)}
              />
              <SliderRow
                label="Radius"
                value={tokens.button.radius}
                min={0}
                max={tokens.theme.radius.baseRadius + 8}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('button.radius', value)}
              />
              <div className="text-xs font-medium text-muted-foreground">Interaction</div>
              <SliderRow
                label="Duration"
                value={tokens.interaction.transition.duration}
                min={50}
                max={500}
                step={10}
                unit="ms"
                onChange={(value) => handleSetToken('interaction.transition.duration', value)}
              />
              <SliderRow
                label="Hover Lift"
                value={tokens.interaction.hover.lift}
                min={0}
                max={8}
                step={0.5}
                unit="px"
                onChange={(value) => handleSetToken('interaction.hover.lift', value)}
              />
              <SliderRow
                label="Active Press"
                value={tokens.interaction.active.press}
                min={0}
                max={8}
                step={0.5}
                unit="px"
                onChange={(value) => handleSetToken('interaction.active.press', value)}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="card" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Card</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <SliderRow
                label="Radius"
                value={tokens.card.radius}
                min={0}
                max={tokens.theme.radius.baseRadius + 12}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('card.radius', value)}
              />
              <SliderRow
                label="Padding"
                value={tokens.card.padding}
                min={8}
                max={48}
                step={4}
                unit="px"
                onChange={(value) => handleSetToken('card.padding', value)}
              />
              <SliderRow
                label="Surface Opacity"
                value={tokens.card.surfaceAlpha}
                min={0}
                max={1}
                step={0.05}
                onChange={(value) => handleSetToken('card.surfaceAlpha', value)}
              />
              <SliderRow
                label="Border Opacity"
                value={tokens.card.borderAlpha}
                min={0}
                max={1}
                step={0.05}
                onChange={(value) => handleSetToken('card.borderAlpha', value)}
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
