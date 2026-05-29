'use client';

import { useEffect } from 'react';
import { useVibeStore, useActions } from '@/lib/store/vibeStore';
import { loadPresets } from '@/lib/presets/builtIn';
import { ColorPickerRow } from './ColorPickerRow';
import { SliderRow } from './SliderRow';
import { ToggleRow } from './ToggleRow';
import { SelectRow } from './SelectRow';
import { AccessibilityHint } from './AccessibilityHint';
import { AnimationEditor } from './AnimationEditor';
import { PaletteGenerator } from './PaletteGenerator';
import { getContrastRating } from '@/lib/generator/color';
import * as Accordion from '@radix-ui/react-accordion';

export function InspectorPanel() {
  const tokens = useVibeStore(state => state.tokens);
  const presets = useVibeStore(state => state.presets);
  const actions = useActions();

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
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="animation" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Animation</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <AnimationEditor />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="palette" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Color Palette</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <PaletteGenerator />
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

          <Accordion.Item value="input" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Input</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <SliderRow
                label="Height"
                value={tokens.input.height}
                min={32}
                max={56}
                step={4}
                unit="px"
                onChange={(value) => handleSetToken('input.height', value)}
              />
              <SliderRow
                label="Radius"
                value={tokens.input.radius}
                min={0}
                max={24}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('input.radius', value)}
              />
              <SliderRow
                label="Border Width"
                value={tokens.input.borderWidth}
                min={0}
                max={4}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('input.borderWidth', value)}
              />
              <SliderRow
                label="Focus Ring Width"
                value={tokens.input.focusRingWidth}
                min={0}
                max={8}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('input.focusRingWidth', value)}
              />
              <SliderRow
                label="Focus Ring Offset"
                value={tokens.input.focusRingOffset}
                min={0}
                max={8}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('input.focusRingOffset', value)}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="badge" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Badge</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <SelectRow
                label="Variant"
                value={tokens.badge.variant}
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'outline', label: 'Outline' },
                  { value: 'soft', label: 'Soft' }
                ]}
                onChange={(value) => handleSetToken('badge.variant', value)}
              />
              <SliderRow
                label="Radius"
                value={tokens.badge.radius}
                min={0}
                max={9999}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('badge.radius', value)}
              />
              <SliderRow
                label="Font Size"
                value={tokens.badge.fontSize}
                min={10}
                max={18}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('badge.fontSize', value)}
              />
              <SliderRow
                label="Font Weight"
                value={tokens.badge.fontWeight}
                min={400}
                max={700}
                step={100}
                onChange={(value) => handleSetToken('badge.fontWeight', value)}
              />
              <SliderRow
                label="Padding X"
                value={tokens.badge.paddingX}
                min={4}
                max={24}
                step={2}
                unit="px"
                onChange={(value) => handleSetToken('badge.paddingX', value)}
              />
              <SliderRow
                label="Padding Y"
                value={tokens.badge.paddingY}
                min={2}
                max={12}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('badge.paddingY', value)}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="avatar" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Avatar</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <SliderRow
                label="Size"
                value={tokens.avatar.size}
                min={24}
                max={80}
                step={4}
                unit="px"
                onChange={(value) => handleSetToken('avatar.size', value)}
              />
              <SliderRow
                label="Radius"
                value={tokens.avatar.radius}
                min={0}
                max={9999}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('avatar.radius', value)}
              />
              <SliderRow
                label="Border Width"
                value={tokens.avatar.borderWidth}
                min={0}
                max={6}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('avatar.borderWidth', value)}
              />
              <ColorPickerRow
                label="Fallback Background"
                value={tokens.avatar.fallbackBg}
                onChange={(value) => handleSetToken('avatar.fallbackBg', value)}
              />
              <ColorPickerRow
                label="Fallback Text"
                value={tokens.avatar.fallbackText}
                onChange={(value) => handleSetToken('avatar.fallbackText', value)}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="checkbox" className="border-0">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary/50">
              <span>Checkbox</span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <SliderRow
                label="Size"
                value={tokens.checkbox.size}
                min={16}
                max={32}
                step={2}
                unit="px"
                onChange={(value) => handleSetToken('checkbox.size', value)}
              />
              <SliderRow
                label="Radius"
                value={tokens.checkbox.radius}
                min={0}
                max={16}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('checkbox.radius', value)}
              />
              <SliderRow
                label="Border Width"
                value={tokens.checkbox.borderWidth}
                min={1}
                max={4}
                step={1}
                unit="px"
                onChange={(value) => handleSetToken('checkbox.borderWidth', value)}
              />
              <SliderRow
                label="Check Size"
                value={tokens.checkbox.checkSize}
                min={8}
                max={24}
                step={2}
                unit="px"
                onChange={(value) => handleSetToken('checkbox.checkSize', value)}
              />
              <SelectRow
                label="Indicator Style"
                value={tokens.checkbox.indicatorStyle}
                options={[
                  { value: 'check', label: 'Check' },
                  { value: 'dot', label: 'Dot' }
                ]}
                onChange={(value) => handleSetToken('checkbox.indicatorStyle', value)}
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
