import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form, type FormValues } from './Form';

const meta: Meta<typeof Form> = {
  title: 'Organisms/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Config-driven form that handles field rendering, built-in validation, loading states, and success messages.
Pass a \`fields\` array and an \`onSubmit\` handler — the form does the rest.

**Supported field types:** \`input\` · \`select\` · \`checkbox\` · \`radio\` · \`textarea\`

**Built-in validation:** required fields, email format. Errors appear on submit and clear as the user types.

\`\`\`tsx
import { Form, type FormValues } from '@unityui/core';

<Form
  title="Sign up"
  submitLabel="Create account →"
  successMessage="Welcome!"
  onSubmit={async (values: FormValues) => {
    await api.createUser(values);
  }}
  fields={[
    { name: 'email', type: 'input', inputType: 'email', label: 'Email', required: true },
    { name: 'terms', type: 'checkbox', checkboxLabel: 'I agree to the Terms', required: true },
  ]}
/>
\`\`\`

**Custom layouts** — use the exported primitives \`FieldWrapper\`, \`FieldLabel\`, \`FieldHint\`,
\`FieldError\`, and \`FieldRow\` to compose your own multi-column or conditional forms.
        `,
      },
    },
  },
  argTypes: {
    title:          { control: 'text', description: 'Optional form heading rendered as `h4`.' },
    description:    { control: 'text', description: 'Optional subtitle shown below the title.' },
    submitLabel:    { control: 'text', description: 'Label for the submit button.', table: { defaultValue: { summary: 'Submit' } } },
    successMessage: { control: 'text', description: 'Shown inside a success Alert after a successful submit.' },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

// ─── Sign up ──────────────────────────────────────────────────────────────────

export const SignUp: Story = {
  render: () => (
    <div style={{ maxWidth: '420px', width: '100%' }}>
      <Form
        title="Create account"
        description="Join UnityUI and start building."
        submitLabel="Create account →"
        successMessage="Account created! Welcome to UnityUI."
        onSubmit={async (values: FormValues) => {
          await new Promise((r) => setTimeout(r, 1200));
          console.log('Submitted:', values);
        }}
        fields={[
          {
            name: 'name',
            type: 'input',
            label: 'Full name',
            placeholder: 'Marc Llopis',
            required: true,
          },
          {
            name: 'email',
            type: 'input',
            label: 'Email',
            inputType: 'email',
            placeholder: 'you@example.com',
            required: true,
          },
          {
            name: 'password',
            type: 'input',
            label: 'Password',
            inputType: 'password',
            placeholder: '••••••••',
            required: true,
            hint: 'At least 8 characters',
          },
          {
            name: 'terms',
            type: 'checkbox',
            checkboxLabel: 'I agree to the Terms of Service',
            required: true,
          },
        ]}
      />
    </div>
  ),
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const ProfileEdit: Story = {
  render: () => (
    <div style={{ maxWidth: '420px', width: '100%' }}>
      <Form
        title="Your profile"
        description="Update your details at any time."
        submitLabel="Save changes"
        successMessage="Profile updated successfully."
        initialValues={{ role: 'frontend', country: 'es', newsletter: true }}
        onSubmit={async (values: FormValues) => {
          await new Promise((r) => setTimeout(r, 800));
          console.log('Saved:', values);
        }}
        fields={[
          {
            name: 'name',
            type: 'input',
            label: 'Full name',
            placeholder: 'Marc Llopis',
            required: true,
          },
          {
            name: 'bio',
            type: 'textarea',
            label: 'Bio',
            placeholder: 'Tell us about yourself…',
            rows: 3,
            hint: 'Max 200 characters',
          },
          {
            name: 'role',
            type: 'select',
            label: 'Role',
            placeholder: 'Select your role…',
            required: true,
            options: [
              { value: 'designer',  label: 'Designer' },
              { value: 'frontend',  label: 'Frontend Developer' },
              { value: 'backend',   label: 'Backend Developer' },
              { value: 'pm',        label: 'Product Manager' },
              { value: 'lead',      label: 'Tech Lead' },
            ],
          },
          {
            name: 'country',
            type: 'select',
            label: 'Country',
            placeholder: 'Where are you based?',
            options: [
              { value: 'es', label: 'Spain' },
              { value: 'de', label: 'Germany' },
              { value: 'fr', label: 'France' },
              { value: 'jp', label: 'Japan' },
              { value: 'us', label: 'United States' },
            ],
          },
          {
            name: 'newsletter',
            type: 'checkbox',
            checkboxLabel: 'Send me product updates',
            hint: 'Optional — unsubscribe anytime',
          },
        ]}
      />
    </div>
  ),
};

// ─── Feedback ─────────────────────────────────────────────────────────────────

export const Feedback: Story = {
  render: () => (
    <div style={{ maxWidth: '420px', width: '100%' }}>
      <Form
        title="Share feedback"
        description="Help us improve UnityUI."
        submitLabel="Send feedback"
        successMessage="Thanks! We'll review your feedback shortly."
        onSubmit={async (values: FormValues) => {
          await new Promise((r) => setTimeout(r, 600));
          console.log('Feedback:', values);
        }}
        fields={[
          {
            name: 'type',
            type: 'radio',
            label: 'Feedback type',
            required: true,
            direction: 'horizontal',
            options: [
              { value: 'bug',     label: 'Bug' },
              { value: 'feature', label: 'Feature request' },
              { value: 'other',   label: 'Other' },
            ],
          },
          {
            name: 'rating',
            type: 'select',
            label: 'Rating',
            placeholder: 'How would you rate it?',
            required: true,
            options: [
              { value: '5', label: '⭐⭐⭐⭐⭐ Excellent' },
              { value: '4', label: '⭐⭐⭐⭐ Good' },
              { value: '3', label: '⭐⭐⭐ Average' },
              { value: '2', label: '⭐⭐ Poor' },
              { value: '1', label: '⭐ Terrible' },
            ],
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Describe the issue or idea…',
            required: true,
            rows: 4,
          },
          {
            name: 'email',
            type: 'input',
            label: 'Email',
            inputType: 'email',
            placeholder: 'Optional — for follow-up',
            hint: 'We\'ll only use this to reply',
          },
        ]}
      />
    </div>
  ),
};

// ─── Minimal — just 2 fields ──────────────────────────────────────────────────

export const Minimal: Story = {
  render: () => (
    <div style={{ maxWidth: '360px', width: '100%' }}>
      <Form
        submitLabel="Subscribe →"
        successMessage="You're subscribed!"
        onSubmit={async (values: FormValues) => {
          await new Promise((r) => setTimeout(r, 600));
          console.log(values);
        }}
        fields={[
          {
            name: 'email',
            type: 'input',
            label: 'Email',
            inputType: 'email',
            placeholder: 'you@example.com',
            required: true,
          },
          {
            name: 'consent',
            type: 'checkbox',
            checkboxLabel: 'I agree to receive updates',
            required: true,
          },
        ]}
      />
    </div>
  ),
};
