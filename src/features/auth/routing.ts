import type { AuthPrincipal } from '../../contracts/auth';
import type { AuthStatus } from '../../stores/authStore';

export type AuthDestination = '/(auth)' | '/(merchant)';

export function authDestination(
  status: AuthStatus,
  principal: AuthPrincipal | null
): AuthDestination | null {
  if (status === 'initializing') return null;
  if (status !== 'authenticated' || !principal || principal.role !== 'MERCHANT') return '/(auth)';
  return '/(merchant)';
}

/** Kept only so the preserved web reference implementation continues to typecheck. */
export function navigateToPrincipalDashboard(principal: AuthPrincipal): AuthDestination {
  return authDestination('authenticated', principal) ?? '/(auth)';
}
