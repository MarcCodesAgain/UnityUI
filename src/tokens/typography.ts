/**
 * UnityUI — Typography Tokens
 *
 * Two voices:
 *   Inter        — the editorial voice (weights 300→800, wide range of tension)
 *   JetBrains Mono — the technical voice (labels, badges, overlines, counters)
 *
 * Typographic tension is achieved by pairing extremes:
 *   Inter 800 (impact) ↔ Inter 300 (breath)
 */

export const fontFamily = {
  base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
} as const;

export const fontWeight = {
  light:    300,  // breath — for large display text, subheadings
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
  black:    800,  // impact — for hero headings, emphasis
} as const;

// Type scale — major third (×1.25)
export const fontSize = {
  xs:    '0.75rem',    // 12px
  sm:    '0.875rem',   // 14px
  base:  '1rem',       // 16px
  lg:    '1.125rem',   // 18px
  xl:    '1.25rem',    // 20px
  '2xl': '1.5rem',     // 24px
  '3xl': '1.875rem',   // 30px
  '4xl': '2.25rem',    // 36px
  '5xl': '3rem',       // 48px
  '6xl': '3.75rem',    // 60px
  '7xl': '4.5rem',     // 72px  — display / hero
} as const;

export const lineHeight = {
  none:    1,
  tight:   1.1,
  snug:    1.3,
  normal:  1.5,
  relaxed: 1.7,
} as const;

export const letterSpacing = {
  tighter: '-0.04em',
  tight:   '-0.02em',
  normal:  '0em',
  wide:    '0.05em',
  wider:   '0.08em',
  widest:  '0.14em',  // mono labels / overlines
} as const;

// ─── Pre-composed text styles ──────────────────────────────────────────────────
//
// Headings use the Inter tension system:
//   h1/h2  → black (800) — maximum impact
//   h3/h4  → bold (700)
//   h5/h6  → semibold (600)
//
// Technical styles use JetBrains Mono:
//   label, caption, overline, code

export const textStyles = {
  // Display
  display: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['7xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.tighter,
  },
  // Headings
  h1: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  h2: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontFamily: fontFamily.base,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
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
  // Body
  bodyLg: {
    fontFamily: fontFamily.base,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.light,   // ← tension: large body = light weight
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
  // Technical — mono voice
  label: {
    fontFamily: fontFamily.mono,    // ← mono for precision
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamily.mono,    // ← mono for metadata
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  overline: {
    fontFamily: fontFamily.mono,    // ← mono + wide tracking = Swiss overline
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TextStyleToken = keyof typeof textStyles;
