import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Alert } from './Alert';
import { Button } from '../Button';

const meta: Meta<typeof Alert> = {
  title: 'Atoms/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Feedback banner for system messages. Four semantic variants with a coloured left-border indicator.
Supports an optional title, rich children, and a dismiss button.

\`\`\`tsx
import { Alert } from '@unityui/core';

<Alert variant="success" title="Saved" onDismiss={() => setVisible(false)}>
  Your changes have been saved successfully.
</Alert>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Determines the left-border accent colour and semantic meaning.',
      table: { defaultValue: { summary: 'info' } },
    },
    title: {
      control: 'text',
      description: 'Bold heading rendered above the body text. Optional.',
    },
    onDismiss: {
      description: 'When provided, a dismiss (✕) button appears in the top-right corner.',
    },
    children: {
      control: 'text',
      description: 'Alert body — any React node.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'info',
    title: 'Heads up',
    children: 'This component is part of the UnityUI design system.',
  },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '520px' }}>
      <Alert variant="info" title="Information">
        Your profile has been updated and is pending review.
      </Alert>
      <Alert variant="success" title="Success">
        Changes saved. Your design system is now live.
      </Alert>
      <Alert variant="warning" title="Warning">
        This action cannot be undone. Please review before continuing.
      </Alert>
      <Alert variant="error" title="Error">
        Failed to save changes. Please check your connection and try again.
      </Alert>
    </div>
  ),
};

// ─── Without title ────────────────────────────────────────────────────────────

export const WithoutTitle: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '520px' }}>
      <Alert variant="info">Your session will expire in 10 minutes.</Alert>
      <Alert variant="success">Email verified successfully.</Alert>
      <Alert variant="warning">You have unsaved changes.</Alert>
      <Alert variant="error">Invalid email or password.</Alert>
    </div>
  ),
};

// ─── Dismissible ──────────────────────────────────────────────────────────────

export const Dismissible: Story = {
  render: () => {
    const [alerts, setAlerts] = useState([
      { id: 1, variant: 'info'    as const, title: 'Update available',   msg: 'UnityUI v0.2.0 is ready to install.' },
      { id: 2, variant: 'success' as const, title: 'Deploy complete',    msg: 'Your app is live at unityui.dev.' },
      { id: 3, variant: 'warning' as const, title: 'Storage almost full',msg: '85% of your quota is used.' },
      { id: 4, variant: 'error'   as const, title: 'Build failed',       msg: 'Check the logs for more details.' },
    ]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '520px' }}>
        {alerts.length === 0 && (
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#888' }}>
            All alerts dismissed.
          </p>
        )}
        {alerts.map(({ id, variant, title, msg }) => (
          <Alert
            key={id}
            variant={variant}
            title={title}
            onDismiss={() => setAlerts((prev) => prev.filter((a) => a.id !== id))}
          >
            {msg}
          </Alert>
        ))}
      </div>
    );
  },
};

// ─── In context — form feedback ───────────────────────────────────────────────

export const FormFeedback: Story = {
  render: () => {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
        {status === 'success' && (
          <Alert variant="success" title="Submitted" onDismiss={() => setStatus('idle')}>
            Your form was submitted successfully.
          </Alert>
        )}
        {status === 'error' && (
          <Alert variant="error" title="Submission failed" onDismiss={() => setStatus('idle')}>
            Please fill in all required fields and try again.
          </Alert>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" size="sm" onClick={() => setStatus('success')}>
            Simulate success
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setStatus('error')}>
            Simulate error
          </Button>
        </div>
      </div>
    );
  },
};
