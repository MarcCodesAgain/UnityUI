import styled, { css, keyframes } from 'styled-components';
import { useState, useCallback, useMemo, useId, createContext, useContext } from 'react';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';
import { Checkbox } from '../../atoms/Checkbox';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null;
export type ColumnAlign   = 'left' | 'center' | 'right';

export interface ColumnDef<T extends object = object> {
  /** Unique key — used for sort state and as React key */
  key: string;
  /** Header label */
  header: React.ReactNode;
  /** Field name or custom renderer */
  accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
  sortable?: boolean;
  align?: ColumnAlign;
  /** Fixed column width (e.g. '120px', '20%') */
  width?: string;
}

export interface TableProps {
  /** Zebra striping */
  striped?: boolean;
  /** Compact row height */
  dense?: boolean;
  /** Sticky thead */
  stickyHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export interface TableHeadProps {
  children: React.ReactNode;
}
export interface TableBodyProps {
  children: React.ReactNode;
}
export interface TableFooterProps {
  children: React.ReactNode;
}
export interface TableRowProps {
  selected?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
export interface TableHeaderCellProps {
  align?: ColumnAlign;
  sortable?: boolean;
  /** Current sort direction — undefined = not sorted by this col */
  sorted?: SortDirection;
  onSort?: () => void;
  width?: string;
  children: React.ReactNode;
}
export interface TableCellProps {
  align?: ColumnAlign;
  children?: React.ReactNode;
  colSpan?: number;
}

// ─── DataTable types ──────────────────────────────────────────────────────────

export interface DataTableProps<T extends object = object> {
  columns: ColumnDef<T>[];
  data: T[];
  /** Key field for stable row identity (required when selectable) */
  rowKey?: keyof T | ((row: T) => string);
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Controlled sort — pass alongside onSortChange for external sort */
  sortKey?: string;
  sortDirection?: SortDirection;
  onSortChange?: (key: string, direction: SortDirection) => void;
  striped?: boolean;
  dense?: boolean;
  stickyHeader?: boolean;
  /** Empty state message or node */
  emptyMessage?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Context — passes table config to sub-components ─────────────────────────

interface TableConfig {
  striped: boolean;
  dense: boolean;
  stickyHeader: boolean;
}

const TableContext = createContext<TableConfig>({
  striped: false,
  dense: false,
  stickyHeader: false,
});

// ─── Animations ───────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

// Sort arrow draw (reuses same principle as Checkbox check draw)
const arrowIn = keyframes`
  from { opacity: 0; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Styled primitives ────────────────────────────────────────────────────────

const ScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  /* Subtle shadow hint on right edge when scrollable */
  background:
    linear-gradient(to right, ${colors.bgPage} 30%, transparent),
    linear-gradient(to right, transparent, ${colors.bgPage} 70%) 0 100%,
    linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent),
    linear-gradient(to left,  rgba(0,0,0,0.06) 0%, transparent) 0 100%;
  background-repeat: no-repeat;
  background-color: ${colors.bgPage};
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-attachment: local, local, scroll, scroll;
`;

const StyledTable = styled.table<{
  $stickyHeader: boolean;
}>`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-family: ${fontFamily.base};
  font-size: ${fontSize.base};
  color: ${colors.textPrimary};

  ${({ $stickyHeader }) =>
    $stickyHeader &&
    css`
      thead th {
        position: sticky;
        top: 0;
        z-index: 2;
      }
    `}
`;

const StyledThead = styled.thead`
  background-color: ${colors.bgPage};
`;
const StyledTbody = styled.tbody``;
const StyledTfoot = styled.tfoot``;

const StyledTr = styled.tr<{
  $selected: boolean;
  $interactive: boolean;
  $dense: boolean;
  $striped: boolean;
  $index?: number;
}>`
  position: relative;
  transition: background-color 160ms ease;

  ${({ $striped, $index }) =>
    $striped && ($index ?? 0) % 2 === 1 &&
    css`background-color: ${colors.bgSurface};`}

  ${({ $selected }) =>
    $selected &&
    css`background-color: ${colors.blue50} !important;`}

  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${colors.grey100};
      }
      /* Electric Blue bottom bar — fills left→right on hover, same as Typography highlight */
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${colors.primary};
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }
      &:hover::after {
        transform: scaleX(1);
      }
    `}

