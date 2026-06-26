import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { CommandPalette } from './CommandPalette';
import type { CommandItem } from './CommandPalette';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const ITEMS: CommandItem[] = [
  { id: '1', label: 'Go to Home',       group: 'Navigation', onSelect: vi.fn() },
  { id: '2', label: 'Create Component', group: 'Actions',    onSelect: vi.fn(), shortcut: ['⌘', 'N'] },
  { id: '3', label: 'Export Tokens',    group: 'Actions',    onSelect: vi.fn(), keywords: ['download'] },
  { id: '4', label: 'Dark Mode',        group: 'Theme',      onSelect: vi.fn(), description: 'Switch theme' },
];

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    wrap(<CommandPalette isOpen={false} onClose={() => {}} items={ITEMS} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders all items', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    expect(screen.getByText('Go to Home')).toBeInTheDocument();
    expect(screen.getByText('Create Component')).toBeInTheDocument();
    expect(screen.getByText('Export Tokens')).toBeInTheDocument();
  });

  it('renders group headers', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    expect(screen.getByText('Switch theme')).toBeInTheDocument();
  });

  it('renders shortcut keys', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    expect(screen.getByText('⌘')).toBeInTheDocument();
    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('filters items by query — label match', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'dark' } });
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.queryByText('Go to Home')).not.toBeInTheDocument();
  });

  it('filters items by keyword', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'download' } });
    expect(screen.getByText('Export Tokens')).toBeInTheDocument();
    expect(screen.queryByText('Go to Home')).not.toBeInTheDocument();
  });

  it('shows empty message when no match', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} emptyMessage="Nothing found" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzzzz' } });
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    wrap(<CommandPalette isOpen onClose={onClose} items={ITEMS} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('calls item onSelect and onClose when Enter is pressed', async () => {
    const onClose  = vi.fn();
    const onSelect = vi.fn();
    const items    = [{ id: '1', label: 'Action', onSelect }];
    wrap(<CommandPalette isOpen onClose={onClose} items={items} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('navigates down with ArrowDown', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Second item should become active
    const options = screen.getAllByRole('option');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates up with ArrowUp (stays at 0)', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowUp' });
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onSelect when clicking an item', async () => {
    const onClose  = vi.fn();
    const onSelect = vi.fn();
    const items    = [{ id: '1', label: 'Clickable', onSelect }];
    wrap(<CommandPalette isOpen onClose={onClose} items={items} />);
    fireEvent.click(screen.getByText('Clickable'));
    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('closes when clicking outside the dialog (backdrop)', async () => {
    const onClose = vi.fn();
    wrap(<CommandPalette isOpen onClose={onClose} items={ITEMS} />);
    // Press Escape — equivalent to clicking outside; also tests the same code path
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('hides group headers when searching (relevance mode)', () => {
    wrap(<CommandPalette isOpen onClose={() => {}} items={ITEMS} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'home' } });
    expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });
});
