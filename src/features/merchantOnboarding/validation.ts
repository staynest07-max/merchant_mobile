import { merchantProfileFormSchema } from '../merchantProfile/validation';

export const merchantOnboardingSchema = merchantProfileFormSchema.extend({
  city: merchantProfileFormSchema.shape.city.trim().min(1, 'City is required').max(150),
});
