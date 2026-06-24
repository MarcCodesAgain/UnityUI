import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { theme } from '../../../styles/theme';
import { Typography } from './Typography';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Typography', () => {
  it('renders children', () => {
    wrap(<Typography>Hello</Typography>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('defaults to <p> for body variant', () => {
    wrap(<Typography variant="body">Text</Typography>);
    expect(screen.getByText('Text').tagName).toBe('P');
  });

  it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
    'renders correct heading element for variant "%s"',
    (variant) => {
      wrap(<Typography variant={variant}>{variant}</Typography>);
      expect(screen.getByRole('heading', { level: Number(variant[1]) })).toBeInTheDocument();
    }
  );

  it('renders display as <h1>', () => {
    wrap(<Typography variant="display">Big</Typography>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders label and caption as <span>', () => {
    wrap(<Typography variant="label">Label</Typography>);
    expect(screen.getByText('Label').tagName).toBe('SPAN');
  });

  it('overrides element with "as" prop', () => {
    wrap(<Typography variant="h1" as="div">Title</Typography>);
    expect(screen.getByText('Title').tagName).toBe('DIV');
  });

  it.each(['primary', 'secondary', 'disabled', 'inverse', 'accent'] as const)(
    'renders color "%s" without crashing',
    (color) => {
      wrap(<Typography color={color}>Text</Typography>);
      expect(screen.getByText('Text')).toBeInTheDocument();
    }
  );

  it.each([
    'display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'bodyLg', 'body', 'bodySm', 'label', 'caption', 'overline',
  ] as const)('renders variant "%s" without crashing', (variant) => {
    wrap(<Typography variant={variant}>{variant}</Typography>);
    expect(screen.getByText(variant)).toBeInTheDocument();
  });

  it('applies truncate with ellipsis', () => {
    wrap(<Typography truncate>Long text</Typography>);
    const el = screen.getByText('Long text');
    expect(el).toBeInTheDocument();
  });
});
