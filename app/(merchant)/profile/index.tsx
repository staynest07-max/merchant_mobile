import { useState } from 'react';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { LoadingState, RetryState, SuccessFeedback } from '@/components/native/ScreenStates';
import { MerchantProfileView } from '@/components/native/profile/MerchantProfileView';
import { ApiError } from '@/api/errors';
import { useMerchantProfile, useUpdateMerchantProfile } from '@/features/merchantProfile/hooks/useMerchantProfile';

const errorMessage = (error: unknown) => error instanceof ApiError ? error.message : 'Unable to load the merchant profile.';
export default function Profile() {
  const query = useMerchantProfile();
  const update = useUpdateMerchantProfile();
  const [success, setSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const save = (input: Parameters<typeof update.mutate>[0]) => update.mutate(input, { onSuccess: () => { setSaveError(''); setSuccess('Profile saved successfully.'); }, onError: (error) => { setSuccess(''); setSaveError(errorMessage(error)); } });
  return <MerchantScreen title="Profile" subtitle="Your Merchant account and business details" showBack refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
    {query.isPending ? <LoadingState label="Loading profile…" /> : query.isError || !query.data ? <RetryState title="Profile could not be loaded" message={errorMessage(query.error)} onRetry={() => void query.refetch()} /> : <MerchantProfileView profile={query.data} saving={update.isPending} apiError={saveError} success={success ? <SuccessFeedback message={success} /> : null} onSave={save} />}
  </MerchantScreen>;
}
