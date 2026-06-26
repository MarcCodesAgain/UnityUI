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

  // Status colors — default (text/border)
  errorDefault:   '#D0021B',
  successDefault: '#1A7F37',
  warningDefault: '#F59E0B',

  // Status colors — bright (icons, dots, filled chips)
  errorBright:    '#EF4444',
  successBright:  '#22C55E',
  warningBright:  '#F59E0B',

  // Status background tints
  errorBg:        '#FEF2F2',
  successBg:      '#F0FDF4',
  warningBg:      '#FFFBEB',
  infoBg:         '#EEF3FF',

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
