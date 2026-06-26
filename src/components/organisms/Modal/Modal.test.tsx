import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { Modal, useModal } from './Modal';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Modal', () => {
  it('renders nothing when closed', () => {
    wrap(<Modal isOpen={false} onClose={() => {}}><Modal.Body>Content</Modal.Body></Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    wrap(<Modal isOpen onClose={() => {}}><Modal.Body>Content</Modal.Body></Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    wrap(
      <Modal isOpen onClose={() => {}} title="Hello World">
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders children', () => {
    wrap(
      <Modal isOpen onClose={() => {}}>
        <Modal.Body>Modal body text</Modal.Body>
      </Modal>,
    );
    expect(screen.getByText('Modal body text')).toBeInTheDocument();
  });

  it('renders Modal.Footer children', () => {
    wrap(
      <Modal isOpen onClose={() => {}}>
        <Modal.Body>Content</Modal.Body>
        <Modal.Footer><button>Confirm</button></Modal.Footer>
      </Modal>,
    );
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    wrap(<Modal isOpen onClose={onClose}><Modal.Body>Content</Modal.Body></Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does not call onClose on Escape when closeOnEscape=false', async () => {
    const onClose = vi.fn();
    wrap(
      <Modal isOpen onClose={onClose} closeOnEscape={false}>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    // wait a tick — onClose should NOT be called
    await new Promise((r) => setTimeout(r, 50));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    wrap(
      <Modal isOpen onClose={onClose} title="Test">
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('has aria-modal attribute', () => {
    wrap(<Modal isOpen onClose={() => {}}><Modal.Body>Content</Modal.Body></Modal>);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('links aria-labelledby to title when title is provided', () => {
    wrap(
      <Modal isOpen onClose={() => {}} title="Accessible title">
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleEl = document.getElementById(labelledById!);
    expect(titleEl?.textContent).toBe('Accessible title');
  });
});
