import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { shadowStyles } from '@/constants/shadows';
import { radius, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  cancelDialogLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  cancelDialogLabel,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.scrim }]}>
        <Pressable
          accessibilityLabel={cancelDialogLabel}
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.card,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            shadowStyles('md', colors.shadow),
          ]}
        >
          <View
            style={[
              styles.icon,
              { backgroundColor: destructive ? colors.dangerSoft : colors.primarySoft },
            ]}
          >
            <Ionicons
              name={destructive ? 'trash-outline' : 'help-circle-outline'}
              size={24}
              color={destructive ? colors.danger : colors.primary}
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>
          <View style={styles.actions}>
            <Button
              label={cancelLabel}
              variant="secondary"
              style={styles.actionButton}
              onPress={onCancel}
            />
            <Button
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              style={styles.actionButton}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  icon: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    fontSize: 14.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    columnGap: spacing.md,
    alignSelf: 'stretch',
  },
  actionButton: {
    flex: 1,
  },
});