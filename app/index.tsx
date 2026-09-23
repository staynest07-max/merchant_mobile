import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function IndexScreen() {
  const status = useAuthStore((state) => state.status);
  const principal = useAuthStore((state) => state.principal);

  if (status === 'initializing') return null;
  return <Redirect href={status === 'authenticated' && principal?.role === 'MERCHANT' ? '/(merchant)' : '/(auth)'} />;
}
