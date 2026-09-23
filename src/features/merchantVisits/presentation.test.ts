import { describe, expect, it } from 'vitest';
import { ApiError } from '../../api/errors';
import type { MerchantVisit } from '../../contracts/merchantVisit';
import { allowedVisitActions } from './transitions';
import { filterMerchantVisits, merchantVisitError, merchantVisitFilters } from './presentation';

const visit = { id: 'v1', publicId: 'VIS-1', pg: { publicId: 'PG-1', name: 'Nest', location: { address: 'A', city: 'Pune', locality: 'Baner' } }, enquiry: null, user: { name: 'Asha', phone: '9000000000', email: null }, requestedDate: '2026-12-10', requestedTime: '10:00', requestedStartAt: '2026-12-10T04:30:00Z', requestedEndAt: '2026-12-10T05:00:00Z', note: null, status: 'REQUESTED', createdAt: '2026-01-01', updatedAt: '2026-01-01' } satisfies MerchantVisit;
describe('native visit presentation', () => {
  it('keeps canonical filters', () => expect(merchantVisitFilters).toHaveLength(8));
  it('filters by backend status', () => { expect(filterMerchantVisits([visit], 'REQUESTED')).toEqual([visit]); expect(filterMerchantVisits([visit], 'CONFIRMED')).toEqual([]); });
  it('preserves canonical actions', () => { expect(allowedVisitActions('REQUESTED')).toEqual(['confirm', 'reject', 'reschedule']); expect(allowedVisitActions('COMPLETED')).toEqual([]); });
  it('explains conflict refresh', () => expect(merchantVisitError(new ApiError('Conflict', 'CONFLICT', 409))).toContain('latest state has been refreshed'));
});
