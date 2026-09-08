import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CATEGORY_COLORS } from '@/constants/categoryColors';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useCategoryStoreHydrated } from '@/hooks/useCategoryStoreHydrated';
import { useTheme } from '@/hooks/useTheme';
import { useCategoryStore } from '@/store/categoryStore';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/store/toastStore';
import type { Category } from '@/types/category';
import { withHexAlpha } from '@/utils/color';
import { Button } from './Button';
import { ConfirmDialog } from './ConfirmDialog';
import { ModalSheet } from './ModalSheet';

interface CategoryManagerProps {
  visible: boolean;
  onClose: () => void;
}

export function CategoryManager({ visible, onClose }: CategoryManagerProps) {
  const { colors, isDark } = useTheme();
  const hydrated = useCategoryStoreHydrated();
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const tasks = useTaskStore((state) => state.tasks);
  const showToast = useToastStore((state) => state.show);

  const [editing, setEditing] = useState<Category | 'new' | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  const startNew = () => {
    setEditing('new');
    setName('');
    setColor(CATEGORY_COLORS[0]);
    setError('');
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setColor(category.color);
    setError('');
  };

  const cancelEdit = () => setEditing(null);

  const save = () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError(strings.categories.nameEmptyError);
      return;
    }
    try {
      if (editing === 'new') {
        addCategory(trimmed, color);
        showToast(strings.toast.categoryCreated);
      } else if (editing) {
        updateCategory(editing.id, { name: trimmed, color });
        showToast(strings.toast.categoryUpdated);
      }
      setEditing(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : strings.categories.nameEmptyError);
    }
  };

  const countFor = (id: string) => tasks.filter((task) => task.categoryId === id).length;

  return (
    <>
      <ModalSheet
        visible={visible}
        onClose={onClose}
        title={strings.categories.manageTitle}
        icon="pricetag-outline"
      >
        {!hydrated ? (
          <Text style={[styles.loading, { color: colors.textMuted }]}>
            {strings.home.loadingTasks}
          </Text>
        ) : (
          <>
            {!editing && (
              <Button
                label={strings.categories.new}
                icon="add"
                variant="secondary"
                style={styles.newButton}
                onPress={startNew}
              />
            )}

            {editing && (
              <View style={styles.form}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  {strings.categories.nameLabel}
                </Text>
                <TextInput
                  accessibilityLabel={strings.categories.nameLabel}
                  autoFocus
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (error) setError('');
                  }}
                  placeholder={strings.categories.namePlaceholder}
                  placeholderTextColor={colors.textMuted}
                  onSubmitEditing={save}
                  selectionColor={colors.primary}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceInput,
                      color: colors.text,
                      borderColor: error ? colors.danger : colors.border,
                    },
                  ]}
                />
                {error.length > 0 && (
                  <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>
                    {error}
                  </Text>
                )}

                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  {strings.categories.colorLabel}
                </Text>
                <View style={styles.swatches}>
                  {CATEGORY_COLORS.map((swatch) => {
                    const selected = swatch === color;
                    return (
                      <Pressable
                        key={swatch}
                        accessibilityRole="button"
                        accessibilityLabel={`Color ${swatch}`}
                        accessibilityState={{ selected }}
                        onPress={() => setColor(swatch)}
                        style={[
                          styles.swatchOuter,
                          selected && { borderColor: colors.primary },
                        ]}
                      >
                        <View style={[styles.swatch, { backgroundColor: swatch }]}>
                          {selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.formActions}>
                  <Button label={strings.categories.cancel} variant="secondary" style={styles.flex} onPress={cancelEdit} />
                  <Button label={strings.categories.save} variant="primary" style={styles.flex} onPress={save} />
                </View>
              </View>
            )}

            {categories.length === 0 && !editing && (
              <View style={styles.empty}>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {strings.categories.empty}
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {strings.categories.emptySubtitle}
                </Text>
              </View>
            )}

            <View style={styles.list}>
              {categories.map((category) => (
                <View
                  key={category.id}
                  style={[styles.row, { backgroundColor: colors.surfaceSecondary }]}
                >
                  <View
                    style={[
                      styles.rowDot,
                      { backgroundColor: withHexAlpha(category.color, isDark ? 0.3 : 0.16) },
                    ]}
                  >
                    <View style={[styles.dot, { backgroundColor: category.color }]} />
                  </View>
                  <View style={styles.rowBody}>
                    <Text numberOfLines={1} style={[styles.rowName, { color: colors.text }]}>
                      {category.name}
                    </Text>
                    <Text style={[styles.rowCount, { color: colors.textMuted }]}>
                      {strings.categories.count(countFor(category.id))}
                    </Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${strings.categories.edit} ${category.name}`}
                      hitSlop={6}
                      onPress={() => startEdit(category)}
                      style={({ pressed }) => [
                        styles.rowButton,
                        { backgroundColor: pressed ? colors.surfacePressed : 'transparent' },
                      ]}
                    >
                      <Ionicons name="pencil-outline" size={19} color={colors.textMuted} />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${strings.categories.delete} ${category.name}`}
                      hitSlop={6}
                      onPress={() => setPendingDelete(category)}
                      style={({ pressed }) => [
                        styles.rowButton,
                        { backgroundColor: pressed ? colors.dangerSoft : 'transparent' },
                      ]}
                    >
                      <Ionicons name="trash-outline" size={19} color={colors.danger} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ModalSheet>

      <ConfirmDialog
        visible={pendingDelete !== null}
        title={
          pendingDelete
            ? strings.categories.deleteTitle(pendingDelete.name)
            : ''
        }
        message={strings.categories.deleteMessage}
        confirmLabel={strings.confirm.delete}
        cancelLabel={strings.confirm.cancel}
        cancelDialogLabel={strings.confirm.cancelDialogLabel}
        onConfirm={() => {
          if (pendingDelete) {
            deleteCategory(pendingDelete.id);
            showToast(strings.toast.categoryDeleted);
          }
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  newButton: {
    marginBottom: spacing.lg,
  },
  form: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  swatchOuter: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formActions: {
    flexDirection: 'row',
    columnGap: spacing.sm,
    marginTop: spacing.lg,
  },
  flex: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13.5,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  list: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.sm,
    columnGap: spacing.sm,
  },
  rowDot: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  rowBody: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowCount: {
    fontSize: 12.5,
    marginTop: 1,
  },
  rowActions: {
    flexDirection: 'row',
    columnGap: spacing.xs,
  },
  rowButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});