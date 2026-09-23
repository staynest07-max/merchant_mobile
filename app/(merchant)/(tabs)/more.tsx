import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { merchantRoutes } from '@/navigation/merchantRoutes';

const destinations = [
  ['Residents', merchantRoutes.residents], ['Money', merchantRoutes.money], ['Availability', merchantRoutes.availability],
  ['Reviews', merchantRoutes.reviews], ['Notifications', merchantRoutes.notifications], ['Profile', merchantRoutes.profile], ['Preferences', merchantRoutes.preferences], ['Onboarding', merchantRoutes.onboarding],
] as const;

export default function MoreScreen() {
  const router = useRouter(); const logout = useLogout();
  return <MerchantScreen title="More" subtitle="All Merchant tools"><View style={styles.grid}>{destinations.map(([label, href]) => <Pressable key={href} onPress={() => router.push(href as Href)} style={styles.card}><Text style={styles.cardText}>{label}</Text><Text style={styles.arrow}>›</Text></Pressable>)}</View><Pressable accessibilityRole="button" disabled={logout.isPending} onPress={() => logout.mutate()} style={styles.logout}><Text style={styles.logoutText}>{logout.isPending ? 'Signing out…' : 'Log out'}</Text></Pressable></MerchantScreen>;
}

const styles = StyleSheet.create({ grid: { gap: spacing.sm }, card: { minHeight: touchTarget.min, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1 }, cardText: { color: colors.textPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 15 }, arrow: { color: colors.primaryDark, fontFamily: fontFamilies.heading, fontSize: 24 }, logout: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, backgroundColor: colors.errorLight, borderRadius: radius.control }, logoutText: { color: colors.error, fontFamily: fontFamilies.bodySemiBold, fontSize: 15 } });
