import type { EnquiryItem, PGListing } from '../../types/merchant';

export interface MerchantDashboardSummary { totalPgs: number; totalRooms: number; occupiedBeds: number; availableBeds: number; newEnquiries: number }
export function merchantDashboardSummary(pgs: PGListing[], enquiries: EnquiryItem[]): MerchantDashboardSummary {
  return {
    totalPgs: pgs.length,
    totalRooms: pgs.reduce((total, pg) => total + pg.totalRooms, 0),
    availableBeds: pgs.reduce((total, pg) => total + (pg.availableBeds || 0), 0),
    occupiedBeds: pgs.reduce((total, pg) => total + Math.max((pg.totalBeds || 0) - (pg.availableBeds || 0), 0), 0),
    newEnquiries: enquiries.filter((enquiry) => enquiry.status === 'NEW').length,
  };
}

export function merchantGreeting(hour: number) { return hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'; }
