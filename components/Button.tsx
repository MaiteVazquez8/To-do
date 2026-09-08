import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { focusRingStyle, shadowStyles } from '@/constants/shadows';
import { smoothMotion } from '@/constants/motion';
import { radius, spacing } from '@/constants/spacing';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';
type ButtonTone = 'default' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  tone = 'default',
  size = 'md',
  icon,
  disabled = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const { focused, hovered, interactionProps } = useInteractionState();

  const isFilled = variant === 'primary' || variant === 'danger';
  const isText = variant === 'text';

  const backgroundColor = () => {
    if (disabled) {
      return isFilled ? colors.surfacePressed : isText ? 'transparent' : colors.surface;
    }
    switch (variant) {
      case 'primary':
        return hovered ? colors.primaryHover : colors.primary;
      case 'danger':
        return hovered ? colors.dangerPressed : colors.danger;
      case 'secondary':
        return hovered ? colors.surfaceHover : colors.surface;
      default:
        if (hovered) {
          return tone === 'danger' ? colors.dangerSoft : colors.primarySoft;
        }
        return 'transparent';
    }
  };

  const labelColor = disabled
    ? colors.textMuted
    : isFilled
      ? colors.onPrimary
      : variant === 'secondary'
        ? colors.text
        : tone === 'danger'
          ? colors.danger
          : colors.primary;

  const shape =
    variant === 'text'
      ? size === 'sm'
        ? styles.textSm
        : styles.textMd
      : size === 'sm'
        ? styles.filledSm
        : styles.filledMd;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={
        isFilled && !disabled
          ? { color: 'rgba(255, 255, 255, 0.22)', borderless: false }
          : undefined
      }
      {...interactionProps}
      style={({ pressed }) => [
        styles.base,
        shape,
        smoothMotion(),
        {
          backgroundColor: backgroundColor(),
          borderColor: variant === 'secondary' ? colors.border : 'transparent',
          opacity: disabled ? 0.5 : 1,
          transform: [
            { translateY: hovered && !disabled && !isText ? -1 : 0 },
            { scale: pressed && !disabled && !isText ? 0.97 : 1 },
          ],
        },
        icon ? styles.withIcon : null,
        isFilled && variant === 'primary'
          ? shadowStyles(hovered ? 'md' : 'sm', colors.shadow)
          : null,
        focused ? focusRingStyle(tone === 'danger' ? colors.danger : colors.focus) : null,
        style,
      ]}
    >
      {icon && (
        <Ionicons name={icon} size={size === 'sm' ? 18 : 20} color={labelColor} />
      )}
      <Text
        style={[
          styles.label,
          size === 'sm' ? styles.smLabel : styles.mdLabel,
          { color: labelColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledMd: {
    minHeight: 54,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.lg,
  },
  filledSm: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  textMd: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  textSm: {
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  withIcon: {
    columnGap: spacing.sm,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  smLabel: {
    fontSize: 14.5,
  },
  mdLabel: {
    fontSize: 16,
  },
});