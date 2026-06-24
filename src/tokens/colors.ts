/**
 * UnityUI — Color Tokens
 * Swiss Minimalism palette: black, white, greys, red accent
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

  // Accent — Swiss red
  red50:   '#FDF0EF',
  red100:  '#FAD3D1',
  red200:  '#F5A5A2',
  red300:  '#EF7773',
  red400:  '#E84844',
  red500:  '#E63329', // primary accent
  red600:  '#C22822',
  red700:  '#9A1F1A',
  red800:  '#721613',
  red900:  '#480E0B',

  // Semantic aliases
  primary:   '#E63329',
  textPrimary:   '#0A0A0A',
  textSecondary: '#636363',
  textDisabled:  '#ABABAB',
  borderDefault: '#DEDEDE',
  borderFocus:   '#0A0A0A',
  bgPage:        '#FFFFFF',
  bgSurface:     '#F7F7F7',
} as const;

export type ColorToken = keyof typeof colors;
