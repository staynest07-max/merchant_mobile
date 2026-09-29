import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { authMessage, useRequestOtp, useVerifyOtp } from '@/features/auth/hooks/useAuth';
import { validOtp, validPhone } from '@/features/auth/validation';

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const verifyOtp = useVerifyOtp();
  const resendOtp = useRequestOtp();
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!validPhone(phone)) return <RedirectToLogin />;

  const submit = () => {
    if (!validOtp(otp)) {
      setLocalError('Enter the 6-digit OTP.');
      return;
    }
    setLocalError(null);
    verifyOtp.mutate({ phone, otp }, {
      onSuccess: (result) => {
        if (result.kind === 'signup_required') router.push({ pathname: './signup', params: { phone, otp } });
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={styles.back}>‹ Change number</Text></Pressable>
          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>Enter the 6-digit OTP sent to +91 {phone}.</Text>
          <TextInput
            accessibilityLabel="One-time password"
            autoComplete="one-time-code"
            autoFocus
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={(value) => setOtp(value.replace(/\D/g, ''))}
            placeholder="••••••"
            placeholderTextColor={colors.textTertiary}
            style={styles.otp}
            textContentType="oneTimeCode"
            value={otp}
          />
          {(localError || verifyOtp.error || resendOtp.error) && (
            <Text style={styles.error}>{localError ?? authMessage(verifyOtp.error ?? resendOtp.error)}</Text>
          )}
          <Pressable disabled={verifyOtp.isPending} onPress={submit} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>{verifyOtp.isPending ? 'Verifying…' : 'Verify OTP'}</Text>
          </Pressable>
          <Pressable disabled={resendOtp.isPending} onPress={() => resendOtp.mutate(phone)} style={styles.linkButton}>
            <Text style={styles.link}>{resendOtp.isPending ? 'Sending…' : 'Resend OTP'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RedirectToLogin() {
  return <Redirect href="./login" />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, justifyContent: 'center', padding: spacing['2xl'] },
  content: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  back: { color: colors.primaryDark, fontFamily: fontFamilies.bodySemiBold, fontSize: 15 },
  title: { color: colors.textPrimary, fontFamily: fontFamilies.headingBold, fontSize: 30, marginTop: spacing.xl },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24, marginTop: spacing.md },
  otp: { minHeight: 64, marginTop: spacing['3xl'], backgroundColor: colors.surface, borderColor: colors.borderStrong, borderRadius: radius.control, borderWidth: 1, color: colors.textPrimary, fontFamily: fontFamilies.numbersBold, fontSize: 28, letterSpacing: 12, paddingHorizontal: spacing.xl, textAlign: 'center' },
  error: { color: colors.error, fontFamily: fontFamilies.body, fontSize: 14, marginTop: spacing.md },
  button: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryDark, borderRadius: radius.control, marginTop: spacing.xl },
  pressed: { opacity: 0.85 },
  buttonText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 16 },
  linkButton: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  link: { color: colors.primaryDark, fontFamily: fontFamilies.bodySemiBold, fontSize: 15 },
});
