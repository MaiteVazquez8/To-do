import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { withHexAlpha } from '@/utils/color';

interface CategoryBadgeProps {
  name: string;
  color: string;
  muted?: boolean;
}

export function CategoryBadge({ name, color, muted = false }: CategoryBadgeProps) {
  const { colors, isDark } = useTheme();
  const alpha = isDark ? 0.18 : 0.13;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: withHexAlpha(color, muted ? alpha * 0.5 : alpha) },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: muted ? colors.textMuted : color }]} />
      <Text
        numberOfLines={1}
        style={[styles.label, { color: muted ? colors.textMuted : colors.textSecondary }]}
      >
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    maxWidth: 160,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
});