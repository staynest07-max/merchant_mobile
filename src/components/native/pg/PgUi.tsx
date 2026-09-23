import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ApiError } from '@/api/errors';
import type { PgStatus } from '@/contracts/merchantPg';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { pgStatusLabel } from '@/features/merchantPgs/mapper';
import { StatusBadge } from '@/components/native/ScreenStates';

export function pgErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) return 'This PG changed elsewhere. Refresh and try again.';
    return error.message;
  }
  return error instanceof Error ? error.message : 'Unable to complete this PG request.';
}

export function PgStatusBadge({ status }: { status: PgStatus }) {
  const tone = status === 'LIVE' ? 'success' : status === 'REJECTED' || status === 'SUSPENDED' ? 'error' : status === 'PENDING_REVIEW' || status === 'CHANGES_REQUIRED' ? 'warning' : 'neutral';
  return <StatusBadge label={pgStatusLabel(status)} tone={tone} />;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
}

export function FieldText({ label, value }: { label: string; value: string }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

export function PgActionButton({ label, onPress, disabled, secondary }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, (pressed || disabled) && styles.disabled]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1 },
  sectionTitle: { color: colors.textPrimary, fontFamily: fontFamilies.heading, fontSize: 17 }, field: { gap: spacing.xxs },
  label: { color: colors.textTertiary, fontFamily: fontFamilies.bodyMedium, fontSize: 11 }, value: { color: colors.textPrimary, fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 21 },
  button: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, backgroundColor: colors.primaryDark, borderRadius: radius.control },
  secondary: { backgroundColor: colors.primaryMuted, borderColor: colors.borderStrong, borderWidth: 1 }, buttonText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 14 }, secondaryText: { color: colors.primaryDark }, disabled: { opacity: 0.55 },
});
