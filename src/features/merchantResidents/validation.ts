import { z } from 'zod';
export const residentPaymentDaySchema = z.number().int('Payment day must be a whole number').min(1, 'Payment day must be from 1 to 31').max(31, 'Payment day must be from 1 to 31');
