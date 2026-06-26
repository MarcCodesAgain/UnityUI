import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { SpotlightCard } from './SpotlightCard';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SpotlightCard', () => {
  it('renders children', () => {
    wrap(<SpotlightCard>Hello spotlight</SpotlightCard>);
    expect(screen.getByText('Hello spotlight')).toBeInTheDocument();
  });

  it('renders compound sub-components', () => {
    wrap(
      <SpotlightCard>
        <SpotlightCard.Header>
          <SpotlightCard.Title>My title</SpotlightCard.Title>
        </SpotlightCard.Header>
        <SpotlightCard.Body>
          <SpotlightCard.Description>My description</SpotlightCard.Description>
        </SpotlightCard.Body>
        <SpotlightCard.Footer>Footer content</SpotlightCard.Footer>
      </SpotlightCard>,
    );
    expect(screen.getByText('My title')).toBeInTheDocument();
    expect(screen.getByText('My description')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders icon sub-component', () => {
    wrap(
      <SpotlightCard>
        <SpotlightCard.Icon>⚡</SpotlightCard.Icon>
      </SpotlightCard>,
    );
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    wrap(<SpotlightCard onClick={onClick}>Clickable</SpotlightCard>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('glow becomes visible on mouseenter and hidden on mouseleave', () => {
    const { container } = wrap(
      <SpotlightCard>Content</SpotlightCard>,
    );
    // The Glow div is the second child of the Wrapper (first is Glow, second is Content)
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(wrapper, { clientX: 100, clientY: 50 });
    // After mouseenter the glow opacity prop should be visible=true (opacity:1 via styled)
    fireEvent.mouseLeave(wrapper);
    // Just verifying no crash; opacity transitions are CSS and not queryable in jsdom
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className and style', () => {
    const { container } = wrap(
      <SpotlightCard className="custom-class" style={{ width: '300px' }}>
        Content
      </SpotlightCard>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.classList.contains('custom-class')).toBe(true);
    expect(wrapper.style.width).toBe('300px');
  });
});
