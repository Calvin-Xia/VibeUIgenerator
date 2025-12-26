export interface ThemeTokens {
  mode: 'light' | 'dark';
  palette: {
    accent: string;
    accent2?: string;
    bg: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    letterSpacing: number;
  };
  radius: {
    baseRadius: number;
  };
  spacing: {
    paddingX: number;
    paddingY: number;
    cardPadding: number;
  };
}

export interface EffectsTokens {
  shadow: {
    elevation: number;
    softness: number;
    spread: number;
    color: string;
  };
  border: {
    width: number;
    opacity: number;
  };
  glass: {
    enabled: boolean;
    blur: number;
    opacity: number;
    saturation: number;
  };
  gradient: {
    enabled: boolean;
    angle: number;
    stops: Array<{ color: string; pos: number }>;
  };
  noise: {
    enabled: boolean;
    intensity: number;
  };
  glow: {
    enabled: boolean;
    size: number;
    opacity: number;
  };
}

export interface InteractionTokens {
  transition: {
    duration: number;
    easing: string;
  };
  hover: {
    lift: number;
    brighten: number;
    shadowBoost: number;
  };
  active: {
    press: number;
    darken: number;
  };
}

export interface ButtonTokens {
  variant: 'solid' | 'outline' | 'ghost';
  height: number;
  radius: number;
  override: {
    bg?: string;
    text?: string;
    border?: string;
  };
}

export interface CardTokens {
  radius: number;
  padding: number;
  surfaceAlpha: number;
  borderAlpha: number;
}

export interface VibeTokens {
  schemaVersion: string;
  theme: ThemeTokens;
  effects: EffectsTokens;
  interaction: InteractionTokens;
  button: ButtonTokens;
  card: CardTokens;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  tokens: VibeTokens;
  isBuiltIn?: boolean;
  createdAt?: number;
}

export interface GeneratedStyles {
  cssVars: Record<string, string>;
  cssText: string;
  tailwindLayer: string;
  htmlSnippet: {
    button: string;
    card: string;
  };
}

export type ComponentType = 'button' | 'card';
export type ComponentState = 'default' | 'hover' | 'active' | 'focus';

export interface CodeTab {
  id: 'css-vars' | 'css' | 'tailwind' | 'html' | 'json';
  label: string;
  icon?: React.ReactNode;
}
