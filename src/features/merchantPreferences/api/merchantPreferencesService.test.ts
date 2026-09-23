import { beforeEach, describe, expect, it, vi } from 'vitest';
const get = vi.hoisted(() => vi.fn()); const patch = vi.hoisted(() => vi.fn());
vi.mock('../../../api/client', () => ({ apiClient: { get, patch } }));
import { merchantPreferencesService } from './merchantPreferencesService';
const data = { emailAlerts: true, smsAlerts: false, pushAlerts: true, whatsapp: false, updatedAt: '2026-09-24T00:00:00.000Z' };
describe('merchant preferences service', () => {
  beforeEach(() => { vi.clearAllMocks(); get.mockResolvedValue({ data }); patch.mockResolvedValue({ data: { ...data, smsAlerts: true } }); });
  it('gets canonical preferences', async () => { await expect(merchantPreferencesService.get()).resolves.toEqual(data); expect(get).toHaveBeenCalledWith('/merchants/preferences'); });
  it('patches only the supported payload and returns the canonical response', async () => { await expect(merchantPreferencesService.update({ smsAlerts: true })).resolves.toMatchObject({ smsAlerts: true }); expect(patch).toHaveBeenCalledWith('/merchants/preferences', { smsAlerts: true }); });
  it('rejects an unsupported field before calling the API', async () => { await expect(merchantPreferencesService.update({ merchantId: 'bad' } as never)).rejects.toThrow(); expect(patch).not.toHaveBeenCalled(); });
  it('propagates API failures', async () => { const error = new Error('Backend unavailable'); patch.mockRejectedValueOnce(error); await expect(merchantPreferencesService.update({ whatsapp: true })).rejects.toBe(error); });
});
