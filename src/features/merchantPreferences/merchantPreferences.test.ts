import { describe, expect, it } from 'vitest';
import { buildMerchantPreferencesUpdate, mapMerchantPreferences, preferencesDraft } from './presentation';
import { merchantPreferencesUpdateSchema } from './validation';
const backend = { emailAlerts: true, smsAlerts: false, pushAlerts: true, whatsapp: false, updatedAt: '2026-09-24T00:00:00.000Z' };
describe('merchant preferences contract', () => {
  it('maps GET values exactly, preserving true and false', () => expect(mapMerchantPreferences(backend)).toEqual(backend));
  it('maps all supported fields into editable state', () => expect(preferencesDraft(backend)).toEqual({ emailAlerts: true, smsAlerts: false, pushAlerts: true, whatsapp: false }));
  it('builds a PATCH containing only changed supported fields', () => expect(buildMerchantPreferencesUpdate(backend, { ...preferencesDraft(backend), smsAlerts: true, pushAlerts: false })).toEqual({ smsAlerts: true, pushAlerts: false }));
  it('rejects unsupported fields and non-boolean values', () => { expect(merchantPreferencesUpdateSchema.safeParse({ merchantId: 'forged' }).success).toBe(false); expect(merchantPreferencesUpdateSchema.safeParse({ emailAlerts: 'true' }).success).toBe(false); });
  it('rejects null because backend preference booleans are not nullable', () => expect(merchantPreferencesUpdateSchema.safeParse({ whatsapp: null }).success).toBe(false));
});
