import { VibeTokens, Preset } from '@/lib/types/tokens';

export const builtInPresets: Preset[] = [
  {
    id: 'glass',
    name: 'Glass',
    description: 'Modern frosted glass effect',
    tags: ['glass', 'modern', 'clean'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#6366f1',
          accent2: '#8b5cf6',
          bg: '#f1f5f9',
          surface: '#ffffff',
          text: '#1e293b',
          mutedText: '#64748b',
          border: '#ffffff'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0
        },
        radius: { baseRadius: 16 },
        spacing: { paddingX: 24, paddingY: 12, cardPadding: 24 }
      },
      effects: {
        shadow: { elevation: 0, softness: 0, spread: 0, color: '#1e293b' },
        border: { width: 1, opacity: 0.2 },
        glass: { enabled: true, blur: 16, opacity: 0.4, saturation: 1.1 },
        gradient: { enabled: false, angle: 135, stops: [] },
        noise: { enabled: false, intensity: 0.02 },
        glow: { enabled: false, size: 20, opacity: 0.1 }
      },
      interaction: {
        transition: { duration: 200, easing: 'ease-out' },
        hover: { lift: 0, brighten: 0.02, shadowBoost: 0 },
        active: { press: 1, darken: 0.05 }
      },
      button: { variant: 'solid', height: 44, radius: 12, override: {} },
      card: { radius: 20, padding: 24, surfaceAlpha: 0.5, borderAlpha: 0.3 }
    },
    isBuiltIn: true
  },
  {
    id: 'neo-brutal',
    name: 'Neo Brutal',
    description: 'Bold outlines and solid colors',
    tags: ['bold', 'brutal', 'retro'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#f97316',
          accent2: '#ef4444',
          bg: '#fef3c7',
          surface: '#ffffff',
          text: '#18181b',
          mutedText: '#71717a',
          border: '#18181b'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0
        },
        radius: { baseRadius: 0 },
        spacing: { paddingX: 28, paddingY: 14, cardPadding: 28 }
      },
      effects: {
        shadow: { elevation: 4, softness: 0, spread: 0, color: '#18181b' },
        border: { width: 3, opacity: 1 },
        glass: { enabled: false, blur: 0, opacity: 0, saturation: 1 },
        gradient: { enabled: false, angle: 135, stops: [] },
        noise: { enabled: false, intensity: 0 },
        glow: { enabled: false, size: 0, opacity: 0 }
      },
      interaction: {
        transition: { duration: 100, easing: 'ease-out' },
        hover: { lift: -2, brighten: 0, shadowBoost: 0 },
        active: { press: 2, darken: 0.1 }
      },
      button: { variant: 'solid', height: 48, radius: 0, override: {} },
      card: { radius: 0, padding: 28, surfaceAlpha: 1, borderAlpha: 1 }
    },
    isBuiltIn: true
  },
  {
    id: 'soft-shadow',
    name: 'Soft Shadow',
    description: 'Subtle and elegant shadows',
    tags: ['soft', 'elegant', 'minimal'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#3b82f6',
          accent2: '#6366f1',
          bg: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
          mutedText: '#94a3b8',
          border: '#f1f5f9'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0
        },
        radius: { baseRadius: 12 },
        spacing: { paddingX: 20, paddingY: 10, cardPadding: 20 }
      },
      effects: {
        shadow: { elevation: 2, softness: 0.8, spread: -1, color: '#1e293b' },
        border: { width: 1, opacity: 0.5 },
        glass: { enabled: false, blur: 0, opacity: 0, saturation: 1 },
        gradient: { enabled: false, angle: 135, stops: [] },
        noise: { enabled: false, intensity: 0 },
        glow: { enabled: false, size: 0, opacity: 0 }
      },
      interaction: {
        transition: { duration: 250, easing: 'ease-out' },
        hover: { lift: -4, brighten: 0.03, shadowBoost: 0.4 },
        active: { press: 1, darken: 0.05 }
      },
      button: { variant: 'solid', height: 40, radius: 8, override: {} },
      card: { radius: 16, padding: 20, surfaceAlpha: 1, borderAlpha: 0.3 }
    },
    isBuiltIn: true
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'Neon glow and dark mode',
    tags: ['cyber', 'neon', 'dark'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'dark',
        palette: {
          accent: '#06b6d4',
          accent2: '#a855f7',
          bg: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          mutedText: '#94a3b8',
          border: '#334155'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0
        },
        radius: { baseRadius: 8 },
        spacing: { paddingX: 24, paddingY: 12, cardPadding: 24 }
      },
      effects: {
        shadow: { elevation: 12, softness: 0.5, spread: -2, color: '#06b6d4' },
        border: { width: 1, opacity: 0.8 },
        glass: { enabled: true, blur: 12, opacity: 0.2, saturation: 1.2 },
        gradient: { enabled: true, angle: 135, stops: [{ color: '#1e293b', pos: 0 }, { color: '#0f172a', pos: 100 }] },
        noise: { enabled: true, intensity: 0.03 },
        glow: { enabled: true, size: 32, opacity: 0.4 }
      },
      interaction: {
        transition: { duration: 150, easing: 'ease-out' },
        hover: { lift: 0, brighten: 0.15, shadowBoost: 0.5 },
        active: { press: 0, darken: 0.1 }
      },
      button: { variant: 'solid', height: 44, radius: 8, override: {} },
      card: { radius: 12, padding: 24, surfaceAlpha: 0.6, borderAlpha: 0.5 }
    },
    isBuiltIn: true
  },
  {
    id: 'y2k',
    name: 'Y2K',
    description: 'Early 2000s aesthetic',
    tags: ['y2k', 'vintage', 'nostalgic'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#ff6b9d',
          accent2: '#c084fc',
          bg: '#ffeef8',
          surface: '#ffffff',
          text: '#4a1942',
          mutedText: '#9d7a8f',
          border: '#ffb8d0'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.5
        },
        radius: { baseRadius: 20 },
        spacing: { paddingX: 20, paddingY: 10, cardPadding: 20 }
      },
      effects: {
        shadow: { elevation: 6, softness: 0.2, spread: -2, color: '#ff6b9d' },
        border: { width: 2, opacity: 1 },
        glass: { enabled: false, blur: 0, opacity: 0, saturation: 1 },
        gradient: { enabled: true, angle: 45, stops: [{ color: '#ffdee9', pos: 0 }, { color: '#b9fff6', pos: 100 }] },
        noise: { enabled: false, intensity: 0 },
        glow: { enabled: true, size: 16, opacity: 0.3 }
      },
      interaction: {
        transition: { duration: 180, easing: 'ease-out' },
        hover: { lift: -2, brighten: 0.1, shadowBoost: 0.2 },
        active: { press: 1, darken: 0.08 }
      },
      button: { variant: 'solid', height: 40, radius: 20, override: {} },
      card: { radius: 24, padding: 20, surfaceAlpha: 0.95, borderAlpha: 0.8 }
    },
    isBuiltIn: true
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights inspired colors',
    tags: ['aurora', 'nature', 'colorful'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'dark',
        palette: {
          accent: '#22d3ee',
          accent2: '#a78bfa',
          bg: '#0c0a1d',
          surface: '#1a1625',
          text: '#e2e8f0',
          mutedText: '#94a3b8',
          border: '#4c1d95'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0
        },
        radius: { baseRadius: 16 },
        spacing: { paddingX: 24, paddingY: 12, cardPadding: 24 }
      },
      effects: {
        shadow: { elevation: 8, softness: 0.6, spread: -3, color: '#22d3ee' },
        border: { width: 1, opacity: 0.6 },
        glass: { enabled: true, blur: 20, opacity: 0.25, saturation: 1.3 },
        gradient: { enabled: true, angle: 180, stops: [{ color: '#1e1b4b', pos: 0 }, { color: '#312e81', pos: 50 }, { color: '#0c0a1d', pos: 100 }] },
        noise: { enabled: true, intensity: 0.02 },
        glow: { enabled: true, size: 40, opacity: 0.25 }
      },
      interaction: {
        transition: { duration: 300, easing: 'ease-out' },
        hover: { lift: -2, brighten: 0.1, shadowBoost: 0.4 },
        active: { press: 1, darken: 0.05 }
      },
      button: { variant: 'solid', height: 44, radius: 12, override: {} },
      card: { radius: 20, padding: 24, surfaceAlpha: 0.5, borderAlpha: 0.4 }
    },
    isBuiltIn: true
  },
  {
    id: 'mono',
    name: 'Mono',
    description: 'Monochrome minimal',
    tags: ['mono', 'minimal', 'black-white'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#18181b',
          accent2: '#27272a',
          bg: '#ffffff',
          surface: '#fafafa',
          text: '#18181b',
          mutedText: '#71717a',
          border: '#e4e4e7'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0
        },
        radius: { baseRadius: 8 },
        spacing: { paddingX: 20, paddingY: 10, cardPadding: 20 }
      },
      effects: {
        shadow: { elevation: 1, softness: 0.5, spread: 0, color: '#18181b' },
        border: { width: 1, opacity: 1 },
        glass: { enabled: false, blur: 0, opacity: 0, saturation: 1 },
        gradient: { enabled: false, angle: 135, stops: [] },
        noise: { enabled: false, intensity: 0 },
        glow: { enabled: false, size: 0, opacity: 0 }
      },
      interaction: {
        transition: { duration: 150, easing: 'ease-out' },
        hover: { lift: -1, brighten: 0, shadowBoost: 0.2 },
        active: { press: 0, darken: 0.1 }
      },
      button: { variant: 'solid', height: 40, radius: 6, override: {} },
      card: { radius: 8, padding: 20, surfaceAlpha: 1, borderAlpha: 1 }
    },
    isBuiltIn: true
  },
  {
    id: 'retro',
    name: 'Retro',
    description: '70s vintage style',
    tags: ['retro', 'vintage', '70s'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#ea580c',
          accent2: '#ca8a04',
          bg: '#fef3c7',
          surface: '#fffbeb',
          text: '#451a03',
          mutedText: '#92400e',
          border: '#d97706'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0
        },
        radius: { baseRadius: 4 },
        spacing: { paddingX: 24, paddingY: 12, cardPadding: 24 }
      },
      effects: {
        shadow: { elevation: 4, softness: 0.1, spread: 0, color: '#451a03' },
        border: { width: 2, opacity: 1 },
        glass: { enabled: false, blur: 0, opacity: 0, saturation: 1 },
        gradient: { enabled: true, angle: 90, stops: [{ color: '#fff7ed', pos: 0 }, { color: '#ffedd5', pos: 100 }] },
        noise: { enabled: false, intensity: 0.05 },
        glow: { enabled: false, size: 0, opacity: 0 }
      },
      interaction: {
        transition: { duration: 200, easing: 'ease-out' },
        hover: { lift: -2, brighten: 0.05, shadowBoost: 0.3 },
        active: { press: 2, darken: 0.1 }
      },
      button: { variant: 'solid', height: 44, radius: 4, override: {} },
      card: { radius: 8, padding: 24, surfaceAlpha: 1, borderAlpha: 1 }
    },
    isBuiltIn: true
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Film noir aesthetic',
    tags: ['noir', 'film', 'dark'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'dark',
        palette: {
          accent: '#fafafa',
          accent2: '#d4d4d4',
          bg: '#0a0a0a',
          surface: '#171717',
          text: '#fafafa',
          mutedText: '#a3a3a3',
          border: '#262626'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: 0
        },
        radius: { baseRadius: 2 },
        spacing: { paddingX: 20, paddingY: 10, cardPadding: 20 }
      },
      effects: {
        shadow: { elevation: 0, softness: 0.8, spread: 0, color: '#000000' },
        border: { width: 1, opacity: 0.5 },
        glass: { enabled: true, blur: 8, opacity: 0.3, saturation: 1 },
        gradient: { enabled: false, angle: 135, stops: [] },
        noise: { enabled: true, intensity: 0.05 },
        glow: { enabled: false, size: 0, opacity: 0 }
      },
      interaction: {
        transition: { duration: 200, easing: 'ease-out' },
        hover: { lift: 0, brighten: 0.05, shadowBoost: 0.2 },
        active: { press: 0, darken: 0.1 }
      },
      button: { variant: 'solid', height: 40, radius: 2, override: {} },
      card: { radius: 4, padding: 20, surfaceAlpha: 0.8, borderAlpha: 0.4 }
    },
    isBuiltIn: true
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft pastel colors',
    tags: ['pastel', 'soft', 'cute'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#f9a8d4',
          accent2: '#c4b5fd',
          bg: '#fdf4ff',
          surface: '#ffffff',
          text: '#831843',
          mutedText: '#be185d',
          border: '#fbcfe8'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0
        },
        radius: { baseRadius: 16 },
        spacing: { paddingX: 24, paddingY: 12, cardPadding: 24 }
      },
      effects: {
        shadow: { elevation: 2, softness: 0.9, spread: -1, color: '#f9a8d4' },
        border: { width: 1, opacity: 0.6 },
        glass: { enabled: true, blur: 12, opacity: 0.35, saturation: 1 },
        gradient: { enabled: true, angle: 135, stops: [{ color: '#fdf2f8', pos: 0 }, { color: '#fce7f3', pos: 100 }] },
        noise: { enabled: false, intensity: 0.02 },
        glow: { enabled: true, size: 16, opacity: 0.2 }
      },
      interaction: {
        transition: { duration: 250, easing: 'ease-out' },
        hover: { lift: -2, brighten: 0.05, shadowBoost: 0.3 },
        active: { press: 1, darken: 0.03 }
      },
      button: { variant: 'solid', height: 44, radius: 12, override: {} },
      card: { radius: 20, padding: 24, surfaceAlpha: 0.7, borderAlpha: 0.4 }
    },
    isBuiltIn: true
  },
  {
    id: 'clay',
    name: 'Clay',
    description: 'Tactile clay-like appearance',
    tags: ['clay', 'tactile', '3d'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#f59e0b',
          accent2: '#d97706',
          bg: '#fef3c7',
          surface: '#fffbeb',
          text: '#78350f',
          mutedText: '#b45309',
          border: '#fcd34d'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0
        },
        radius: { baseRadius: 24 },
        spacing: { paddingX: 24, paddingY: 14, cardPadding: 28 }
      },
      effects: {
        shadow: { elevation: 8, softness: 0.1, spread: 0, color: '#78350f' },
        border: { width: 0, opacity: 0 },
        glass: { enabled: false, blur: 0, opacity: 0, saturation: 1 },
        gradient: { enabled: false, angle: 135, stops: [] },
        noise: { enabled: false, intensity: 0 },
        glow: { enabled: false, size: 0, opacity: 0 }
      },
      interaction: {
        transition: { duration: 200, easing: 'ease-out' },
        hover: { lift: -4, brighten: 0.03, shadowBoost: 0.5 },
        active: { press: 4, darken: 0.1 }
      },
      button: { variant: 'solid', height: 48, radius: 24, override: {} },
      card: { radius: 28, padding: 28, surfaceAlpha: 1, borderAlpha: 0 }
    },
    isBuiltIn: true
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Realistic paper texture',
    tags: ['paper', 'texture', 'natural'],
    tokens: {
      schemaVersion: '1.0.0',
      theme: {
        mode: 'light',
        palette: {
          accent: '#78716c',
          accent2: '#57534e',
          bg: '#f5f5f4',
          surface: '#fafaf9',
          text: '#44403c',
          mutedText: '#78716c',
          border: '#e7e5e4'
        },
        typography: {
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0
        },
        radius: { baseRadius: 4 },
        spacing: { paddingX: 20, paddingY: 10, cardPadding: 20 }
      },
      effects: {
        shadow: { elevation: 1, softness: 0.3, spread: 0, color: '#44403c' },
        border: { width: 1, opacity: 0.8 },
        glass: { enabled: false, blur: 0, opacity: 0, saturation: 1 },
        gradient: { enabled: false, angle: 135, stops: [] },
        noise: { enabled: true, intensity: 0.08 },
        glow: { enabled: false, size: 0, opacity: 0 }
      },
      interaction: {
        transition: { duration: 150, easing: 'ease-out' },
        hover: { lift: -1, brighten: 0.02, shadowBoost: 0.2 },
        active: { press: 0, darken: 0.05 }
      },
      button: { variant: 'solid', height: 40, radius: 4, override: {} },
      card: { radius: 4, padding: 20, surfaceAlpha: 1, borderAlpha: 1 }
    },
    isBuiltIn: true
  }
];

export function loadPresets(): Preset[] {
  return builtInPresets;
}

export function getPresetById(id: string): Preset | undefined {
  return builtInPresets.find(p => p.id === id);
}
