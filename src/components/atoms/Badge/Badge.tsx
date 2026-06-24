import styled, { css } from 'styled-components';
import { colors, fontFamily, fontWeight, fontSize, letterSpacing, spacing, borderWidth } from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'primary' | 'outline' | 'ghost';
export type BadgeSize   = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Optional left dot indicator */
  dot?: boolean;
  className?: string;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  default: css`
    background-color: ${colors.grey100};
    color: ${colors.textPrimary};
    border: ${borderWidth[1]} solid transparent;
  `,
  primary: css`
    background-color: ${colors.primary};
    color: ${colors.white};
    border: ${borderWidth[1]} solid transparent;
  `,
  outline: css`
    background-color: transparent;
    color: ${colors.textPrimary};
    border: ${borderWidth[1]} solid ${colors.black};
  `,
  ghost: css`
    background-color: transparent;
    color: ${colors.textSecondary};
    border: ${borderWidth[1]} solid ${colors.borderDefault};
  `,
};

const sizeStyles: Record<BadgeSize, ReturnType<typeof css>> = {
  sm: css`
    padding: ${spacing[1]} ${spacing[2]};
    font-size: ${fontSize.xs};
    height: 20px;
  `,
  md: css`
    padding: ${spacing[1]} ${spacing[3]};
    font-size: ${fontSize.xs};
    height: 24px;
  `,
};

// ─── Dot ─────────────────────────────────────────────────────────────────────

const Dot = styled.span<{ $variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${({ $variant }) =>
    $variant === 'primary' ? colors.white : colors.primary};
`;

// ─── Styled component ─────────────────────────────────────────────────────────

const StyledBadge = styled.span<{
  $variant: BadgeVariant;
  $size: BadgeSize;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};

  /* Technical voice — mono all the way */
  font-family: ${fontFamily.mono};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;

  /* Swiss: no radius */
  border-radius: 0;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <StyledBadge $variant={variant} $size={size} className={className}>
      {dot && <Dot $variant={variant} aria-hidden="true" />}
      {label}
    </StyledBadge>
  );
}
