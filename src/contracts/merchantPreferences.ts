export const merchantPreferenceFields = ['emailAlerts', 'smsAlerts', 'pushAlerts', 'whatsapp'] as const;
export type MerchantPreferenceField = typeof merchantPreferenceFields[number];
export interface MerchantPreferencesDto {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  whatsapp: boolean;
  updatedAt: string;
}
export type MerchantPreferencesUpdateRequest = Partial<Pick<MerchantPreferencesDto, MerchantPreferenceField>>;
