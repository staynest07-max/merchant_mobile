import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MerchantPreferencesUpdateRequest } from '../../../contracts/merchantPreferences';
import { merchantPreferencesService } from '../api/merchantPreferencesService';

export const merchantPreferencesKeys = { all: ['merchant-preferences'] as const };
export const useMerchantPreferences = () => useQuery({ queryKey: merchantPreferencesKeys.all, queryFn: merchantPreferencesService.get });
export const useUpdateMerchantPreferences = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: MerchantPreferencesUpdateRequest) => merchantPreferencesService.update(input),
    onSuccess: (preferences) => {
      client.setQueryData(merchantPreferencesKeys.all, preferences);
      void client.invalidateQueries({ queryKey: merchantPreferencesKeys.all });
    },
  });
};
