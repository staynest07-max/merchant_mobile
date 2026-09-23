import type { MerchantOnboardingCompleteRequest, MerchantOnboardingForm } from '../../contracts/merchantOnboarding';
import type { MerchantSelfProfileDto } from '../../contracts/merchantProfile';
import { merchantProfileToForm, merchantProfileUpdatePayload } from '../merchantProfile/presentation';

export const onboardingFormFromProfile = (profile: MerchantSelfProfileDto): MerchantOnboardingForm => merchantProfileToForm(profile);
export const onboardingPayload = (form: MerchantOnboardingForm): MerchantOnboardingCompleteRequest => {
  const profile = merchantProfileUpdatePayload(form);
  return { ...profile, fullName: profile.fullName!, businessName: profile.businessName!, businessType: profile.businessType!, city: profile.city! };
};
export const onboardingDestination = (profile: MerchantSelfProfileDto) => profile.onboarding.completed ? '/(merchant)' as const : '/(merchant-onboarding)' as const;
export const canSubmitOnboarding = (pending: boolean) => !pending;
