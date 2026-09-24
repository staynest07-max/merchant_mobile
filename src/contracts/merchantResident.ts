export const merchantResidentStatuses = ['Staying', 'Notice Period', 'Moved Out'] as const;
export type MerchantResidentStatus = typeof merchantResidentStatuses[number];
export interface MerchantResidentDto {
  id: string; publicId: string;
  resident: { name: string; phone: string };
  pg: { id: string; publicId: string; name: string };
  room: { id: string; publicId: string; number: string; type: string; building: string | null; floor: string | null; wing: string | null } | null;
  stay: { joinedDate: string; joinDay: number; status: MerchantResidentStatus; moveOutDate: string | null; agreementEndDate: string | null };
  rent: { monthlyRent: number | null; displayLabel: string | null; paymentDay: number; smsReminders: boolean };
  timestamps: { createdAt: string; updatedAt: string };
}
export interface MerchantResidentListParams { page?: number; limit?: number; status?: MerchantResidentStatus; pgId?: string; search?: string }
export interface MerchantResidentPage { items: MerchantResidentDto[]; meta: { page: number; limit: number; total: number; totalPages: number } }
