import styled, { keyframes } from 'styled-components';
import { useState, useEffect, useRef, useCallback, useMemo, useId } from 'react';
import { filterAndGroup } from './fuzzySearch';
import { createPortal } from 'react-dom';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  /** Small icon / emoji / ReactNode shown left of the label */
  icon?: React.ReactNode;
  /** Group name — items with the same group are listed together */
  group?: string;
  /** Keyboard shortcut hints, e.g. ['⌘', 'K'] */
  shortcut?: string[];
  /** Extra terms that boost this item in search */
  keywords?: string[];
  onSelect: () => void;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  /** Placeholder for the search input */
  placeholder?: string;
  /** Shown when no items match the query */
  emptyMessage?: string;
}

// ─── useCommandPalette hook ───────────────────────────────────────────────────
//
// Manages open/close state and registers the global ⌘K / Ctrl+K shortcut.
// Usage:
//   const cmd = useCommandPalette();
//   <CommandPalette {...cmd} items={ITEMS} />

export function useCommandPalette(onOpenChange?: (open: boolean) => void) {
  const [isOpen, setIsOpen] = useState(false);

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

  // Global ⌘K / Ctrl+K
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

  return { isOpen, open, close, toggle };
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

const paletteIn = keyframes`
  from { opacity: 0; transform: translateY(-16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)     scale(1); }
`;

const paletteOut = keyframes`
  from { opacity: 1; transform: translateY(0)     scale(1); }
  to   { opacity: 0; transform: translateY(-8px)  scale(0.98); }
`;

const ANIM_MS = 180;

// ─── Styled ───────────────────────────────────────────────────────────────────

const Backdrop = styled.div<{ $closing: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(10, 10, 10, 0.5);
  z-index: 9998;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(60px, 12vh, 140px);

  animation: ${({ $closing }) => ($closing ? backdropOut : backdropIn)}
    ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

const Dialog = styled.div<{ $closing: boolean }>`
  position: relative;
  width: min(640px, calc(100vw - ${spacing[8]}));
  background-color: ${colors.bgPage};
  border: ${borderWidth[1]} solid ${colors.borderDefault};
  box-shadow:
    0 4px 6px -1px rgba(0,0,0,0.08),
    0 20px 40px -8px rgba(0,0,0,0.18);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  max-height: min(480px, 70vh);
  overflow: hidden;

  animation: ${({ $closing }) => ($closing ? paletteOut : paletteIn)}
    ${ANIM_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
`;

// Search row
const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[4]} ${spacing[5]};
  border-bottom: ${borderWidth[1]} solid ${colors.borderDefault};
  flex-shrink: 0;
`;

const SearchIcon = styled.span`
  flex-shrink: 0;
  color: ${colors.textSecondary};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${fontFamily.base};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.regular};
  color: ${colors.textPrimary};
  caret-color: ${colors.primary};

  &::placeholder {
    color: ${colors.textDisabled};
  }
`;

// Results list
const ResultsList = styled.ul`
  list-style: none;
  overflow-y: auto;
  flex: 1;
  padding: ${spacing[2]} 0;
  margin: 0;

  /* Scrollbar — thin, Swiss */
  scrollbar-width: thin;
  scrollbar-color: ${colors.grey200} transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: ${colors.grey200}; }
`;

const GroupHeader = styled.li`
  padding: ${spacing[2]} ${spacing[5]};
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${colors.textSecondary};
  user-select: none;
`;

const Item = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[3]} ${spacing[5]};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  /* Text color transitions in sync with the fill */
  color: ${({ $active }) => ($active ? colors.white : colors.textPrimary)};
  transition: color 280ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Electric Blue fill — expands left → right, same mechanic as Table row + Typography highlight */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: ${colors.primary};
    transform: ${({ $active }) => ($active ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: left center;
    transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 0;
  }

  /* Hover — pre-warms the fill slightly so it reacts immediately */
  &:hover::after {
    transform: scaleX(1);
  }
  &:hover {
    color: ${colors.white};
  }
`;

const ItemIcon = styled.span<{ $active: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize.base};
  /* Icon color follows text via inheritance — no separate prop needed */
  position: relative;
  z-index: 1;
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  position: relative;
  z-index: 1;
`;

const ItemLabel = styled.span`
  font-family: ${fontFamily.base};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDescription = styled.span<{ $active: boolean }>`
  font-family: ${fontFamily.base};
  font-size: ${fontSize.xs};
  color: ${({ $active }) => ($active ? 'rgba(255,255,255,0.7)' : colors.textSecondary)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 100ms ease;
`;

const ShortcutGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const Kbd = styled.kbd<{ $active: boolean }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.medium};
  padding: 2px ${spacing[2]};
  border: ${borderWidth[1]} solid ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.4)' : colors.borderDefault};
  background-color: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.15)' : colors.bgSurface};
  color: ${({ $active }) => ($active ? colors.white : colors.textSecondary)};
  line-height: 1.4;
  transition: all 100ms ease;
