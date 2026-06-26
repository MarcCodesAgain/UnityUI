import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { Checkbox } from './Checkbox';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    wrap(<Checkbox onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label and links it to the input', () => {
    wrap(<Checkbox label="Accept terms" onChange={() => {}} />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    wrap(<Checkbox checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('reflects unchecked state', () => {
    wrap(<Checkbox checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();
    wrap(<Checkbox label="Toggle me" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    wrap(<Checkbox disabled onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('renders hint text', () => {
    wrap(<Checkbox hint="Helper text" onChange={() => {}} />);
    expect(screen.getByText(/Helper text/)).toBeInTheDocument();
  });

  it('renders error text and marks input invalid', () => {
    wrap(<Checkbox error="Required" onChange={() => {}} />);
    expect(screen.getByText(/Required/)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size "%s" without crashing', (size) => {
    wrap(<Checkbox size={size} label="Label" onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders indeterminate state without crashing', () => {
    wrap(<Checkbox indeterminate onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
