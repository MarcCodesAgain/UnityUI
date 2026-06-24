import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Typography } from '../../atoms/Typography';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { colors } from '../../../tokens';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant:     { control: 'select', options: ['default', 'outlined', 'ghost'] },
    interactive: { control: 'boolean' },
    flush:       { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: { variant: 'default', interactive: false },
  render: (args) => (
    <Card {...args} style={{ maxWidth: '360px' }}>
      <Card.Header>
        <Typography variant="h5">Card title</Typography>
        <Typography variant="bodySm" color="secondary">Supporting description text</Typography>
      </Card.Header>
      <Card.Body>
        <Typography variant="body" color="secondary">
          This is the main content area of the card. Use it for any body content.
        </Typography>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" size="sm">Action</Button>
      </Card.Footer>
    </Card>
  ),
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {(['default', 'outlined', 'ghost'] as const).map((variant) => (
        <Card key={variant} variant={variant} style={{ width: '260px' }}>
          <Card.Header>
            <Badge label={variant} variant="outline" />
            <Typography variant="h6">Card {variant}</Typography>
          </Card.Header>
          <Card.Body>
            <Typography variant="bodySm" color="secondary">
              Swiss minimalism — no radius, no shadow, no noise.
            </Typography>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};

// ─── Interactive (hover animation) ────────────────────────────────────────────

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {['Project Alpha', 'Project Beta', 'Project Gamma'].map((name, i) => (
        <Card key={name} interactive style={{ width: '240px' }}>
          <Card.Header>
            <Badge label={`v0.${i + 1}.0`} variant="default" />
            <Typography variant="h6">{name}</Typography>
            <Typography variant="caption" color="secondary">Hover to see the blue bar</Typography>
          </Card.Header>
          <Card.Footer>
            <Button variant="ghost" size="sm" fullWidth>Open →</Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  ),
};

// ─── Article card ─────────────────────────────────────────────────────────────

export const ArticleCard: Story = {
  render: () => (
    <Card interactive style={{ maxWidth: '400px' }}>
      <Card.Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Badge label="Design Systems" variant="primary" />
          <Typography variant="caption" color="secondary">Jun 2025</Typography>
        </div>
        <Typography variant="h4">The grid is the law</Typography>
        <Typography variant="bodySm" color="secondary">
          How Swiss International Typographic Style became the foundation
          of modern UI design systems.
        </Typography>
      </Card.Header>
      <Card.Footer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="secondary">5 min read</Typography>
          <Button variant="ghost" size="sm">Read more →</Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

// ─── Stat card ────────────────────────────────────────────────────────────────

export const StatCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '680px' }}>
      {[
        { label: 'Components', value: '24', delta: '+6 this month', accent: true },
        { label: 'Tests',      value: '184', delta: '100% passing',  accent: false },
        { label: 'Bundle',     value: '12kb', delta: 'gzipped',      accent: false },
      ].map(({ label, value, delta, accent }) => (
        <Card key={label} variant={accent ? 'outlined' : 'default'}>
          <Card.Header>
            <Typography variant="overline" color="secondary">{label}</Typography>
            <Typography variant="h2" color={accent ? 'accent' : 'primary'}>{value}</Typography>
            <Typography variant="caption" color="secondary">{delta}</Typography>
          </Card.Header>
        </Card>
      ))}
    </div>
  ),
};

// ─── Profile card ─────────────────────────────────────────────────────────────

export const ProfileCard: Story = {
  render: () => (
    <Card style={{ maxWidth: '320px' }} variant="outlined">
      <Card.Header>
        {/* Avatar placeholder */}
        <div style={{
          width: '48px', height: '48px',
          backgroundColor: colors.black,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography variant="h5" color="inverse">ML</Typography>
        </div>
        <div>
          <Typography variant="h6">Marc Llopis</Typography>
          <Typography variant="caption" color="secondary">Senior Frontend Developer</Typography>
        </div>
        <Badge label="Available" variant="primary" dot />
      </Card.Header>
      <Card.Body>
        <Typography variant="bodySm" color="secondary">
          Building design systems with precision and purpose.
          Swiss minimalism, Electric Blue.
        </Typography>
      </Card.Body>
      <Card.Footer>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" size="sm" fullWidth>Contact</Button>
          <Button variant="secondary" size="sm" fullWidth>Portfolio</Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};
