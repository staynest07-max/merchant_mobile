import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, spacing } from '@/design-system';

export function FoundationScreen({ label }: { label: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.brand}>STAYNEST</Text>
      <Text style={styles.title}>Merchant Mobile</Text>
      <Text style={styles.message}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
    backgroundColor: colors.background,
  },
  brand: {
    color: colors.primaryDark,
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    letterSpacing: 2,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontFamily: fontFamilies.headingBold,
    fontSize: 32,
  },
  message: {
    marginTop: spacing.lg,
    color: colors.textSecondary,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    textAlign: 'center',
  },
});
