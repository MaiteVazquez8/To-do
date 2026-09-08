import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { smoothMotion } from '@/constants/motion';
import { shadowStyles } from '@/constants/shadows';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';
import { addDaysKey, formatShortDate, todayKey } from '@/utils/date';
import { Calendar } from './Calendar';

interface DateSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

function friendlyLabel(key: string): string {
  const today = todayKey();
  if (key === today) return strings.dueDate.today;
  if (key === addDaysKey(1)) return strings.dueDate.tomorrow;
  return formatShortDate(key);
}

export function DateSelect({ value, onChange }: DateSelectProps) {
  const { colors } = useTheme();
  const { focused, interactionProps } = useInteractionState();
  const [open, setOpen] = useState(false);

  const quickOptions = [
    { key: null, label: strings.dueDate.quickNone },
    { key: todayKey(), label: strings.dueDate.quickToday },
    { key: addDaysKey(1), label: strings.dueDate.quickTomorrow },
    { key: addDaysKey(7), label: strings.dueDate.quickInWeek },
  ];

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={strings.dueDate.label}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((current) => !current)}
        android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
        {...interactionProps}
        style={({ pressed }) => [
          styles.trigger,
          smoothMotion(),
          {
            backgroundColor: pressed ? colors.surfaceHover : colors.surfaceInput,
            borderColor: focused ? colors.primary : colors.border,
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
        <Text style={[styles.triggerLabel, { color: value ? colors.text : colors.textMuted }]}>
          {value ? friendlyLabel(value) : strings.dueDate.none}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </Pressable>

      {open && (
        <View
          style={[
            styles.panel,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            shadowStyles('md', colors.shadow),
          ]}
        >
          <View style={styles.chipRow}>
            {quickOptions.map((option) => {
              const active = option.key === value;
              return (
                <Pressable
                  key={option.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => onChange(option.key)}
                  style={[
                    styles.chip,
                    smoothMotion(120),
                    {
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: active ? colors.onPrimary : colors.textSecondary },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Calendar selected={value} onSelect={onChange} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  triggerLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  panel: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});