  /* Selected row — blue tint + persistent accent bar */
  ${({ $selected, $interactive }) =>
    $selected && $interactive &&
    css`
      &:hover { background-color: ${colors.blue100}; }
      &::after {
        transform: scaleX(1);
        background-color: ${colors.primary};
        opacity: 0.6;
      }
    `}
`;

const StyledTh = styled.th<{
  $align: ColumnAlign;
  $sortable: boolean;
  $sorted: boolean;
  $dense: boolean;
  $width?: string;
}>`
  padding: ${({ $dense }) => ($dense ? `${spacing[2]} ${spacing[4]}` : `${spacing[3]} ${spacing[4]}`)};
  text-align: ${({ $align }) => $align};
  width: ${({ $width }) => $width ?? 'auto'};

  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.semibold};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${colors.textSecondary};
  white-space: nowrap;

  border-bottom: ${borderWidth[2]} solid ${colors.borderDefault};
  background-color: ${colors.bgPage};

  ${({ $sortable }) =>
    $sortable &&
    css`
      cursor: pointer;
      user-select: none;
      &:hover { color: ${colors.textPrimary}; }
    `}

  ${({ $sorted }) =>
    $sorted &&
    css`color: ${colors.primary};`}
`;

const ThInner = styled.div<{ $align: ColumnAlign }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  flex-direction: ${({ $align }) => ($align === 'right' ? 'row-reverse' : 'row')};
`;

const SortIcon = styled.span<{ $dir: 'asc' | 'desc' }>`
  display: inline-flex;
  align-items: center;
  color: ${colors.primary};
  animation: ${arrowIn} 180ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transform: ${({ $dir }) => ($dir === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const SortPlaceholder = styled.span`
  display: inline-flex;
  align-items: center;
  opacity: 0;
  /* Reserve same space as SortIcon so layout doesn't shift */
  width: 10px;
`;

const StyledTd = styled.td<{
  $align: ColumnAlign;
  $dense: boolean;
}>`
  padding: ${({ $dense }) => ($dense ? `${spacing[2]} ${spacing[4]}` : `${spacing[4]} ${spacing[4]}`)};
  text-align: ${({ $align }) => $align};
  border-bottom: ${borderWidth[1]} solid ${colors.borderDefault};
  vertical-align: middle;
  font-size: ${fontSize.sm};
  color: ${colors.textPrimary};
`;

// Skeleton cell
const SkeletonCell = styled.td<{ $dense: boolean }>`
  padding: ${({ $dense }) => ($dense ? `${spacing[2]} ${spacing[4]}` : `${spacing[4]} ${spacing[4]}`)};
  border-bottom: ${borderWidth[1]} solid ${colors.borderDefault};
`;

const SkeletonBar = styled.div<{ $width?: string }>`
  height: 14px;
  width: ${({ $width }) => $width ?? '80%'};
  border-radius: 0;
  background: linear-gradient(
    90deg,
    ${colors.grey100} 25%,
    ${colors.grey50}  50%,
    ${colors.grey100} 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

const EmptyCell = styled.td`
  padding: ${spacing[10]} ${spacing[4]};
  text-align: center;
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  letter-spacing: ${letterSpacing.wide};
  border-bottom: ${borderWidth[1]} solid ${colors.borderDefault};
`;

// ─── SVG sort arrow (10×6, square linecap — Swiss aesthetic) ─────────────────

function ArrowUp() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

// ─── Table sub-components (low-level compound API) ───────────────────────────

function TableHead({ children }: TableHeadProps) {
  return <StyledThead>{children}</StyledThead>;
}

function TableBody({ children }: TableBodyProps) {
  return <StyledTbody>{children}</StyledTbody>;
}

function TableFooterComp({ children }: TableFooterProps) {
  return <StyledTfoot>{children}</StyledTfoot>;
}

function TableRow({
  selected = false,
  interactive = false,
  onClick,
  children,
  className,
}: TableRowProps) {
  const { dense, striped } = useContext(TableContext);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    },
    [onClick],
  );

  return (
    <StyledTr
      $selected={selected}
      $interactive={interactive || !!onClick}
      $dense={dense}
      $striped={striped}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      {children}
    </StyledTr>
  );
}

