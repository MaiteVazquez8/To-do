import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import type { Task } from '@/types/task';
import { getDueInfo, type DueKind } from '@/utils/date';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface DueDateBadgeProps {
  task: Pick<Task, 'dueDate' | 'completed'>;
}

const KIND_ICON: Record<DueKind, IconName> = {
  none: 'calendar-outline',
  overdue: 'alert-circle-outline',
  today: 'calendar-outline',
  tomorrow: 'calendar-outline',
  upcoming: 'calendar-outline',
};

export function DueDateBadge({ task }: DueDateBadgeProps) {
  const { colors } = useTheme();
  const info = getDueInfo(task);
  if (info.kind === 'none') return null;

  const tone =
    info.kind === 'overdue'
      ? { bg: colors.dangerSoft, text: colors.danger }
      : info.kind === 'today'
        ? { bg: colors.primarySoft, text: colors.primary }
        : info.kind === 'tomorrow'
          ? { bg: colors.surfaceSecondary, text: colors.textSecondary }
          : { bg: colors.surfaceSecondary, text: colors.textSecondary };

  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Ionicons name={KIND_ICON[info.kind]} size={13} color={tone.text} />
      <Text style={[styles.label, { color: tone.text }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    maxWidth: 160,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
});