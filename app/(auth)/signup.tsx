import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { authMessage, useMerchantSignup } from '@/features/auth/hooks/useAuth';
import { merchantSignupFormSchema, merchantSignupPayload, validOtp, validPhone } from '@/features/auth/validation';

export default function MerchantSignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; otp?: string }>();
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const otp = typeof params.otp === 'string' ? params.otp : '';
  const signup = useMerchantSignup();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!validPhone(phone) || !validOtp(otp)) return <Redirect href="./login" />;

  const submit = () => {
    const parsed = merchantSignupFormSchema.safeParse({ fullName, businessName, email });
    if (!parsed.success) {
      setLocalError(parsed.error.issues[0]?.message ?? 'Check the form and try again.');
      return;
    }
    setLocalError(null);
    signup.mutate(merchantSignupPayload(phone, otp, parsed.data));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
          <Text style={styles.title}>Create your merchant account</Text>
          <Text style={styles.subtitle}>This number is not registered yet. Add the owner and business details for +91 {phone}.</Text>
          <Field label="Owner name" value={fullName} onChangeText={setFullName} accessibilityLabel="Owner name" />
          <Field label="Business name" value={businessName} onChangeText={setBusinessName} accessibilityLabel="Business name" />
          <Field label="Email (optional)" value={email} onChangeText={setEmail} accessibilityLabel="Email" keyboardType="email-address" autoCapitalize="none" />
          {(localError || signup.error) && <Text style={styles.error}>{localError ?? authMessage(signup.error)}</Text>}
          <Pressable disabled={signup.isPending} onPress={submit} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>{signup.isPending ? 'Creating account…' : 'Create account'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, ...input }: { label: string; value: string; onChangeText: (value: string) => void; accessibilityLabel: string; keyboardType?: 'default' | 'email-address'; autoCapitalize?: 'none' | 'sentences' }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.textTertiary} style={styles.input} {...input} />
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, justifyContent: 'center', padding: spacing['2xl'] },
  content: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  back: { color: colors.primaryDark, fontFamily: fontFamilies.bodySemiBold, fontSize: 15 },
  title: { color: colors.textPrimary, fontFamily: fontFamilies.headingBold, fontSize: 30, marginTop: spacing.xl },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24, marginTop: spacing.md },
  label: { color: colors.textPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 14, marginTop: spacing.xl, marginBottom: spacing.sm },
  input: { minHeight: touchTarget.min, backgroundColor: colors.surface, borderColor: colors.borderStrong, borderRadius: radius.control, borderWidth: 1, color: colors.textPrimary, fontFamily: fontFamilies.body, fontSize: 16, paddingHorizontal: spacing.lg },
  error: { color: colors.error, fontFamily: fontFamilies.body, fontSize: 14, marginTop: spacing.md },
  button: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryDark, borderRadius: radius.control, marginTop: spacing.xl },
  pressed: { opacity: 0.85 },
  buttonText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 16 },
});
