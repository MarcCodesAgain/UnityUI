import styled, { css } from 'styled-components';
import { colors, spacing, fontSize, fontWeight, fontFamily, letterSpacing, borderRadius, borderWidth } from '../../../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

// ─── Size styles ─────────────────────────────────────────────────────────────

const sizeStyles = {
  sm: css`
    padding: ${spacing[2]} ${spacing[4]};
    font-size: ${fontSize.xs};
    height: 32px;
  `,
  md: css`
    padding: ${spacing[3]} ${spacing[6]};
    font-size: ${fontSize.sm};
    height: 40px;
  `,
  lg: css`
    padding: ${spacing[4]} ${spacing[8]};
    font-size: ${fontSize.base};
    height: 48px;
  `,
};

// ─── Variant styles ───────────────────────────────────────────────────────────
//
// Hover micro-interaction: block reveal — a fill rises bottom→top via ::before
//
// primary:   black bg  → Electric Blue fill, text stays white
// secondary: outline   → black fill rises, text flips white via mix-blend-mode
// ghost:     empty     → grey100 fill rises, text stays black

const variantStyles = {
  primary: css`
    background-color: ${colors.black};
    color: ${colors.white};
    border: ${borderWidth[2]} solid ${colors.black};

    &::before { background-color: ${colors.primary}; }

    &:hover:not(:disabled) {
      border-color: ${colors.primary};
    }
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${colors.black};
    border: ${borderWidth[2]} solid ${colors.black};

    &::before { background-color: ${colors.black}; }

    /* Text flips to white at exactly the halfway point of the fill (110ms).
     * transition-timing-function: steps(1) = instant flip, no fade.
     * On mouse-out the fill retreats and text flips back at the same midpoint. */
    & > span {
      transition: color 0ms steps(1) 110ms;
    }

    &:hover:not(:disabled) > span {
      color: ${colors.white};
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
      border-color: ${colors.primary};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${colors.black};
    border: ${borderWidth[2]} solid transparent;

    &::before { background-color: ${colors.grey100}; }

    &:hover:not(:disabled) {
      border-color: ${colors.grey200};
    }
    &:active:not(:disabled) {
      transform: translateY(1px);
      border-color: ${colors.blue100};
      &::before { background-color: ${colors.blue50}; }
    }
  `,
};

// ─── Styled component ─────────────────────────────────────────────────────────

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $loading: boolean;
}>`
  appearance: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  position: relative;
  overflow: hidden;

  font-family: ${fontFamily.mono};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.wider};
  line-height: 1;

  border-radius: ${borderRadius.none};

  transition:
    border-color 180ms ease,
    transform 80ms ease;

  /* ── Block reveal ────────────────────────────────────────────────────────
   * ::before anchors to the bottom and expands upward on hover.
   * z-index 0 keeps it behind the Label (z-index 1).
   */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0%;
    transition: height 220ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }

  &:hover:not(:disabled)::before {
    height: 100%;
  }

  /* Size */
  ${({ $size }) => sizeStyles[$size]}

  /* Variant */
  ${({ $variant }) => variantStyles[$variant]}

  /* Full width */
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  /* Disabled — no animation */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    &::before { display: none; }
  }

  /* Loading */
  ${({ $loading }) =>
    $loading &&
    css`
      cursor: wait;
      opacity: 0.7;
      pointer-events: none;
      &::before { display: none; }
    `}

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

// Label — z-index 1 so it floats above the ::before fill

const Label = styled.span`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: inherit;
`;

// Spinner

const Spinner = styled.span`
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 600ms linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      <Label>
        {loading && <Spinner aria-hidden="true" />}
        {children}
      </Label>
    </StyledButton>
  );
}
