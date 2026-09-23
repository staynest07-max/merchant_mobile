import { ApiError } from '../../api/errors';
import type { MerchantVisit, MerchantVisitStatus } from '../../contracts/merchantVisit';

export const merchantVisitFilters = ['ALL', 'REQUESTED', 'CONFIRMED', 'RESCHEDULE_REQUESTED', 'COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'] as const;
export type MerchantVisitFilter = typeof merchantVisitFilters[number];
export const filterMerchantVisits = (visits: MerchantVisit[], status: MerchantVisitFilter) => visits.filter((visit) => status === 'ALL' || visit.status === status);
export const merchantVisitError = (error: unknown) => error instanceof ApiError ? error.status === 409 ? 'The visit changed elsewhere. Its latest state has been refreshed.' : error.message : error instanceof Error ? error.message : 'Unable to load visits. Please try again.';
export const visitStatusTone = (status: MerchantVisitStatus): 'neutral' | 'success' | 'warning' | 'error' => status === 'COMPLETED' ? 'success' : status === 'REQUESTED' || status === 'RESCHEDULE_REQUESTED' ? 'warning' : status === 'CANCELLED' || status === 'REJECTED' || status === 'NO_SHOW' ? 'error' : 'neutral';
