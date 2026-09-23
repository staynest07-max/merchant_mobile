import type { MerchantPreferenceField, MerchantPreferencesDto, MerchantPreferencesUpdateRequest } from '../../contracts/merchantPreferences';
import { merchantPreferenceFields } from '../../contracts/merchantPreferences';
import { merchantPreferencesDtoSchema, merchantPreferencesUpdateSchema } from './validation';

export const mapMerchantPreferences = (value: unknown): MerchantPreferencesDto => merchantPreferencesDtoSchema.parse(value);
export const buildMerchantPreferencesUpdate = (current: MerchantPreferencesDto, draft: Record<MerchantPreferenceField, boolean>): MerchantPreferencesUpdateRequest => {
  const changed = Object.fromEntries(merchantPreferenceFields.filter((field) => current[field] !== draft[field]).map((field) => [field, draft[field]]));
  return merchantPreferencesUpdateSchema.parse(changed);
};
export const preferencesDraft = (value: MerchantPreferencesDto): Record<MerchantPreferenceField, boolean> => ({ emailAlerts: value.emailAlerts, smsAlerts: value.smsAlerts, pushAlerts: value.pushAlerts, whatsapp: value.whatsapp });
