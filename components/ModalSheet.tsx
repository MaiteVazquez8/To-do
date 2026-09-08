import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { shadowStyles } from '@/constants/shadows';
import { radius, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon?: IconName;
  iconColor?: string;
  children: ReactNode;
}

/**
 * Bottom-sheet style modal that feels like part of the app. Constrained to
 * the same content column as the rest of the UI so it looks right on tablet
 * and desktop too. Esc (web) and the back button (Android) close it.
 */
export function ModalSheet({
  visible,
  onClose,
  title,
  icon,
  iconColor,
  children,
}: ModalSheetProps) {
  const { colors } = useTheme();

  useEffect(() => {
    if (!visible || typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.scrim }]}>
        <Pressable
          accessibilityLabel="Cerrar"
          style={styles.backdrop}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surfaceElevated },
            shadowStyles('lg', colors.shadow),
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />
          <View style={[styles.header, { backgroundColor: colors.surfaceElevated }]}>
            {icon && (
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: iconColor ?? colors.primarySoft },
                ]}
              >
                <Ionicons
                  name={icon}
                  size={18}
                  color={iconColor ? colors.text : colors.primary}
                />
              </View>
            )}
            <Text
              accessibilityRole="header"
              numberOfLines={1}
              style={[styles.title, { color: colors.text }]}
            >
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: pressed ? colors.surfacePressed : 'transparent' },
              ]}
            >
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.content}
            bounces
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    width: '100%',
    maxWidth: 640,
    maxHeight: '88%',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    columnGap: spacing.sm,
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});