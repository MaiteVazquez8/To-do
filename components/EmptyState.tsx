import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { shadowStyles } from '@/constants/shadows';
import { radius, spacing } from '@/constants/spacing';
import { strings } from '@/constants/strings';
import { useTheme } from '@/hooks/useTheme';
import { withHexAlpha } from '@/utils/color';

export type EmptyVariant = 'all' | 'active' | 'completed' | 'uncategorized' | 'search' | 'date';

interface EmptyStateProps {
  variant: EmptyVariant;
}

export function EmptyState({ variant }: EmptyStateProps) {
  const { colors } = useTheme();
  const copy =
    variant === 'search'
      ? strings.empty.search
      : strings.empty[variant];

  return (
    <View style={styles.container}>
      <View style={styles.iconBlock}>
        <View
          style={[styles.halo, { backgroundColor: withHexAlpha(colors.primary, 0.1) }]}
        />
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: colors.primarySoft,
              borderColor: withHexAlpha(colors.primary, 0.35),
            },
            shadowStyles('sm', colors.shadow),
          ]}
        >
          <Ionicons name={copy.icon} size={36} color={colors.primary} />
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{copy.title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {copy.subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.md,
  },
  iconBlock: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  halo: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 999,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});