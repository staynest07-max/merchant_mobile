import { apiClient, clearAccessToken, setAccessToken } from '../../../api/client';
import type { AuthMeResult, AuthPrincipal, AuthTokens, RequestOtpResult } from '../../../contracts/auth';
import { clearRefreshToken, getRefreshToken, saveRefreshToken } from '../../../storage/secureTokens';
import { isMerchantRole } from '../../../stores/authStore';

function requireMerchantRole(role: string): void {
  if (!isMerchantRole(role)) throw new Error('ROLE_FORBIDDEN');
}

async function accept(tokens: AuthTokens): Promise<AuthTokens> {
  requireMerchantRole(tokens.account.role);
  await saveRefreshToken(tokens.refreshToken);
  setAccessToken(tokens.accessToken);
  return tokens;
}

export async function clearCredentials(): Promise<void> {
  clearAccessToken();
  await clearRefreshToken();
}

export const authService = {
  async requestOtp(phone: string): Promise<RequestOtpResult> {
    return (await apiClient.post<RequestOtpResult>(
      '/auth/request-otp',
      { phone },
      { authenticated: false }
    )).data;
  },

  async verifyOtp(phone: string, otp: string): Promise<AuthPrincipal> {
    try {
      const response = await apiClient.post<AuthTokens>(
        '/auth/verify-otp',
        { phone, otp },
        { authenticated: false }
      );
      await accept(response.data);
      return await this.me(true);
    } catch (error) {
      await clearCredentials();
      throw error;
    }
  },

  async refresh(): Promise<AuthTokens> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('NO_SESSION');
    const response = await apiClient.post<AuthTokens>(
      '/auth/refresh',
      { refreshToken },
      { authenticated: false, retry: true }
    );
    return accept(response.data);
  },

  async restore(): Promise<AuthPrincipal | null> {
    if (!(await getRefreshToken())) return null;
    await this.refresh();
    return this.me(true);
  },

  async me(skipRefresh = false): Promise<AuthPrincipal> {
    const principal = (await apiClient.get<AuthMeResult>('/auth/me', { retry: skipRefresh })).data.principal;
    requireMerchantRole(principal.role);
    return principal;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', undefined, { retry: true });
    } finally {
      await clearCredentials();
    }
  },

  clearCredentials,
};
