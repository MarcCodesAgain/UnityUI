import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { Radio, RadioGroup } from './Radio';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const GROUP_OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

describe('Radio', () => {
  it('renders a radio input', () => {
    wrap(<Radio onChange={() => {}} />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders label and links it to the input', () => {
    wrap(<Radio label="Pick me" onChange={() => {}} />);
    expect(screen.getByLabelText('Pick me')).toBeInTheDocument();
  });

  it('reflects checked state', () => {
    wrap(<Radio checked onChange={() => {}} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('reflects unchecked state', () => {
    wrap(<Radio checked={false} onChange={() => {}} />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();
    wrap(<Radio label="Click me" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    wrap(<Radio disabled onChange={() => {}} />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('renders hint text', () => {
    wrap(<Radio hint="Helpful info" onChange={() => {}} />);
    expect(screen.getByText(/Helpful info/)).toBeInTheDocument();
  });

  it('renders error text and marks input invalid', () => {
    wrap(<Radio error="Required" onChange={() => {}} />);
    expect(screen.getByText(/Required/)).toBeInTheDocument();
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size "%s" without crashing', (size) => {
    wrap(<Radio size={size} label="Label" onChange={() => {}} />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });
});

describe('RadioGroup', () => {
  it('renders all options', () => {
    wrap(<RadioGroup name="test" options={GROUP_OPTIONS} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('renders group label', () => {
    wrap(<RadioGroup name="test" options={GROUP_OPTIONS} label="Choose one" />);
    expect(screen.getByRole('radiogroup', { name: 'Choose one' })).toBeInTheDocument();
  });

  it('marks the correct option as checked', () => {
    wrap(<RadioGroup name="test" options={GROUP_OPTIONS} value="b" />);
    expect(screen.getByLabelText('Option B')).toBeChecked();
    expect(screen.getByLabelText('Option A')).not.toBeChecked();
  });

  it('calls onChange with the selected value', () => {
    const onChange = vi.fn();
    wrap(<RadioGroup name="test" options={GROUP_OPTIONS} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('disables a specific option', () => {
    wrap(<RadioGroup name="test" options={GROUP_OPTIONS} />);
    expect(screen.getByLabelText('Option C')).toBeDisabled();
  });

  it('renders group-level error', () => {
    wrap(<RadioGroup name="test" options={GROUP_OPTIONS} error="Pick one" />);
    expect(screen.getByText(/Pick one/)).toBeInTheDocument();
  });
});
