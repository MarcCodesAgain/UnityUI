import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { theme } from '../../../styles/theme';
import { Card } from './Card';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Card', () => {
  it('renders children', () => {
    wrap(<Card><p>Content</p></Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders Card.Header', () => {
    wrap(
      <Card>
        <Card.Header><h2>Title</h2></Card.Header>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders Card.Body', () => {
    wrap(
      <Card>
        <Card.Body><p>Body content</p></Card.Body>
      </Card>
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders Card.Footer', () => {
    wrap(
      <Card>
        <Card.Footer><button>Action</button></Card.Footer>
      </Card>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders Card.Footer with divider by default', () => {
    wrap(
      <Card>
        <Card.Footer><span>Footer</span></Card.Footer>
      </Card>
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders Card.Footer without divider when divider=false', () => {
    wrap(
      <Card>
        <Card.Footer divider={false}><span>Footer</span></Card.Footer>
      </Card>
    );
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it.each(['default', 'outlined', 'ghost'] as const)(
    'renders variant "%s" without crashing',
    (variant) => {
      wrap(<Card variant={variant}><p>Content</p></Card>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    }
  );

  it('renders interactive card without crashing', () => {
    wrap(<Card interactive><p>Clickable</p></Card>);
    expect(screen.getByText('Clickable')).toBeInTheDocument();
  });
});
