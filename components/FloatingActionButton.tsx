import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { focusRingStyle, shadowStyles } from '@/constants/shadows';
import { smoothMotion } from '@/constants/motion';
import { radius, spacing } from '@/constants/spacing';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';

interface FloatingActionButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
}

const SIZE = 56;

export function FloatingActionButton({ onPress, accessibilityLabel }: FloatingActionButtonProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const pressed = useSharedValue(0);
  const { focused, hovered, interactionProps } = useInteractionState();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - 0.08 * pressed.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(14).stiffness(120)}
      style={[styles.position, { bottom: insets.bottom + spacing.xl }]}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          onPress={onPress}
          onPressIn={() => {
            pressed.value = withSpring(1, { stiffness: 320, damping: 20 });
          }}
          onPressOut={() => {
            pressed.value = withSpring(0, { stiffness: 320, damping: 20 });
          }}
          android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true }}
          {...interactionProps}
          style={[
            styles.button,
            smoothMotion(),
            {
              backgroundColor: hovered ? colors.primaryHover : colors.primary,
            },
            shadowStyles('md', colors.shadow),
            focused ? focusRingStyle(colors.focus) : null,
          ]}
        >
          <Ionicons name="add" size={30} color={colors.onPrimary} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    right: spacing.xl,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});