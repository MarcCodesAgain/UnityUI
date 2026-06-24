import { colors, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, spacing, borderRadius, borderWidth } from '../tokens';

export const theme = {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  spacing,
  borderRadius,
  borderWidth,
} as const;

export type Theme = typeof theme;
