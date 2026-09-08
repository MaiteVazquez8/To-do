import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { smoothMotion } from '@/constants/motion';
import { focusRingStyle, shadowStyles } from '@/constants/shadows';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';
import { UNCATEGORIZED, type CategoryFilter as CategoryFilterValue } from '@/hooks/useTaskQuery';
import type { Category } from '@/types/category';

interface CategoryFilterProps {
  categories: Category[];
  uncategorizedCount: number;
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
  hasUncategorized: boolean;
}

function Pill({
  label,
  active,
  dotColor,
  onPress,
}: {
  label: string;
  active: boolean;
  dotColor?: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { hovered, focused, interactionProps } = useInteractionState();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      {...interactionProps}
      style={[
        styles.pill,
        smoothMotion(),
        {
          backgroundColor: active ? colors.primary : hovered ? colors.surfaceHover : colors.surface,
          borderColor: active ? colors.primary : focused ? colors.primary : colors.border,
          transform: [{ translateY: hovered && !active ? -1 : 0 }],
        },
        active ? shadowStyles('sm', colors.shadow) : null,
        focused ? focusRingStyle(colors.primary) : null,
      ]}
    >
      {dotColor && (
        <View
          style={[
            styles.dot,
            { backgroundColor: active ? colors.onPrimary : dotColor, opacity: active ? 0.95 : 0.85 },
          ]}
        />
      )}
      <Text
        style={[
          styles.pillLabel,
          { color: active ? colors.onPrimary : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function CategoryFilter({
  categories,
  uncategorizedCount,
  value,
  onChange,
  hasUncategorized,
}: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pill
          label={strings.categories.all}
          active={value === 'all'}
          onPress={() => onChange('all')}
        />
        {categories.map((category) => (
          <Pill
            key={category.id}
            label={category.name}
            dotColor={category.color}
            active={value === category.id}
            onPress={() => onChange(value === category.id ? 'all' : category.id)}
          />
        ))}
        {hasUncategorized && (
          <Pill
            label={`${strings.categories.uncategorized} (${uncategorizedCount})`}
            active={value === UNCATEGORIZED}
            onPress={() =>
              onChange(value === UNCATEGORIZED ? 'all' : UNCATEGORIZED)
            }
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.xl,
    columnGap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});