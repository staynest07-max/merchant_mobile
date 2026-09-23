import { describe, expect, it } from 'vitest';
import type { MerchantPgInput, PgStatus } from '../../contracts/merchantPg';
import { buildMerchantPgPayload, merchantPgActions } from './presentation';

const input: MerchantPgInput = {
  name: 'StayNest One', description: 'Safe accommodation', category: 'Girls Only', address: '1 Main Road', city: 'Hyderabad', locality: 'Madhapur', monthlyRent: 12000, deposit: 24000,
  amenities: [], rooms: [{ roomNumber: '101', roomType: '2 Sharing', totalBeds: 2, monthlyRent: 12000 }],
  media: [], availability: [{ roomType: '2 Sharing', totalBeds: 2, availableBeds: 1, monthlyRent: 12000 }],
};

describe('native Merchant PG presentation', () => {
  it.each([['DRAFT', ['edit', 'submit']], ['CHANGES_REQUIRED', ['edit', 'submit']], ['LIVE', ['pause']], ['PAUSED', ['resume']]] as const)('shows only valid %s actions', (status, actions) => {
    expect(merchantPgActions(status)).toEqual(actions);
  });
  it.each(['PENDING_REVIEW', 'REJECTED', 'FULLY_OCCUPIED', 'SUSPENDED', 'ARCHIVED'] as PgStatus[])('keeps %s view-only', (status) => {
    expect(merchantPgActions(status)).toEqual([]);
  });
  it('builds the existing API payload without ownership or lifecycle fields', () => {
    const payload = buildMerchantPgPayload(input, 'WiFi, CCTV', ' https://example.test/cover.jpg ');
    expect(payload).toMatchObject({ category: 'Girls Only', amenities: ['WiFi', 'CCTV'], media: [{ type: 'image', url: 'https://example.test/cover.jpg', isCover: true }] });
    for (const key of ['merchantId', 'ownerId', 'reviewerId', 'status', 'approvedAt', 'rating']) expect(payload).not.toHaveProperty(key);
  });
});
