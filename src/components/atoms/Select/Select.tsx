import styled, { css, keyframes } from 'styled-components';
import { useId } from 'react';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';
import { FieldLabel, FieldInputWrapper } from '../../shared/fieldStyles';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectSize  = 'sm' | 'md' | 'lg';
export type SelectState = 'default' | 'error' | 'success';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  success?: string;
  size?: SelectSize;
  fullWidth?: boolean;
}

// ─── Size styles ──────────────────────────────────────────────────────────────

const sizeStyles: Record<SelectSize, ReturnType<typeof css>> = {
  sm: css`
    height: 32px;
    font-size: ${fontSize.sm};
    padding: 0 ${spacing[8]} 0 ${spacing[3]};
  `,
  md: css`
    height: 40px;
    font-size: ${fontSize.base};
    padding: 0 ${spacing[10]} 0 ${spacing[4]};
  `,
  lg: css`
    height: 48px;
    font-size: ${fontSize.lg};
    padding: 0 ${spacing[10]} 0 ${spacing[5]};
  `,
};

const chevronSizeMap: Record<SelectSize, string> = {
  sm: spacing[3],   // 12px
  md: spacing[4],   // 16px
  lg: spacing[5],   // 20px
};

// ─── Chevron rotation animation ───────────────────────────────────────────────

const rotateCW = keyframes`
  from { transform: translateY(-50%) rotate(0deg); }
  to   { transform: translateY(-50%) rotate(180deg); }
`;

// ─── Container: holds select + chevron + accent line ─────────────────────────

const SelectContainer = styled.div`
  position: relative;
`;

// ─── The actual <select> ──────────────────────────────────────────────────────

const StyledSelect = styled.select<{
  $size: SelectSize;
  $state: SelectState;
}>`
  /* Reset */
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  width: 100%;
  display: block;
  cursor: pointer;

  font-family: ${fontFamily.base};
  font-weight: ${fontWeight.regular};
  color: ${colors.textPrimary};
  background-color: ${colors.bgPage};

  /* Swiss: no radius */
  border-radius: 0;
  border: ${borderWidth[1]} solid ${({ $state }) =>
    $state === 'error'   ? colors.errorDefault :
    $state === 'success' ? colors.successDefault :
    colors.borderDefault};

  transition: border-color 180ms ease, background-color 180ms ease;

  ${({ $size }) => sizeStyles[$size]}

  /* Focus — border flips to Electric Blue */
  &:focus {
    border-color: ${({ $state }) =>
      $state === 'error'   ? colors.errorDefault :
      $state === 'success' ? colors.successDefault :
      colors.primary};
  }

  /* Keyboard focus ring — WCAG 2.4.7 Focus Visible */
  &:focus-visible {
    outline: 2px solid ${colors.borderFocus};
    outline-offset: 2px;
  }

  /* Rotate chevron on focus via sibling selector */
  &:focus ~ div > svg {
    animation: ${rotateCW} 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Disabled */
  &:disabled {
    background-color: ${colors.grey50};
    border-color: ${colors.grey200};
    color: ${colors.textDisabled};
    cursor: not-allowed;
  }
`;

// ─── Chevron icon ─────────────────────────────────────────────────────────────
//
// Positioned absolutely on the right. Uses a div wrapper so the
// select:focus ~ div selector can trigger the rotation.

const ChevronWrapper = styled.div<{ $disabled: boolean }>`
  position: absolute;
  top: 50%;
  right: ${spacing[4]};
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${({ $disabled }) => $disabled ? colors.textDisabled : colors.textSecondary};
  transition: color 180ms ease;

  /* When select is focused, tint chevron Electric Blue */
  select:focus ~ & {
    color: ${colors.primary};
  }
`;

// ─── Animated bottom accent line — identical to Input ────────────────────────

const AccentLine = styled.span<{ $state: SelectState }>`
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  height: ${borderWidth[2]};
  width: 0%;
  background-color: ${({ $state }) =>
    $state === 'error'   ? colors.errorDefault :
    $state === 'success' ? colors.successDefault :
    colors.primary};
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  select:focus ~ & {
    width: 100%;
  }
`;

// ─── Hint / error / success text ─────────────────────────────────────────────

const HintText = styled.span<{ $state: SelectState }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.regular};
  letter-spacing: ${letterSpacing.normal};
  color: ${({ $state }) =>
    $state === 'error'   ? colors.errorDefault :
    $state === 'success' ? colors.successDefault :
    colors.textSecondary};
`;

// ─── Chevron SVG ─────────────────────────────────────────────────────────────

function ChevronIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 5.5L8 10.5L13 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Select({
  options,
  label,
  placeholder,
  hint,
  error,
  success,
  size = 'md',
  fullWidth = false,
  disabled,
  id: externalId,
  ...props
}: SelectProps) {
  const autoId = useId();
  const id     = externalId ?? autoId;
  const hintId = `${id}-hint`;

  const state: SelectState =
    error   ? 'error'   :
    success ? 'success' : 'default';

  const message = error ?? success ?? hint;

  return (
    <FieldInputWrapper $fullWidth={fullWidth}>
      {label && (
        <FieldLabel htmlFor={id} $disabled={!!disabled}>
          {label}
        </FieldLabel>
      )}

      <SelectContainer>
        <StyledSelect
          id={id}
          $size={size}
          $state={state}
          disabled={disabled}
          aria-invalid={state === 'error'}
          aria-describedby={message ? hintId : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(({ value, label: optLabel, disabled: optDisabled }) => (
            <option key={value} value={value} disabled={optDisabled}>
              {optLabel}
            </option>
          ))}
        </StyledSelect>

        {/* Chevron — sibling of select so CSS selector triggers rotation */}
        <ChevronWrapper $disabled={!!disabled}>
          <ChevronIcon size={chevronSizeMap[size]} />
        </ChevronWrapper>

        {/* Accent line — sibling of select so CSS selector triggers sweep */}
        <AccentLine $state={state} aria-hidden="true" />
      </SelectContainer>

      {message && (
        <HintText id={hintId} $state={state}>
          {state === 'error'   && '✕ '}
          {state === 'success' && '✓ '}
          {message}
        </HintText>
      )}
    </FieldInputWrapper>
  );
}
