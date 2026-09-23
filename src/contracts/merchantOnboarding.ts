import type { MerchantBusinessType, MerchantSelfProfileDto } from './merchantProfile';

export interface MerchantOnboardingCompleteRequest {
  fullName: string; email?: string | null; profilePhotoUrl?: string | null;
  businessName: string; businessType: MerchantBusinessType;
  businessAddress?: string | null; city: string; state?: string | null; pincode?: string | null;
  gstNumber?: string | null; panNumber?: string | null; paymentQrUrl?: string | null; upiId?: string | null;
}
export interface MerchantOnboardingCompleteResponse { profile: MerchantSelfProfileDto; onboarding: { completed: true } }
export type MerchantOnboardingForm = Record<keyof Required<MerchantOnboardingCompleteRequest>, string>;
