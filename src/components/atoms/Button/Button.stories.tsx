import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Height and padding scale',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches button to full container width',
    },
    loading: {
      control: 'boolean',
      description: 'Shows spinner and disables interaction',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Base stories ─────────────────────────────────────────────────────────────

export const Primary: Story = {
  args: { variant: 'primary', size: 'md', children: 'Button' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md', children: 'Button' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md', children: 'Button' },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="primary" size={size}>Primary</Button>
          <Button variant="secondary" size={size}>Secondary</Button>
          <Button variant="ghost" size={size}>Ghost</Button>
        </div>
      ))}
    </div>
  ),
};

// ─── States ───────────────────────────────────────────────────────────────────

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

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
      <Button variant="primary" fullWidth>Primary full width</Button>
      <Button variant="secondary" fullWidth>Secondary full width</Button>
      <Button variant="ghost" fullWidth>Ghost full width</Button>
    </div>
  ),
};
