import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { GestureResponderHandlers, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/Button';
import { Calendar } from '@/components/Calendar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CategoryManager } from '@/components/CategoryManager';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DraggableTaskList } from '@/components/DraggableTaskList';
import { Dropdown } from '@/components/Dropdown';
import { EmptyState, type EmptyVariant } from '@/components/EmptyState';
import { FilterTabs } from '@/components/FilterTabs';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchBar } from '@/components/SearchBar';
import { TaskDetails } from '@/components/TaskDetails';
import { TaskItem } from '@/components/TaskItem';
import { TaskList } from '@/components/TaskList';
import { smoothMotion } from '@/constants/motion';
import { shadowStyles } from '@/constants/shadows';
import { SORT_OPTIONS } from '@/constants/sort';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useCategoryStoreHydrated } from '@/hooks/useCategoryStoreHydrated';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import {
  useTaskQuery,
  UNCATEGORIZED,
  type CategoryFilter as CategoryFilterValue,
} from '@/hooks/useTaskQuery';
import { useTaskStoreHydrated } from '@/hooks/useTaskStoreHydrated';
import { useTheme } from '@/hooks/useTheme';
import { useCategoryStore } from '@/store/categoryStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/store/toastStore';
import type { Filter } from '@/types/filter';
import type { SortKey } from '@/types/sort';
import type { Task } from '@/types/task';
import { withHexAlpha } from '@/utils/color';
import { formatFullDate, todayLiteral } from '@/utils/date';
import { buildSections } from '@/utils/sections';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return strings.greeting.morning;
  if (hour < 18) return strings.greeting.afternoon;
  return strings.greeting.evening;
}

const SECTION_TITLES = {
  overdue: strings.sections.overdue,
  today: strings.sections.today,
  tomorrow: strings.sections.tomorrow,
  upcoming: strings.sections.upcoming,
  noDate: strings.sections.noDate,
  completed: strings.sections.completed,
};

