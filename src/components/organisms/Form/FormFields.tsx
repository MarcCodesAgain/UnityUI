/**
 * Internal field-level sub-components used by <Form>.
 * Not part of the public API — import from Form.tsx, not directly from here.
 */
import styled from 'styled-components';
import { useId } from 'react';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Checkbox } from '../../atoms/Checkbox';
import { Radio } from '../../atoms/Radio';
import type { FormField, FormValues } from './Form';

// ─── Textarea styled pieces ───────────────────────────────────────────────────

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const TextareaLabel = styled.label`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

const StyledTextarea = styled.textarea<{ $error: boolean }>`
  appearance: none;
  outline: none;
  width: 100%;
  resize: vertical;
  font-family: ${fontFamily.base};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.regular};
  color: ${colors.textPrimary};
  background-color: ${colors.bgPage};
  border-radius: 0;
  border: ${borderWidth[1]} solid ${({ $error }) => ($error ? colors.errorDefault : colors.borderDefault)};
  padding: ${spacing[3]} ${spacing[4]};
  transition: border-color 180ms ease;
  line-height: 1.5;

  &:focus { border-color: ${colors.primary}; }
  &:disabled {
    background-color: ${colors.grey50};
    border-color: ${colors.grey200};
    color: ${colors.textDisabled};
    cursor: not-allowed;
  }
  &::placeholder { color: ${colors.textDisabled}; }
`;

const HintText = styled.span<{ $error: boolean }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  color: ${({ $error }) => ($error ? colors.errorDefault : colors.textSecondary)};
`;

// ─── Radio group row ──────────────────────────────────────────────────────────

const Overline = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

const RadioGroupRow = styled.div<{ $horizontal: boolean }>`
  display: flex;
  flex-direction: ${({ $horizontal }) => ($horizontal ? 'row' : 'column')};
  gap: ${({ $horizontal }) => ($horizontal ? spacing[6] : spacing[3])};
  flex-wrap: wrap;
`;

const RadioFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[5]};
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TextareaFieldControlProps {
  field: Extract<FormField, { type: 'textarea' }>;
  value: string;
  error?: string;
  onChange: (val: string | boolean) => void;
}

export function TextareaFieldControl({ field, value, error, onChange }: TextareaFieldControlProps) {
  const autoId   = useId();
  const taId     = `${autoId}-ta`;
  const taHintId = `${autoId}-hint`;
  const message  = error ?? field.hint;

  return (
    <TextareaWrapper>
      {field.label && <TextareaLabel htmlFor={taId}>{field.label}</TextareaLabel>}
      <StyledTextarea
        id={taId}
        rows={field.rows ?? 4}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        $error={!!error}
        aria-invalid={!!error || undefined}
        aria-describedby={message ? taHintId : undefined}
      />
      {message && (
        <HintText id={taHintId} $error={!!error}>
          {error ? `✕ ${error}` : field.hint}
        </HintText>
      )}
    </TextareaWrapper>
  );
}

interface RadioFieldControlProps {
  field: Extract<FormField, { type: 'radio' }>;
  value: string;
  error?: string;
  onChange: (val: string | boolean) => void;
}

export function RadioFieldControl({ field, value, error, onChange }: RadioFieldControlProps) {
  const errorId = useId();
  return (
    <RadioFieldsWrapper>
      {field.label && <Overline>{field.label}</Overline>}
      <RadioGroupRow $horizontal={field.direction === 'horizontal'}>
        {field.options.map((opt) => (
          <Radio
            key={opt.value}
            name={field.name}
            label={opt.label}
            hint={opt.hint}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled ?? field.disabled}
            onChange={() => onChange(opt.value)}
          />
        ))}
      </RadioGroupRow>
      {error && <HintText id={errorId} $error>✕ {error}</HintText>}
    </RadioFieldsWrapper>
  );
}

// ─── Field renderer ───────────────────────────────────────────────────────────

export function renderField(
  field: FormField,
  value: string | boolean,
  error: string | undefined,
  onChange: (val: string | boolean) => void,
): React.ReactNode {
  const fw = field.fullWidth !== false;

  switch (field.type) {
    case 'input':
      return (
        <Input
          label={field.label}
          hint={field.hint}
          error={error}
          type={field.inputType ?? 'text'}
          placeholder={field.placeholder}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={field.disabled}
          required={field.required}
          fullWidth={fw}
        />
      );
    case 'select':
      return (
        <Select
          label={field.label}
          hint={field.hint}
          error={error}
          options={field.options}
          placeholder={field.placeholder}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={field.disabled}
          fullWidth={fw}
        />
      );
    case 'checkbox':
      return (
        <Checkbox
          label={field.checkboxLabel ?? field.label}
          hint={field.hint}
          error={error}
          checked={value as boolean}
          onChange={() => onChange(!value)}
          disabled={field.disabled}
        />
      );
    case 'radio':
      return (
        <RadioFieldControl
          field={field}
          value={value as string}
          error={error}
          onChange={onChange}
        />
      );
    case 'textarea':
      return (
        <TextareaFieldControl
          field={field}
          value={value as string}
          error={error}
          onChange={onChange}
        />
      );
  }
}

// Re-export the type so Form.tsx can pass it through without re-importing
export type { FormValues };
