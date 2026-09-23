import type { ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';

type MessageProps = { title: string; message?: string; actionLabel?: string; onAction?: () => void };

function MessageState({ title, message, actionLabel, onAction }: MessageProps) {
  return (
    <View style={styles.state}>
      <Text style={styles.stateTitle}>{title}</Text>
      {message ? <Text style={styles.stateMessage}>{message}</Text> : null}
      {actionLabel && onAction ? <ActionButton label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <View style={styles.state}><ActivityIndicator color={colors.primaryDark} /><Text style={styles.stateMessage}>{label}</Text></View>;
}

export function ErrorState(props: MessageProps) {
  return <MessageState {...props} />;
}

export function RetryState({ title = 'Something went wrong', message, onRetry }: { title?: string; message?: string; onRetry: () => void }) {
  return <MessageState title={title} message={message} actionLabel="Retry" onAction={onRetry} />;
}

export function EmptyState(props: MessageProps) {
  return <MessageState {...props} />;
}

export function InlineError({ message }: { message: string }) {
  return <View accessibilityRole="alert" style={styles.inlineError}><Text style={styles.inlineErrorText}>{message}</Text></View>;
}

export function MutationLoading({ label = 'Saving…' }: { label?: string }) {
  return <View accessibilityRole="progressbar" style={styles.inline}><ActivityIndicator color={colors.primaryDark} size="small" /><Text style={styles.inlineText}>{label}</Text></View>;
}

export function SuccessFeedback({ message }: { message: string }) {
  return <View accessibilityRole="alert" style={styles.success}><Text style={styles.successText}>{message}</Text></View>;
}

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'warning' | 'error' }) {
  return <View style={[styles.badge, styles[`badge_${tone}`]]}><Text style={[styles.badgeText, styles[`badgeText_${tone}`]]}>{label}</Text></View>;
}

export function ConfirmationAction({ visible, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', busy, onConfirm, onCancel }: {
  visible: boolean; title: string; message: string; confirmLabel?: string; cancelLabel?: string;
  busy?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}><View style={styles.dialog}>
        <Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateMessage}>{message}</Text>
        <View style={styles.dialogActions}>
          <ActionButton label={cancelLabel} onPress={onCancel} secondary />
          <ActionButton disabled={busy} label={busy ? 'Please wait…' : confirmLabel} onPress={onConfirm} />
        </View>
      </View></View>
    </Modal>
  );
}

export function ActionButton({ label, onPress, secondary, disabled }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.action, secondary && styles.actionSecondary, (pressed || disabled) && styles.actionPressed]}><Text style={[styles.actionText, secondary && styles.actionTextSecondary]}>{label}</Text></Pressable>;
}

export function StateContainer({ children }: { children: ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  state: { minHeight: 190, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing['2xl'], backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: 1 },
  stateTitle: { color: colors.textPrimary, fontFamily: fontFamilies.heading, fontSize: 18, textAlign: 'center' },
  stateMessage: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  inlineError: { padding: spacing.md, backgroundColor: colors.errorLight, borderRadius: radius.md },
  inlineErrorText: { color: colors.error, fontFamily: fontFamilies.bodyMedium, fontSize: 14 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  inlineText: { color: colors.textSecondary, fontFamily: fontFamilies.bodyMedium, fontSize: 14 },
  success: { padding: spacing.md, backgroundColor: colors.successLight, borderRadius: radius.md },
  successText: { color: colors.success, fontFamily: fontFamilies.bodySemiBold, fontSize: 14 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.chip },
  badge_neutral: { backgroundColor: colors.surfaceMuted }, badge_success: { backgroundColor: colors.successLight }, badge_warning: { backgroundColor: colors.warningLight }, badge_error: { backgroundColor: colors.errorLight },
  badgeText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 12 }, badgeText_neutral: { color: colors.textSecondary }, badgeText_success: { color: colors.success }, badgeText_warning: { color: colors.accentDark }, badgeText_error: { color: colors.error },
  action: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, backgroundColor: colors.primaryDark, borderRadius: radius.control, marginTop: spacing.sm },
  actionSecondary: { backgroundColor: colors.surfaceMuted }, actionPressed: { opacity: 0.7 },
  actionText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 14 }, actionTextSecondary: { color: colors.textPrimary },
  overlay: { flex: 1, justifyContent: 'center', padding: spacing['2xl'], backgroundColor: colors.overlay },
  dialog: { gap: spacing.md, padding: spacing['2xl'], backgroundColor: colors.surface, borderRadius: radius.sheet },
  dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
});
