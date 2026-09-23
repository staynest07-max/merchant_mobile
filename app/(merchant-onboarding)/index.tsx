import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { ApiError } from '@/api/errors';
import { MerchantOnboardingFormView } from '@/components/native/onboarding/MerchantOnboardingForm';
import { ErrorState, LoadingState } from '@/components/native/ScreenStates';
import { useCompleteMerchantOnboarding } from '@/features/merchantOnboarding/hooks/useMerchantOnboarding';
import { useMerchantProfile } from '@/features/merchantProfile/hooks/useMerchantProfile';
import { merchantRoutes } from '@/navigation/merchantRoutes';

const message = (error: unknown) => error instanceof ApiError ? error.message : error instanceof Error ? error.message : 'Unable to complete Merchant onboarding.';
export default function MerchantOnboarding() {
  const router = useRouter(); const profile = useMerchantProfile(); const completion = useCompleteMerchantOnboarding(); const [error, setError] = useState('');
  useEffect(() => { if (profile.data?.onboarding.completed) router.replace(merchantRoutes.home); }, [profile.data?.onboarding.completed, router]);
  if (profile.isPending) return <LoadingState label="Loading your Merchant profile…" />;
  if (profile.isError || !profile.data) return <ErrorState title="Onboarding could not be loaded" message={message(profile.error)} actionLabel="Retry" onAction={() => void profile.refetch()} />;
  if (profile.data.onboarding.completed) return <Redirect href={merchantRoutes.home} />;
  return <MerchantOnboardingFormView profile={profile.data} pending={completion.isPending} apiError={error} onSubmit={(input) => completion.mutate(input, { onSuccess: () => { setError(''); router.replace(merchantRoutes.home); }, onError: (reason) => setError(message(reason)) })} />;
}
