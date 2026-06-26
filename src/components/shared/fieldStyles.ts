/**
 * Shared styled primitives reused across form-field atoms
 * (Input, Select, Checkbox, Radio) and the Form organism.
 *
 * Import from here instead of duplicating per-component.
 */
import styled from 'styled-components';
import { colors, fontFamily, fontWeight, fontSize, letterSpacing, spacing } from '../../tokens';

/** Uppercase mono label — used by Input, Select, and Form field wrappers */
export const FieldLabel = styled.label<{ $disabled?: boolean }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${({ $disabled }) => ($disabled ? colors.textDisabled : colors.textSecondary)};
  transition: color 180ms ease;
`;

/** Inline-flex column wrapper with optional full-width — used by Input and Select */
export const FieldInputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${spacing[2]};
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`;

/** Visually-hidden native input that stays in the accessibility tree */
export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;
