import { Platform } from 'react-native';
import type { ViewStyle } from 'react-native';

export type ShadowLevel = 'sm' | 'md' | 'lg';

/**
 * Platform-aware card shadows. Depth in this design comes mostly from layered
 * surfaces and subtle borders, so the shadows stay restrained. Web maps to CSS
 * `box-shadow`, iOS uses native shadow props and Android uses elevation.
 */
export function shadowStyles(level: ShadowLevel = 'sm', shadowColor = '#000000'): ViewStyle {
  if (Platform.OS === 'web') {
    switch (level) {
      case 'lg':
        return {
          boxShadow:
            '0 24px 60px -16px rgba(0, 0, 0, 0.6), 0 10px 28px -10px rgba(0, 0, 0, 0.45)',
        };
      case 'md':
        return {
          boxShadow:
            '0 16px 40px -16px rgba(0, 0, 0, 0.55), 0 6px 16px -8px rgba(0, 0, 0, 0.4)',
        };
      default:
        return {
          boxShadow:
            '0 2px 4px rgba(0, 0, 0, 0.25), 0 4px 12px -2px rgba(0, 0, 0, 0.35)',
        };
    }
  }
  if (Platform.OS === 'ios') {
    switch (level) {
      case 'lg':
        return {
          shadowColor,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 30,
        };
      case 'md':
        return {
          shadowColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
        };
      default:
        return {
          shadowColor,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 9,
        };
    }
  }
  return { elevation: level === 'lg' ? 14 : level === 'md' ? 10 : 4 };
}

/**
 * Visible keyboard focus ring for web. Uses box-shadow so it follows the
 * element's border radius. No-op on native.
 */
export function focusRingStyle(color: string): ViewStyle {
  if (Platform.OS !== 'web') {
    return {};
  }
  return { boxShadow: `0 0 0 3px ${color}` };
}