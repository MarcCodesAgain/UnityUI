import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useModal } from '../organisms/Modal';
import { useCommandPalette } from '../organisms/CommandPalette';

const strict = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;

describe.each([
  ['useModal', (cb: (open: boolean) => void) => useModal(false, cb)],
  ['useCommandPalette', (cb: (open: boolean) => void) => useCommandPalette(cb)],
])('%s', (_name, useHook) => {
  it('notifies onOpenChange exactly once per change, even in StrictMode', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useHook(onOpenChange), { wrapper: strict });

    act(() => result.current.toggle());
    act(() => result.current.toggle());
    act(() => result.current.open());
    act(() => result.current.close());

    expect(onOpenChange.mock.calls).toEqual([[true], [false], [true], [false]]);
    expect(result.current.isOpen).toBe(false);
  });

  it('flips correctly when toggled twice in the same tick', () => {
    const { result } = renderHook(() => useHook(() => {}), { wrapper: strict });
    act(() => {
      result.current.toggle();
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
