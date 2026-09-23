import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { authMessage, useRequestOtp } from '@/features/auth/hooks/useAuth';
import { normalizePhone, validPhone } from '@/features/auth/validation';

export default function MerchantLoginScreen() {
  const router = useRouter();
  const requestOtp = useRequestOtp();
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = () => {
    const normalized = normalizePhone(phone);
    if (!validPhone(normalized)) {
      setLocalError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setLocalError(null);
    requestOtp.mutate(normalized, {
      onSuccess: () => router.push({ pathname: './otp', params: { phone: normalized } }),
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.brand}>STAYNEST</Text>
          <Text style={styles.title}>Merchant sign in</Text>
          <Text style={styles.subtitle}>Use the mobile number registered with your merchant account.</Text>
          <Text style={styles.label}>Mobile number</Text>
          <View style={styles.inputRow}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              accessibilityLabel="Mobile number"
              autoComplete="tel"
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={(value) => setPhone(value.replace(/\D/g, ''))}
              placeholder="98765 43210"
              placeholderTextColor={colors.textTertiary}
              style={styles.input}
              value={phone}
            />
          </View>
          {(localError || requestOtp.error) && (
            <Text style={styles.error}>{localError ?? authMessage(requestOtp.error)}</Text>
          )}
          <Pressable disabled={requestOtp.isPending} onPress={submit} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>{requestOtp.isPending ? 'Sending OTP…' : 'Continue'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, justifyContent: 'center', padding: spacing['2xl'] },
  content: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  brand: { color: colors.primaryDark, fontFamily: fontFamilies.bodySemiBold, fontSize: 14, letterSpacing: 2 },
  title: { color: colors.textPrimary, fontFamily: fontFamilies.headingBold, fontSize: 32, marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24, marginTop: spacing.md },
  label: { color: colors.textPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 14, marginTop: spacing['3xl'], marginBottom: spacing.sm },
  inputRow: { minHeight: touchTarget.min, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.borderStrong, borderRadius: radius.control, borderWidth: 1, paddingHorizontal: spacing.lg },
  prefix: { color: colors.textPrimary, fontFamily: fontFamilies.numbers, fontSize: 16, marginRight: spacing.md },
  input: { flex: 1, minHeight: touchTarget.min, color: colors.textPrimary, fontFamily: fontFamilies.numbers, fontSize: 17 },
  error: { color: colors.error, fontFamily: fontFamilies.body, fontSize: 14, marginTop: spacing.md },
  button: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryDark, borderRadius: radius.control, marginTop: spacing.xl },
  pressed: { opacity: 0.85 },
  buttonText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 16 },
});
