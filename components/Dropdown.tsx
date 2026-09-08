import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import { focusRingStyle, shadowStyles } from '@/constants/shadows';
import { smoothMotion } from '@/constants/motion';
import { radius, spacing } from '@/constants/spacing';
import { useInteractionState } from '@/hooks/useInteractionState';
import { useTheme } from '@/hooks/useTheme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface DropdownOption {
  key: string;
  label: string;
}

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  accessibilityLabel: string;
  icon?: IconName;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

const PANEL_MAX_HEIGHT = 320;

export function Dropdown({
  value,
  options,
  onChange,
  accessibilityLabel,
  icon,
  placeholder,
  style,
}: DropdownProps) {
  const { colors } = useTheme();
  const { focused, interactionProps } = useInteractionState();
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const selected = options.find((option) => option.key === value);

  const handleOpen = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      // Provisional position so the panel renders immediately; the real
      // placement is refined on first layout (keeps the panel inside the
      // viewport). Without this, the panel could never open because it only
      // positions itself through its own `onLayout`.
      setAlign({ left: Math.max(8, x), top: y + height + 6 });
      setOpen(true);
    });
  };

  const handlePanelLayout = (event: LayoutChangeEvent) => {
    if (!anchor) return;
    const { width, height } = event.nativeEvent.layout;
    const screenWidth = Math.max(width, 360);
    const left = Math.max(8, Math.min(anchor.x, anchor.x + anchor.width - screenWidth));
    const spaceBelow = anchor.y + anchor.height;
    const top =
      spaceBelow + height > screenHeight() ? Math.max(8, spaceBelow - height - 6) : spaceBelow + 6;
    setAlign({ left, top });
  };

  const [align, setAlign] = useState<{ left: number; top: number } | null>(null);

  return (
    <>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
        onPress={handleOpen}
        android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
        {...interactionProps}
        style={({ pressed }) => [
          styles.trigger,
          smoothMotion(),
          {
            backgroundColor: pressed ? colors.surfaceHover : colors.surfaceInput,
            borderColor: focused ? colors.primary : colors.border,
          },
          focused ? focusRingStyle(colors.focus) : null,
          style,
        ]}
      >
        {icon && <Ionicons name={icon} size={18} color={colors.textMuted} />}
        <Text
          numberOfLines={1}
          style={[styles.triggerLabel, { color: selected ? colors.text : colors.textMuted }]}
        >
          {selected ? selected.label : (placeholder ?? '')}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        {align && anchor && (
          <View
            style={[
              styles.panel,
              { left: align.left, top: align.top, width: Math.max(anchor.width, 220) },
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              shadowStyles('md', colors.shadow),
            ]}
            onLayout={handlePanelLayout}
          >
            <ScrollView style={{ maxHeight: PANEL_MAX_HEIGHT }} bounces={false}>
              {options.map((option) => {
                const active = option.key === value;
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      onChange(option.key);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      smoothMotion(120),
                      active && { backgroundColor: colors.primarySoft },
                      pressed && !active && { backgroundColor: colors.surfacePressed },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.optionLabel,
                        { color: active ? colors.primary : colors.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}
      </Modal>
    </>
  );
}

function screenHeight(): number {
  if (typeof window === 'undefined') return 800;
  return window.innerHeight || 800;
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
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  panel: {
    position: 'absolute',
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    overflow: 'hidden',
  },
  option: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: spacing.sm,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});