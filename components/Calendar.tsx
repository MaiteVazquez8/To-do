import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { smoothMotion } from '@/constants/motion';
import { radius, spacing } from '@/constants/spacing';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';
import {
  MONTHS_FULL,
  toDateKey,
  todayKey,
} from '@/utils/date';

const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

interface CalendarProps {
  selected: string | null;
  onSelect: (key: string) => void;
  /** Due dates that have tasks; rendered as a small dot under the day number. */
  markers?: ReadonlySet<string>;
}

export function Calendar({ selected, onSelect, markers }: CalendarProps) {
  const { colors } = useTheme();
  const initialView =
    selected && /^\d{4}-\d{2}-\d{2}$/.test(selected)
      ? (() => {
          const [y, m] = selected.split('-').map(Number);
          return new Date(y, m - 1, 1);
        })()
      : (() => {
          const now = new Date();
          return new Date(now.getFullYear(), now.getMonth(), 1);
        })();

  const [view, setView] = useState(initialView);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mes anterior"
          hitSlop={8}
          onPress={goPrev}
          style={({ pressed }) => [
            styles.nav,
            smoothMotion(),
            { backgroundColor: pressed ? colors.surfaceHover : colors.surfaceInput },
          ]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.monthLabel, { color: colors.text }]}>
          {MONTHS_FULL[month]} {year}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mes siguiente"
          hitSlop={8}
          onPress={goNext}
          style={({ pressed }) => [
            styles.nav,
            smoothMotion(),
            { backgroundColor: pressed ? colors.surfaceHover : colors.surfaceInput },
          ]}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((label, index) => (
          <Text key={`weekday-${index}`} style={[styles.weekDay, { color: colors.textMuted }]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }
          const key = toDateKey(new Date(year, month, day));
          return (
            <DayCell
              key={key}
              day={day}
              dateKey={key}
              selected={key === selected}
              hasMarker={markers?.has(key) ?? false}
              onSelect={onSelect}
            />
          );
        })}
      </View>
    </View>
  );
}

function DayCell({
  day,
  dateKey,
  selected,
  hasMarker,
  onSelect,
}: {
  day: number;
  dateKey: string;
  selected: boolean;
  hasMarker: boolean;
  onSelect: (key: string) => void;
}) {
  const { colors } = useTheme();
  const { hovered, interactionProps } = useInteractionState();
  const isToday = dateKey === todayKey();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={dateKey}
      accessibilityState={{ selected }}
      onPress={() => onSelect(dateKey)}
      {...interactionProps}
      style={styles.cell}
    >
      <View
        style={[
          styles.day,
          smoothMotion(),
          {
            backgroundColor: selected
              ? colors.primary
              : hovered
                ? colors.surfaceHover
                : 'transparent',
            borderColor: isToday && !selected ? colors.primary : 'transparent',
            borderWidth: isToday && !selected ? 1.5 : 0,
          },
        ]}
      >
        <Text
          style={[
            styles.dayLabel,
            {
              color: selected
                ? colors.onPrimary
                : isToday
                  ? colors.primary
                  : colors.text,
            },
          ]}
        >
          {day}
        </Text>
      </View>
      <View
        style={[
          styles.marker,
          {
            backgroundColor: selected ? 'transparent' : colors.primary,
            opacity: hasMarker && !selected ? 1 : 0,
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  nav: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  cell: {
    width: '14.2857%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  marker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});