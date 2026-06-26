import React, { useEffect, useLayoutEffect, useRef, useCallback, useId, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';

// ─── Scroll-lock registry ─────────────────────────────────────────────────────
//
// A Set of open modal IDs instead of a mutable integer counter.
// Safe under concurrent renders, SSR-compatible (Set never touches the DOM
// at module evaluation time), and immune to count desync bugs.

const openModalIds = new Set<string>();

function lockScroll(id: string) {
  openModalIds.add(id);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
}

function unlockScroll(id: string) {
  openModalIds.delete(id);
  if (typeof document !== 'undefined' && openModalIds.size === 0) {
    document.body.style.overflow = '';
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Accessible title — rendered in Modal.Header if provided, otherwise used as aria-label */
  title?: string;
  /** Modal width preset */
  size?: ModalSize;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdrop?: boolean;
  /** Whether Escape key closes the modal */
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

// ─── Animations ───────────────────────────────────────────────────────────────

const backdropIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const backdropOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;
const dialogIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;
const dialogOut = keyframes`
  from { opacity: 1; transform: translateY(0)    scale(1); }
  to   { opacity: 0; transform: translateY(12px) scale(0.98); }
`;

const ANIM_MS = 200;

// ─── Width map ────────────────────────────────────────────────────────────────

const sizeWidth: Record<ModalSize, string> = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const Backdrop = styled.div<{ $closing: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(10, 10, 10, 0.55);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing[6]};

  animation: ${({ $closing }) => ($closing ? backdropOut : backdropIn)}
    ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const DialogEl = styled.div<{ $closing: boolean; $size: ModalSize }>`
  position: relative;
  width: min(${({ $size }) => sizeWidth[$size]}, 100%);
  background-color: ${colors.bgPage};
  border: ${borderWidth[1]} solid ${colors.borderDefault};
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 24px 48px -8px rgba(0, 0, 0, 0.22);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - ${spacing[12]});
  overflow: hidden;

  animation: ${({ $closing }) => ($closing ? dialogOut : dialogIn)}
    ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

// ─── Sub-component styled ─────────────────────────────────────────────────────

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[5]} ${spacing[6]};
  border-bottom: ${borderWidth[1]} solid ${colors.borderDefault};
  flex-shrink: 0;
  gap: ${spacing[4]};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-family: ${fontFamily.base};
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textPrimary};
  letter-spacing: ${letterSpacing.tight};
  line-height: 1.2;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: color 160ms cubic-bezier(0.4, 0, 0.2, 1),
              background-color 160ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: ${colors.textPrimary};
    background-color: ${colors.grey100};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const ModalBody = styled.div`
  padding: ${spacing[6]};
  overflow-y: auto;
  flex: 1;

  /* Text defaults */
  font-family: ${fontFamily.base};
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  line-height: 1.6;

  /* Thin Swiss scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${colors.grey200} transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${colors.grey200}; }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${spacing[3]};
  padding: ${spacing[4]} ${spacing[6]};
  border-top: ${borderWidth[1]} solid ${colors.borderDefault};
  flex-shrink: 0;
`;

// ─── Close SVG ────────────────────────────────────────────────────────────────

function CloseSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

// ─── Modal component ──────────────────────────────────────────────────────────

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
}: ModalProps) {
  const [closing, setClosing] = useState(false);
  const dialogRef    = useRef<HTMLDivElement>(null);
  const titleId      = useId();
  const modalId      = useId(); // stable ID for the scroll-lock registry
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // ── Animated close — guard prevents double-invocation (e.g. Escape + backdrop
  //    click fired in the same frame both calling handleClose) ──
  const handleClose = useCallback(() => {
    setClosing((alreadyClosing) => {
      if (alreadyClosing) return alreadyClosing; // already in flight — bail out
      setTimeout(() => {
        setClosing(false);
        onClose();
      }, ANIM_MS);
      return true;
    });
  }, [onClose]);

  // ── Escape key ──
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeOnEscape, handleClose]);

  // ── Focus management + body scroll lock ──
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      lockScroll(modalId);
    } else {
      unlockScroll(modalId);
      prevFocusRef.current?.focus();
    }
    return () => {
      // Always clean up on unmount regardless of isOpen state
      unlockScroll(modalId);
    };
  }, [isOpen, modalId]);

  // ── Initial focus — useLayoutEffect + rAF ensures the dialog is painted
  //    before we query focusable elements, avoiding the setTimeout(10) hack ──
  useLayoutEffect(() => {
    if (!isOpen) return;
    const rafId = requestAnimationFrame(() => {
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    });
    return () => cancelAnimationFrame(rafId);
  }, [isOpen]);

  // ── Focus trap ──
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen && !closing) return null;

  return createPortal(
    <Backdrop
      $closing={closing}
      onClick={closeOnBackdrop ? handleClose : undefined}
    >
      <DialogEl
        ref={dialogRef}
        $closing={closing}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? 'Dialog' : undefined}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        {/* Auto-rendered header when title prop is supplied */}
        {title && (
          <ModalHeader>
            <ModalTitle id={titleId}>{title}</ModalTitle>
            <CloseButton onClick={handleClose} aria-label="Close dialog">
              <CloseSvg />
            </CloseButton>
          </ModalHeader>
        )}

        {children}
      </DialogEl>
    </Backdrop>,
    document.body,
  );
}

// Attach compound sub-components as static properties
Modal.Header  = ModalHeader;
Modal.Title   = ModalTitle;
Modal.Body    = ModalBody;
Modal.Footer  = ModalFooter;

// Re-export close button for advanced use (custom header layout)
Modal.CloseButton = CloseButton;

// ─── useModal hook ────────────────────────────────────────────────────────────

export function useModal(initialOpen = false, onOpenChange?: (open: boolean) => void) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => { onOpenChangeRef.current = onOpenChange; }, [onOpenChange]);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChangeRef.current?.(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChangeRef.current?.(false);
  }, []);
  const toggle = useCallback(() => {
    setIsOpen((v) => {
      const next = !v;
      onOpenChangeRef.current?.(next);
      return next;
    });
  }, []);
  return { isOpen, open, close, toggle };
}
