import { ApiError } from '../../api/errors';
import type { MerchantResidentDto } from '../../contracts/merchantResident';

export const merchantResidentError = (error: unknown) => error instanceof ApiError ? error.message : error instanceof Error ? error.message : 'Unable to load residents.';
export const merchantResidentNotFound = (error: unknown) => error instanceof ApiError && error.status === 404;
export const residentRoomLabel = (resident: MerchantResidentDto) => resident.room ? `${resident.room.type} · ${resident.room.number}` : 'Room not assigned';
export const residentRentLabel = (resident: MerchantResidentDto) => resident.rent.displayLabel ?? (resident.rent.monthlyRent == null ? 'Not provided' : `₹${resident.rent.monthlyRent.toLocaleString('en-IN')} / mo`);
export const resetResidentPaymentDay = (resident: MerchantResidentDto) => resident.stay.joinDay;
export const residentStatusTone = (status: MerchantResidentDto['stay']['status']): 'neutral' | 'success' | 'warning' => status === 'Staying' ? 'success' : status === 'Notice Period' ? 'warning' : 'neutral';
