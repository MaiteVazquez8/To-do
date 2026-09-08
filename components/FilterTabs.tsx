import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { FILTER_OPTIONS } from '@/constants/filters';
import { smoothMotion } from '@/constants/motion';
import { focusRingStyle } from '@/constants/shadows';
import { radius, spacing } from '@/constants/spacing';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';
import type { Filter } from '@/types/filter';

interface FilterTabsProps {
  value: Filter;
  onChange: (filter: Filter) => void;
}

function FilterTab({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { focused, interactionProps } = useInteractionState();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.12)', borderless: false }}
      {...interactionProps}
      style={[
        styles.tab,
        smoothMotion(),
        focused ? focusRingStyle(colors.focus) : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? colors.onPrimary : colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const indicatorLeft = useSharedValue(0);

  const activeIndex = FILTER_OPTIONS.findIndex((option) => option.key === value);
  const segmentWidth = containerWidth / FILTER_OPTIONS.length;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
    if (width > 0) {
      indicatorLeft.value = activeIndex * (width / FILTER_OPTIONS.length);
    }
  };

  const handlePress = (index: number) => {
    indicatorLeft.value = withTiming(index * segmentWidth, { duration: 220 });
    onChange(FILTER_OPTIONS[index].key);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorLeft.value }],
  }));

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.container,
        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
      ]}
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { width: segmentWidth, backgroundColor: colors.primary },
            indicatorStyle,
          ]}
        />
      )}
      {FILTER_OPTIONS.map((option, index) => (
        <FilterTab
          key={option.key}
          label={option.label}
          selected={option.key === value}
          onPress={() => handlePress(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    borderRadius: radius.pill,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    minHeight: 40,
    borderRadius: radius.pill,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});