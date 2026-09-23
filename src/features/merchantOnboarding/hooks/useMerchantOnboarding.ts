import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MerchantOnboardingCompleteRequest, MerchantOnboardingCompleteResponse } from '../../../contracts/merchantOnboarding';
import { merchantProfileKeys } from '../../merchantProfile/hooks/useMerchantProfile';
import { merchantOnboardingService } from '../api/merchantOnboardingService';

export function applyCompletedOnboarding(client: ReturnType<typeof useQueryClient>, response: MerchantOnboardingCompleteResponse) {
  client.setQueryData(merchantProfileKeys.all, response.profile);
  return client.invalidateQueries({ queryKey: merchantProfileKeys.all });
}
export const useCompleteMerchantOnboarding = () => {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: MerchantOnboardingCompleteRequest) => merchantOnboardingService.complete(input), onSuccess: (response) => { void applyCompletedOnboarding(client, response); } });
};
