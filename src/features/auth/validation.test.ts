import { describe, expect, it } from 'vitest';
import { isMerchantRole } from '../../stores/authStore';
import { normalizePhone, validOtp, validPhone } from './validation';

describe('auth validation and authorization', () => {
  it('normalizes supported Indian numbers', () => {
    expect(normalizePhone('+91 98765 43210')).toBe('9876543210');
    expect(validPhone('9876543210')).toBe(true);
    expect(validPhone('5876543210')).toBe(false);
  });
  it('requires exactly six OTP digits without knowing their value', () => {
    expect(validOtp('123456')).toBe(true);
    expect(validOtp('12345')).toBe(false);
    expect(validOtp('1234567')).toBe(false);
    expect(validOtp('12x456')).toBe(false);
  });
  it.each([['MERCHANT', true], ['ADMIN', false], ['SUPER_ADMIN', false], ['USER', false]] as const)('%s Merchant access is %s', (role, allowed) => {
    expect(isMerchantRole(role)).toBe(allowed);
  });
});