function TableHeaderCell({
  align = 'left',
  sortable = false,
  sorted,
  onSort,
  width,
  children,
}: TableHeaderCellProps) {
  const { dense } = useContext(TableContext);
  const isSorted = sorted !== null && sorted !== undefined;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (sortable && onSort && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort();
      }
    },
    [sortable, onSort],
  );

  return (
    <StyledTh
      $align={align}
      $sortable={sortable}
      $sorted={isSorted}
      $dense={dense}
      $width={width}
      scope="col"
      onClick={sortable ? onSort : undefined}
      onKeyDown={sortable ? handleKeyDown : undefined}
      tabIndex={sortable ? 0 : undefined}
      aria-sort={
        !sortable ? undefined :
        sorted === 'asc'  ? 'ascending' :
        sorted === 'desc' ? 'descending' : 'none'
      }
    >
      <ThInner $align={align}>
        {children}
        {sortable && (
          isSorted && sorted ? (
            <SortIcon $dir={sorted}>
              <ArrowUp />
            </SortIcon>
          ) : (
            <SortPlaceholder aria-hidden="true">
              <ArrowUp />
            </SortPlaceholder>
          )
        )}
      </ThInner>
    </StyledTh>
  );
}

function TableCell({ align = 'left', children, colSpan }: TableCellProps) {
  const { dense } = useContext(TableContext);
  return (
    <StyledTd $align={align} $dense={dense} colSpan={colSpan}>
      {children}
    </StyledTd>
  );
}

// ─── Table (compound root) ───────────────────────────────────────────────────

export function Table({
  striped = false,
  dense = false,
  stickyHeader = false,
  className,
  style,
  children,
}: TableProps) {
  return (
    <TableContext.Provider value={{ striped, dense, stickyHeader }}>
      <ScrollWrapper>
        <StyledTable
          $stickyHeader={stickyHeader}
          className={className}
          style={style}
          role="table"
        >
          {children}
        </StyledTable>
      </ScrollWrapper>
    </TableContext.Provider>
  );
}

Table.Head         = TableHead;
Table.Body         = TableBody;
Table.Footer       = TableFooterComp;
Table.Row          = TableRow;
Table.HeaderCell   = TableHeaderCell;
Table.Cell         = TableCell;

// ─── DataTable (high-level config-driven) ────────────────────────────────────

const SKELETON_ROWS = 5;

function getRowId<T extends object>(
  row: T,
  index: number,
  rowKey?: keyof T | ((row: T) => string),
): string {
  if (!rowKey) return String(index);
  if (typeof rowKey === 'function') return rowKey(row);
  return String(row[rowKey]);
}

function getCellValue<T extends object>(
  row: T,
  col: ColumnDef<T>,
  index: number,
): React.ReactNode {
  if (!col.accessor) return null;
  if (typeof col.accessor === 'function') return col.accessor(row, index);
  const val = row[col.accessor];
  return val == null ? '—' : String(val);
}

