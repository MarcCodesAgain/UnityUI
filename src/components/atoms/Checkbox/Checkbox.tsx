import styled, { css, keyframes } from 'styled-components';
import { useId, useRef, useEffect, useState } from 'react';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';
import { HiddenInput } from '../../shared/fieldStyles';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Indeterminate state — visually a dash instead of a check */
  indeterminate?: boolean;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const boxSize: Record<'sm' | 'md' | 'lg', string> = {
  sm: '14px',
  md: '18px',
  lg: '22px',
};

const labelSize: Record<'sm' | 'md' | 'lg', string> = {
  sm: fontSize.sm,
  md: fontSize.base,
  lg: fontSize.lg,
};

// ─── Check draw animation ─────────────────────────────────────────────────────
//
// The SVG check path has a known length (~17px).
// stroke-dashoffset goes 17 → 0, drawing the path left-to-right.

const drawCheck = keyframes`
  from { stroke-dashoffset: 17; }
  to   { stroke-dashoffset: 0; }
`;

const drawDash = keyframes`
  from { stroke-dashoffset: 8; }
  to   { stroke-dashoffset: 0; }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────


const Box = styled.div<{
  $size: 'sm' | 'md' | 'lg';
  $checked: boolean;
  $indeterminate: boolean;
  $disabled: boolean;
  $error: boolean;
}>`
  flex-shrink: 0;
  width:  ${({ $size }) => boxSize[$size]};
  height: ${({ $size }) => boxSize[$size]};
  border-radius: 0; /* Swiss — sharp */
  border: ${borderWidth[1]} solid ${({ $checked, $indeterminate, $error, $disabled }) =>
    $disabled                        ? colors.grey200 :
    $error                           ? colors.errorDefault       :
    $checked || $indeterminate       ? colors.primary  :
    colors.borderDefault};
  background-color: ${({ $checked, $indeterminate, $disabled }) =>
    $disabled                  ? colors.grey50  :
    $checked || $indeterminate ? colors.primary :
    colors.bgPage};
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color  180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;

  /* Focus ring — driven by sibling input:focus-visible */
`;

const CheckSvg = styled.svg<{ $visible: boolean }>`
  overflow: visible;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

const CheckPath = styled.path<{ $animate: boolean }>`
  stroke: ${colors.white};
  stroke-width: 2px;
  stroke-linecap: square;
  stroke-linejoin: miter;
  fill: none;
  stroke-dasharray: 17;
  stroke-dashoffset: ${({ $animate }) => ($animate ? 0 : 17)};

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${drawCheck} 180ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `}
`;

const DashPath = styled.path<{ $animate: boolean }>`
  stroke: ${colors.white};
  stroke-width: 2px;
  stroke-linecap: square;
  fill: none;
  stroke-dasharray: 8;
  stroke-dashoffset: ${({ $animate }) => ($animate ? 0 : 8)};

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${drawDash} 150ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `}
`;

const Wrapper = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${spacing[1]};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  user-select: none;

  /* Focus ring on Box when hidden input is focused */
  &:focus-within ${Box} {
    box-shadow: 0 0 0 3px ${colors.blue100};
    border-color: ${colors.primary};
  }

  /* Hover — only when not disabled */
  ${({ $disabled }) =>
    !$disabled &&
    css`
      &:hover ${Box} {
        border-color: ${colors.primary};
      }
    `}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

const LabelText = styled.span<{ $size: 'sm' | 'md' | 'lg'; $disabled: boolean }>`
  font-family: ${fontFamily.base};
  font-size: ${({ $size }) => labelSize[$size]};
  font-weight: ${fontWeight.regular};
  color: ${({ $disabled }) => ($disabled ? colors.textDisabled : colors.textPrimary)};
  line-height: 1.4;
  transition: color 180ms ease;
`;

const HintText = styled.span<{ $error: boolean; $size: 'sm' | 'md' | 'lg' }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  letter-spacing: ${letterSpacing.normal};
  color: ${({ $error }) => ($error ? colors.errorDefault : colors.textSecondary)};
  padding-left: calc(${({ $size }) => boxSize[$size]} + ${spacing[3]});
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Checkbox({
  label,
  hint,
  error,
  size = 'md',
  indeterminate = false,
  disabled,
  checked,
  id: externalId,
  onChange,
  ...props
}: CheckboxProps) {
  const autoId  = useId();
  const id      = externalId ?? autoId;
  const hintId  = `${id}-hint`;
  const inputRef = useRef<HTMLInputElement>(null);

  const isChecked       = !!checked;
  const isIndeterminate = indeterminate && !isChecked;
  const hasError        = !!error;
  const message         = error ?? hint;

  // Wire the native indeterminate DOM property — React doesn't support it as a prop
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // Animate only on the transition render, not on every re-render while checked/indeterminate
  const prevChecked       = useRef(isChecked);
  const prevIndeterminate = useRef(isIndeterminate);
  const [animateCheck,  setAnimateCheck]  = useState(false);
  const [animateDash,   setAnimateDash]   = useState(false);

  useEffect(() => {
    if (isChecked && !prevChecked.current) {
      setAnimateCheck(true);
    } else if (!isChecked) {
      setAnimateCheck(false);
    }
    prevChecked.current = isChecked;
  }, [isChecked]);

  useEffect(() => {
    if (isIndeterminate && !prevIndeterminate.current) {
      setAnimateDash(true);
    } else if (!isIndeterminate) {
      setAnimateDash(false);
    }
    prevIndeterminate.current = isIndeterminate;
  }, [isIndeterminate]);

  return (
    <Wrapper htmlFor={id} $disabled={!!disabled}>
      <Row>
        {/* Hidden but accessible native input */}
        <HiddenInput
          ref={inputRef}
          type="checkbox"
          id={id}
          checked={isChecked}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? hintId : undefined}
          {...props}
        />

        {/* Visual box */}
        <Box
          $size={size}
          $checked={isChecked}
          $indeterminate={isIndeterminate}
          $disabled={!!disabled}
          $error={hasError}
          aria-hidden="true"
        >
          {isIndeterminate ? (
            <CheckSvg $visible width="10" height="2" viewBox="0 0 10 2">
              <DashPath d="M1 1H9" $animate={animateDash} />
            </CheckSvg>
          ) : (
            <CheckSvg
              $visible={isChecked}
              width="11"
              height="8"
              viewBox="0 0 11 8"
            >
              <CheckPath
                d="M1 4L4 7L10 1"
                $animate={animateCheck}
              />
            </CheckSvg>
          )}
        </Box>

        {label && (
          <LabelText $size={size} $disabled={!!disabled}>
            {label}
          </LabelText>
        )}
      </Row>

      {message && (
        <HintText id={hintId} $error={hasError} $size={size}>
          {hasError && '✕ '}
          {message}
        </HintText>
      )}
    </Wrapper>
  );
}
