/**
 * UnityUI — Border Tokens
 * Swiss minimalism: sharp edges, minimal radius, strong outlines
 */

export const borderRadius = {
  none: '0px',
  sm:   '2px',
  md:   '4px',
  // No 'lg', no 'full' — Swiss style stays sharp
} as const;

export const borderWidth = {
  1: '1px',
  2: '2px',
  4: '4px',
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;
