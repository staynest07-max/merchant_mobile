import { z } from 'zod';
import type { MerchantSignupRequest } from '../../contracts/auth';

export const normalizePhone=(value:string)=>{const digits=value.replace(/\D/g,'');return digits.length===12&&digits.startsWith('91')?digits.slice(2):digits};
export const validPhone=(value:string)=>/^[6-9]\d{9}$/.test(normalizePhone(value));export const validOtp=(value:string)=>/^\d{6}$/.test(value);

export const merchantSignupFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter the owner name.').max(150),
  businessName: z.string().trim().min(2, 'Enter the business name.').max(200),
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email.').max(254)]),
}).strict();

export function merchantSignupPayload(phone: string, otp: string, form: z.infer<typeof merchantSignupFormSchema>): MerchantSignupRequest {
  const email = form.email.trim();
  return { phone, otp, fullName: form.fullName.trim(), businessName: form.businessName.trim(), ...(email ? { email } : {}) };
}
