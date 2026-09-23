import { useState } from 'react';
import { ApiError } from '@/api/errors';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { LoadingState, RetryState } from '@/components/native/ScreenStates';
import { MerchantPreferencesView } from '@/components/native/preferences/MerchantPreferencesView';
import { useMerchantPreferences, useUpdateMerchantPreferences } from '@/features/merchantPreferences/hooks/useMerchantPreferences';

const errorMessage = (error: unknown) => error instanceof ApiError ? error.message : error instanceof Error ? error.message : 'Unable to load Merchant preferences.';
export default function Preferences() {
  const query = useMerchantPreferences(); const update = useUpdateMerchantPreferences(); const [success, setSuccess] = useState(''); const [saveError, setSaveError] = useState('');
  return <MerchantScreen title="Preferences" subtitle="Notification channels" showBack refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>{query.isPending ? <LoadingState label="Loading preferences…" /> : query.isError || !query.data ? <RetryState title="Preferences could not be loaded" message={errorMessage(query.error)} onRetry={() => void query.refetch()} /> : <MerchantPreferencesView preferences={query.data} saving={update.isPending} apiError={saveError} success={success} onSave={(input) => update.mutate(input, { onSuccess: () => { setSaveError(''); setSuccess('Preferences saved successfully.'); }, onError: (error) => { setSuccess(''); setSaveError(errorMessage(error)); } })} />}</MerchantScreen>;
}
