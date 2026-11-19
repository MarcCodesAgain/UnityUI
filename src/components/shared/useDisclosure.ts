import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Open/close state shared by Modal and CommandPalette. `onOpenChange` is
 * called outside React's state updater, so it fires exactly once per change
 * (updaters may run twice — always in StrictMode). A ref mirrors the state so
 * consecutive toggles in the same tick still flip correctly.
 */
export function useDisclosure(initialOpen = false, onOpenChange?: (open: boolean) => void) {
  const [isOpen, setIsOpenState] = useState(initialOpen);
  const isOpenRef = useRef(initialOpen);
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => { onOpenChangeRef.current = onOpenChange; }, [onOpenChange]);

  const setOpen = useCallback((next: boolean) => {
    isOpenRef.current = next;
    setIsOpenState(next);
    onOpenChangeRef.current?.(next);
  }, []);

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen(!isOpenRef.current), [setOpen]);

  return { isOpen, open, close, onClose: close, toggle };
}
