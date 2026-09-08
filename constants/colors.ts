export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  surfacePressed: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  surfaceInput: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  primarySoft: string;
  onPrimary: string;
  danger: string;
  dangerPressed: string;
  dangerSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  focus: string;
  scrim: string;
  shadow: string;
}

/**
 * Black + violet identity.
 *
 * The app is designed dark-first: an almost-black canvas, slightly lighter
 * surfaces to create layering, and violet as the single accent used for
 * actions, selection, focus and small identity details. Neutrals carry ~80%
 * of the visual weight; light text fills in the rest and violet sits on top
 * as 5–10% of the impression.
 *
 * Victory green and the warning amber are kept desaturated enough to stay in
 * the family without stealing attention from violet.
 */
export const darkColors: ThemeColors = {
  background: '#0A0A0D',
  surface: '#131318',
  surfaceHover: '#191920',
  surfacePressed: '#1E1E26',
  surfaceSecondary: '#18181E',
  surfaceElevated: '#1B1B22',
  surfaceInput: '#0F0F13',
  text: '#F4F3F8',
  textSecondary: '#B8B5C4',
  textMuted: '#77747F',
  border: '#242330',
  divider: '#1B1A23',
  primary: '#8B5CF6',
  primaryHover: '#A78BFA',
  primaryPressed: '#7C3AED',
  primarySoft: 'rgba(139, 92, 246, 0.16)',
  onPrimary: '#FFFFFF',
  danger: '#F08387',
  dangerPressed: '#E2666B',
  dangerSoft: 'rgba(240, 131, 135, 0.13)',
  success: '#4CC389',
  successSoft: 'rgba(76, 195, 137, 0.13)',
  warning: '#E5B85C',
  warningSoft: 'rgba(229, 184, 92, 0.13)',
  focus: 'rgba(139, 92, 246, 0.55)',
  scrim: 'rgba(5, 5, 8, 0.72)',
  shadow: '#000000',
};

/**
 * Keeping a refined light theme for systems that request it: cool light grays
 * with the same violet accent and the same token structure, so the identity
 * and proportions hold in both directions.
 */
export const lightColors: ThemeColors = {
  background: '#F3F3F7',
  surface: '#FFFFFF',
  surfaceHover: '#F1F0F7',
  surfacePressed: '#E9E7F2',
  surfaceSecondary: '#F7F6FB',
  surfaceElevated: '#FFFFFF',
  surfaceInput: '#FFFFFF',
  text: '#191820',
  textSecondary: '#55536A',
  textMuted: '#84818F',
  border: '#E4E2EE',
  divider: '#ECEBF3',
  primary: '#7B4FF0',
  primaryHover: '#8B5CF6',
  primaryPressed: '#6B3FE0',
  primarySoft: 'rgba(123, 79, 240, 0.12)',
  onPrimary: '#FFFFFF',
  danger: '#D6454B',
  dangerPressed: '#C03A40',
  dangerSoft: 'rgba(214, 69, 75, 0.1)',
  success: '#1E9E5F',
  successSoft: 'rgba(30, 158, 95, 0.1)',
  warning: '#B87A16',
  warningSoft: 'rgba(184, 122, 22, 0.11)',
  focus: 'rgba(123, 79, 240, 0.4)',
  scrim: 'rgba(21, 18, 40, 0.4)',
  shadow: '#191720',
};