export function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  selectable = false,
  onSelectionChange,
  sortKey: controlledSortKey,
  sortDirection: controlledSortDir,
  onSortChange,
  striped = false,
  dense = false,
  stickyHeader = false,
  emptyMessage = 'No data',
  className,
  style,
}: DataTableProps<T>) {
  // ── Dev warning: rowKey is required when selectable to avoid selection desync ──
  if (process.env.NODE_ENV !== 'production' && selectable && !rowKey && data.length > 0) {
    console.warn(
      '[DataTable] `rowKey` is required when `selectable` is true. ' +
      'Without it, selection state is keyed by index and will desync if data is reordered or updated. ' +
      'Pass a stable unique key (e.g. rowKey="id").',
    );
  }

  // ── Sort state (uncontrolled unless sortKey/onSortChange provided) ──
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<SortDirection>(null);

  const isControlled = controlledSortKey !== undefined;
  const activeSortKey = isControlled ? (controlledSortKey ?? null) : internalSortKey;
  const activeSortDir = isControlled ? (controlledSortDir ?? null) : internalSortDir;

  const handleSort = useCallback((key: string) => {
    const next: SortDirection =
      activeSortKey !== key ? 'asc' :
      activeSortDir === 'asc' ? 'desc' : null;

    if (isControlled) {
      onSortChange?.(key, next);
    } else {
      setInternalSortKey(next === null ? null : key);
      setInternalSortDir(next);
    }
  }, [activeSortKey, activeSortDir, isControlled, onSortChange]);

  // ── Selection state ──
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allIds = useMemo(
    () => data.map((row, i) => getRowId(row, i, rowKey)),
    [data, rowKey],
  );

  const allSelected  = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = !allSelected && allIds.some((id) => selectedIds.has(id));

  const toggleAll = useCallback(() => {
    setSelectedIds(() => {
      const next = new Set(allSelected ? [] : allIds);
      const rows = data.filter((_, i) => next.has(getRowId(_, i, rowKey)));
      onSelectionChange?.(rows);
      return next;
    });
  }, [allSelected, allIds, data, rowKey, onSelectionChange]);

  const toggleRow = useCallback((id: string, _row: T) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      const rows = data.filter((r, i) => next.has(getRowId(r, i, rowKey)));
      onSelectionChange?.(rows);
      return next;
    });
  }, [data, rowKey, onSelectionChange]);

  // ── Client-side sort (only when uncontrolled) ──
  const sortedData = useMemo(() => {
    if (isControlled || !activeSortKey || !activeSortDir) return data;
    const col = columns.find((c) => c.key === activeSortKey);
    if (!col?.accessor || typeof col.accessor === 'function') return data;
    const field = col.accessor as keyof T;
    return [...data].sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      const cmp = av == null ? -1 : bv == null ? 1 :
        typeof av === 'number' && typeof bv === 'number' ? av - bv :
        String(av).localeCompare(String(bv));
      return activeSortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, columns, activeSortKey, activeSortDir, isControlled]);

  const checkboxColId = useId();
  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <Table
      striped={striped}
      dense={dense}
      stickyHeader={stickyHeader}
      className={className}
      style={style}
    >
      <Table.Head>
        <tr>
          {selectable && (
            <StyledTh
              $align="left"
              $sortable={false}
              $sorted={false}
              $dense={dense}
              $width="48px"
              aria-label="Select all rows"
            >
              <Checkbox
                id={checkboxColId}
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
                aria-label="Select all"
                size="sm"
              />
            </StyledTh>
          )}
          {columns.map((col) => (
            <Table.HeaderCell
              key={col.key}
              align={col.align}
              sortable={col.sortable}
              sorted={activeSortKey === col.key ? activeSortDir : null}
              onSort={col.sortable ? () => handleSort(col.key) : undefined}
              width={col.width}
            >
              {col.header}
            </Table.HeaderCell>
          ))}
        </tr>
      </Table.Head>

      <Table.Body>
        {/* Empty state */}
        {sortedData.length === 0 && (
          <tr>
            <EmptyCell colSpan={colCount}>
              {emptyMessage}
            </EmptyCell>
          </tr>
        )}

        {/* Data rows */}
        {sortedData.map((row, i) => {
          const id       = getRowId(row, i, rowKey);
          const isSelected = selectedIds.has(id);
          return (
            <StyledTr
              key={id}
              $selected={isSelected}
              $interactive
              $dense={dense}
              $striped={striped}
              $index={i}
            >
              {selectable && (
                <StyledTd $align="left" $dense={dense}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleRow(id, row)}
                    aria-label={`Select row ${i + 1}`}
                    size="sm"
                  />
                </StyledTd>
              )}
              {columns.map((col) => (
                <Table.Cell key={col.key} align={col.align}>
                  {getCellValue(row, col, i)}
                </Table.Cell>
              ))}
            </StyledTr>
          );
        })}
      </Table.Body>
    </Table>
  );
}

// ─── DataTable.Skeleton — loading placeholder ─────────────────────────────────

interface DataTableSkeletonProps {
  columns: number;
  rows?: number;
  dense?: boolean;
  selectable?: boolean;
}

export function DataTableSkeleton({
  columns,
  rows = SKELETON_ROWS,
  dense = false,
  selectable = false,
}: DataTableSkeletonProps) {
  const colCount = columns + (selectable ? 1 : 0);
  return (
    <Table dense={dense}>
      <Table.Head>
        <tr>
          {Array.from({ length: colCount }).map((_, i) => (
            <StyledTh key={i} $align="left" $sortable={false} $sorted={false} $dense={dense}>
              <SkeletonBar $width={i === 0 && selectable ? '24px' : '60%'} />
            </StyledTh>
          ))}
        </tr>
      </Table.Head>
      <Table.Body>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: colCount }).map((__, c) => (
              <SkeletonCell key={c} $dense={dense}>
                <SkeletonBar $width={c === 0 && selectable ? '18px' : `${55 + ((r * 13 + c * 17) % 35)}%`} />
              </SkeletonCell>
            ))}
          </tr>
        ))}
      </Table.Body>
    </Table>
  );
}
