import type { InteractionTokens } from '@/lib/types/tokens';

export interface ResolvedInteractionMotion {
  hoverLift: number;
  hoverTranslateY: number;
  activePress: number;
  activeTranslateY: number;
}

export function resolveInteractionMotion(interaction: InteractionTokens): ResolvedInteractionMotion {
  const hoverLift = Math.abs(interaction.hover.lift);
  const activePress = interaction.active.press;

  return {
    hoverLift,
    hoverTranslateY: -hoverLift,
    activePress,
    activeTranslateY: activePress
  };
}
