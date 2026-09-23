import { z } from 'zod';

export const merchantPreferencesDtoSchema = z.object({
  emailAlerts: z.boolean(), smsAlerts: z.boolean(), pushAlerts: z.boolean(), whatsapp: z.boolean(), updatedAt: z.string(),
}).strict();
export const merchantPreferencesUpdateSchema = merchantPreferencesDtoSchema.omit({ updatedAt: true }).partial().strict().refine((value) => Object.keys(value).length > 0, 'Select at least one preference');