`;

const Empty = styled.div`
  padding: ${spacing[10]} ${spacing[5]};
  text-align: center;
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  letter-spacing: ${letterSpacing.wide};
`;

// Footer hint bar
const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  padding: ${spacing[2]} ${spacing[5]};
  border-top: ${borderWidth[1]} solid ${colors.borderDefault};
  flex-shrink: 0;
`;

const FooterHint = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  font-family: ${fontFamily.mono};
  font-size: 10px;
  color: ${colors.textSecondary};
  letter-spacing: ${letterSpacing.wide};
`;

const FooterKbd = styled.kbd`
  font-family: ${fontFamily.mono};
  font-size: 10px;
  padding: 1px 4px;
  border: 1px solid ${colors.borderDefault};
  background-color: ${colors.bgSurface};
  color: ${colors.textSecondary};
  line-height: 1.4;
`;

// ─── SVG icons ────────────────────────────────────────────────────────────────

function SearchSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

// ─── CommandPalette component ─────────────────────────────────────────────────

export function CommandPalette({
  isOpen,
  onClose,
  items,
  placeholder = 'Search commands…',
  emptyMessage = 'No results',
}: CommandPaletteProps) {
  const [query,       setQuery]       = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [closing,     setClosing]     = useState(false);

  const inputRef    = useRef<HTMLInputElement>(null);
  const listRef     = useRef<HTMLUListElement>(null);
  const dialogRef   = useRef<HTMLDivElement>(null);
  const titleId     = useId();

  // ── Filtered / grouped results ──
  const groups = useMemo(() => filterAndGroup(items, query), [items, query]);
  const flatItems = useMemo(
    () => groups.flatMap(({ items: g }) => g),
    [groups],
  );

  // Pre-compute item → flat-index map so the render loop avoids mutable counters
  const itemIndexMap = useMemo(
    () => new Map(flatItems.map((item, i) => [item.id, i])),
    [flatItems],
  );

  // ── Close with exit animation — guard prevents double-invocation ──
  const handleClose = useCallback(() => {
    setClosing((alreadyClosing) => {
      if (alreadyClosing) return alreadyClosing;
      setTimeout(() => {
        setClosing(false);
        setQuery('');
        setActiveIndex(0);
        onClose();
      }, ANIM_MS);
      return true;
    });
  }, [onClose]);

  // ── Reset state on open ──
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // ── Keep active item scrolled into view ──
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector('[data-active="true"]');
    if (active && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // ── Reset activeIndex when results change ──
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // ── Keyboard navigation ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatItems[activeIndex]) {
          flatItems[activeIndex].onSelect();
          handleClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        break;
    }
  };

  // ── Focus trap: keep Tab inside dialog ──
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])',
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
      onClick={handleClose}
    >
      <Dialog
        ref={dialogRef}
        $closing={closing}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        {/* Search input */}
        <SearchRow>
          <SearchIcon aria-hidden="true"><SearchSvg /></SearchIcon>
          <SearchInput
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="cmd-listbox"
            aria-activedescendant={
              flatItems[activeIndex] ? `cmd-item-${flatItems[activeIndex].id}` : undefined
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
        </SearchRow>

        {/* Results */}
        <ResultsList
          ref={listRef}
          id="cmd-listbox"
          role="listbox"
          aria-label="Commands"
        >
          {flatItems.length === 0 ? (
            <Empty>{emptyMessage}</Empty>
          ) : (
            groups.map(({ group, items: gItems }) => (
              <div key={group ?? '__ungrouped'}>
                {group && <GroupHeader role="presentation">{group}</GroupHeader>}
                {gItems.map((item) => {
                  const idx      = itemIndexMap.get(item.id)!;
                  const isActive = idx === activeIndex;
                  return (
                    <Item
                      key={item.id}
                      id={`cmd-item-${item.id}`}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      $active={isActive}
                      onClick={() => { item.onSelect(); handleClose(); }}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      {item.icon && (
                        <ItemIcon $active={isActive} aria-hidden="true">
                          {item.icon}
                        </ItemIcon>
                      )}
                      <ItemContent>
                        <ItemLabel>{item.label}</ItemLabel>
                        {item.description && (
                          <ItemDescription $active={isActive}>
                            {item.description}
                          </ItemDescription>
                        )}
                      </ItemContent>
                      {item.shortcut && (
                        <ShortcutGroup aria-label={`Shortcut: ${item.shortcut.join(' ')}`}>
                          {item.shortcut.map((k, i) => (
                            <Kbd key={i} $active={isActive}>{k}</Kbd>
                          ))}
                        </ShortcutGroup>
                      )}
                    </Item>
                  );
                })}
              </div>
            ))
          )}
        </ResultsList>

        {/* Footer hints */}
        <Footer aria-hidden="true">
          <FooterHint>
            <FooterKbd>↑</FooterKbd>
            <FooterKbd>↓</FooterKbd>
            navigate
          </FooterHint>
          <FooterHint>
            <FooterKbd>↵</FooterKbd>
            select
          </FooterHint>
          <FooterHint>
            <FooterKbd>esc</FooterKbd>
            close
          </FooterHint>
        </Footer>
      </Dialog>
    </Backdrop>,
    document.body,
  );
}
