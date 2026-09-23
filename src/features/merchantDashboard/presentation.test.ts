import { describe, expect, it } from 'vitest';
import type { EnquiryItem, PGListing } from '../../types/merchant';
import { merchantDashboardSummary, merchantGreeting } from './presentation';

describe('merchant dashboard presentation', () => {
  it('derives only metrics used by the real web dashboard', () => { const pgs = [{ totalRooms: 3, totalBeds: 8, availableBeds: 2 }] as PGListing[]; const enquiries = [{ status: 'NEW' }, { status: 'CONTACTED' }] as EnquiryItem[]; expect(merchantDashboardSummary(pgs, enquiries)).toEqual({ totalPgs: 1, totalRooms: 3, occupiedBeds: 6, availableBeds: 2, newEnquiries: 1 }); });
  it('does not allow negative occupied beds', () => expect(merchantDashboardSummary([{ totalRooms: 1, totalBeds: 1, availableBeds: 2 }] as PGListing[], []).occupiedBeds).toBe(0));
  it('uses the existing time-based greeting', () => { expect(merchantGreeting(9)).toBe('Good Morning'); expect(merchantGreeting(15)).toBe('Good Afternoon'); expect(merchantGreeting(20)).toBe('Good Evening'); });
});
