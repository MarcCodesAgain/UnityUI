import styled, { css, keyframes } from 'styled-components';
import { useId, useRef, useEffect, useState } from 'react';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';
import { HiddenInput } from '../../shared/fieldStyles';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: RadioSize;
}

export interface RadioGroupProps {
  name: string;
  options: { value: string; label: string; hint?: string; disabled?: boolean }[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  size?: RadioSize;
  /** Stack vertically (default) or horizontally */
  direction?: 'vertical' | 'horizontal';
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const outerSize: Record<RadioSize, string> = {
  sm: '14px',
  md: '18px',
  lg: '22px',
};

const innerSize: Record<RadioSize, string> = {
  sm: '6px',
  md: '8px',
  lg: '10px',
};

const labelFontSize: Record<RadioSize, string> = {
  sm: fontSize.sm,
  md: fontSize.base,
  lg: fontSize.lg,
};

// ─── Dot pop animation ────────────────────────────────────────────────────────
//
// Inner dot scales from 0 → 1 with a slight overshoot (spring feel).

const dotPop = keyframes`
  0%   { transform: translate(-50%, -50%) scale(0); }
  60%  { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────


const Circle = styled.div<{
  $size: RadioSize;
  $checked: boolean;
  $disabled: boolean;
  $error: boolean;
}>`
  flex-shrink: 0;
  position: relative;
  width:  ${({ $size }) => outerSize[$size]};
  height: ${({ $size }) => outerSize[$size]};
  border-radius: 50%;
  border: ${borderWidth[1]} solid ${({ $checked, $error, $disabled }) =>
    $disabled  ? colors.grey200   :
    $error     ? colors.errorDefault        :
    $checked   ? colors.primary   :
    colors.borderDefault};
  background-color: ${({ $disabled }) => $disabled ? colors.grey50 : colors.bgPage};
  transition:
    border-color     180ms ease,
    background-color 180ms ease,
    box-shadow       180ms ease;
`;

const Dot = styled.div<{ $size: RadioSize; $visible: boolean; $animate: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width:  ${({ $size }) => innerSize[$size]};
  height: ${({ $size }) => innerSize[$size]};
  border-radius: 50%;
  background-color: ${colors.primary};
  transform: translate(-50%, -50%) scale(${({ $visible }) => ($visible ? 1 : 0)});

  ${({ $animate, $visible }) =>
    $animate && $visible &&
    css`
      animation: ${dotPop} 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `}
`;

const Wrapper = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${spacing[1]};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  user-select: none;

  /* Focus ring */
  &:focus-within ${Circle} {
    box-shadow: 0 0 0 3px ${colors.blue100};
    border-color: ${colors.primary};
  }

  /* Hover */
  ${({ $disabled }) =>
    !$disabled &&
    css`
      &:hover ${Circle} {
        border-color: ${colors.primary};
      }
    `}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

const LabelText = styled.span<{ $size: RadioSize; $disabled: boolean }>`
  font-family: ${fontFamily.base};
  font-size: ${({ $size }) => labelFontSize[$size]};
  font-weight: ${fontWeight.regular};
  color: ${({ $disabled }) => ($disabled ? colors.textDisabled : colors.textPrimary)};
  line-height: 1.4;
  transition: color 180ms ease;
`;

const HintText = styled.span<{ $error: boolean; $size: RadioSize }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  letter-spacing: ${letterSpacing.normal};
  color: ${({ $error }) => ($error ? colors.errorDefault : colors.textSecondary)};
  padding-left: calc(${({ $size }) => outerSize[$size]} + ${spacing[3]});
`;

// ─── Radio (single) ───────────────────────────────────────────────────────────

export function Radio({
  label,
  hint,
  error,
  size = 'md',
  disabled,
  checked,
  id: externalId,
  onChange,
  ...props
}: RadioProps) {
  const autoId = useId();
  const id     = externalId ?? autoId;
  const hintId = `${id}-hint`;

  const isChecked = !!checked;
  const hasError  = !!error;
  const message   = error ?? hint;

  // Animate dot only on the transition to checked, not on every re-render
  const prevChecked = useRef(isChecked);
  const [animateDot, setAnimateDot] = useState(false);

  useEffect(() => {
    if (isChecked && !prevChecked.current) {
      setAnimateDot(true);
    } else if (!isChecked) {
      setAnimateDot(false);
    }
    prevChecked.current = isChecked;
  }, [isChecked]);

  return (
    <Wrapper htmlFor={id} $disabled={!!disabled}>
      <Row>
        <HiddenInput
          type="radio"
          id={id}
          checked={isChecked}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={hasError || undefined}
          aria-describedby={message ? hintId : undefined}
          {...props}
        />

        <Circle
          $size={size}
          $checked={isChecked}
          $disabled={!!disabled}
          $error={hasError}
          aria-hidden="true"
        >
          <Dot $size={size} $visible={isChecked} $animate={animateDot} />
        </Circle>

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

// ─── RadioGroup ───────────────────────────────────────────────────────────────

const GroupWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const GroupLabel = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

const OptionsWrapper = styled.div<{ $direction: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'horizontal' ? 'row' : 'column')};
  gap: ${({ $direction }) => ($direction === 'horizontal' ? spacing[6] : spacing[3])};
  flex-wrap: wrap;
`;

const GroupError = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  letter-spacing: ${letterSpacing.normal};
  color: ${colors.errorDefault};
`;

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  error,
  size = 'md',
  direction = 'vertical',
}: RadioGroupProps) {
  const labelId = `${name}-group-label`;
  const errorId = `${name}-group-error`;

  return (
    <GroupWrapper
      role="radiogroup"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={error ? errorId : undefined}
    >
      {label && <GroupLabel id={labelId}>{label}</GroupLabel>}

      <OptionsWrapper $direction={direction}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            value={opt.value}
            label={opt.label}
            hint={opt.hint}
            checked={value === opt.value}
            disabled={opt.disabled}
            size={size}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </OptionsWrapper>

      {error && <GroupError id={errorId}>✕ {error}</GroupError>}
    </GroupWrapper>
  );
}
