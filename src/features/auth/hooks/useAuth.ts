import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { authMessage } from '../errors';
import { initializeSession, installRecovery } from '../session';
import { queryClient } from '../../../query/client';
import { queryKeys } from '../../../query/keys';
import { useAuthStore } from '../../../stores/authStore';

export function useInitializeAuth(): void {
  const started = useRef(false);
  useEffect(() => {
    const removeRecovery = installRecovery();
    if (!started.current) {
      started.current = true;
      void initializeSession();
    }
    return removeRecovery;
  }, []);
}

export const useRequestOtp = () => useMutation({
  mutationFn: (phone: string) => authService.requestOtp(phone),
});

export const useVerifyOtp = () => useMutation({
  mutationFn: ({ phone, otp }: { phone: string; otp: string }) => authService.verifyOtp(phone, otp),
  onSuccess: (result) => {
    if (result.kind !== 'authenticated') return;
    queryClient.setQueryData(queryKeys.auth.me(), result.principal);
    useAuthStore.getState().authenticated(result.principal);
  },
});

export const useMerchantSignup = () => useMutation({
  mutationFn: (input: { phone: string; otp: string; fullName: string; businessName: string; email?: string }) => authService.signup(input),
  onSuccess: (principal) => {
    queryClient.setQueryData(queryKeys.auth.me(), principal);
    useAuthStore.getState().authenticated(principal);
  },
});

export const useLogout = () => useMutation({
  mutationFn: () => authService.logout(),
  onSettled: () => {
    queryClient.clear();
    useAuthStore.getState().unauthenticated();
  },
});

export { authMessage };
