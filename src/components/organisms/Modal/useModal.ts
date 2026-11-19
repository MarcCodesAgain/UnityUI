import { useDisclosure } from '../../shared/useDisclosure';

/** Open/close state for a Modal: `const modal = useModal(); <Modal isOpen={modal.isOpen} onClose={modal.close} />` */
export function useModal(initialOpen = false, onOpenChange?: (open: boolean) => void) {
  return useDisclosure(initialOpen, onOpenChange);
}
