import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { theme } from '../../../styles/theme';
import { Badge } from './Badge';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Badge', () => {
  it('renders label', () => {
    wrap(<Badge label="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders dot when dot prop is true', () => {
    const { container } = wrap(<Badge label="Live" dot />);
    const dot = within(container).queryAllByRole('presentation').at(0)
      ?? container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });

  it('does not render dot by default', () => {
    const { container } = wrap(<Badge label="Live" />);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).not.toBeInTheDocument();
  });

  it.each(['default', 'primary', 'outline', 'ghost'] as const)(
    'renders variant "%s" without crashing',
    (variant) => {
      wrap(<Badge label={variant} variant={variant} />);
      expect(screen.getByText(variant)).toBeInTheDocument();
    }
  );

  it.each(['sm', 'md'] as const)('renders size "%s" without crashing', (size) => {
    wrap(<Badge label="Tag" size={size} />);
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });
});
