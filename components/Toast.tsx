import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shadowStyles } from '@/constants/shadows';
import { radius, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { useToastStore, type ToastTone } from '@/store/toastStore';

const TONE_ICON: Record<ToastTone, 'checkmark-circle' | 'alert-circle' | 'information-circle'> = {
  success: 'checkmark-circle',
  danger: 'alert-circle',
  info: 'information-circle',
};

const TONE_COLOR: Record<ToastTone, 'success' | 'danger' | 'primary'> = {
  success: 'success',
  danger: 'danger',
  info: 'primary',
};

export function Toast() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToastStore((state) => state.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      useToastStore.getState().hide();
    }, 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const toneKey = TONE_COLOR[toast.tone];
  const color = colors[toneKey];

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      style={[styles.host, { top: insets.top + spacing.sm, pointerEvents: 'none' }]}
    >
      <View
        style={[
          styles.toast,
          { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          shadowStyles('md', colors.shadow),
        ]}
      >
        <Ionicons name={TONE_ICON[toast.tone]} size={20} color={color} />
        <Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    maxWidth: 420,
    marginHorizontal: spacing.xl,
    opacity: 0.98,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
});