import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { theme } from '../../../styles/theme';
import { Spinner } from './Spinner';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Spinner', () => {
  it('renders with default accessible label', () => {
    wrap(<Spinner />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('accepts a custom label', () => {
    wrap(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status', { name: 'Saving changes' })).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg', 'xl'] as const)('renders size "%s" without crashing', (size) => {
    wrap(<Spinner size={size} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it.each(['default', 'inverse'] as const)('renders variant "%s" without crashing', (variant) => {
    wrap(<Spinner variant={variant} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
