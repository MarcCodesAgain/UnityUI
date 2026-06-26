import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Native \`<select>\` with a custom chevron, animated accent line on focus, and the same label/hint/error API as \`Input\`.

The chevron rotates 180° on focus via a CSS sibling selector — zero JavaScript.

\`\`\`tsx
import { Select } from '@unityui/core';

<Select
  label="Role"
  placeholder="Select your role…"
  options={[
    { value: 'designer', label: 'Designer' },
    { value: 'dev',      label: 'Developer' },
  ]}
  fullWidth
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size:      {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '`sm` = 32px · `md` = 40px · `lg` = 48px.',
      table: { defaultValue: { summary: 'md' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands the wrapper to 100% of its container.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Greys out the field and disables interaction.',
      table: { defaultValue: { summary: 'false' } },
    },
    label:   { control: 'text', description: 'Uppercase mono label rendered above the field.' },
    hint:    { control: 'text', description: 'Helper text shown below in the default state.' },
    error:   { control: 'text', description: 'Replaces hint with error text and applies red styles.' },
    success: { control: 'text', description: 'Replaces hint with success text and applies green styles.' },
    placeholder: { control: 'text', description: 'Disabled placeholder `<option>` shown when no value is selected.' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// ─── Shared options ───────────────────────────────────────────────────────────

const COUNTRIES = [
  { value: 'es', label: 'Spain' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
];

const ROLES = [
  { value: 'designer',   label: 'Designer' },
  { value: 'frontend',   label: 'Frontend Developer' },
  { value: 'backend',    label: 'Backend Developer' },
  { value: 'pm',         label: 'Product Manager' },
  { value: 'lead',       label: 'Tech Lead' },
];

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country…',
    options: COUNTRIES,
    hint: 'Where are you based?',
    size: 'md',
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
      <Select label="Small"  size="sm" options={COUNTRIES} placeholder="Select…" />
      <Select label="Medium" size="md" options={COUNTRIES} placeholder="Select…" />
      <Select label="Large"  size="lg" options={COUNTRIES} placeholder="Select…" />
    </div>
  ),
};

// ─── All states ───────────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
      <Select
        label="Default"
        options={COUNTRIES}
        placeholder="Select a country…"
        hint="Where are you currently based?"
      />
      <Select
        label="Error"
        options={COUNTRIES}
        placeholder="Select a country…"
        error="Please select a valid country"
      />
      <Select
        label="Success"
        options={COUNTRIES}
        defaultValue="es"
        success="Great choice"
      />
      <Select
        label="Disabled"
        options={COUNTRIES}
        placeholder="Not available"
        hint="This field is locked"
        disabled
      />
    </div>
  ),
};

// ─── Full width ───────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <Select label="Role"    options={ROLES}     placeholder="Select your role…"    fullWidth />
      <Select label="Country" options={COUNTRIES} placeholder="Select your country…" fullWidth />
    </div>
  ),
};

// ─── In context — profile form ────────────────────────────────────────────────

export const ProfileForm: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '400px',
      padding: 'clamp(16px, 4vw, 40px)',
      border: `1px solid #DEDEDE`,
    }}>
      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', margin: 0 }}>
        UnityUI · Profile
      </p>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', margin: 0, letterSpacing: '-0.02em' }}>
        Your details
      </h2>
      <Select
        label="Role"
        options={ROLES}
        placeholder="What do you do?"
        fullWidth
      />
      <Select
        label="Country"
        options={COUNTRIES}
        placeholder="Where are you based?"
        fullWidth
      />
      <Select
        label="Experience"
        options={[
          { value: 'junior',  label: '0–2 years' },
          { value: 'mid',     label: '2–5 years' },
          { value: 'senior',  label: '5–10 years' },
          { value: 'staff',   label: '10+ years' },
        ]}
        placeholder="Years of experience"
        fullWidth
      />
    </div>
  ),
};
