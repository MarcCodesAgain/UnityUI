import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The primary interaction element. Three visual variants cover the full spectrum of hierarchy —
\`primary\` for the main action, \`secondary\` for supporting actions, \`ghost\` for low-emphasis actions.

Button labels use **JetBrains Mono** with wide letter-spacing — a small but intentional detail
that signals the system has a point of view.

\`\`\`tsx
import { Button } from '@unityui/core';

<Button variant="primary" size="md">Save changes</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: '`primary` — filled Electric Blue. `secondary` — outlined. `ghost` — text only.',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls height and horizontal padding. `sm` = 32px, `md` = 40px, `lg` = 48px.',
      table: { defaultValue: { summary: 'md' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches the button to 100% of its container width.',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Shows a `<Spinner>` in place of children and disables pointer events.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Reduces opacity and disables all interaction.',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
      description: 'Button label — any React node.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Tweak every prop in the Controls panel below. */
export const Playground: Story = {
  args: { variant: 'primary', size: 'md', children: 'Button' },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

/** The main hierarchy: one primary, one secondary, one ghost. Use this pattern consistently. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="primary"   size={size}>Primary</Button>
          <Button variant="secondary" size={size}>Secondary</Button>
          <Button variant="ghost"     size={size}>Ghost</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'All three variants across all three sizes.' } },
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

/** Height and horizontal padding scale together. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Button size="sm">Small — 32px</Button>
      <Button size="md">Medium — 40px</Button>
      <Button size="lg">Large — 48px</Button>
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────

/**
 * `loading` replaces the label with a spinner and blocks clicks.
 * `disabled` reduces opacity and removes pointer events.
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Default</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="secondary">Default</Button>
      <Button variant="secondary" disabled>Disabled</Button>
      <Button variant="secondary" loading>Loading</Button>
      <Button variant="ghost">Default</Button>
      <Button variant="ghost" disabled>Disabled</Button>
      <Button variant="ghost" loading>Loading</Button>
    </div>
  ),
};

// ─── Full width ───────────────────────────────────────────────────────────────

/** Use `fullWidth` inside forms or narrow containers. */
export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '400px' }}>
      <Button variant="primary"   fullWidth>Primary full width</Button>
      <Button variant="secondary" fullWidth>Secondary full width</Button>
      <Button variant="ghost"     fullWidth>Ghost full width</Button>
    </div>
  ),
};
