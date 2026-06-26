/**
 * UnityUI — Spacing Tokens
 * 4px base grid — strict adherence is key for Swiss grid aesthetic
 */

const BASE = 4;

export const spacing = {
  0:   '0px',
  1:   `${BASE * 1}px`,   // 4px
  2:   `${BASE * 2}px`,   // 8px
  3:   `${BASE * 3}px`,   // 12px
  4:   `${BASE * 4}px`,   // 16px
  5:   `${BASE * 5}px`,   // 20px
  6:   `${BASE * 6}px`,   // 24px
  8:   `${BASE * 8}px`,   // 32px
  10:  `${BASE * 10}px`,  // 40px
  12:  `${BASE * 12}px`,  // 48px
  14:  `${BASE * 14}px`,  // 56px
  16:  `${BASE * 16}px`,  // 64px
  20:  `${BASE * 20}px`,  // 80px
  24:  `${BASE * 24}px`,  // 96px
  32:  `${BASE * 32}px`,  // 128px
} as const;

export type SpacingToken = keyof typeof spacing;
