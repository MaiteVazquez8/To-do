import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PRIORITY_OPTIONS } from '@/constants/priorities';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types/category';
import type { Task } from '@/types/task';
import { formatFullDate } from '@/utils/date';
import { Button } from './Button';
import { CategoryBadge } from './CategoryBadge';
import { DueDateBadge } from './DueDateBadge';
import { ModalSheet } from './ModalSheet';
import { PriorityBadge } from './PriorityBadge';

const NONE_PRIORITY_LABEL = PRIORITY_OPTIONS.find((option) => option.key === 'none')?.label ?? 'Sin prioridad';

interface TaskDetailsProps {
  task: Task | null;
  category: Category | null;
  onClose: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskDetails({
  task,
  category,
  onClose,
  onToggle,
  onEdit,
  onDelete,
}: TaskDetailsProps) {
  const { colors } = useTheme();

  if (!task) return null;

  const createdKey = task.createdAt.split('T')[0];

  return (
    <ModalSheet
      visible
      onClose={onClose}
      title={strings.detail.title}
      icon="reader-outline"
    >
      <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>

      <View style={[styles.description, { backgroundColor: colors.surfaceSecondary }]}>
        {task.description.length > 0 ? (
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {task.description}
          </Text>
        ) : (
          <Text style={[styles.descriptionEmpty, { color: colors.textMuted }]}>
            {strings.detail.noDescription}
          </Text>
        )}
      </View>

      <View style={[styles.rows, { borderColor: colors.divider }]}>
        <DetailRow label={strings.detail.statusLabel}>
          <View
            style={[
              styles.statusChip,
              {
                backgroundColor: task.completed ? colors.successSoft : colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name={task.completed ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={task.completed ? colors.success : colors.textSecondary}
            />
            <Text
              style={[
                styles.statusLabel,
                { color: task.completed ? colors.success : colors.textSecondary },
              ]}
            >
              {task.completed ? strings.detail.statusCompleted : strings.detail.statusPending}
            </Text>
          </View>
        </DetailRow>

        <DetailRow label={strings.detail.categoryLabel}>
          {category ? (
            <CategoryBadge name={category.name} color={category.color} />
          ) : (
            <Text style={[styles.valueText, { color: colors.textMuted }]}>
              {strings.categories.uncategorized}
            </Text>
          )}
        </DetailRow>

        <DetailRow label={strings.detail.dueLabel}>
          {task.dueDate ? (
            <DueDateBadge task={task} />
          ) : (
            <Text style={[styles.valueText, { color: colors.textMuted }]}>
              {strings.dueDate.none}
            </Text>
          )}
        </DetailRow>

        <DetailRow label={strings.priority.label}>
          {task.priority !== 'none' ? (
            <PriorityBadge priority={task.priority} />
          ) : (
            <Text style={[styles.valueText, { color: colors.textMuted }]}>
              {NONE_PRIORITY_LABEL}
            </Text>
          )}
        </DetailRow>

        <DetailRow label={strings.detail.createdLabel}>
          <Text style={[styles.valueText, { color: colors.textSecondary }]}>
            {formatFullDate(createdKey)}
          </Text>
        </DetailRow>
      </View>

      <View style={styles.actions}>
        <Button
          label={task.completed ? strings.detail.markPending : strings.detail.complete}
          icon={task.completed ? 'arrow-undo' : 'checkmark'}
          variant="primary"
          onPress={onToggle}
        />
        <View style={styles.actionRow}>
          <Button label={strings.detail.edit} icon="pencil" variant="secondary" style={styles.flex} onPress={onEdit} />
          <Button label={strings.detail.delete} icon="trash-outline" variant="text" tone="danger" style={styles.flex} onPress={onDelete} />
        </View>
      </View>
    </ModalSheet>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 29,
  },
  description: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  descriptionEmpty: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  rows: {
    marginTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    gap: spacing.md,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    marginTop: spacing.xl,
    flexDirection: 'column',
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    columnGap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});