import { useState } from 'react';
import type { Href } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { ConfirmationAction, InlineError, LoadingState, RetryState, SuccessFeedback } from '@/components/native/ScreenStates';
import { FieldText, PgActionButton, PgStatusBadge, Section, pgErrorMessage } from '@/components/native/pg/PgUi';
import { colors, fontFamilies, radius, spacing } from '@/design-system';
import { coverImage } from '@/features/merchantPgs/mapper';
import { merchantPgActions, type MerchantPgAction } from '@/features/merchantPgs/presentation';
import { merchantPgKeys, useMerchantPg, usePauseMerchantPg, useResumeMerchantPg, useSubmitMerchantPg } from '@/features/merchantPgs/hooks/useMerchantPgs';
import { merchantRoutes } from '@/navigation/merchantRoutes';

export default function PgDetail() {
  const params = useLocalSearchParams<{ id?: string }>(); const id = typeof params.id === 'string' ? params.id : ''; const router = useRouter(); const cache = useQueryClient();
  const query = useMerchantPg(id); const submit = useSubmitMerchantPg(); const pause = usePauseMerchantPg(); const resume = useResumeMerchantPg(); const [action, setAction] = useState<Exclude<MerchantPgAction, 'edit'> | null>(null); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const busy = submit.isPending || pause.isPending || resume.isPending;
  const perform = () => { if (!action) return; const mutation = action === 'submit' ? submit : action === 'pause' ? pause : resume; mutation.mutate(id, { onSuccess: async () => { await cache.invalidateQueries({ queryKey: merchantPgKeys.detail(id) }); setSuccess(action === 'submit' ? 'PG submitted for review.' : action === 'pause' ? 'PG paused.' : 'PG resumed.'); setError(''); setAction(null); }, onError: (reason) => { setError(pgErrorMessage(reason)); setAction(null); } }); };
  return <MerchantScreen title="PG Detail" showBack refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
    {query.isPending ? <LoadingState label="Loading PG details…" /> : query.isError || !query.data ? <RetryState title="PG could not be loaded" message={pgErrorMessage(query.error)} onRetry={() => void query.refetch()} /> : <PgDetails pg={query.data} busy={busy} onEdit={() => router.push({ pathname: merchantRoutes.editPg, params: { id } } as Href)} onAction={setAction} />}
    {success ? <SuccessFeedback message={success} /> : null}{error ? <InlineError message={error} /> : null}
    <ConfirmationAction visible={Boolean(action)} title={action === 'submit' ? 'Submit PG for review?' : action === 'pause' ? 'Pause this PG?' : 'Resume this PG?'} message="The backend controls the resulting lifecycle status." confirmLabel={action === 'submit' ? 'Submit' : action === 'pause' ? 'Pause' : 'Resume'} busy={busy} onCancel={() => setAction(null)} onConfirm={perform} />
  </MerchantScreen>;
}

function PgDetails({ pg, busy, onEdit, onAction }: { pg: NonNullable<ReturnType<typeof useMerchantPg>['data']>; busy: boolean; onEdit: () => void; onAction: (action: Exclude<MerchantPgAction, 'edit'>) => void }) {
  const image = coverImage(pg); const actions = merchantPgActions(pg.status);
  return <View style={styles.content}>{image ? <Image source={{ uri: image }} style={styles.cover} /> : null}<View style={styles.heading}><PgStatusBadge status={pg.status} /><Text style={styles.name}>{pg.name}</Text><Text style={styles.category}>{pg.category}</Text><Text style={styles.address}>{pg.location.address}, {pg.location.locality}, {pg.location.city}</Text></View><Text style={styles.description}>{pg.description || 'No description provided.'}</Text>
    <Section title="Pricing"><FieldText label="Monthly rent" value={`₹${pg.pricing.monthlyRent ?? 0}`} /><FieldText label="Deposit" value={`₹${pg.pricing.deposit}`} /><FieldText label="Maintenance" value={`₹${pg.pricing.maintenanceCharge}`} /></Section>
    <Section title="Rooms">{pg.rooms.length ? pg.rooms.map((room) => <View key={room.id} style={styles.item}><Text style={styles.itemTitle}>Room {room.roomNumber}</Text><Text style={styles.itemText}>{room.roomType} · {room.totalBeds} beds · ₹{room.monthlyRent}</Text></View>) : <Text style={styles.itemText}>No rooms listed.</Text>}</Section>
    <Section title="Availability">{pg.availability.length ? pg.availability.map((item) => <View key={item.id} style={styles.item}><Text style={styles.itemTitle}>{item.roomType}</Text><Text style={styles.itemText}>{item.availableBeds}/{item.totalBeds} beds available · ₹{item.monthlyRent}</Text></View>) : <Text style={styles.itemText}>No availability listed.</Text>}</Section>
    <Section title="Amenities"><Text style={styles.itemText}>{pg.amenities.length ? pg.amenities.join(' · ') : 'None listed'}</Text></Section>
    <Section title="Listing information"><FieldText label="Created" value={new Date(pg.timestamps.createdAt).toLocaleString('en-IN')} /><FieldText label="Updated" value={new Date(pg.timestamps.updatedAt).toLocaleString('en-IN')} /></Section>
    <View style={styles.actions}>{actions.includes('edit') ? <PgActionButton label="Edit PG" secondary onPress={onEdit} /> : null}{actions.filter((item) => item !== 'edit').map((item) => <PgActionButton key={item} disabled={busy} label={item === 'submit' ? 'Submit for review' : item === 'pause' ? 'Pause PG' : 'Resume PG'} onPress={() => onAction(item)} />)}</View>
  </View>;
}

const styles = StyleSheet.create({ content: { gap: spacing.lg }, cover: { width: '100%', height: 230, backgroundColor: colors.surfaceMuted, borderRadius: radius.card }, heading: { gap: spacing.xs }, name: { color: colors.textPrimary, fontFamily: fontFamilies.headingBold, fontSize: 27 }, category: { color: colors.primaryDark, fontFamily: fontFamilies.bodySemiBold, fontSize: 13 }, address: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 20 }, description: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 15, lineHeight: 23 }, item: { gap: spacing.xs, paddingVertical: spacing.sm, borderBottomColor: colors.divider, borderBottomWidth: 1 }, itemTitle: { color: colors.textPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 14 }, itemText: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 20 }, actions: { gap: spacing.sm } });
