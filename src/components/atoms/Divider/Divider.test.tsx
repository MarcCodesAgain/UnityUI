import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { theme } from '../../../styles/theme';
import { Divider } from './Divider';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    wrap(<Divider />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders a vertical separator', () => {
    wrap(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders label when provided', () => {
    wrap(<Divider label="Or" />);
    expect(screen.getByText('Or')).toBeInTheDocument();
  });

  it('does not render label element when not provided', () => {
    wrap(<Divider />);
    expect(screen.queryByText('Or')).not.toBeInTheDocument();
  });

  it.each(['default', 'strong', 'accent'] as const)(
    'renders variant "%s" without crashing',
    (variant) => {
      wrap(<Divider variant={variant} />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    }
  );

  it.each(['none', 'sm', 'md', 'lg'] as const)(
    'renders spacing "%s" without crashing',
    (spacing) => {
      wrap(<Divider spacing={spacing} />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    }
  );
});
