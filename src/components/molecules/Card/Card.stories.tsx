import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Typography } from '../../atoms/Typography';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Avatar } from '../../atoms/Avatar';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Content container with a compound sub-component API: \`Card.Header\`, \`Card.Body\`, \`Card.Footer\`.
Three visual variants, an interactive hover state (Electric Blue bottom bar), and a \`flush\` mode
that removes internal padding for full-bleed content.

\`\`\`tsx
import { Card } from '@unityui/core';

<Card variant="default" interactive onClick={() => router.push('/details')}>
  <Card.Header>
    <Card.Title>Design tokens</Card.Title>
    <Card.Subtitle>Colors · Spacing · Typography</Card.Subtitle>
  </Card.Header>
  <Card.Body>
    Every value in UnityUI is a named token.
  </Card.Body>
  <Card.Footer>
    <Badge label="v0.1.0" variant="outline" />
  </Card.Footer>
</Card>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'ghost'],
      description: '`default` — subtle shadow · `outlined` — 1px border · `ghost` — flat, no border.',
      table: { defaultValue: { summary: 'default' } },
    },
    interactive: {
      control: 'boolean',
      description: 'Adds hover state (Electric Blue bottom-bar sweep) and pointer cursor.',
      table: { defaultValue: { summary: 'false' } },
    },
    flush: {
      control: 'boolean',
      description: 'Removes padding from `Card.Body` for full-bleed content (images, maps, etc.).',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: { variant: 'default', interactive: false },
  render: (args) => (
    <Card {...args} style={{ maxWidth: '360px', width: '100%' }}>
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
        <Card key={variant} variant={variant} style={{ flex: '1 1 180px', minWidth: '0' }}>
          <Card.Header>
            <Badge label={variant} variant="outline" />
            <Typography variant="h6">Card {variant}</Typography>
          </Card.Header>
          <Card.Body>
            <Typography variant="bodySm" color="secondary">
              Swiss minimalism — no radius, no shadow.
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
        <Card key={name} interactive style={{ flex: '1 1 200px', minWidth: '0' }}>
          <Card.Header>
            <Badge label={`v0.${i + 1}.0`} variant="default" />
            <Typography variant="h6">{name}</Typography>
            <Typography variant="caption" color="secondary">Hover to see the blue border</Typography>
          </Card.Header>
          <Card.Footer>
            <Button variant="primary" size="sm" fullWidth>Open →</Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  ),
};

// ─── Article card ─────────────────────────────────────────────────────────────

export const ArticleCard: Story = {
  render: () => (
    <Card interactive style={{ maxWidth: '480px', width: '100%' }}>
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
          <Button variant="primary" size="sm">Read more →</Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

// ─── Stat card ────────────────────────────────────────────────────────────────

export const StatCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', width: '100%' }}>
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

// ─── Image card ───────────────────────────────────────────────────────────────

export const ImageCard: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Card interactive style={{ flex: '1 1 280px', minWidth: '0', maxWidth: '400px' }}>
        <Card.Header style={{ paddingTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Badge label="Design" variant="primary" />
            <Typography variant="caption" color="secondary">Jun 2025</Typography>
          </div>
          <Typography variant="h5">The grid is the law</Typography>
        </Card.Header>

        {/* Full-bleed image */}
        <img
          src="https://picsum.photos/seed/unityui/680/340"
          alt="Swiss grid composition"
          style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', marginBottom: '0' }}
        />

        <Card.Body style={{ paddingTop: '32px' }}>
          <Typography variant="bodySm" color="secondary">
            How Swiss International Typographic Style became the foundation
            of modern UI design systems.
          </Typography>
        </Card.Body>
        <Card.Footer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="secondary">5 min read</Typography>
            <Button variant="primary" size="sm">Read more →</Button>
          </div>
        </Card.Footer>
      </Card>

      <Card interactive style={{ flex: '1 1 200px', minWidth: '0', maxWidth: '300px' }}>
        <Card.Header style={{ paddingTop: '32px' }}>
          <Typography variant="h6">Electric Blue</Typography>
          <Typography variant="caption" color="secondary">Color study #0047FF</Typography>
        </Card.Header>

        <img
          src="https://picsum.photos/seed/electric/520/260"
          alt="Electric blue composition"
          style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
        />

        <Card.Footer divider={false}>
          <Button variant="primary" size="sm" fullWidth>Explore →</Button>
        </Card.Footer>
      </Card>
    </div>
  ),
};

// ─── Profile card ─────────────────────────────────────────────────────────────

export const ProfileCard: Story = {
  render: () => (
    <Card style={{ maxWidth: '360px', width: '100%' }} variant="outlined">
      <Card.Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar initials="ML" size="md" status="online" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Typography variant="h6">Marc Llopis</Typography>
            <Typography variant="caption" color="secondary">Senior Frontend Developer</Typography>
          </div>
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
