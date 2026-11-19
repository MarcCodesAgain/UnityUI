import { useEffect } from 'react';
import { useDisclosure } from '../../shared/useDisclosure';

/**
 * Manages open/close state and registers the global ⌘K / Ctrl+K shortcut.
 * Usage:
 *   const cmd = useCommandPalette();
 *   <CommandPalette {...cmd} items={ITEMS} />
 */
export function useCommandPalette(onOpenChange?: (open: boolean) => void) {
  const disclosure = useDisclosure(false, onOpenChange);
  const { toggle } = disclosure;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [toggle]);

  return disclosure;
}
