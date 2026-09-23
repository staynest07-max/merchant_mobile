import { beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.hoisted(() => vi.fn());
const post = vi.hoisted(() => vi.fn());
const setAccessToken = vi.hoisted(() => vi.fn());
const clearAccessToken = vi.hoisted(() => vi.fn());
const getRefreshToken = vi.hoisted(() => vi.fn());
const saveRefreshToken = vi.hoisted(() => vi.fn());
const clearRefreshToken = vi.hoisted(() => vi.fn());

vi.mock('../../../api/client', () => ({ apiClient: { get, post }, setAccessToken, clearAccessToken }));
vi.mock('../../../storage/secureTokens', () => ({ getRefreshToken, saveRefreshToken, clearRefreshToken }));

import { authService } from './authService';

type Role = 'USER' | 'MERCHANT' | 'ADMIN' | 'SUPER_ADMIN';
const tokens = (role: Role = 'MERCHANT') => ({ account: { id: 'account-a', role }, accessToken: 'access-token', refreshToken: 'refresh-token', expiresIn: 900, refreshExpiresAt: '2030-01-01T00:00:00.000Z' });
const principal = (role: Role = 'MERCHANT') => ({ accountId: 'account-a', role, sessionId: 'session-a', ...(role === 'MERCHANT' ? { merchantId: 'merchant-a' } : {}) });

describe('merchant auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRefreshToken.mockResolvedValue('stored-refresh-token');
    saveRefreshToken.mockResolvedValue(undefined);
    clearRefreshToken.mockResolvedValue(undefined);
  });

  it('requests an OTP through the backend', async () => {
    post.mockResolvedValue({ data: { expiresInSeconds: 60 } });
    await authService.requestOtp('9876543210');
    expect(post).toHaveBeenCalledWith('/auth/request-otp', { phone: '9876543210' }, { authenticated: false });
  });

  it.each(['654321', '160999'])('verifies the six-digit OTP %s only through the backend', async (otp) => {
    post.mockResolvedValueOnce({ data: tokens() });
    get.mockResolvedValueOnce({ data: { principal: principal() } });
    await expect(authService.verifyOtp('9876543210', otp)).resolves.toMatchObject({ role: 'MERCHANT' });
    expect(post).toHaveBeenCalledWith('/auth/verify-otp', { phone: '9876543210', otp }, { authenticated: false });
    expect(saveRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(setAccessToken).toHaveBeenCalledWith('access-token');
  });

  it('clears credentials when the backend rejects an invalid OTP', async () => {
    post.mockRejectedValue(new Error('INVALID_OTP'));
    await expect(authService.verifyOtp('9876543210', '000000')).rejects.toThrow('INVALID_OTP');
    expect(clearAccessToken).toHaveBeenCalled();
    expect(clearRefreshToken).toHaveBeenCalled();
  });

  it('restores a session and rotates the refresh token', async () => {
    post.mockResolvedValueOnce({ data: tokens() });
    get.mockResolvedValueOnce({ data: { principal: principal() } });
    await expect(authService.restore()).resolves.toMatchObject({ merchantId: 'merchant-a' });
    expect(post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'stored-refresh-token' }, { authenticated: false, retry: true });
    expect(saveRefreshToken).toHaveBeenCalledWith('refresh-token');
  });

  it('does not call the backend when no refresh token exists', async () => {
    getRefreshToken.mockResolvedValue(null);
    await expect(authService.restore()).resolves.toBeNull();
    expect(post).not.toHaveBeenCalled();
  });

  it('always clears credentials when logout fails', async () => {
    post.mockRejectedValue(new Error('SESSION_REVOKED'));
    await expect(authService.logout()).rejects.toThrow('SESSION_REVOKED');
    expect(clearAccessToken).toHaveBeenCalled();
    expect(clearRefreshToken).toHaveBeenCalled();
  });

  it.each(['USER', 'ADMIN', 'SUPER_ADMIN'] as const)('rejects a %s token before opening the Merchant app', async (role) => {
    post.mockResolvedValueOnce({ data: tokens(role) });
    await expect(authService.verifyOtp('9876543210', '654321')).rejects.toThrow('ROLE_FORBIDDEN');
    expect(get).not.toHaveBeenCalled();
    expect(clearRefreshToken).toHaveBeenCalled();
  });

  it.each(['USER', 'ADMIN', 'SUPER_ADMIN'] as const)('rejects a backend-authoritative %s principal', async (role) => {
    post.mockResolvedValueOnce({ data: tokens() });
    get.mockResolvedValueOnce({ data: { principal: principal(role) } });
    await expect(authService.verifyOtp('9876543210', '654321')).rejects.toThrow('ROLE_FORBIDDEN');
    expect(clearRefreshToken).toHaveBeenCalled();
  });
});
