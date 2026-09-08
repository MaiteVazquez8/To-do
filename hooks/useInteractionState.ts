import { useState } from 'react';
import type { PressableProps } from 'react-native';

type InteractionStateProps = Pick<
  PressableProps,
  'tabIndex' | 'onFocus' | 'onBlur' | 'onHoverIn' | 'onHoverOut'
>;

/**
 * Shared helper to expose keyboard focus and (web) hover state for
 * Pressable-based components. Keeps the focus/hover wiring consistent across
 * buttons, tabs, checkboxes and icon actions.
 */
export function useInteractionState(): {
  focused: boolean;
  hovered: boolean;
  interactionProps: InteractionStateProps;
} {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const interactionProps: InteractionStateProps = {
    tabIndex: 0,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onHoverIn: () => setHovered(true),
    onHoverOut: () => setHovered(false),
  };

  return { focused, hovered, interactionProps };
}