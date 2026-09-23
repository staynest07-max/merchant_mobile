import type { MerchantPgInput, PgStatus } from '../../contracts/merchantPg';

export type MerchantPgAction = 'edit' | 'submit' | 'pause' | 'resume';

export function merchantPgActions(status: PgStatus): MerchantPgAction[] {
  if (status === 'DRAFT' || status === 'CHANGES_REQUIRED') return ['edit', 'submit'];
  if (status === 'LIVE') return ['pause'];
  if (status === 'PAUSED') return ['resume'];
  return [];
}

export function buildMerchantPgPayload(input: MerchantPgInput, amenitiesText: string, coverImageUrl: string): MerchantPgInput {
  return {
    name: input.name,
    description: input.description,
    category: input.category,
    address: input.address,
    city: input.city,
    locality: input.locality,
    monthlyRent: input.monthlyRent,
    deposit: input.deposit,
    amenities: amenitiesText.split(',').map((item) => item.trim()).filter(Boolean),
    rooms: input.rooms?.map((room) => ({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      totalBeds: room.totalBeds,
      monthlyRent: room.monthlyRent,
    })),
    media: coverImageUrl.trim() ? [{ type: 'image', url: coverImageUrl.trim(), isCover: true }] : [],
    availability: input.availability?.map((item) => ({
      roomType: item.roomType,
      totalBeds: item.totalBeds,
      availableBeds: item.availableBeds,
      monthlyRent: item.monthlyRent,
    })),
  };
}
