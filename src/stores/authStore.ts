import { create } from 'zustand';
import type { AuthPrincipal } from '../contracts/auth';

export type AuthStatus = 'initializing' | 'unauthenticated' | 'authenticated';

interface AuthState {
  status: AuthStatus;
  principal: AuthPrincipal | null;
  error: string | null;
  begin: () => void;
  authenticated: (principal: AuthPrincipal) => void;
  unauthenticated: (error?: string | null) => void;
}

export const isMerchantRole = (role: string): role is 'MERCHANT' => role === 'MERCHANT';

export const useAuthStore = create<AuthState>((set) => ({
  status: 'initializing',
  principal: null,
  error: null,
  begin: () => set({ status: 'initializing', error: null }),
  authenticated: (principal) => {
    if (!isMerchantRole(principal.role)) throw new Error('ROLE_FORBIDDEN');
    set({ status: 'authenticated', principal, error: null });
  },
  unauthenticated: (error = null) => set({ status: 'unauthenticated', principal: null, error }),
}));
