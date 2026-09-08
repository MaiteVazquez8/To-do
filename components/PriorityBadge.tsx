import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import type { Priority } from '@/types/task';

interface PriorityBadgeProps {
  priority: Priority;
}

const CONFIG: Record<
  Priority,
  { color: 'success' | 'warning' | 'danger'; soft: 'successSoft' | 'warningSoft' | 'dangerSoft' } | null
> = {
  none: null,
  low: { color: 'success', soft: 'successSoft' },
  medium: { color: 'warning', soft: 'warningSoft' },
  high: { color: 'danger', soft: 'dangerSoft' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { colors } = useTheme();
  const config = CONFIG[priority];
  if (!config) return null;

  const label = priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja';

  return (
    <View style={[styles.badge, { backgroundColor: colors[config.soft] }]}>
      <View style={[styles.dot, { backgroundColor: colors[config.color] }]} />
      <Text style={[styles.label, { color: colors[config.color] }]}>{label}</Text>
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
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});