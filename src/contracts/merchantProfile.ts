export const merchantBusinessTypes = ['Sole Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Individual'] as const;
export type MerchantBusinessType = typeof merchantBusinessTypes[number];

export interface MerchantSelfProfileDto {
  id: string;
  publicId: string;
  fullName: string;
  phone: string;
  email: string | null;
  profilePhotoUrl: string | null;
  business: { name: string; type: MerchantBusinessType | null; gstNumber: string | null; panNumber: string | null };
  address: { businessAddress: string | null; city: string | null; state: string | null; pincode: string | null };
  payment: { qrUrl: string | null; upiId: string | null };
  onboarding: { completed: boolean };
  access: { status: 'ACTIVE' | 'SUSPENDED'; approvedAt: string | null; rejectedAt: string | null; suspendedAt: string | null; statusReason: string | null };
  timestamps: { createdAt: string; updatedAt: string };
}

export interface MerchantProfileUpdateRequest {
  fullName?: string;
  email?: string | null;
  profilePhotoUrl?: string | null;
  businessName?: string;
  businessType?: MerchantBusinessType;
  gstNumber?: string | null;
  panNumber?: string | null;
  businessAddress?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  paymentQrUrl?: string | null;
  upiId?: string | null;
}

export type MerchantProfileForm = Record<keyof Required<MerchantProfileUpdateRequest>, string>;
