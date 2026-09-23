import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MerchantProfileUpdateRequest, MerchantSelfProfileDto } from '../../../contracts/merchantProfile';
import { merchantProfileService } from '../api/merchantProfileService';

export const merchantProfileKeys = { all: ['merchant-profile'] as const };
export const useMerchantProfile = () => useQuery({ queryKey: merchantProfileKeys.all, queryFn: merchantProfileService.get });
export const useUpdateMerchantProfile = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: MerchantProfileUpdateRequest) => merchantProfileService.update(input),
    onSuccess: (profile: MerchantSelfProfileDto) => {
      client.setQueryData(merchantProfileKeys.all, profile);
      void client.invalidateQueries({ queryKey: merchantProfileKeys.all });
    },
  });
};
