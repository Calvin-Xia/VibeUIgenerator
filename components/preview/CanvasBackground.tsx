'use client';

import { useVibeStore } from '@/lib/store/vibeStore';
import { cn } from '@/lib/utils';
import { hexToRgb } from '@/lib/generator/color';

export function CanvasBackground() {
  const tokens = useVibeStore(state => state.tokens);
  const version = useVibeStore(state => state.ui.version);

  const effects = tokens.effects;
  const glassRgb = hexToRgb(tokens.theme.palette.surface);

  const glowSize = effects.glow.size;
  const glowOpacity = effects.glow.opacity;
  const blurAmount = glowSize * 1.5;
  const glowRgb = hexToRgb(tokens.theme.palette.accent);
  const glowRgb2 = hexToRgb(tokens.theme.palette.accent2 || tokens.theme.palette.accent);

  const bgColor = tokens.theme.palette.bg;
  const gradientStyle = effects.gradient.enabled
    ? `linear-gradient(${effects.gradient.angle}deg, ${effects.gradient.stops.map(s => `${s.color} ${s.pos}%`).join(', ')})`
    : undefined;

  return (
    <div
      className={cn(
        'absolute inset-0 z-0 overflow-hidden rounded-2xl',
        effects.noise.enabled && 'animate-noise'
      )}
      style={{
        backgroundColor: bgColor,
        background: gradientStyle || bgColor,
        backgroundSize: effects.noise.enabled ? '400% 400%' : 'auto'
      }}
      key={version}
    >
      {effects.noise.enabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: effects.noise.intensity
          }}
        />
      )}

      {effects.glow.enabled && glowRgb && (
        <>
          <div
            className="absolute animate-pulse-glow pointer-events-none"
            style={{
              width: glowSize * 2,
              height: glowSize * 2,
              top: -glowSize / 2,
              left: -glowSize / 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glowOpacity}) 0%, transparent 70%)`,
              filter: `blur(${blurAmount}px)`
            }}
          />
          <div
            className="absolute animate-pulse-glow pointer-events-none"
            style={{
              width: glowSize * 1.6,
              height: glowSize * 1.6,
              bottom: -glowSize / 2,
              right: -glowSize / 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${glowRgb2?.r || glowRgb.r}, ${glowRgb2?.g || glowRgb.g}, ${glowRgb2?.b || glowRgb.b}, ${glowOpacity * 0.75}) 0%, transparent 70%)`,
              filter: `blur(${blurAmount * 0.8}px)`,
              animationDelay: '2s'
            }}
          />
        </>
      )}

      {effects.glass.enabled && glassRgb && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${effects.glass.blur}px) saturate(${effects.glass.saturation})`,
            WebkitBackdropFilter: `blur(${effects.glass.blur}px) saturate(${effects.glass.saturation})`,
            backgroundColor: `rgba(${glassRgb.r}, ${glassRgb.g}, ${glassRgb.b}, ${effects.glass.opacity})`,
            borderRadius: '1rem',
            transition: 'backdrop-filter 150ms ease-out, background-color 150ms ease-out',
            willChange: 'backdrop-filter',
            transform: 'translateZ(0)'
          }}
        />
      )}
    </div>
  );
}
