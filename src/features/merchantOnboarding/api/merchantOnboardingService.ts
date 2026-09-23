import { apiClient } from '../../../api/client';
import type { MerchantOnboardingCompleteRequest, MerchantOnboardingCompleteResponse } from '../../../contracts/merchantOnboarding';

export const merchantOnboardingService = {
  complete: async (input: MerchantOnboardingCompleteRequest) => (await apiClient.post<MerchantOnboardingCompleteResponse, MerchantOnboardingCompleteRequest>('/merchants/onboarding/complete', input)).data,
};
