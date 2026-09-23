import { beforeEach, describe, expect, it, vi } from 'vitest';
const get = vi.hoisted(() => vi.fn()); const patch = vi.hoisted(() => vi.fn());
vi.mock('../../../api/client', () => ({ apiClient: { get, patch } }));
import { merchantProfileService } from './merchantProfileService';
describe('merchant profile service', () => {
  beforeEach(() => { vi.clearAllMocks(); get.mockResolvedValue({ data: { id: 'm1' } }); patch.mockResolvedValue({ data: { id: 'm1', fullName: 'Updated' } }); });
  it('loads the authenticated merchant profile', async () => { await expect(merchantProfileService.get()).resolves.toMatchObject({ id: 'm1' }); expect(get).toHaveBeenCalledWith('/merchants/me'); });
  it('updates through the canonical self-profile endpoint', async () => { const input = { fullName: 'Updated' }; await expect(merchantProfileService.update(input)).resolves.toMatchObject({ fullName: 'Updated' }); expect(patch).toHaveBeenCalledWith('/merchants/me', input); });
  it('propagates backend API errors without reporting success', async () => { const failure = new Error('Validation failed'); patch.mockRejectedValueOnce(failure); await expect(merchantProfileService.update({ fullName: 'X' })).rejects.toBe(failure); });
});
