import { Platform } from 'react-native';

type TransitionStyle = {
  transitionProperty: string;
  transitionDuration: string;
  transitionTimingFunction: string;
};

/**
 * Opt-in smooth color/interaction transitions for web. React Native Web
 * accepts CSS transitions through the style object; native ignores them and
 * keeps instant feedback instead.
 */
export function smoothMotion(durationMs = 150): TransitionStyle {
  if (Platform.OS !== 'web') {
    return {} as TransitionStyle;
  }
  return {
    transitionProperty: 'background-color, border-color, color, opacity, transform, box-shadow',
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: 'ease-out',
  };
}