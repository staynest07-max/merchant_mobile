import { describe, expect, it } from 'vitest';
import type { AuthPrincipal } from '../../contracts/auth';
import { authDestination } from './routing';

const principal = (role: AuthPrincipal['role']): AuthPrincipal => ({ accountId: 'account', role, sessionId: 'session' });

describe('merchant mobile auth routing', () => {
  it('waits while the session is initializing', () => expect(authDestination('initializing', null)).toBeNull());
  it('routes unauthenticated users to login', () => expect(authDestination('unauthenticated', null)).toBe('/(auth)'));
  it('routes an authenticated merchant to the Merchant application', () => expect(authDestination('authenticated', principal('MERCHANT'))).toBe('/(merchant)'));
  it.each(['USER', 'ADMIN', 'SUPER_ADMIN'] as const)('never routes %s into Merchant screens', (role) => {
    expect(authDestination('authenticated', principal(role))).toBe('/(auth)');
  });
});
