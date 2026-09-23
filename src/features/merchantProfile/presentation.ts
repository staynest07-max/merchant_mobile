import type { MerchantProfileForm, MerchantProfileUpdateRequest, MerchantSelfProfileDto } from '../../contracts/merchantProfile';

export const merchantProfileToForm = (profile: MerchantSelfProfileDto): MerchantProfileForm => ({
  fullName: profile.fullName,
  email: profile.email ?? '',
  profilePhotoUrl: profile.profilePhotoUrl ?? '',
  businessName: profile.business.name,
  businessType: profile.business.type ?? 'Individual',
  gstNumber: profile.business.gstNumber ?? '',
  panNumber: profile.business.panNumber ?? '',
  businessAddress: profile.address.businessAddress ?? '',
  city: profile.address.city ?? '',
  state: profile.address.state ?? '',
  pincode: profile.address.pincode ?? '',
  paymentQrUrl: profile.payment.qrUrl ?? '',
  upiId: profile.payment.upiId ?? '',
});

const nullable = (value: string) => value.trim() || null;
export const merchantProfileUpdatePayload = (form: MerchantProfileForm): MerchantProfileUpdateRequest => ({
  fullName: form.fullName.trim(),
  email: nullable(form.email),
  profilePhotoUrl: nullable(form.profilePhotoUrl),
  businessName: form.businessName.trim(),
  businessType: form.businessType as MerchantProfileUpdateRequest['businessType'],
  gstNumber: nullable(form.gstNumber)?.toUpperCase() ?? null,
  panNumber: nullable(form.panNumber)?.toUpperCase() ?? null,
  businessAddress: nullable(form.businessAddress),
  city: nullable(form.city),
  state: nullable(form.state),
  pincode: nullable(form.pincode),
  paymentQrUrl: nullable(form.paymentQrUrl),
  upiId: nullable(form.upiId),
});
