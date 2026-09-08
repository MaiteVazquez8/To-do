import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { PanResponder, ScrollView, StyleSheet } from 'react-native';
import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { shadowStyles } from '@/constants/shadows';
import type { Task } from '@/types/task';

type DragHandlers = GestureResponderHandlers & { tabIndex?: number };

interface DraggableTaskListProps {
  tasks: Task[];
  renderRow: (task: Task, dragHandlers?: DragHandlers) => React.ReactNode;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

/**
 * Lightweight manual reordering. A drag handle on each row claims the gesture
 * responder, so it never conflicts with scrolling (the row content itself is
 * untouched). Reordering updates the persisted order in real time; when the
 * finger lifts, the list simply keeps its new arrangement.
 */
export function DraggableTaskList({ tasks, renderRow, onReorder }: DraggableTaskListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [, forceUpdate] = useReducer((value: number) => value + 1, 0);
  const heights = useRef<Record<string, number>>({}).current;
  const dragRef = useRef({ id: '', index: -1 }).current;

  const start = (id: string, index: number) => {
    dragRef.id = id;
    dragRef.index = index;
    setDraggingId(id);
  };

  const move = (dy: number) => {
    const ids = tasks.map((task) => task.id);
    const from = ids.indexOf(dragRef.id);
    if (from < 0) return;

    let target = from;
    let consumed = 0;
    const step = dy >= 0 ? 1 : -1;
    while (true) {
      const next = target + step;
      if (next < 0 || next >= ids.length) break;
      const neighbor = ids[next];
      const midline = consumed + (heights[neighbor] ?? 76) / 2;
      if (Math.abs(dy) > midline) {
        target = next;
        consumed = midline;
      } else {
        break;
      }
    }

    if (target !== from) {
      onReorder(from, target);
      forceUpdate();
    }
  };

  const release = () => setDraggingId(null);

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {tasks.map((task, index) => (
        <DraggableRow
          key={task.id}
          task={task}
          isDragging={draggingId === task.id}
          onLayout={(height) => {
            heights[task.id] = height;
          }}
          onStart={() => start(task.id, index)}
          onMove={move}
          onRelease={release}
          renderRow={renderRow}
        />
      ))}
    </ScrollView>
  );
}

interface DraggableRowProps {
  task: Task;
  isDragging: boolean;
  onLayout: (height: number) => void;
  onStart: () => void;
  onMove: (dy: number) => void;
  onRelease: () => void;
  renderRow: (task: Task, dragHandlers?: DragHandlers) => React.ReactNode;
}

function DraggableRow({
  task,
  isDragging,
  onLayout,
  onStart,
  onMove,
  onRelease,
  renderRow,
}: DraggableRowProps) {
  const translateY = useSharedValue(0);
  const onStartRef = useRef(onStart);
  const onMoveRef = useRef(onMove);
  const onReleaseRef = useRef(onRelease);

  useEffect(() => {
    onStartRef.current = onStart;
    onMoveRef.current = onMove;
    onReleaseRef.current = onRelease;
  });

  const panHandlers = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- PanResponder callbacks are event handlers, not render reads
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderGrant: () => {
          onStartRef.current();
        },
        onPanResponderMove: (_event, gesture) => {
          // eslint-disable-next-line react-hooks/immutability -- shared values are meant to be mutated
          translateY.value = gesture.dy;
          onMoveRef.current(gesture.dy);
        },
        onPanResponderRelease: () => {
          // eslint-disable-next-line react-hooks/immutability -- shared values are meant to be mutated
          translateY.value = withTiming(0, { duration: 160 });
          onReleaseRef.current();
        },
        onPanResponderTerminate: () => {
          // eslint-disable-next-line react-hooks/immutability -- shared values are meant to be mutated
          translateY.value = withTiming(0, { duration: 160 });
          onReleaseRef.current();
        },
      }).panHandlers,
    [translateY]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        isDragging ? [styles.dragging, shadowStyles('md')] : styles.rowSpacing,
      ]}
      onLayout={(event: LayoutChangeEvent) => onLayout(event.nativeEvent.layout.height)}
    >
      {renderRow(task, panHandlers)}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 120,
  },
  rowSpacing: {
    marginBottom: 8,
  },
  dragging: {
    zIndex: 10,
    elevation: 10,
    marginBottom: 0,
    opacity: 0.96,
  },
});