import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { withHexAlpha } from '@/utils/color';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface SectionHeaderProps {
  title: string;
  count: number;
  icon?: IconName;
}

export function SectionHeader({ title, count, icon }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {icon && (
        <View style={[styles.icon, { backgroundColor: withHexAlpha(colors.primary, 0.14) }]}>
          <Ionicons name={icon} size={14} color={colors.primary} />
        </View>
      )}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.count, { color: colors.textMuted }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  icon: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});