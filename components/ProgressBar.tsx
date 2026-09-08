import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { radius } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

interface ProgressBarProps {
  /** Value between 0 and 1. */
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const clamped = Math.max(0, Math.min(1, value));

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 400 });
  }, [clamped, progress]);

  const fill = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
      ]}
    >
      <Animated.View
        style={[styles.fill, { backgroundColor: colors.primary }, fill]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: radius.pill,
  },
});