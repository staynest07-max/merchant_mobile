import { useState } from 'react';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { ConfirmationAction, EmptyState, InlineError, LoadingState, RetryState, SuccessFeedback } from '@/components/native/ScreenStates';
import { PgActionButton, PgStatusBadge, pgErrorMessage } from '@/components/native/pg/PgUi';
import type { MerchantPg } from '@/contracts/merchantPg';
import { colors, fontFamilies, radius, spacing } from '@/design-system';
import { coverImage } from '@/features/merchantPgs/mapper';
import { merchantPgActions, type MerchantPgAction } from '@/features/merchantPgs/presentation';
import { useMerchantPgs, usePauseMerchantPg, useResumeMerchantPg, useSubmitMerchantPg } from '@/features/merchantPgs/hooks/useMerchantPgs';
import { merchantRoutes } from '@/navigation/merchantRoutes';

export default function MerchantPgs() {
  const router = useRouter(); const query = useMerchantPgs(); const submit = useSubmitMerchantPg(); const pause = usePauseMerchantPg(); const resume = useResumeMerchantPg();
  const [pending, setPending] = useState<{ pg: MerchantPg; action: Exclude<MerchantPgAction, 'edit'> } | null>(null); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const busy = submit.isPending || pause.isPending || resume.isPending;
  const perform = () => { if (!pending) return; const mutation = pending.action === 'submit' ? submit : pending.action === 'pause' ? pause : resume; mutation.mutate(pending.pg.id, { onSuccess: () => { setSuccess(pending.action === 'submit' ? 'PG submitted for review.' : pending.action === 'pause' ? 'PG paused.' : 'PG resumed.'); setError(''); setPending(null); }, onError: (reason) => { setError(pgErrorMessage(reason)); setPending(null); } }); };

  return <MerchantScreen title="My PGs" subtitle="Listings owned by your Merchant account" refreshing={query.isRefetching} onRefresh={() => void query.refetch()} action={<Pressable onPress={() => router.push(merchantRoutes.addPg as Href)} style={styles.headerAction}><Text style={styles.headerActionText}>＋ Add</Text></Pressable>}>
    {success ? <SuccessFeedback message={success} /> : null}{error ? <InlineError message={error} /> : null}
    {query.isPending ? <LoadingState label="Loading your PGs…" /> : query.isError ? <RetryState title="My PGs could not be loaded" message={pgErrorMessage(query.error)} onRetry={() => void query.refetch()} /> : !query.data.length ? <EmptyState title="No PG listings yet" message="Create your first backend-controlled draft." actionLabel="Add PG" onAction={() => router.push(merchantRoutes.addPg as Href)} /> : <View style={styles.list}>{query.data.map((pg) => <PgCard key={pg.id} pg={pg} busy={busy} onView={() => router.push({ pathname: merchantRoutes.pgDetail, params: { id: pg.id } } as Href)} onEdit={() => router.push({ pathname: merchantRoutes.editPg, params: { id: pg.id } } as Href)} onAction={(action) => setPending({ pg, action })} />)}</View>}
    <ConfirmationAction visible={Boolean(pending)} title={pending?.action === 'submit' ? 'Submit PG for review?' : pending?.action === 'pause' ? 'Pause this PG?' : 'Resume this PG?'} message="This uses the existing backend lifecycle action." confirmLabel={pending?.action === 'submit' ? 'Submit' : pending?.action === 'pause' ? 'Pause' : 'Resume'} busy={busy} onCancel={() => setPending(null)} onConfirm={perform} />
  </MerchantScreen>;
}

function PgCard({ pg, busy, onView, onEdit, onAction }: { pg: MerchantPg; busy: boolean; onView: () => void; onEdit: () => void; onAction: (action: Exclude<MerchantPgAction, 'edit'>) => void }) {
  const image = coverImage(pg); const actions = merchantPgActions(pg.status); const availableBeds = pg.availability.reduce((total, item) => total + item.availableBeds, 0);
  return <View style={styles.card}>{image ? <Image source={{ uri: image }} style={styles.cover} /> : <View style={styles.coverEmpty}><Text style={styles.coverEmptyText}>STAYNEST</Text></View>}<View style={styles.cardBody}><View style={styles.row}><View style={styles.nameBlock}><Text style={styles.name}>{pg.name}</Text><Text style={styles.meta}>{pg.category} · {pg.location.locality}, {pg.location.city}</Text></View><PgStatusBadge status={pg.status} /></View><Text style={styles.summary}>{pg.rooms.length} rooms · {availableBeds} available beds · ₹{pg.pricing.monthlyRent ?? 0}/month</Text><View style={styles.actions}><PgActionButton label="View" secondary onPress={onView} />{actions.includes('edit') ? <PgActionButton label="Edit" secondary onPress={onEdit} /> : null}{actions.filter((action) => action !== 'edit').map((action) => <PgActionButton key={action} disabled={busy} label={action === 'submit' ? 'Submit' : action === 'pause' ? 'Pause' : 'Resume'} onPress={() => onAction(action)} />)}</View></View></View>;
}

const styles = StyleSheet.create({
  headerAction: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.primaryDark, borderRadius: radius.control }, headerActionText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 13 }, list: { gap: spacing.lg }, card: { overflow: 'hidden', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: 1 }, cover: { width: '100%', height: 180, backgroundColor: colors.surfaceMuted }, coverEmpty: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryMuted }, coverEmptyText: { color: colors.primaryDark, fontFamily: fontFamilies.heading, letterSpacing: 2 }, cardBody: { gap: spacing.md, padding: spacing.lg }, row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm }, nameBlock: { flex: 1, gap: spacing.xs }, name: { color: colors.textPrimary, fontFamily: fontFamilies.heading, fontSize: 18 }, meta: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }, summary: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 13 }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
