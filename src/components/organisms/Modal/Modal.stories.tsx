import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal, useModal } from './Modal';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Accessible dialog rendered in a portal at \`document.body\`. Includes:
- **Focus trap** — Tab cycles only through focusable elements inside the modal
- **Scroll lock** — body scroll is disabled while open (multiple modals are safe via a \`Set\` registry)
- **Enter/exit animation** — fade + slide-up on open, reverse on close
- **Keyboard** — \`Escape\` closes the modal
- **Backdrop click** — closes by default; disable with \`closeOnBackdrop={false}\`

Use the \`useModal()\` hook for the open/close state, or manage it yourself.

\`\`\`tsx
import { Modal, useModal, Button } from '@unityui/core';

function DeleteDialog() {
  const modal = useModal();
  return (
    <>
      <Button onClick={modal.open}>Delete</Button>
      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Confirm" size="sm">
        <Modal.Body>This action is permanent.</Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={modal.close}>Cancel</Button>
          <Button onClick={modal.close}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Max-width of the modal panel.',
      table: { defaultValue: { summary: 'md' } },
    },
    title: {
      control: 'text',
      description: 'Heading rendered in the default header. Omit to render a fully custom header via `Modal.Header`.',
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: 'Whether clicking the backdrop closes the modal.',
      table: { defaultValue: { summary: 'true' } },
    },
    isOpen:  { description: 'Controlled open state.' },
    onClose: { description: 'Called when the modal requests to close (Escape, backdrop click, or close button).' },
  },
};
export default meta;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: '#F7F7F7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const modal = useModal();
    return (
      <Page>
        <Button onClick={modal.open}>Open Modal</Button>
        <Modal isOpen={modal.isOpen} onClose={modal.close} title="Confirm action">
          <Modal.Body>
            Are you sure you want to continue? This action cannot be undone and will
            permanently affect your workspace settings.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={modal.close}>Cancel</Button>
            <Button onClick={modal.close}>Confirm</Button>
          </Modal.Footer>
        </Modal>
      </Page>
    );
  },
};

export const Sizes: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null);
    return (
      <Page>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Button key={s} variant="secondary" onClick={() => setSize(s)}>
              {s.toUpperCase()}
            </Button>
          ))}
        </div>
        <Modal
          isOpen={size !== null}
          onClose={() => setSize(null)}
          title={`Modal — ${size?.toUpperCase()}`}
          size={size ?? 'md'}
        >
          <Modal.Body>
            This is a <strong>{size}</strong>-size modal. Resize the window to see how it
            adapts. The max width is capped and the height is scrollable once content
            overflows.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setSize(null)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Page>
    );
  },
};

export const LongContent: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const modal = useModal();
    return (
      <Page>
        <Button onClick={modal.open}>Open scrollable modal</Button>
        <Modal isOpen={modal.isOpen} onClose={modal.close} title="Terms & Conditions" size="lg">
          <Modal.Body>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} style={{ marginTop: i === 0 ? 0 : '16px', color: 'inherit' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
              </p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={modal.close}>Decline</Button>
            <Button onClick={modal.close}>Accept</Button>
          </Modal.Footer>
        </Modal>
      </Page>
    );
  },
};

export const CustomHeader: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const modal = useModal();
    return (
      <Page>
        <Button onClick={modal.open}>Custom header</Button>
        <Modal isOpen={modal.isOpen} onClose={modal.close} size="sm">
          {/* No title prop — we build our own header */}
          <Modal.Header>
            <div>
              <Modal.Title>Delete workspace</Modal.Title>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888', fontFamily: 'inherit' }}>
                This is permanent
              </p>
            </div>
            <Modal.CloseButton onClick={modal.close} aria-label="Close">
              ✕
            </Modal.CloseButton>
          </Modal.Header>
          <Modal.Body>
            Deleting <strong>my-workspace</strong> will remove all data, members, and
            integrations. There is no way to recover it.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={modal.close}>Cancel</Button>
            <Button onClick={modal.close}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Page>
    );
  },
};

export const NoBackdropClose: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const modal = useModal();
    return (
      <Page>
        <Button onClick={modal.open}>Open (backdrop won't close)</Button>
        <Modal
          isOpen={modal.isOpen}
          onClose={modal.close}
          title="Unsaved changes"
          closeOnBackdrop={false}
          size="sm"
        >
          <Modal.Body>
            You have unsaved changes. Please save or discard them before closing.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={modal.close}>Discard</Button>
            <Button onClick={modal.close}>Save</Button>
          </Modal.Footer>
        </Modal>
      </Page>
    );
  },
};
