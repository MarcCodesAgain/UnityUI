import styled, { css } from 'styled-components';
import { textStyles, colors } from '../../../tokens';
import type { TextStyleToken } from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TypographyVariant = TextStyleToken;
export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'inverse'
  | 'accent';

// Variants that get the blue sweep highlight on hover
const HIGHLIGHT_VARIANTS = new Set<TypographyVariant>([
  'display', 'h1', 'h2', 'h3', 'h4',
]);

const defaultElement: Record<TypographyVariant, React.ElementType> = {
  display:  'h1',
  h1:       'h1',
  h2:       'h2',
  h3:       'h3',
  h4:       'h4',
  h5:       'h5',
  h6:       'h6',
  bodyLg:   'p',
  body:     'p',
  bodySm:   'p',
  label:    'span',
  caption:  'span',
  overline: 'span',
};

const colorMap: Record<TypographyColor, string> = {
  primary:   colors.textPrimary,
  secondary: colors.textSecondary,
  disabled:  colors.textDisabled,
  inverse:   colors.textInverse,
  accent:    colors.primary,
};

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  /** Override the rendered HTML element */
  as?: React.ElementType;
  /** Truncate to a single line with ellipsis */
  truncate?: boolean;
  /** Max number of lines before clamping (requires truncate) */
  lines?: number;
  /** Disable the blue sweep highlight on headings */
  noHighlight?: boolean;
  className?: string;
  children: React.ReactNode;
}

// ─── Highlight sweep ──────────────────────────────────────────────────────────
//
// A 3px Electric Blue bar anchored to the bottom of the heading.
// On hover it sweeps left → right (width 0% → 100%) in 320ms.
// Uses cubic-bezier(0.4, 0, 0.2, 1) — same easing as the Button block reveal
// so both animations feel like they belong to the same system.

const highlightStyles = css`
  position: relative;
  display: inline-block; /* shrink-wrap to text width */
  cursor: default;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0.05em;
    height: 0.35em;
    width: 0%;
    background-color: ${colors.primary};
    opacity: 0.25;
    transition: width 320ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }

  &:hover::after {
    width: 100%;
  }
`;

// ─── Styled component ─────────────────────────────────────────────────────────

const StyledText = styled.span<{
  $variant: TypographyVariant;
  $color: TypographyColor;
  $truncate: boolean;
  $lines: number;
  $highlight: boolean;
}>`
  ${({ $variant }) => {
    const s = textStyles[$variant];
    return css`
      font-family: ${s.fontFamily};
      font-size: ${s.fontSize};
      font-weight: ${s.fontWeight};
      line-height: ${s.lineHeight};
      letter-spacing: ${s.letterSpacing};
      ${'textTransform' in s ? `text-transform: ${s.textTransform};` : ''}
    `;
  }}

  color: ${({ $color }) => colorMap[$color]};

  /* Blue sweep on hover — only for heading variants */
  ${({ $highlight }) => $highlight && highlightStyles}

  /* Truncation */
  ${({ $truncate, $lines }) =>
    $truncate &&
    ($lines > 1
      ? css`
          display: -webkit-box;
          -webkit-line-clamp: ${$lines};
          -webkit-box-orient: vertical;
          overflow: hidden;
        `
      : css`
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `)}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Typography({
  variant = 'body',
  color = 'primary',
  as,
  truncate = false,
  lines = 1,
  noHighlight = false,
  className,
  children,
}: TypographyProps) {
  const element = as ?? defaultElement[variant];
  const highlight = HIGHLIGHT_VARIANTS.has(variant) && !noHighlight;

  return (
    <StyledText
      as={element}
      $variant={variant}
      $color={color}
      $truncate={truncate}
      $lines={lines}
      $highlight={highlight}
      className={className}
    >
      {children}
    </StyledText>
  );
}
