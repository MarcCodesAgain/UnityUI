import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { theme } from '../../../styles/theme';
import { Select } from './Select';

const OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Select', () => {
  it('renders a combobox', () => {
    wrap(<Select options={OPTIONS} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all options', () => {
    wrap(<Select options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option C' })).toBeInTheDocument();
  });

  it('renders a placeholder option when provided', () => {
    wrap(<Select options={OPTIONS} placeholder="Choose…" />);
    expect(screen.getByRole('option', { name: 'Choose…' })).toBeInTheDocument();
  });

  it('renders label and links it to the select', () => {
    wrap(<Select options={OPTIONS} label="Country" />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    wrap(<Select options={OPTIONS} hint="Pick one option" />);
    expect(screen.getByText(/Pick one option/)).toBeInTheDocument();
  });

  it('renders error text and marks select invalid', () => {
    wrap(<Select options={OPTIONS} error="Required field" />);
    expect(screen.getByText(/Required field/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders success text', () => {
    wrap(<Select options={OPTIONS} success="Looks good" />);
    expect(screen.getByText(/Looks good/)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    wrap(<Select options={OPTIONS} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size "%s" without crashing', (size) => {
    wrap(<Select options={OPTIONS} size={size} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('marks a disabled option correctly', () => {
    wrap(<Select options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'Option C' })).toBeDisabled();
  });
});
