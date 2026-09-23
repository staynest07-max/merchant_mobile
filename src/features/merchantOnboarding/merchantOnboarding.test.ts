import { describe, expect, it } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import type { MerchantSelfProfileDto } from '../../contracts/merchantProfile';
import { canSubmitOnboarding, onboardingDestination, onboardingFormFromProfile, onboardingPayload } from './presentation';
import { merchantOnboardingSchema } from './validation';
import { applyCompletedOnboarding } from './hooks/useMerchantOnboarding';
import { merchantProfileKeys } from '../merchantProfile/hooks/useMerchantProfile';
const profile = { fullName: 'Merchant Owner', phone: '+91 90000 00000', email: null, profilePhotoUrl: null, business: { name: 'Nest Business', type: 'Individual', gstNumber: null, panNumber: null }, address: { businessAddress: null, city: 'Pune', state: null, pincode: null }, payment: { qrUrl: null, upiId: null }, onboarding: { completed: false } } as MerchantSelfProfileDto;
describe('merchant onboarding validation and presentation', () => {
  it('prefills known profile fields without fabricating optional values', () => expect(onboardingFormFromProfile(profile)).toMatchObject({ fullName: 'Merchant Owner', email: '', businessName: 'Nest Business', businessType: 'Individual', city: 'Pune' }));
  it.each([['fullName', ''], ['businessName', ''], ['city', '']] as const)('requires %s', (field, value) => expect(merchantOnboardingSchema.safeParse({ ...onboardingFormFromProfile(profile), [field]: value }).success).toBe(false));
  it('rejects unsupported business types', () => expect(merchantOnboardingSchema.safeParse({ ...onboardingFormFromProfile(profile), businessType: 'PG Owner' }).success).toBe(false));
  it('validates optional backend fields', () => { const form = onboardingFormFromProfile(profile); expect(merchantOnboardingSchema.safeParse({ ...form, email: 'bad' }).success).toBe(false); expect(merchantOnboardingSchema.safeParse({ ...form, paymentQrUrl: 'http://example.com/qr' }).success).toBe(false); expect(merchantOnboardingSchema.safeParse({ ...form, pincode: '123' }).success).toBe(false); });
  it('builds only the supported request payload', () => { const payload = onboardingPayload(onboardingFormFromProfile(profile)); expect(payload).toMatchObject({ fullName: 'Merchant Owner', businessName: 'Nest Business', businessType: 'Individual', city: 'Pune' }); expect(payload).not.toHaveProperty('phone'); expect(payload).not.toHaveProperty('merchantId'); expect(payload).not.toHaveProperty('onboardingDone'); });
  it('prevents submission while a request is pending', () => { expect(canSubmitOnboarding(false)).toBe(true); expect(canSubmitOnboarding(true)).toBe(false); });
  it('uses backend completion for routing', () => { expect(onboardingDestination(profile)).toBe('/(merchant-onboarding)'); expect(onboardingDestination({ ...profile, onboarding: { completed: true } })).toBe('/(merchant)'); });
  it('updates and invalidates the canonical Merchant profile query after success', async () => { const client = new QueryClient(); const completed = { ...profile, onboarding: { completed: true } }; await applyCompletedOnboarding(client, { profile: completed, onboarding: { completed: true } }); expect(client.getQueryData(merchantProfileKeys.all)).toEqual(completed); expect(client.getQueryState(merchantProfileKeys.all)?.isInvalidated).toBe(true); });
});
