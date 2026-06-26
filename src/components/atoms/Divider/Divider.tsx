import styled, { css } from 'styled-components';
import { colors, spacing, fontFamily, fontWeight, fontSize, letterSpacing } from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant     = 'default' | 'strong' | 'accent';
export type DividerSpacing     = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  spacing?: DividerSpacing;
  /** Optional label centered on the divider */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Token maps ───────────────────────────────────────────────────────────────

const colorMap: Record<DividerVariant, string> = {
  default: colors.borderDefault,   // #DEDEDE — subtle
  strong:  colors.black,           // #0A0A0A — assertive
  accent:  colors.primary,         // #0047FF — Electric Blue
};

const spacingMap: Record<DividerSpacing, string> = {
  none: '0px',
  sm:   spacing[4],   // 16px
  md:   spacing[8],   // 32px
  lg:   spacing[12],  // 48px
};

// ─── Horizontal divider ───────────────────────────────────────────────────────

const HorizontalRule = styled.hr<{
  $variant: DividerVariant;
  $spacing: DividerSpacing;
  $hasLabel: boolean;
}>`
  border: none;
  margin: ${({ $spacing }) => `${spacingMap[$spacing]} 0`};

  ${({ $hasLabel, $variant }) =>
    $hasLabel
      ? css`
          display: flex;
          align-items: center;
          gap: ${spacing[4]};

          /* Lines on each side of the label */
          &::before,
          &::after {
            content: '';
            flex: 1;
            height: 1px;
            background-color: ${colorMap[$variant]};
          }
        `
      : css`
          height: 1px;
          background-color: ${colorMap[$variant]};

          /* accent variant: 2px for more visual weight */
          ${$variant === 'accent' && 'height: 2px;'}
          ${$variant === 'strong' && 'height: 2px;'}
        `}
`;

// ─── Vertical divider ─────────────────────────────────────────────────────────

const VerticalRule = styled.div<{
  $variant: DividerVariant;
  $spacing: DividerSpacing;
}>`
  display: inline-block;
  width: 1px;
  align-self: stretch;
  background-color: ${({ $variant }) => colorMap[$variant]};
  margin: ${({ $spacing }) => `0 ${spacingMap[$spacing]}`};

  ${({ $variant }) => ($variant === 'strong' || $variant === 'accent') && 'width: 2px;'}
`;

// ─── Label ────────────────────────────────────────────────────────────────────

const Label = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.medium};
  letter-spacing: ${letterSpacing.wider};
  text-transform: uppercase;
  color: ${colors.textSecondary};
  white-space: nowrap;
  flex-shrink: 0;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Divider({
  orientation = 'horizontal',
  variant = 'default',
  spacing = 'md',
  label,
  className,
  style,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <VerticalRule
        $variant={variant}
        $spacing={spacing}
        role="separator"
        aria-orientation="vertical"
        className={className}
        style={style}
      />
    );
  }

  if (label) {
    return (
      <HorizontalRule
        as="div"
        $variant={variant}
        $spacing={spacing}
        $hasLabel={true}
        role="separator"
        aria-orientation="horizontal"
        className={className}
        style={style}
      >
        <Label>{label}</Label>
      </HorizontalRule>
    );
  }

  return (
    <HorizontalRule
      $variant={variant}
      $spacing={spacing}
      $hasLabel={false}
      role="separator"
      aria-orientation="horizontal"
      className={className}
      style={style}
    />
  );
}
