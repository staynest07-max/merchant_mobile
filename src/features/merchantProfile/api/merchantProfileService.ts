import { apiClient } from '../../../api/client';
import type { MerchantProfileUpdateRequest, MerchantSelfProfileDto } from '../../../contracts/merchantProfile';

export const merchantProfileService = {
  get: async () => (await apiClient.get<MerchantSelfProfileDto>('/merchants/me')).data,
  update: async (input: MerchantProfileUpdateRequest) => (await apiClient.patch<MerchantSelfProfileDto, MerchantProfileUpdateRequest>('/merchants/me', input)).data,
};
