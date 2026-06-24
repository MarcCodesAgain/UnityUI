/**
 * UnityUI — Color Tokens
 * Swiss Minimalism palette: black, white, greys + Electric Blue #0047FF accent
 */

export const colors = {
  // Base
  black: '#0A0A0A',
  white: '#FFFFFF',

  // Greys
  grey50:  '#F7F7F7',
  grey100: '#EFEFEF',
  grey200: '#DEDEDE',
  grey300: '#CACACA',
  grey400: '#ABABAB',
  grey500: '#888888',
  grey600: '#636363',
  grey700: '#454545',
  grey800: '#2B2B2B',
  grey900: '#1A1A1A',

  // Accent — Electric Blue
  blue50:  '#EEF3FF',
  blue100: '#D4E0FF',
  blue200: '#A9C1FF',
  blue300: '#7EA2FF',
  blue400: '#5383FF',
  blue500: '#0047FF', // primary accent
  blue600: '#0039CC',
  blue700: '#002B99',
  blue800: '#001D66',
  blue900: '#000F33',

  // Semantic aliases
  primary:       '#0047FF',
  textPrimary:   '#0A0A0A',
  textSecondary: '#636363',
  textDisabled:  '#ABABAB',
  textInverse:   '#FFFFFF',
  borderDefault: '#DEDEDE',
  borderFocus:   '#0047FF',
  bgPage:        '#FFFFFF',
  bgSurface:     '#F7F7F7',
} as const;

export type ColorToken = keyof typeof colors;
