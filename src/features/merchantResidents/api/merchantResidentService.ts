import { apiClient } from '../../../api/client';
import type { MerchantResidentDto, MerchantResidentListParams, MerchantResidentPage } from '../../../contracts/merchantResident';

const query = (params: MerchantResidentListParams) => { const search = new URLSearchParams(); search.set('page', String(params.page ?? 1)); search.set('limit', String(params.limit ?? 20)); if (params.status) search.set('status', params.status); if (params.pgId) search.set('pgId', params.pgId); if (params.search?.trim()) search.set('search', params.search.trim()); return search.toString(); };
export const merchantResidentService = {
  list: async (params: MerchantResidentListParams = {}): Promise<MerchantResidentPage> => { const response = await apiClient.get<MerchantResidentDto[]>(`/merchants/residents?${query(params)}`); return { items: response.data, meta: response.meta as MerchantResidentPage['meta'] }; },
  detail: async (id: string) => (await apiClient.get<MerchantResidentDto>(`/merchants/residents/${id}`)).data,
  updatePaymentDay: async ({ id, paymentDay }: { id: string; paymentDay: number }) => (await apiClient.patch<MerchantResidentDto, { paymentDay: number }>(`/merchants/residents/${id}/payment-day`, { paymentDay })).data,
  updateSmsReminders: async ({ id, enabled }: { id: string; enabled: boolean }) => (await apiClient.patch<MerchantResidentDto, { enabled: boolean }>(`/merchants/residents/${id}/sms-reminders`, { enabled })).data,
};
