import { beforeEach, describe, expect, it, vi } from 'vitest';
const post = vi.hoisted(() => vi.fn()); vi.mock('../../../api/client', () => ({ apiClient: { post } }));
import { merchantOnboardingService } from './merchantOnboardingService';
const input = { fullName: 'Owner', businessName: 'Nest', businessType: 'Individual' as const, city: 'Pune' };
describe('merchant onboarding service', () => {
  beforeEach(() => { vi.clearAllMocks(); post.mockResolvedValue({ data: { profile: { onboarding: { completed: true } }, onboarding: { completed: true } } }); });
  it('posts the exact onboarding endpoint and payload', async () => { await merchantOnboardingService.complete(input); expect(post).toHaveBeenCalledWith('/merchants/onboarding/complete', input); });
  it('returns the backend-authoritative completed profile', async () => expect(await merchantOnboardingService.complete(input)).toMatchObject({ profile: { onboarding: { completed: true } }, onboarding: { completed: true } }));
  it.each([[400, 'Validation failed'], [401, 'Authentication required'], [403, 'Forbidden'], [409, 'Conflict'], [0, 'Network unavailable']] as const)('propagates status %s errors', async (_status, text) => { const error = new Error(text); post.mockRejectedValueOnce(error); await expect(merchantOnboardingService.complete(input)).rejects.toBe(error); });
});
