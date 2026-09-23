import type { ReactNode } from 'react';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { merchantRoutes } from '@/navigation/merchantRoutes';

export function MerchantScreen({ title, subtitle, children, showBack = false, action, refreshing = false, onRefresh }: { title: string; subtitle?: string; children: ReactNode; showBack?: boolean; action?: ReactNode; refreshing?: boolean; onRefresh?: () => void }) {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeading}>
          {showBack ? <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}><Text style={styles.back}>‹</Text></Pressable> : null}
          <View style={styles.heading}><Text style={styles.brand}>STAYNEST · MERCHANT</Text><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View>
        </View>
        <View style={styles.actions}>{action}<Pressable accessibilityLabel="Notifications" onPress={() => router.push(merchantRoutes.notifications as Href)} style={styles.iconButton}><Text style={styles.bell}>N</Text></Pressable></View>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryDark} /> : undefined}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function FeaturePlaceholder({ title, description, actions = [] }: { title: string; description: string; actions?: Array<{ label: string; href: string }> }) {
  const router = useRouter();
  return (
    <MerchantScreen title={title} subtitle="Mobile navigation foundation">
      <View style={styles.placeholder}><Text style={styles.placeholderTitle}>{title}</Text><Text style={styles.placeholderText}>{description}</Text>
        {actions.map((item) => <Pressable accessibilityRole="button" key={item.href} onPress={() => router.push(item.href as Href)} style={styles.primary}><Text style={styles.primaryText}>{item.label}</Text></Pressable>)}
      </View>
    </MerchantScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 82, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 },
  headerLeading: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, heading: { flex: 1 }, actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brand: { color: colors.primaryDark, fontFamily: fontFamilies.bodySemiBold, fontSize: 10, letterSpacing: 1.2 },
  title: { color: colors.textPrimary, fontFamily: fontFamilies.heading, fontSize: 22 }, subtitle: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12, marginTop: 2 },
  iconButton: { width: touchTarget.icon, height: touchTarget.icon, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryMuted, borderRadius: radius.full },
  back: { color: colors.primaryDark, fontFamily: fontFamilies.heading, fontSize: 30, lineHeight: 32 }, bell: { color: colors.primaryDark, fontSize: 17 },
  content: { flexGrow: 1, padding: spacing.lg, paddingBottom: 104 },
  placeholder: { minHeight: 260, justifyContent: 'center', gap: spacing.md, padding: spacing['2xl'], backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: 1 },
  placeholderTitle: { color: colors.textPrimary, fontFamily: fontFamilies.headingBold, fontSize: 26 }, placeholderText: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 15, lineHeight: 23 },
  primary: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, backgroundColor: colors.primaryDark, borderRadius: radius.control }, primaryText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 14 },
});
