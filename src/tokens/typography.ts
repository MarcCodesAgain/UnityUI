/**
 * UnityUI — Typography Tokens
 * Inter as primary typeface, strict type scale
 */

export const fontFamily = {
  base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
} as const;

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

// Type scale — major third (1.25)
export const fontSize = {
  xs:   '0.75rem',   // 12px
  sm:   '0.875rem',  // 14px
  base: '1rem',      // 16px
  lg:   '1.125rem',  // 18px
  xl:   '1.25rem',   // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
} as const;

export const lineHeight = {
  tight:  1.1,
  snug:   1.3,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const letterSpacing = {
  tight:   '-0.03em',
  normal:  '0em',
  wide:    '0.05em',
  widest:  '0.12em',
} as const;

// Pre-composed text styles
export const textStyles = {
  h1: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodyLg: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySm: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TextStyleToken = keyof typeof textStyles;
