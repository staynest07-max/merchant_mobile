import { describe, expect, it } from 'vitest';
import { ApiError } from '../../api/errors';
import type { MerchantEnquiry } from '../../contracts/merchantEnquiry';
import { allowedEnquiryTransitions } from './transitions';
import { filterMerchantEnquiries, merchantEnquiryError, merchantEnquiryFilters } from './presentation';

const enquiry = { id: 'e1', publicId: 'ENQ-1', pg: { publicId: 'PG-1', name: 'Green Nest', location: { address: 'Road', city: 'Pune', locality: 'Baner' } }, user: { name: 'Asha', phone: '9000000000', email: null }, details: { message: null, roomType: '2 Sharing', moveInDate: null }, status: 'NEW', createdAt: '2026-01-01', updatedAt: '2026-01-01' } satisfies MerchantEnquiry;

describe('native merchant enquiry presentation', () => {
  it('keeps every canonical filter', () => expect(merchantEnquiryFilters).toEqual(['ALL', 'NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'CLOSED', 'CANCELLED', 'REJECTED', 'NO_RESPONSE']));
  it('filters by status and searches tenant, phone, or PG', () => { expect(filterMerchantEnquiries([enquiry], 'NEW', 'green')).toEqual([enquiry]); expect(filterMerchantEnquiries([enquiry], 'CONTACTED', 'asha')).toEqual([]); });
  it('shows the conflict refresh message', () => expect(merchantEnquiryError(new ApiError('Conflict', 'CONFLICT', 409))).toContain('latest state has been refreshed'));
  it('uses canonical transition rules', () => { expect(allowedEnquiryTransitions('NEW')).toEqual(['CONTACTED', 'REJECTED', 'CANCELLED']); expect(allowedEnquiryTransitions('CLOSED')).toEqual([]); });
});
