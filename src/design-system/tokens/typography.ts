export const fontFamilies = {
  heading: 'Sora_600SemiBold',
  headingBold: 'Sora_700Bold',
  headingMedium: 'Sora_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  numbers: 'Manrope_600SemiBold',
  numbersBold: 'Manrope_700Bold',
  numbersRegular: 'Manrope_400Regular',
} as const;

export const typography = {
  h1: { fontFamily: fontFamilies.headingBold, fontSize: 32, lineHeight: 40 },
  h2: { fontFamily: fontFamilies.heading, fontSize: 28, lineHeight: 36 },
  h3: { fontFamily: fontFamilies.heading, fontSize: 24, lineHeight: 32 },
  h4: { fontFamily: fontFamilies.headingMedium, fontSize: 20, lineHeight: 28 },
  body: { fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fontFamilies.bodyMedium, fontSize: 16, lineHeight: 24 },
  bodySemiBold: { fontFamily: fontFamilies.bodySemiBold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 20 },
  small: { fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 16 },
  number: { fontFamily: fontFamilies.numbers, fontSize: 16, lineHeight: 24 },
  numberLarge: { fontFamily: fontFamilies.numbersBold, fontSize: 24, lineHeight: 32 },
} as const;
