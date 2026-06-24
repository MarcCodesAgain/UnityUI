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

// Maps variant → semantic HTML element
const defaultElement: Record<TypographyVariant, React.ElementType> = {
  display: 'h1',
  h1:      'h1',
  h2:      'h2',
  h3:      'h3',
  h4:      'h4',
  h5:      'h5',
  h6:      'h6',
  bodyLg:  'p',
  body:    'p',
  bodySm:  'p',
  label:   'span',
  caption: 'span',
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
  className?: string;
  children: React.ReactNode;
}

// ─── Styled component ─────────────────────────────────────────────────────────

const StyledText = styled.span<{
  $variant: TypographyVariant;
  $color: TypographyColor;
  $truncate: boolean;
  $lines: number;
}>`
  /* Apply the pre-composed text style from tokens */
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
  className,
  children,
}: TypographyProps) {
  const element = as ?? defaultElement[variant];

  return (
    <StyledText
      as={element}
      $variant={variant}
      $color={color}
      $truncate={truncate}
      $lines={lines}
      className={className}
    >
      {children}
    </StyledText>
  );
}
