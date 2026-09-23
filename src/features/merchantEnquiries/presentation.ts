import { ApiError } from '../../api/errors';
import type { MerchantEnquiry, MerchantEnquiryStatus } from '../../contracts/merchantEnquiry';

export const merchantEnquiryFilters = ['ALL', 'NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'CLOSED', 'CANCELLED', 'REJECTED', 'NO_RESPONSE'] as const;
export type MerchantEnquiryFilter = typeof merchantEnquiryFilters[number];

export function filterMerchantEnquiries(enquiries: MerchantEnquiry[], filter: MerchantEnquiryFilter, search: string) {
  const term = search.trim().toLocaleLowerCase();
  return enquiries.filter((enquiry) => (filter === 'ALL' || enquiry.status === filter) && (!term || [enquiry.user.name, enquiry.user.phone, enquiry.pg.name].some((value) => value.toLocaleLowerCase().includes(term))));
}

export function merchantEnquiryError(error: unknown) {
  if (error instanceof ApiError) return error.status === 409 ? 'The enquiry changed elsewhere. The latest state has been refreshed.' : error.message;
  return error instanceof Error ? error.message : 'Unable to load enquiries. Please try again.';
}

export function enquiryTransitionLabel(status: MerchantEnquiryStatus) {
  return status.replaceAll('_', ' ');
}
