import styled from 'styled-components';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { colors, fontFamily, fontWeight, fontSize, letterSpacing, spacing } from '../../../tokens';
import { type SelectOption } from '../../atoms/Select';
import { Button } from '../../atoms/Button';
import { Typography } from '../../atoms/Typography';
import { Alert } from '../../atoms/Alert';
import { renderField } from './FormFields';

// ─── Field definitions ────────────────────────────────────────────────────────

interface BaseField {
  /** Unique key — used as the key in the submitted values object */
  name: string;
  label?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  /** Full-width inside the form (default true) */
  fullWidth?: boolean;
}

interface InputField extends BaseField {
  type: 'input';
  inputType?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
}

interface SelectField extends BaseField {
  type: 'select';
  options: SelectOption[];
  placeholder?: string;
}

interface CheckboxField extends BaseField {
  type: 'checkbox';
  /** Overrides label as the inline checkbox label */
  checkboxLabel?: string;
}

interface RadioField extends BaseField {
  type: 'radio';
  options: { value: string; label: string; hint?: string; disabled?: boolean }[];
  direction?: 'vertical' | 'horizontal';
}

interface TextareaField extends BaseField {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

export type FormField =
  | InputField
  | SelectField
  | CheckboxField
  | RadioField
  | TextareaField;

// ─── Form values ──────────────────────────────────────────────────────────────

export type FormValues = Record<string, string | boolean>;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateField(field: FormField, value: string | boolean): string | undefined {
  if (field.required) {
    if (value === '' || value === false || value === undefined || value === null) {
      return `${field.label ?? field.name} is required`;
    }
  }
  if (field.type === 'input' && field.inputType === 'email' && typeof value === 'string' && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
  }
  return undefined;
}

function validateAll(fields: FormField[], values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const error = validateField(field, values[field.name] ?? '');
    if (error) errors[field.name] = error;
  }
  return errors;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FormProps {
  fields: FormField[];
  /** Called with all values when the form is valid and submitted */
  onSubmit: (values: FormValues) => void | Promise<void>;
  /** Initial values — useful for edit forms */
  initialValues?: Partial<FormValues>;
  /** Label for the submit button */
  submitLabel?: string;
  /** Optional form title */
  title?: string;
  /** Optional form description */
  description?: string;
  /** Shown inside the form after a successful submit */
  successMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing[5]};
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[5]};
`;

// ─── Field primitives — exported for custom form layouts ──────────────────────
//
// Consumers who need multi-column or conditional layouts can compose these
// building blocks directly without reimplementing the visual style.

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
  width: 100%;
`;

export const FieldLabel = styled.label<{ $disabled?: boolean }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${({ $disabled }) => ($disabled ? colors.textDisabled : colors.textSecondary)};
  transition: color 180ms ease;
`;

export const FieldHint = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  color: ${colors.textSecondary};
`;

export const FieldError = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  color: ${colors.errorDefault};
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${spacing[5]};
  width: 100%;
`;

// ─── Stable fallback so `initialValues = {}` never creates a new reference ────

const EMPTY_INITIAL_VALUES: Partial<FormValues> = {};

// ─── Form component ───────────────────────────────────────────────────────────

export function Form({
  fields,
  onSubmit,
  initialValues = EMPTY_INITIAL_VALUES,
  submitLabel = 'Submit',
  title,
  description,
  successMessage,
  className,
  style,
}: FormProps) {
  const buildInitialValues = useCallback((): FormValues => {
    const defaults: FormValues = {};
    for (const f of fields) {
      defaults[f.name] = initialValues[f.name] ?? (f.type === 'checkbox' ? false : '');
    }
    return defaults;
  }, [fields, initialValues]);

  const [values,  setValues]  = useState<FormValues>(buildInitialValues);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset when fields or initialValues change (e.g. switching edit ↔ create)
  useEffect(() => {
    setValues(buildInitialValues());
    setErrors({});
    setSuccess(false);
  }, [buildInitialValues]);

  const handleChange = useCallback((name: string) => (val: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSuccess(false);
  }, []);

  // Stable per-field handler references
  const fieldHandlers = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, handleChange(f.name)])),
    [fields, handleChange],
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateAll(fields, values);
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      await onSubmit(values);
      if (successMessage) setSuccess(true);
    } finally {
      setLoading(false);
    }
  }, [fields, values, onSubmit, successMessage]);

  return (
    <StyledForm onSubmit={handleSubmit} className={className} style={style} noValidate>
      {(title || description) && (
        <Header>
          {title && <Typography variant="h4" noHighlight>{title}</Typography>}
          {description && <Typography variant="bodySm" color="secondary">{description}</Typography>}
        </Header>
      )}

      <FieldsWrapper>
        {fields.map((field) => (
          <div key={field.name}>
            {renderField(
              field,
              values[field.name] ?? (field.type === 'checkbox' ? false : ''),
              errors[field.name],
              fieldHandlers[field.name],
            )}
          </div>
        ))}
      </FieldsWrapper>

      {success && successMessage && (
        <Alert variant="success" onDismiss={() => setSuccess(false)}>
          {successMessage}
        </Alert>
      )}

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {submitLabel}
      </Button>
    </StyledForm>
  );
}
