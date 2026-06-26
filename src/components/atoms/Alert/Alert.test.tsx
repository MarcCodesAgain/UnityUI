import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { Alert } from './Alert';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Alert', () => {
  it('renders message content', () => {
    wrap(<Alert>Something went wrong</Alert>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    wrap(<Alert title="Heads up">Pay attention</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Pay attention')).toBeInTheDocument();
  });

  it('does not render title element when omitted', () => {
    wrap(<Alert>No title here</Alert>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('error variant has role="alert" (assertive)', () => {
    wrap(<Alert variant="error">Critical error</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('non-error variants have role="status" (polite)', () => {
    wrap(<Alert variant="info">Info message</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders dismiss button when onDismiss is provided', () => {
    wrap(<Alert onDismiss={() => {}}>Dismissible</Alert>);
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
  });

  it('does not render dismiss button when onDismiss is absent', () => {
    wrap(<Alert>Not dismissible</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    wrap(<Alert onDismiss={onDismiss}>Click to dismiss</Alert>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss alert' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it.each(['info', 'success', 'warning'] as const)(
    'variant "%s" renders with role="status"',
    (variant) => {
      wrap(<Alert variant={variant}>Content</Alert>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    }
  );

  it('variant "error" renders with role="alert"', () => {
    wrap(<Alert variant="error">Content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
