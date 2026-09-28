import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { ErrorState, InlineError, LoadingState, MutationLoading, RetryState, StatusBadge, SuccessFeedback } from '@/components/native/ScreenStates';
import { Field, Section } from '@/components/native/residents/ResidentUi';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { openResidentDialer, openResidentWhatsApp } from '@/features/merchantResidents/contact';
import { useMerchantResident, useUpdateResidentPaymentDay, useUpdateResidentSmsReminders } from '@/features/merchantResidents/hooks/useMerchantResidents';
import { merchantResidentError, merchantResidentNotFound, resetResidentPaymentDay, residentRentLabel, residentStatusTone } from '@/features/merchantResidents/presentation';
import { residentPaymentDaySchema } from '@/features/merchantResidents/validation';

export default function ResidentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useMerchantResident(id);
  const payment = useUpdateResidentPaymentDay();
  const sms = useUpdateResidentSmsReminders();
  const [day, setDay] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const resident = query.data;
  const selected = day ?? resident?.rent.paymentDay ?? 1;

  const saveDay = (value = selected) => {
    const valid = residentPaymentDaySchema.safeParse(value);
    if (!valid.success) {
      setError(valid.error.issues[0]?.message ?? 'Choose a day from 1 to 31.');
      return;
    }
    payment.mutate({ id: id!, paymentDay: valid.data }, {
      onSuccess: () => { setDay(null); setError(''); setSuccess('Payment day updated.'); },
      onError: (reason) => { setSuccess(''); setError(merchantResidentError(reason)); },
    });
  };

  const toggle = (enabled: boolean) => sms.mutate({ id: id!, enabled }, {
    onSuccess: () => { setError(''); setSuccess('SMS reminder preference updated.'); },
    onError: (reason) => { setSuccess(''); setError(merchantResidentError(reason)); },
  });

  const contact = async (kind: 'call' | 'whatsapp') => {
    if (!resident) return;
    setSuccess('');
    const result = kind === 'call'
      ? await openResidentDialer(resident.resident.phone, Linking)
      : await openResidentWhatsApp(resident.resident.phone, Linking);
    setError(result.ok ? '' : result.message ?? 'This contact action is unavailable.');
  };

  if (query.isPending) return <MerchantScreen title="Resident" showBack><LoadingState label="Loading resident…" /></MerchantScreen>;
  if (query.isError || !resident) {
    return <MerchantScreen title="Resident" showBack>{merchantResidentNotFound(query.error)
      ? <ErrorState title="Resident not found" message="This resident is unavailable or does not belong to your account." />
      : <RetryState title="Resident could not be loaded" message={merchantResidentError(query.error)} onRetry={() => void query.refetch()} />}</MerchantScreen>;
  }

  return <MerchantScreen title={resident.resident.name} subtitle={resident.publicId} showBack refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
    <View style={styles.content}>
      <View style={styles.heading}>
        <View style={styles.grow}><Text style={styles.name}>{resident.resident.name}</Text><Text style={styles.phone}>{resident.resident.phone}</Text></View>
        <StatusBadge label={resident.stay.status} tone={residentStatusTone(resident.stay.status)} />
      </View>
      <View style={styles.contactActions}>
        <Action label="Call" onPress={() => void contact('call')} />
        <Action label="WhatsApp" onPress={() => void contact('whatsapp')} />
      </View>
      <Section title="PG"><Field label="Name" value={resident.pg.name} /><Field label="PG identifier" value={resident.pg.publicId} /></Section>
      <Section title="Room">{resident.room ? <><Field label="Room" value={resident.room.number} /><Field label="Type" value={resident.room.type} /><Field label="Building" value={resident.room.building} /><Field label="Floor" value={resident.room.floor} /><Field label="Wing" value={resident.room.wing} /></> : <Text style={styles.empty}>Room not assigned</Text>}</Section>
      <Section title="Stay"><Field label="Joined" value={resident.stay.joinedDate} /><Field label="Status" value={resident.stay.status} /><Field label="Move-out date" value={resident.stay.moveOutDate} /><Field label="Agreement end date" value={resident.stay.agreementEndDate} /></Section>
      <Section title="Rent">
        <Field label="Monthly rent" value={residentRentLabel(resident)} />
        <Text style={styles.label}>Payment day</Text>
        <View style={styles.day}><Pressable disabled={payment.isPending || selected <= 1} onPress={() => setDay(Math.max(1, selected - 1))} style={styles.dayButton}><Text style={styles.dayButtonText}>−</Text></Pressable><Text style={styles.dayValue}>{selected}</Text><Pressable disabled={payment.isPending || selected >= 31} onPress={() => setDay(Math.min(31, selected + 1))} style={styles.dayButton}><Text style={styles.dayButtonText}>+</Text></Pressable></View>
        <View style={styles.actions}><Action label="Reset to join day" disabled={payment.isPending || selected === resident.stay.joinDay} onPress={() => saveDay(resetResidentPaymentDay(resident))} /><Action label="Save payment day" disabled={payment.isPending || selected === resident.rent.paymentDay} onPress={() => saveDay()} /></View>
      </Section>
      <Section title="Reminders"><View style={styles.switchRow}><View style={styles.grow}><Text style={styles.label}>SMS reminders</Text><Text style={styles.help}>Stores the reminder preference only. It does not send an SMS.</Text></View><Switch disabled={sms.isPending} value={resident.rent.smsReminders} onValueChange={toggle} trackColor={{ false: colors.borderStrong, true: colors.primaryLight }} thumbColor={resident.rent.smsReminders ? colors.primaryDark : colors.textTertiary} /></View></Section>
      {success ? <SuccessFeedback message={success} /> : null}
      {error ? <InlineError message={error} /> : null}
      {payment.isPending ? <MutationLoading label="Updating payment day…" /> : null}
      {sms.isPending ? <MutationLoading label="Updating reminder preference…" /> : null}
    </View>
  </MerchantScreen>;
}

function Action({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.action, disabled && styles.disabled]}><Text style={styles.actionText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  heading: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', padding: spacing.lg, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.card },
  grow: { flex: 1 },
  name: { color: colors.textPrimary, fontFamily: fontFamilies.heading, fontSize: 20 },
  phone: { marginTop: spacing.xs, color: colors.textSecondary, fontFamily: fontFamilies.numbersRegular, fontSize: 13 },
  empty: { color: colors.textTertiary, fontFamily: fontFamilies.body, fontSize: 14, fontStyle: 'italic' },
  label: { color: colors.textPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 13 },
  help: { marginTop: spacing.xs, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 18 },
  day: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  dayButton: { width: touchTarget.min, height: touchTarget.min, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryMuted, borderRadius: radius.full },
  dayButtonText: { color: colors.primaryDark, fontFamily: fontFamilies.heading, fontSize: 24 },
  dayValue: { minWidth: 48, textAlign: 'center', color: colors.textPrimary, fontFamily: fontFamilies.numbersBold, fontSize: 24 },
  contactActions: { flexDirection: 'row', gap: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1, minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, backgroundColor: colors.primaryDark, borderRadius: radius.control },
  actionText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 12, textAlign: 'center' },
  disabled: { opacity: .45 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
