import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MerchantResidentDto, MerchantResidentListParams } from '../../../contracts/merchantResident';
import { merchantResidentService } from '../api/merchantResidentService';

export const merchantResidentKeys = { all: ['merchant-residents'] as const, lists: () => ['merchant-residents','list'] as const, list: (params: Omit<MerchantResidentListParams,'page'>) => ['merchant-residents','list',params] as const, detail: (id:string) => ['merchant-residents','detail',id] as const };
export const useMerchantResidents = (params: Omit<MerchantResidentListParams,'page'>) => useInfiniteQuery({ queryKey: merchantResidentKeys.list(params), initialPageParam: 1, queryFn: ({pageParam}) => merchantResidentService.list({...params,page:pageParam}), getNextPageParam: (last) => last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined });
export const useMerchantResident = (id?:string) => useQuery({queryKey:merchantResidentKeys.detail(id??''),queryFn:()=>merchantResidentService.detail(id!),enabled:Boolean(id)});
function useResidentMutation<T>(fn:(input:T)=>Promise<MerchantResidentDto>){const client=useQueryClient();return useMutation({mutationFn:fn,onSuccess:(resident)=>{client.setQueryData(merchantResidentKeys.detail(resident.id),resident);void client.invalidateQueries({queryKey:merchantResidentKeys.lists()});void client.invalidateQueries({queryKey:merchantResidentKeys.detail(resident.id)});}});}
export const useUpdateResidentPaymentDay=()=>useResidentMutation(merchantResidentService.updatePaymentDay);
export const useUpdateResidentSmsReminders=()=>useResidentMutation(merchantResidentService.updateSmsReminders);