function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { hovered, focused, interactionProps } = useInteractionState();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      {...interactionProps}
      style={[
        styles.iconButton,
        smoothMotion(),
        {
          backgroundColor: hovered ? colors.surfaceHover : colors.surfaceInput,
          borderColor: focused ? colors.primary : colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

function CalendarToggle({
  open,
  onPress,
}: {
  open: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { hovered, focused, interactionProps } = useInteractionState();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={strings.home.calendarAccessibility}
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      {...interactionProps}
      style={[
        styles.calendarToggle,
        smoothMotion(),
        {
          backgroundColor: hovered ? colors.surfaceHover : colors.surfaceInput,
          borderColor: focused ? colors.primary : colors.border,
        },
      ]}
    >
      <Ionicons name="calendar-outline" size={18} color={colors.primary} />
      <Text style={[styles.calendarToggleLabel, { color: colors.text }]}>
        {strings.home.calendarToggle}
      </Text>
      <Ionicons
        name={open ? 'chevron-up' : 'chevron-down'}
        size={16}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

function AmbientGlow() {
  const { colors } = useTheme();
  if (Platform.OS !== 'web') return null;
  const center = withHexAlpha(colors.primary, 0.18);
  const edge = withHexAlpha(colors.primary, 0);
  return (
    <View
      style={[
        styles.ambientGlow,
        {
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          backgroundImage: `radial-gradient(640px 320px at 50% 0%, ${center}, ${edge})`,
        } as ComponentProps<typeof View>['style'],
      ]}
    />
  );
}

function StatChip({
  icon,
  value,
  label,
  iconColor,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  value: number;
  label: string;
  iconColor: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statChip, { backgroundColor: colors.surfaceInput, borderColor: colors.border }]}>
      <View style={styles.statChipMain}>
        <Ionicons name={icon} size={15} color={iconColor} />
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.statLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const taskHydrated = useTaskStoreHydrated();
  const categoryHydrated = useCategoryStoreHydrated();

  const [status, setStatus] = useState<Filter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterValue>('all');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [clearDialog, setClearDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const searchRef = useRef<TextInput>(null);

  const sortBy = useSettingsStore((state) => state.sortBy);
  const setSortBy = useSettingsStore((state) => state.setSortBy);

  const tasks = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const clearCompleted = useTaskStore((state) => state.clearCompleted);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const categories = useCategoryStore((state) => state.categories);
  const showToast = useToastStore((state) => state.show);

  const { tasks: visible } = useTaskQuery({ status, categoryFilter, search, sortBy, date: dateFilter });

  const datesWithTasks = useMemo(
    () =>
      new Set(tasks.filter((task) => task.dueDate !== null).map((task) => task.dueDate as string)),
    [tasks]
  );

  const activeCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );
  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );
  const totalCount = tasks.length;
  const percentDone =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );
  const uncategorizedCount = useMemo(
    () => tasks.filter((task) => task.categoryId === null).length,
    [tasks]
  );

  const detailsTask = detailsId
    ? tasks.find((task) => task.id === detailsId) ?? null
    : null;

  const useSections = status === 'all' && sortBy === 'dueDate';

  const sections = useMemo(() => {
    if (useSections) {
      return buildSections(visible, SECTION_TITLES);
    }
    return [{ key: 'noDate' as const, title: '', count: visible.length, tasks: visible }];
  }, [visible, useSections]);

  const handleToggle = (task: Task) => {
    toggleTask(task.id);
    showToast(
      task.completed ? strings.toast.taskReopened : strings.toast.taskCompleted
    );
  };

  const renderTask = (task: Task, dragProps?: GestureResponderHandlers) => (
    <TaskItem
      task={task}
      category={categoriesById.get(task.categoryId ?? '') ?? null}
      showHandle={dragProps != null}
      dragProps={dragProps}
      onToggle={() => handleToggle(task)}
      onDelete={(id) => {
        deleteTask(id);
        showToast(strings.toast.taskDeleted);
      }}
      onPress={(id) => setDetailsId(id)}
    />
  );

  const emptyVariant: EmptyVariant = dateFilter
    ? 'date'
    : search.trim()
      ? 'search'
      : status === 'completed'
        ? 'completed'
        : status === 'active'
          ? 'active'
          : categoryFilter === UNCATEGORIZED && uncategorizedCount > 0
            ? 'uncategorized'
            : 'all';

  const listContentStyle = styles.listContent;

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;
    deleteTask(deleteTarget.id);
    showToast(strings.toast.taskDeleted);
    if (detailsId === deleteTarget.id) {
      setDetailsId(null);
    }
    setDeleteTarget(null);
  };

  const handleEscape = () => {
    if (deleteTarget) {
      setDeleteTarget(null);
    } else if (clearDialog) {
      setClearDialog(false);
    } else if (detailsId) {
      setDetailsId(null);
    } else if (categoryManagerOpen) {
      setCategoryManagerOpen(false);
    }
  };

  useKeyboardShortcuts({
    onNewTask: () => router.push('/task/new'),
    onFocusSearch: () => searchRef.current?.focus(),
    onEscape: handleEscape,
  });

  const openEditFor = (id: string) => {
    setDetailsId(null);
    router.push({ pathname: '/task/[id]', params: { id } });
  };

  const handleDaySelect = (key: string) => {
    setDateFilter((prev) => (prev === key ? null : key));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <AmbientGlow />
      <ScreenContainer>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View style={styles.titleBlock}>
              <Text numberOfLines={1} style={[styles.greeting, { color: colors.text }]}>{getGreeting()}</Text>
              <Text numberOfLines={1} style={[styles.dateLine, { color: colors.textMuted }]}>{todayLiteral()}</Text>
            </View>
            <IconButton
              icon="pricetag-outline"
              label={strings.home.manageCategoriesLabel}
              onPress={() => setCategoryManagerOpen(true)}
            />
          </View>

          <View style={styles.addTaskWrap}>
            <Button
              label={strings.home.addTaskLabel}
              icon="add"
              size="md"
              style={styles.addTaskButton}
              onPress={() => router.push('/task/new')}
            />
          </View>

          <View style={[styles.pendingRow, styles.pendingRowWrap]}>
            <Text style={[styles.pendingLine, { color: colors.textSecondary }]}>
              {activeCount === 0 ? strings.home.allClear : strings.home.pendingCount(activeCount)}
            </Text>
            {completedCount > 0 && (
              <Button
                label={strings.home.clearCompleted}
                icon="trash-outline"
                variant="text"
                tone="danger"
                size="sm"
                onPress={() => setClearDialog(true)}
              />
            )}
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderTopColor: colors.primary,
                borderTopWidth: 3,
              },
              shadowStyles('md', colors.shadow),
            ]}
          >
            <View style={styles.progressRow}>
              <Text style={[styles.progressTitle, { color: colors.textMuted }]}>
                {strings.home.progressTitle}
              </Text>
              <Text style={[styles.percentLabel, { color: colors.primary }]}>
                {percentDone}
                <Text style={[styles.percentUnit, { color: colors.textMuted }]}>%</Text>
              </Text>
            </View>
            <ProgressBar value={percentDone / 100} />
            <View style={styles.statRow}>
              <StatChip
                icon="checkbox-outline"
                value={totalCount}
                label={strings.stats.tasksLabel(totalCount)}
                iconColor={colors.textSecondary}
              />
              <StatChip
                icon="ellipse-outline"
                value={activeCount}
                label={strings.stats.pendingLabel(activeCount)}
                iconColor={colors.primary}
              />
              <StatChip
                icon="checkmark-done-outline"
                value={completedCount}
                label={strings.stats.completedLabel(completedCount)}
                iconColor={colors.success}
              />
            </View>
          </View>

          <View style={styles.calendarWrap}>
            <CalendarToggle open={calendarOpen} onPress={() => setCalendarOpen((value) => !value)} />
            {calendarOpen && (
              <View
                style={[
                  styles.calendarCard,
                  { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                ]}
              >
                <Calendar
                  selected={dateFilter}
                  onSelect={handleDaySelect}
                  markers={datesWithTasks}
                />
              </View>
            )}
          </View>

          <View style={styles.searchWrap}>
            <SearchBar value={search} onChange={setSearch} inputRef={searchRef} />
          </View>

          <FilterTabs value={status} onChange={setStatus} />

          {categoryHydrated && categories.length > 0 && (
            <View style={styles.categoryWrap}>
              <CategoryFilter
                categories={categories}
                uncategorizedCount={uncategorizedCount}
                value={categoryFilter}
                onChange={setCategoryFilter}
                hasUncategorized={uncategorizedCount > 0}
              />
            </View>
          )}

          <View style={styles.sortRow}>
            <Text style={[styles.sortLabel, { color: colors.textMuted }]}>
              {strings.sort.label}
            </Text>
            <Dropdown
              value={sortBy}
              options={SORT_OPTIONS}
              onChange={(value) => setSortBy(value as SortKey)}
              accessibilityLabel={strings.sort.optionsLabel}
              icon="swap-vertical"
              style={styles.sortDropdown}
            />
          </View>
        </View>

        {dateFilter && (
          <View style={styles.dateFilterWrap}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={strings.home.dateFilterAccessibility}
              onPress={() => setDateFilter(null)}
              style={({ pressed }) => [
                styles.dateFilterChip,
                smoothMotion(),
                {
                  backgroundColor: pressed ? colors.primarySoft : colors.surfaceElevated,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Ionicons name="calendar" size={14} color={colors.primary} />
              <Text style={[styles.dateFilterLabel, { color: colors.text }]}>
                {formatFullDate(dateFilter)}
              </Text>
              <Ionicons name="close" size={16} color={colors.primary} />
            </Pressable>
          </View>
        )}

        {!taskHydrated ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : visible.length === 0 ? (
          <EmptyState variant={emptyVariant} />
        ) : sortBy === 'manual' ? (
          <DraggableTaskList tasks={visible} onReorder={reorderTasks} renderRow={renderTask} />
        ) : (
          <TaskList
            sections={sections}
            showSectionHeaders={useSections}
            renderItem={renderTask}
            listEmptyComponent={null}
            contentContainerStyle={listContentStyle}
          />
        )}

        <ConfirmDialog
          visible={clearDialog}
          title={strings.confirm.clearCompletedTitle}
          message={strings.confirm.clearCompletedMessage}
          confirmLabel={strings.confirm.delete}
          cancelLabel={strings.confirm.cancel}
          cancelDialogLabel={strings.confirm.cancelDialogLabel}
          onConfirm={() => {
            clearCompleted();
            setClearDialog(false);
            showToast(strings.toast.clearedCompleted);
          }}
          onCancel={() => setClearDialog(false)}
        />

        <ConfirmDialog
          visible={deleteTarget !== null}
          title={
            deleteTarget ? strings.confirm.deleteTaskTitle(deleteTarget.title) : ''
          }
          message={strings.confirm.deleteTaskMessage}
          confirmLabel={strings.confirm.delete}
          cancelLabel={strings.confirm.cancel}
          cancelDialogLabel={strings.confirm.cancelDialogLabel}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />

        <TaskDetails
          task={detailsTask}
          category={
            detailsTask ? (categoriesById.get(detailsTask.categoryId ?? '') ?? null) : null
          }
          onClose={() => setDetailsId(null)}
          onToggle={() => detailsTask && handleToggle(detailsTask)}
          onEdit={() => detailsId && openEditFor(detailsId)}
          onDelete={() => detailsTask && setDeleteTarget(detailsTask)}
        />

        <CategoryManager
          visible={categoryManagerOpen}
          onClose={() => setCategoryManagerOpen(false)}
        />

        <FloatingActionButton
          accessibilityLabel={strings.home.addTaskLabel}
          onPress={() => router.push('/task/new')}
        />
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  dateLine: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskWrap: {
    marginTop: spacing.md,
  },
  addTaskButton: {
    width: '100%',
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
    marginTop: spacing.xs,
  },
  pendingRowWrap: {
    flexWrap: 'wrap',
    rowGap: spacing.xs,
  },
  pendingLine: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  percentLabel: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  percentUnit: {
    fontSize: 15,
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    columnGap: spacing.sm,
    marginTop: spacing.md,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 3,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  statChipMain: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  ambientGlow: {
    position: 'absolute',
    top: -110,
    left: -80,
    right: -80,
    height: 320,
  },
  calendarWrap: {
    marginTop: spacing.md,
  },
  calendarToggle: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  calendarToggleLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  calendarCard: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  dateFilterWrap: {
    paddingTop: spacing.lg,
  },
  dateFilterChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dateFilterLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  searchWrap: {
    marginTop: spacing.lg,
  },
  categoryWrap: {
    marginTop: spacing.md,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    marginTop: spacing.md,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 0,
  },
  sortDropdown: {
    flex: 1,
  },
  loader: {
    marginTop: spacing.xxl * 2,
  },
  listContent: {
    paddingTop: spacing.lg,
    paddingBottom: 120,
    flexGrow: 1,
  },
});