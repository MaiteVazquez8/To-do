import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { smoothMotion } from '@/constants/motion';
import { PRIORITY_OPTIONS } from '@/constants/priorities';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useTheme } from '@/hooks/useTheme';
import { useCategoryStore } from '@/store/categoryStore';
import type { Priority, TaskInput } from '@/types/task';
import { Button } from './Button';
import { DateSelect } from './DateSelect';
import { Dropdown } from './Dropdown';

interface TaskFormProps {
  initial?: Partial<TaskInput>;
  submitLabel: string;
  onSubmit: (input: TaskInput) => void;
}

const MAX_TITLE_LENGTH = 200;
const NO_CATEGORY = '__none__';

export function TaskForm({ initial = {}, submitLabel, onSubmit }: TaskFormProps) {
  const { colors } = useTheme();
  const categories = useCategoryStore((state) => state.categories);

  const [title, setTitle] = useState(initial.title ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [categoryId, setCategoryId] = useState<string>(initial.categoryId ?? NO_CATEGORY);
  const [priority, setPriority] = useState<Priority>(initial.priority ?? 'none');
  const [dueDate, setDueDate] = useState<string | null>(initial.dueDate ?? null);
  const [submitted, setSubmitted] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const trimmed = title.trim();
  const hasError = submitted && trimmed.length === 0;
  const canSubmit = trimmed.length > 0;

  const handleSubmit = () => {
    setSubmitted(true);
    if (trimmed.length === 0) {
      return;
    }
    onSubmit({
      title: trimmed,
      description,
      categoryId: categoryId === NO_CATEGORY ? null : categoryId,
      priority,
      dueDate,
    });
  };

  const categoryOptions = [
    { key: NO_CATEGORY, label: strings.categories.uncategorized },
    ...categories.map((category) => ({ key: category.id, label: category.name })),
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {strings.form.titleLabel}
      </Text>
      <TextInput
        accessibilityLabel={strings.form.titleAccessibilityLabel}
        autoFocus
        multiline
        maxLength={MAX_TITLE_LENGTH}
        placeholder={strings.form.titlePlaceholder}
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={(value) => {
          setTitle(value);
          if (hasError) setSubmitted(false);
        }}
        onFocus={() => setTitleFocused(true)}
        onBlur={() => setTitleFocused(false)}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        selectionColor={colors.primary}
        style={[
          styles.input,
          styles.growInput,
          smoothMotion(),
          {
            backgroundColor: colors.surfaceInput,
            color: colors.text,
            borderColor: hasError ? colors.danger : titleFocused ? colors.primary : colors.border,
          },
        ]}
      />
      {hasError && (
        <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>
          {strings.form.emptyError}
        </Text>
      )}

      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {strings.form.descriptionLabel}
      </Text>
      <TextInput
        accessibilityLabel={strings.form.descriptionAccessibilityLabel}
        multiline
        placeholder={strings.form.descriptionPlaceholder}
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={setDescription}
        onFocus={() => setDescFocused(true)}
        onBlur={() => setDescFocused(false)}
        selectionColor={colors.primary}
        style={[
          styles.input,
          styles.descriptionInput,
          smoothMotion(),
          {
            backgroundColor: colors.surfaceInput,
            color: colors.text,
            borderColor: descFocused ? colors.primary : colors.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {strings.form.categoryLabel}
      </Text>
      <Dropdown
        value={categoryId}
        options={categoryOptions}
        onChange={setCategoryId}
        accessibilityLabel={strings.form.categoryLabel}
        icon="pricetag-outline"
        style={styles.select}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {strings.form.priorityLabel}
      </Text>
      <Dropdown
        value={priority}
        options={PRIORITY_OPTIONS}
        onChange={(value) => setPriority(value as Priority)}
        accessibilityLabel={strings.form.priorityLabel}
        icon="flag-outline"
        style={styles.select}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {strings.form.dueDateLabel}
      </Text>
      <DateSelect value={dueDate} onChange={setDueDate} />

      <View style={styles.counterRow}>
        <Text style={[styles.counter, { color: colors.textMuted }]}>
          {strings.form.counter(title.length, MAX_TITLE_LENGTH)}
        </Text>
      </View>

      <Button
        label={submitLabel}
        variant="primary"
        disabled={!canSubmit}
        style={styles.submit}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.md,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  growInput: {
    minHeight: 60,
  },
  descriptionInput: {
    minHeight: 96,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  select: {
    marginBottom: spacing.lg,
  },
  counterRow: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  counter: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  submit: {
    marginTop: spacing.lg,
  },
});