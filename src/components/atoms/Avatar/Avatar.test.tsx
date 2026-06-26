import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { theme } from '../../../styles/theme';
import { Avatar } from './Avatar';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Avatar', () => {
  it('renders initials when no src is provided', () => {
    wrap(<Avatar initials="ML" />);
    expect(screen.getByText('ML')).toBeInTheDocument();
  });

  it('renders fallback "?" when no src and no initials', () => {
    wrap(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders an img when src is provided', () => {
    wrap(<Avatar src="https://example.com/avatar.jpg" alt="User photo" />);
    const img = screen.getByRole('img', { name: 'User photo' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders status dot when status is provided', () => {
    const { container } = wrap(<Avatar initials="ML" status="online" />);
    // Status dot is a span — check it exists inside wrapper
    const dot = container.querySelector('span');
    expect(dot).toBeInTheDocument();
  });

  it('does not render status dot when status is absent', () => {
    const { container } = wrap(<Avatar initials="ML" />);
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'renders size "%s" without crashing',
    (size) => {
      wrap(<Avatar initials="AB" size={size} />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    }
  );

  it.each(['online', 'offline', 'busy', 'away'] as const)(
    'renders status "%s" without crashing',
    (status) => {
      const { container } = wrap(<Avatar initials="ML" status={status} />);
      expect(container.querySelector('span')).toBeInTheDocument();
    }
  );
});
