import styled, { css } from 'styled-components';
import { useId } from 'react';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputSize  = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  /** Overrides hint with an error message and applies error styles */
  error?: string;
  /** Shows a success indicator */
  success?: string;
  size?: InputSize;
  /** Full width */
  fullWidth?: boolean;
}

// ─── Size styles ──────────────────────────────────────────────────────────────

const sizeStyles: Record<InputSize, ReturnType<typeof css>> = {
  sm: css`
    height: 32px;
    font-size: ${fontSize.sm};
    padding: 0 ${spacing[3]};
  `,
  md: css`
    height: 40px;
    font-size: ${fontSize.base};
    padding: 0 ${spacing[4]};
  `,
  lg: css`
    height: 48px;
    font-size: ${fontSize.lg};
    padding: 0 ${spacing[5]};
  `,
};

// ─── Wrapper ──────────────────────────────────────────────────────────────────

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${spacing[2]};
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`;

// ─── Label ────────────────────────────────────────────────────────────────────

const StyledLabel = styled.label<{ $disabled: boolean }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${({ $disabled }) => $disabled ? colors.textDisabled : colors.textSecondary};
  transition: color 180ms ease;
`;

// ─── Input container — holds the input + the animated bottom line ─────────────

const InputContainer = styled.div`
  position: relative;
`;

// ─── The actual input ─────────────────────────────────────────────────────────

const StyledInput = styled.input<{
  $size: InputSize;
  $state: InputState;
}>`
  /* Reset */
  appearance: none;
  outline: none;
  width: 100%;
  display: block;

  font-family: ${fontFamily.base};
  font-weight: ${fontWeight.regular};
  color: ${colors.textPrimary};
  background-color: ${colors.bgPage};

  /* Swiss: no radius, 1px border all sides */
  border-radius: 0;
  border: ${borderWidth[1]} solid ${({ $state }) =>
    $state === 'error'   ? '#D0021B' :
    $state === 'success' ? '#1A7F37' :
    colors.borderDefault};

  transition: border-color 180ms ease, background-color 180ms ease;

  ${({ $size }) => sizeStyles[$size]}

  /* Focus — border flips to Electric Blue, no outline */
  &:focus {
    border-color: ${({ $state }) =>
      $state === 'error'   ? '#D0021B' :
      $state === 'success' ? '#1A7F37' :
      colors.primary};
  }

  /* Disabled */
  &:disabled {
    background-color: ${colors.grey50};
    border-color: ${colors.grey200};
    color: ${colors.textDisabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${colors.textDisabled};
    font-weight: ${fontWeight.regular};
  }
`;

// ─── Animated bottom accent line ──────────────────────────────────────────────
//
// Sits on top of the bottom border, starts at width 0 centered,
// expands outward to 100% on focus — same cubic-bezier as Button & Typography.
// Color adapts to state.

const AccentLine = styled.span<{ $state: InputState }>`
  position: absolute;
  bottom: -1px;  /* sits on top of the border */
  left: 50%;
  transform: translateX(-50%);
  height: ${borderWidth[2]};
  width: 0%;
  background-color: ${({ $state }) =>
    $state === 'error'   ? '#D0021B' :
    $state === 'success' ? '#1A7F37' :
    colors.primary};
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  /* Expand when sibling input is focused */
  input:focus ~ & {
    width: 100%;
  }
`;

// ─── Helper / error / success text ───────────────────────────────────────────

const HintText = styled.span<{ $state: InputState }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.regular};
  letter-spacing: ${letterSpacing.normal};
  color: ${({ $state }) =>
    $state === 'error'   ? '#D0021B' :
    $state === 'success' ? '#1A7F37' :
    colors.textSecondary};
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Input({
  label,
  hint,
  error,
  success,
  size = 'md',
  fullWidth = false,
  disabled,
  id: externalId,
  ...props
}: InputProps) {
  const autoId  = useId();
  const id      = externalId ?? autoId;
  const hintId  = `${id}-hint`;

  const state: InputState =
    error   ? 'error'   :
    success ? 'success' : 'default';

  const message = error ?? success ?? hint;

  return (
    <Wrapper $fullWidth={fullWidth}>
      {label && (
        <StyledLabel htmlFor={id} $disabled={!!disabled}>
          {label}
        </StyledLabel>
      )}

      <InputContainer>
        <StyledInput
          id={id}
          $size={size}
          $state={state}
          disabled={disabled}
          aria-invalid={state === 'error'}
          aria-describedby={message ? hintId : undefined}
          {...props}
        />
        {/* accent line sits after the input so CSS sibling selector works */}
        <AccentLine $state={state} aria-hidden="true" />
      </InputContainer>

      {message && (
        <HintText id={hintId} $state={state}>
          {state === 'error' && '✕ '}
          {state === 'success' && '✓ '}
          {message}
        </HintText>
      )}
    </Wrapper>
  );
}
