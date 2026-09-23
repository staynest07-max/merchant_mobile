import { z } from 'zod';
import { merchantBusinessTypes } from '../../contracts/merchantProfile';

const optionalEmail = z.union([z.literal(''), z.string().trim().email('Enter a valid email').max(254)]);
const optionalHttpsUrl = z.union([z.literal(''), z.string().trim().url('Enter a valid URL').max(2048).refine((value) => new URL(value).protocol === 'https:', 'Use an HTTPS URL')]);
const optionalGst = z.union([z.literal(''), z.string().trim().transform((value) => value.toUpperCase()).refine((value) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value), 'Enter a valid GST number')]);
const optionalPan = z.union([z.literal(''), z.string().trim().transform((value) => value.toUpperCase()).refine((value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value), 'Enter a valid PAN number')]);

export const merchantProfileFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must contain at least 2 characters').max(150),
  email: optionalEmail,
  profilePhotoUrl: optionalHttpsUrl,
  businessName: z.string().trim().min(2, 'Business name must contain at least 2 characters').max(200),
  businessType: z.enum(merchantBusinessTypes),
  gstNumber: optionalGst,
  panNumber: optionalPan,
  businessAddress: z.string().trim().max(500),
  city: z.string().trim().max(150),
  state: z.string().trim().max(150),
  pincode: z.union([z.literal(''), z.string().trim().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits')]),
  paymentQrUrl: optionalHttpsUrl,
  upiId: z.union([z.literal(''), z.string().trim().min(3).max(100).regex(/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$/, 'Enter a valid UPI ID')]),
}).strict();
