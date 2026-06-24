import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { Input } from './Input';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Input', () => {
  it('renders an input element', () => {
    wrap(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label and associates it with the input', () => {
    wrap(<Input label="Email" />);
    // text-transform: uppercase is CSS-only, DOM text remains lowercase
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    wrap(<Input hint="We'll never share your email" />);
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
  });

  it('renders error message and sets aria-invalid', () => {
    wrap(<Input error="This field is required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/This field is required/)).toBeInTheDocument();
  });

  it('renders success message', () => {
    wrap(<Input success="Looks good!" />);
    expect(screen.getByText(/Looks good!/)).toBeInTheDocument();
  });

  it('error takes priority over hint', () => {
    wrap(<Input hint="Hint" error="Error" />);
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    wrap(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    wrap(<Input onChange={handleChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('aria-describedby links input to hint', () => {
    wrap(<Input hint="Helper text" />);
    const input = screen.getByRole('textbox');
    const hintId = input.getAttribute('aria-describedby');
    expect(hintId).toBeTruthy();
    expect(document.getElementById(hintId!)).toHaveTextContent('Helper text');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size "%s" without crashing', (size) => {
    wrap(<Input size={size} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
