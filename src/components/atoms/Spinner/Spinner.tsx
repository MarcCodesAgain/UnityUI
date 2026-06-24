import styled, { keyframes, css } from 'styled-components';
import { colors, spacing } from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize    = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'inverse';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  /** Accessible label for screen readers */
  label?: string;
  className?: string;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeMap: Record<SpinnerSize, string> = {
  sm: spacing[4],   // 16px
  md: spacing[6],   // 24px
  lg: spacing[10],  // 40px
  xl: spacing[16],  // 64px
};

const strokeMap: Record<SpinnerSize, number> = {
  sm: 8,
  md: 7,
  lg: 6,
  xl: 5,
};

// ─── Keyframes ────────────────────────────────────────────────────────────────

// 1. The whole SVG rotates at a steady pace
const rotate = keyframes`
  from { transform: rotate(-90deg); }
  to   { transform: rotate(270deg); }
`;

// 2. The arc length pulses — short arc expands and contracts
//    This creates the "elastic snake" feel used by Material, iOS, etc.
const arcGrow = keyframes`
  0%   { stroke-dashoffset: 220; }
  50%  { stroke-dashoffset: 50;  }
  100% { stroke-dashoffset: 220; }
`;

// ─── SVG wrapper — handles rotation ──────────────────────────────────────────

const Svg = styled.svg<{ $size: SpinnerSize }>`
  display: block;
  flex-shrink: 0;
  animation: ${rotate} 1400ms linear infinite;

  ${({ $size }) => css`
    width: ${sizeMap[$size]};
    height: ${sizeMap[$size]};
  `}
`;

// ─── Track — static full circle in blue50 ────────────────────────────────────

const Track = styled.circle`
  fill: none;
  stroke: ${colors.blue100};
`;

// ─── Arc — animated, Electric Blue ───────────────────────────────────────────

const Arc = styled.circle<{ $variant: SpinnerVariant }>`
  fill: none;
  stroke: ${({ $variant }) =>
    $variant === 'inverse' ? colors.white : colors.primary};
  stroke-linecap: square;
  stroke-dasharray: 220;
  animation: ${arcGrow} 1400ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Spinner({
  size = 'md',
  variant = 'default',
  label = 'Loading',
  className,
}: SpinnerProps) {
  const strokeWidth = strokeMap[size];
  const r  = 50 - strokeWidth / 2; // radius stays inside the viewBox

  return (
    <Svg
      $size={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label={label}
      className={className}
    >
      <Track
        cx="50" cy="50" r={r}
        strokeWidth={strokeWidth}
      />
      <Arc
        $variant={variant}
        cx="50" cy="50" r={r}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}
