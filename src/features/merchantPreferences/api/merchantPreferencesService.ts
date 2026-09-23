import { apiClient } from '../../../api/client';
import type { MerchantPreferencesDto, MerchantPreferencesUpdateRequest } from '../../../contracts/merchantPreferences';
import { mapMerchantPreferences } from '../presentation';
import { merchantPreferencesUpdateSchema } from '../validation';

export const merchantPreferencesService = {
  get: async () => mapMerchantPreferences((await apiClient.get<MerchantPreferencesDto>('/merchants/preferences')).data),
  update: async (input: MerchantPreferencesUpdateRequest) => {
    const safeInput = merchantPreferencesUpdateSchema.parse(input);
    return mapMerchantPreferences((await apiClient.patch<MerchantPreferencesDto, MerchantPreferencesUpdateRequest>('/merchants/preferences', safeInput)).data);
  },
};
