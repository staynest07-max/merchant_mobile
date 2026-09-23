import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { MerchantPreferenceField, MerchantPreferencesDto, MerchantPreferencesUpdateRequest } from '@/contracts/merchantPreferences';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { buildMerchantPreferencesUpdate, preferencesDraft } from '@/features/merchantPreferences/presentation';
import { InlineError, MutationLoading, SuccessFeedback } from '@/components/native/ScreenStates';

const items: Array<{ field: MerchantPreferenceField; label: string; description: string }> = [
  { field: 'emailAlerts', label: 'Email alerts', description: 'Receive Merchant updates at your registered email.' },
  { field: 'smsAlerts', label: 'SMS notifications', description: 'Receive important Merchant updates by SMS.' },
  { field: 'pushAlerts', label: 'Push alerts', description: 'Receive in-app and device notification alerts.' },
  { field: 'whatsapp', label: 'WhatsApp updates', description: 'Receive supported Merchant updates through WhatsApp.' },
];

export function MerchantPreferencesView({ preferences, saving, apiError, success, onSave }: { preferences: MerchantPreferencesDto; saving: boolean; apiError?: string; success?: string; onSave: (input: MerchantPreferencesUpdateRequest) => void }) {
  const [draft, setDraft] = useState(() => preferencesDraft(preferences));
  const [validationError, setValidationError] = useState('');
  useEffect(() => { setDraft(preferencesDraft(preferences)); }, [preferences]);
  const dirty = useMemo(() => items.some(({ field }) => draft[field] !== preferences[field]), [draft, preferences]);
  const save = () => { try { const payload = buildMerchantPreferencesUpdate(preferences, draft); setValidationError(''); onSave(payload); } catch { setValidationError('Change at least one preference before saving.'); } };
  return <View style={styles.root}>
    <View style={styles.card}><Text style={styles.title}>Notification preferences</Text><Text style={styles.intro}>Choose how StayNest sends Merchant account and business updates.</Text>
      {items.map((item) => <View key={item.field} style={styles.row}><View style={styles.copy}><Text style={styles.label}>{item.label}</Text><Text style={styles.description}>{item.description}</Text></View><Switch accessibilityLabel={item.label} disabled={saving} onValueChange={(value) => setDraft((current) => ({ ...current, [item.field]: value }))} trackColor={{ false: colors.borderStrong, true: colors.primaryLight }} thumbColor={draft[item.field] ? colors.primaryDark : colors.textTertiary} value={draft[item.field]} /></View>)}
    </View>
    {success ? <SuccessFeedback message={success} /> : null}{validationError ? <InlineError message={validationError} /> : null}{apiError ? <InlineError message={apiError} /> : null}{saving ? <MutationLoading label="Saving preferences…" /> : null}
    <Pressable accessibilityRole="button" disabled={!dirty || saving} onPress={save} style={({ pressed }) => [styles.button, (!dirty || pressed || saving) && styles.disabled]}><Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save preferences'}</Text></Pressable>
    <Text style={styles.updated}>Last synchronized: {new Date(preferences.updatedAt).toLocaleString('en-IN')}</Text>
  </View>;
}

const styles = StyleSheet.create({ root: { gap: spacing.lg }, card: { gap: spacing.md, padding: spacing.lg, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: 1 }, title: { color: colors.textPrimary, fontFamily: fontFamilies.heading, fontSize: 19 }, intro: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 20 }, row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderTopColor: colors.divider, borderTopWidth: 1 }, copy: { flex: 1, gap: spacing.xs }, label: { color: colors.textPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 15 }, description: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 18 }, button: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, backgroundColor: colors.primaryDark, borderRadius: radius.control }, disabled: { opacity: 0.5 }, buttonText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 15 }, updated: { color: colors.textTertiary, fontFamily: fontFamilies.body, fontSize: 11, textAlign: 'center' } });
