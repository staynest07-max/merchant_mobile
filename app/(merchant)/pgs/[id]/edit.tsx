import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import type { MerchantPgInput } from '@/contracts/merchantPg';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { PgForm } from '@/components/native/pg/PgForm';
import { pgErrorMessage } from '@/components/native/pg/PgUi';
import { ErrorState, LoadingState, RetryState } from '@/components/native/ScreenStates';
import { canEditPg, merchantPgToFormInput } from '@/features/merchantPgs/mapper';
import { merchantPgKeys, useMerchantPg, useUpdateMerchantPg } from '@/features/merchantPgs/hooks/useMerchantPgs';

export default function EditPg() {
  const params = useLocalSearchParams<{ id?: string }>(); const id = typeof params.id === 'string' ? params.id : ''; const router = useRouter(); const cache = useQueryClient();
  const query = useMerchantPg(id); const update = useUpdateMerchantPg(id); const [error, setError] = useState('');
  const submit = (input: MerchantPgInput) => update.mutate(input, { onSuccess: async () => { await cache.invalidateQueries({ queryKey: merchantPgKeys.detail(id) }); router.back(); }, onError: (reason) => setError(pgErrorMessage(reason)) });
  return <MerchantScreen title="Edit PG" subtitle="Update editable listing information" showBack refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>{query.isPending ? <LoadingState label="Loading PG..." /> : query.isError || !query.data ? <RetryState title="PG could not be loaded" message={pgErrorMessage(query.error)} onRetry={() => void query.refetch()} /> : !canEditPg(query.data) ? <ErrorState title="This PG cannot be edited" message="Only Draft and Changes Required listings are editable." actionLabel="Go back" onAction={() => router.back()} /> : <PgForm initial={merchantPgToFormInput(query.data)} submitLabel="Save changes" submitting={update.isPending} apiError={error} onSubmit={submit} />}</MerchantScreen>;
}
