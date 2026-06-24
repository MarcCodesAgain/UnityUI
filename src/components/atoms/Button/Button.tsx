import styled, { css } from 'styled-components';
import { colors, spacing, fontSize, fontWeight, letterSpacing, borderRadius, borderWidth } from '../../../tokens';

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
    font-size: ${fontSize.sm};
    height: 32px;
  `,
  md: css`
    padding: ${spacing[3]} ${spacing[6]};
    font-size: ${fontSize.base};
    height: 40px;
  `,
  lg: css`
    padding: ${spacing[4]} ${spacing[8]};
    font-size: ${fontSize.lg};
    height: 48px;
  `,
};

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantStyles = {
  primary: css`
    background-color: ${colors.black};
    color: ${colors.white};
    border: ${borderWidth[2]} solid ${colors.black};

    &:hover:not(:disabled) {
      background-color: ${colors.grey800};
      border-color: ${colors.grey800};
    }

    &:active:not(:disabled) {
      background-color: ${colors.primary};
      border-color: ${colors.primary};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${colors.black};
    border: ${borderWidth[2]} solid ${colors.black};

    &:hover:not(:disabled) {
      background-color: ${colors.grey100};
    }

    &:active:not(:disabled) {
      background-color: ${colors.grey200};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${colors.black};
    border: ${borderWidth[2]} solid transparent;

    &:hover:not(:disabled) {
      background-color: ${colors.grey100};
      border-color: ${colors.grey200};
    }

    &:active:not(:disabled) {
      background-color: ${colors.grey200};
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
  /* Reset */
  appearance: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  white-space: nowrap;
  text-decoration: none;
  user-select: none;

  /* Base typography */
  font-family: inherit;
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.wide};
  line-height: 1;

  /* Swiss: sharp corners */
  border-radius: ${borderRadius.none};

  /* Transitions */
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;

  /* Size */
  ${({ $size }) => sizeStyles[$size]}

  /* Variant */
  ${({ $variant }) => variantStyles[$variant]}

  /* Full width */
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  /* Disabled */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  /* Loading */
  ${({ $loading }) =>
    $loading &&
    css`
      cursor: wait;
      opacity: 0.7;
      pointer-events: none;
    `}

  /* Focus visible — a11y */
  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

// ─── Spinner ──────────────────────────────────────────────────────────────────

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
      {loading && <Spinner aria-hidden="true" />}
      {children}
    </StyledButton>
  );
}
