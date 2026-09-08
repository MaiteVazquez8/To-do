import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { GestureResponderHandlers } from 'react-native';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { shadowStyles } from '@/constants/shadows';
import { smoothMotion } from '@/constants/motion';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types/category';
import type { Task } from '@/types/task';
import { CategoryBadge } from './CategoryBadge';
import { Checkbox } from './Checkbox';
import { DueDateBadge } from './DueDateBadge';
import { PriorityBadge } from './PriorityBadge';

type IconName = ComponentProps<typeof Ionicons>['name'];
type DragProps = GestureResponderHandlers;

interface TaskItemProps {
  task: Task;
  category?: Category | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
  /** Present when the task list is in manual order mode. */
  showHandle?: boolean;
  dragProps?: DragProps;
}

const TOGGLE_DURATION = 200;
const DELETE_DURATION = 190;

function TaskActionButton({
  icon,
  label,
  color,
  hoverBackground,
  onPress,
}: {
  icon: IconName;
  label: string;
  color: string;
  hoverBackground: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { hovered, interactionProps } = useInteractionState();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.06)', borderless: true }}
      {...interactionProps}
      style={({ pressed }) => [
        styles.actionButton,
        {
          backgroundColor: pressed ? colors.surfacePressed : hovered ? hoverBackground : 'transparent',
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

export function TaskItem({
  task,
  category,
  onToggle,
  onDelete,
  onPress,
  showHandle = false,
  dragProps,
}: TaskItemProps) {
  const { colors } = useTheme();
  const { hovered: bodyHovered, interactionProps: bodyInteraction } = useInteractionState();

  const completion = useSharedValue(task.completed ? 1 : 0);
  const deleting = useSharedValue(0);

  useEffect(() => {
    completion.value = withTiming(task.completed ? 1 : 0, { duration: TOGGLE_DURATION });
  }, [task.completed, completion]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: 1 - deleting.value,
    transform: [{ translateX: -36 * deleting.value }, { scale: 1 - 0.03 * deleting.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completion.value,
      [0, 1],
      [colors.text, colors.textSecondary]
    ),
  }));

const strikeStyle = useAnimatedStyle(() => ({
    opacity: completion.value,
    transform: [{ translateY: -1 }, { scaleX: completion.value }],
  }));

  const handleDelete = () => {
    'worklet';
    deleting.value = withTiming(1, { duration: DELETE_DURATION }, (finished) => {
      if (finished) {
        runOnJS(onDelete)(task.id);
      }
    });
  };

  const showBadges = Boolean(category) || task.priority !== 'none' || task.dueDate !== null;

  return (
    <Animated.View style={containerStyle}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          smoothMotion(),
          bodyHovered
            ? shadowStyles('md', colors.shadow)
            : shadowStyles('sm', colors.shadow),
        ]}
      >
        {showHandle && dragProps && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.taskItem.reorder}
            hitSlop={4}
            {...dragProps}
            style={styles.handle}
          >
            <Ionicons name="reorder-three" size={22} color={colors.textMuted} />
          </Pressable>
        )}

        <Checkbox
          checked={task.completed}
          onToggle={() => onToggle(task.id)}
          accessibilityLabel={
            task.completed
              ? strings.taskItem.markActive(task.title)
              : strings.taskItem.complete(task.title)
          }
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.taskItem.open(task.title)}
          onPress={() => onPress(task.id)}
          android_ripple={{ color: 'rgba(0, 0, 0, 0.04)', borderless: false }}
          {...bodyInteraction}
          style={({ pressed }) => [
            styles.body,
            {
              backgroundColor: pressed
                ? colors.surfacePressed
                : bodyHovered
                  ? colors.surfaceHover
                  : 'transparent',
            },
          ]}
        >
          <View style={styles.content}>
            <View style={styles.titleWrap}>
              <Animated.Text
                style={[styles.title, titleStyle]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {task.title}
              </Animated.Text>
              <Animated.View
                style={[
                  styles.strike,
                  { backgroundColor: colors.textSecondary, pointerEvents: 'none' },
                  strikeStyle,
                ]}
              />
            </View>

            {task.description.length > 0 && (
              <TextSnippet text={task.description} muted={task.completed} />
            )}

            {showBadges && (
              <View style={[styles.badges, { pointerEvents: 'none' }]}>
                {category && (
                  <CategoryBadge name={category.name} color={category.color} muted={task.completed} />
                )}
                <PriorityBadge priority={task.priority} />
                <DueDateBadge task={task} />
              </View>
            )}
          </View>
        </Pressable>

        <TaskActionButton
          icon="pencil-outline"
          label={strings.taskItem.edit(task.title)}
          color={colors.textMuted}
          hoverBackground={colors.primarySoft}
          onPress={() => onPress(task.id)}
        />
        <TaskActionButton
          icon="trash-outline"
          label={strings.taskItem.delete(task.title)}
          color={colors.textMuted}
          hoverBackground={colors.dangerSoft}
          onPress={handleDelete}
        />
      </Animated.View>
    </Animated.View>
  );
}

function TextSnippet({ text, muted }: { text: string; muted: boolean }) {
  const { colors } = useTheme();
  return (
    <Animated.Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={[
        styles.snippet,
        { color: muted ? colors.textMuted : colors.textSecondary },
      ]}
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    columnGap: spacing.xs,
  },
  handle: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.xs,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    marginLeft: spacing.xs,
    borderRadius: radius.md,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  titleWrap: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    flex: 1,
  },
  snippet: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  strike: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 2,
    borderRadius: 1,
    transformOrigin: 'left center',
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
});