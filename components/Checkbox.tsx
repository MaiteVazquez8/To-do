import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { smoothMotion } from '@/constants/motion';
import { focusRingStyle } from '@/constants/shadows';
import { radius } from '@/constants/spacing';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
}

const BOX_SIZE = 28;
const DURATION = 200;

export function Checkbox({ checked, onToggle, accessibilityLabel }: CheckboxProps) {
  const { colors } = useTheme();
  const { focused, hovered, interactionProps } = useInteractionState();
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: DURATION });
  }, [checked, progress]);

  const boxStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.primary]),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [hovered ? colors.surfaceHover : colors.surfaceInput, colors.primary]
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.4 + 0.6 * progress.value }],
  }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={12}
      onPress={onToggle}
      {...interactionProps}
      style={({ pressed }) => [
        styles.pressable,
        {
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
        smoothMotion(),
        focused ? focusRingStyle(colors.focus) : null,
      ]}
    >
      <Animated.View style={[styles.box, boxStyle]}>
        <Animated.View style={[styles.checkWrapper, checkStyle]}>
          <Ionicons name="checkmark" size={18} color={colors.onPrimary} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: BOX_SIZE + 8,
    height: BOX_SIZE + 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: radius.md - 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});