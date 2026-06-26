import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Text field with label, hint text, and three validation states.

On focus, an Electric Blue accent line sweeps from center outward along the bottom border.
The line changes colour to match the current state: blue (default), red (error), green (success).

\`\`\`tsx
import { Input } from '@unityui/core';

<Input
  label="Email"
  placeholder="you@example.com"
  hint="We'll never share your email."
  type="email"
  fullWidth
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '`sm` = 32px height · `md` = 40px · `lg` = 48px.',
      table: { defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Uppercase mono label rendered above the field.',
    },
    placeholder: {
      control: 'text',
      description: 'Native placeholder — shown when the field is empty.',
    },
    hint: {
      control: 'text',
      description: 'Helper text shown below the field in the default (non-error) state.',
    },
    error: {
      control: 'text',
      description: 'Overrides `hint` with error text and applies red border + accent line.',
    },
    success: {
      control: 'text',
      description: 'Overrides `hint` with success text and applies green border + accent line.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field with a grey background and `not-allowed` cursor.',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands the wrapper to 100% of its container.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ─── Playground ───────────────────────────────────────────────────────────────

/** Click the input to see the accent-line animation. */
export const Playground: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    hint: "We'll never share your email.",
    size: 'md',
  },
};

// ─── All states ───────────────────────────────────────────────────────────────

/**
 * Every state the Input can be in.
 * Focus any field to see the bottom-border accent-line sweep.
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', maxWidth: '400px' }}>
      <Input
        label="Default"
        placeholder="Type something…"
        hint="Helper text appears here"
      />
      <Input
        label="Error"
        placeholder="invalid@"
        error="Enter a valid email address"
        defaultValue="invalid@"
      />
      <Input
        label="Success"
        placeholder="you@example.com"
        success="Email is available"
        defaultValue="marc@unityui.dev"
      />
      <Input
        label="Disabled"
        placeholder="Not editable"
        hint="This field is locked"
        disabled
        defaultValue="locked value"
      />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Default → Error → Success → Disabled.' } },
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

/** Three heights to match your layout density. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px' }}>
      <Input label="Small"  size="sm" placeholder="sm — 32px height" />
      <Input label="Medium" size="md" placeholder="md — 40px height" />
      <Input label="Large"  size="lg" placeholder="lg — 48px height" />
    </div>
  ),
};

// ─── Full width ───────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Input label="Full name" placeholder="Marc Llopis" fullWidth />
      <Input label="Email"     placeholder="marc@example.com" fullWidth />
    </div>
  ),
};

// ─── In context — login form ──────────────────────────────────────────────────

/** Inputs inside a real card layout. Note how the accent line aligns with the card border. */
export const LoginForm: Story = {
  render: () => (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      padding: '40px',
      border: '1px solid #DEDEDE',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      <div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', margin: '0 0 8px' }}>
          UnityUI · Sign in
        </p>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '28px', margin: 0, letterSpacing: '-0.02em' }}>
          Welcome back
        </h2>
      </div>
      <Input label="Email"    placeholder="you@example.com" fullWidth type="email" />
      <Input label="Password" placeholder="••••••••"        fullWidth type="password" />
      <Input
        label="Email"
        placeholder="taken@example.com"
        fullWidth
        error="This email is already registered"
        defaultValue="taken@example.com"
      />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Inputs composed inside a sign-in card.' } },
  },
};
