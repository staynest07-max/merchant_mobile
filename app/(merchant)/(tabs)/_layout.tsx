import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamilies, radius, spacing } from '@/design-system';

const labels: Record<string, string> = { index: 'Home', pgs: 'My PGs', enquiries: 'Enquiries', visits: 'Visits', more: 'More' };
const glyphs: Record<string, string> = { index: 'H', pgs: 'P', enquiries: 'E', visits: 'V', more: '•••' };

function TabItem({ route, focused }: { route: string; focused: boolean }) {
  return <View style={styles.item}><View style={[styles.glyph, focused && styles.glyphActive]}><Text style={[styles.glyphText, focused && styles.glyphTextActive]}>{glyphs[route]}</Text></View><Text style={[styles.label, focused && styles.labelActive]}>{labels[route]}</Text></View>;
}

export default function MerchantTabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false, tabBarShowLabel: false,
      tabBarIcon: ({ focused }) => <TabItem route={route.name} focused={focused} />,
      tabBarStyle: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: Math.max(insets.bottom, spacing.sm), height: 72, paddingTop: spacing.xs, paddingBottom: spacing.xs, backgroundColor: colors.surface, borderColor: colors.border, borderTopWidth: 1, borderWidth: 1, borderRadius: radius['2xl'] },
    })}>
      <Tabs.Screen name="index" /><Tabs.Screen name="pgs" /><Tabs.Screen name="enquiries" /><Tabs.Screen name="visits" /><Tabs.Screen name="more" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  item: { minWidth: 58, alignItems: 'center', justifyContent: 'center' }, glyph: { minWidth: 28, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full }, glyphActive: { backgroundColor: colors.primaryMuted }, glyphText: { color: colors.textTertiary, fontFamily: fontFamilies.bodySemiBold, fontSize: 12 }, glyphTextActive: { color: colors.primaryDark }, label: { color: colors.textTertiary, fontFamily: fontFamilies.bodyMedium, fontSize: 10, marginTop: 2 }, labelActive: { color: colors.primaryDark },
});
