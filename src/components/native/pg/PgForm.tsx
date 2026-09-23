import { useState, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { MerchantPgInput, PgAvailabilityInput, PgCategory, PgRoomInput } from '@/contracts/merchantPg';
import { colors, fontFamilies, radius, spacing, touchTarget } from '@/design-system';
import { merchantPgFormSchema } from '@/features/merchantPgs/validation';
import { buildMerchantPgPayload } from '@/features/merchantPgs/presentation';
import { InlineError, MutationLoading } from '@/components/native/ScreenStates';

const categories: PgCategory[] = ['Girls Only', 'Boys Only', 'Unisex / Co-living'];
const newRoom = (): PgRoomInput => ({ roomNumber: '', roomType: '', totalBeds: 1, monthlyRent: 0 });
const newAvailability = (): PgAvailabilityInput => ({ roomType: '', totalBeds: 1, availableBeds: 1, monthlyRent: 0 });

export const emptyMerchantPgInput = (): MerchantPgInput => ({
  name: '', description: '', category: 'Unisex / Co-living', address: '', city: '', locality: '', monthlyRent: 0, deposit: 0,
  amenities: [], rooms: [newRoom()], media: [], availability: [newAvailability()],
});

export function PgForm({ initial, submitLabel, submitting, apiError, onSubmit }: { initial: MerchantPgInput; submitLabel: string; submitting: boolean; apiError?: string; onSubmit: (payload: MerchantPgInput) => void }) {
  const [input, setInput] = useState<MerchantPgInput>(initial);
  const [amenities, setAmenities] = useState((initial.amenities ?? []).join(', '));
  const [coverUrl, setCoverUrl] = useState(initial.media?.find((item) => item.isCover)?.url ?? initial.media?.[0]?.url ?? '');
  const [validationError, setValidationError] = useState('');
  const field = <K extends keyof MerchantPgInput>(key: K, value: MerchantPgInput[K]) => setInput((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const payload = buildMerchantPgPayload(input, amenities, coverUrl);
    const parsed = merchantPgFormSchema.safeParse(payload);
    if (!parsed.success) { setValidationError(parsed.error.issues[0]?.message ?? 'Check the form and try again.'); return; }
    setValidationError(''); onSubmit(parsed.data);
  };

  return <View style={styles.form}>
    <FormSection title="Property">
      <Input label="PG name" value={input.name} onChange={(value) => field('name', value)} />
      <Text style={styles.label}>Category</Text><View style={styles.options}>{categories.map((category) => <Pressable key={category} onPress={() => field('category', category)} style={[styles.option, input.category === category && styles.optionSelected]}><Text style={[styles.optionText, input.category === category && styles.optionTextSelected]}>{category}</Text></Pressable>)}</View>
      <Input label="Description" multiline value={input.description ?? ''} onChange={(value) => field('description', value)} />
    </FormSection>
    <FormSection title="Location">
      <Input label="Address" value={input.address ?? ''} onChange={(value) => field('address', value)} />
      <Input label="City" value={input.city ?? ''} onChange={(value) => field('city', value)} />
      <Input label="Locality / area" value={input.locality ?? ''} onChange={(value) => field('locality', value)} />
    </FormSection>
    <FormSection title="Pricing">
      <NumberInput label="Monthly rent" value={input.monthlyRent ?? 0} onChange={(value) => field('monthlyRent', value)} />
      <NumberInput label="Deposit" value={input.deposit ?? 0} onChange={(value) => field('deposit', value)} />
    </FormSection>
    <FormSection title="Amenities"><Input label="Comma-separated amenities" value={amenities} onChange={setAmenities} /></FormSection>
    <FormSection title="Cover image">
      <Input label="Hosted image URL" autoCapitalize="none" value={coverUrl} onChange={setCoverUrl} />
      {coverUrl.trim() ? <Image accessibilityLabel="Cover image preview" source={{ uri: coverUrl.trim() }} style={styles.preview} /> : null}
      <Text style={styles.help}>The current backend supports hosted URLs. No upload API is available.</Text>
    </FormSection>
    <FormSection title="Rooms">
      {(input.rooms ?? []).map((room, index) => <View key={`room-${index}`} style={styles.rowCard}>
        <Input label="Room number" value={room.roomNumber} onChange={(value) => updateRoom(index, { roomNumber: value })} />
        <Input label="Room type" value={room.roomType} onChange={(value) => updateRoom(index, { roomType: value })} />
        <NumberInput label="Total beds" integer value={room.totalBeds} onChange={(value) => updateRoom(index, { totalBeds: value })} />
        <NumberInput label="Monthly room rent" value={room.monthlyRent} onChange={(value) => updateRoom(index, { monthlyRent: value })} />
        <RemoveButton disabled={(input.rooms?.length ?? 0) <= 1} onPress={() => field('rooms', input.rooms?.filter((_, roomIndex) => roomIndex !== index))} />
      </View>)}
      <AddButton label="Add room" onPress={() => field('rooms', [...(input.rooms ?? []), newRoom()])} />
    </FormSection>
    <FormSection title="Availability">
      {(input.availability ?? []).map((item, index) => <View key={`availability-${index}`} style={styles.rowCard}>
        <Input label="Room type" value={item.roomType} onChange={(value) => updateAvailability(index, { roomType: value })} />
        <NumberInput label="Total beds" integer value={item.totalBeds} onChange={(value) => updateAvailability(index, { totalBeds: value })} />
        <NumberInput label="Available beds" integer value={item.availableBeds} onChange={(value) => updateAvailability(index, { availableBeds: value })} />
        <NumberInput label="Monthly rent" value={item.monthlyRent} onChange={(value) => updateAvailability(index, { monthlyRent: value })} />
        <RemoveButton disabled={(input.availability?.length ?? 0) <= 1} onPress={() => field('availability', input.availability?.filter((_, itemIndex) => itemIndex !== index))} />
      </View>)}
      <AddButton label="Add availability type" onPress={() => field('availability', [...(input.availability ?? []), newAvailability()])} />
    </FormSection>
    {validationError ? <InlineError message={validationError} /> : null}{apiError ? <InlineError message={apiError} /> : null}
    {submitting ? <MutationLoading label="Saving PG…" /> : null}
    <Pressable accessibilityRole="button" disabled={submitting} onPress={submit} style={({ pressed }) => [styles.submit, (pressed || submitting) && styles.pressed]}><Text style={styles.submitText}>{submitLabel}</Text></Pressable>
  </View>;

  function updateRoom(index: number, patch: Partial<PgRoomInput>) { field('rooms', (input.rooms ?? []).map((room, roomIndex) => roomIndex === index ? { ...room, ...patch } : room)); }
  function updateAvailability(index: number, patch: Partial<PgAvailabilityInput>) { field('availability', (input.availability ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }
}

function FormSection({ title, children }: { title: string; children: ReactNode }) { return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>; }
function Input({ label, value, onChange, multiline, autoCapitalize = 'sentences' }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; autoCapitalize?: 'none' | 'sentences' }) { return <View style={styles.control}><Text style={styles.label}>{label}</Text><TextInput autoCapitalize={autoCapitalize} multiline={multiline} onChangeText={onChange} placeholderTextColor={colors.textTertiary} style={[styles.input, multiline && styles.multiline]} value={value} /></View>; }
function NumberInput({ label, value, onChange, integer }: { label: string; value: number; onChange: (value: number) => void; integer?: boolean }) { return <View style={styles.control}><Text style={styles.label}>{label}</Text><TextInput keyboardType="decimal-pad" value={String(value)} onChangeText={(text) => { const value = Number(text.replace(/[^\d.]/g, '')); onChange(integer ? Math.trunc(value || 0) : value || 0); }} placeholderTextColor={colors.textTertiary} style={styles.input} /></View>; }
function AddButton({ label, onPress }: { label: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.add}><Text style={styles.addText}>＋ {label}</Text></Pressable>; }
function RemoveButton({ onPress, disabled }: { onPress: () => void; disabled: boolean }) { return <Pressable disabled={disabled} onPress={onPress} style={[styles.remove, disabled && styles.pressed]}><Text style={styles.removeText}>Remove</Text></Pressable>; }

const styles = StyleSheet.create({
  form: { gap: spacing.lg }, section: { gap: spacing.md, padding: spacing.lg, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: 1 }, sectionTitle: { color: colors.textPrimary, fontFamily: fontFamilies.heading, fontSize: 18 }, control: { gap: spacing.xs }, label: { color: colors.textPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 13 }, input: { minHeight: touchTarget.min, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.textPrimary, backgroundColor: colors.background, borderColor: colors.borderStrong, borderRadius: radius.control, borderWidth: 1, fontFamily: fontFamilies.body, fontSize: 15 }, multiline: { minHeight: 96, textAlignVertical: 'top' }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, option: { minHeight: 40, justifyContent: 'center', paddingHorizontal: spacing.md, backgroundColor: colors.surfaceMuted, borderRadius: radius.chip }, optionSelected: { backgroundColor: colors.primaryDark }, optionText: { color: colors.textSecondary, fontFamily: fontFamilies.bodyMedium, fontSize: 13 }, optionTextSelected: { color: colors.textOnPrimary }, preview: { width: '100%', height: 180, backgroundColor: colors.surfaceMuted, borderRadius: radius.lg }, help: { color: colors.textTertiary, fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 18 }, rowCard: { gap: spacing.md, padding: spacing.md, backgroundColor: colors.background, borderRadius: radius.lg }, add: { minHeight: touchTarget.min, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryMuted, borderRadius: radius.control }, addText: { color: colors.primaryDark, fontFamily: fontFamilies.bodySemiBold, fontSize: 14 }, remove: { minHeight: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.errorLight, borderRadius: radius.control }, removeText: { color: colors.error, fontFamily: fontFamilies.bodySemiBold, fontSize: 13 }, submit: { minHeight: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryDark, borderRadius: radius.control }, submitText: { color: colors.textOnPrimary, fontFamily: fontFamilies.bodySemiBold, fontSize: 16 }, pressed: { opacity: 0.55 },
});
