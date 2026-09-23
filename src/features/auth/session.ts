import { configureAuthRecovery } from '../../api/client';
import { queryClient } from '../../query/client';
import { queryKeys } from '../../query/keys';
import { useAuthStore } from '../../stores/authStore';
import { authService } from './api/authService';
import { authMessage } from './errors';

let initializationPromise: Promise<void> | null = null;

export async function clearSession(clearCredential = true): Promise<void> {
  if (clearCredential) await authService.clearCredentials();
  queryClient.clear();
  useAuthStore.getState().unauthenticated();
}

export function initializeSession(): Promise<void> {
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const store = useAuthStore.getState();
    store.begin();
    try {
      const principal = await authService.restore();
      if (!principal) {
        store.unauthenticated();
        return;
      }
      queryClient.setQueryData(queryKeys.auth.me(), principal);
      store.authenticated(principal);
    } catch (error) {
      await authService.clearCredentials();
      store.unauthenticated(authMessage(error));
    }
  })();

  return initializationPromise;
}

export function installRecovery(): () => void {
  return configureAuthRecovery({
    refresh: async () => {
      await authService.refresh();
    },
    invalid: () => clearSession(true),
  });
}
