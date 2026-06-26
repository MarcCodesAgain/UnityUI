import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { Table, DataTable, DataTableSkeleton } from './Table';
import type { ColumnDef } from './Table';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

// ─── Sample data ──────────────────────────────────────────────────────────────

interface Row { id: string; name: string; score: number; }

const COLUMNS: ColumnDef<Row>[] = [
  { key: 'name',  header: 'Name',  accessor: 'name',  sortable: true },
  { key: 'score', header: 'Score', accessor: 'score', sortable: true, align: 'right' },
];

const DATA: Row[] = [
  { id: '1', name: 'Charlie', score: 80 },
  { id: '2', name: 'Alice',   score: 95 },
  { id: '3', name: 'Bob',     score: 72 },
];

// ─── Table primitives ─────────────────────────────────────────────────────────

describe('Table primitives', () => {
  it('renders headers and cells', () => {
    wrap(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Alice</Table.Cell>
            <Table.Cell>95</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  it('renders footer', () => {
    wrap(
      <Table>
        <Table.Head><Table.Row><Table.HeaderCell>Col</Table.HeaderCell></Table.Row></Table.Head>
        <Table.Body><Table.Row><Table.Cell>Val</Table.Cell></Table.Row></Table.Body>
        <Table.Footer><Table.Row><Table.Cell>Total</Table.Cell></Table.Row></Table.Footer>
      </Table>
    );
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('sortable header has aria-sort="none" when unsorted', () => {
    wrap(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell sortable sorted={null} onSort={() => {}}>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body />
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: /name/i })).toHaveAttribute('aria-sort', 'none');
  });

  it('sorted header has aria-sort="ascending"', () => {
    wrap(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell sortable sorted="asc" onSort={() => {}}>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body />
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: /name/i })).toHaveAttribute('aria-sort', 'ascending');
  });
});

// ─── DataTable ────────────────────────────────────────────────────────────────

describe('DataTable', () => {
  it('renders all column headers', () => {
    wrap(<DataTable columns={COLUMNS} data={DATA} rowKey="id" />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /score/i })).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    wrap(<DataTable columns={COLUMNS} data={DATA} rowKey="id" />);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows empty state when data is empty', () => {
    wrap(<DataTable columns={COLUMNS} data={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('sorts ascending on first click', () => {
    wrap(<DataTable columns={COLUMNS} data={DATA} rowKey="id" />);
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    const cells = screen.getAllByRole('cell').filter((c) =>
      ['Alice', 'Bob', 'Charlie'].includes(c.textContent ?? '')
    );
    expect(cells[0]).toHaveTextContent('Alice');
    expect(cells[1]).toHaveTextContent('Bob');
    expect(cells[2]).toHaveTextContent('Charlie');
  });

  it('sorts descending on second click', () => {
    wrap(<DataTable columns={COLUMNS} data={DATA} rowKey="id" />);
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    fireEvent.click(nameHeader); // asc
    fireEvent.click(nameHeader); // desc
    const cells = screen.getAllByRole('cell').filter((c) =>
      ['Alice', 'Bob', 'Charlie'].includes(c.textContent ?? '')
    );
    expect(cells[0]).toHaveTextContent('Charlie');
    expect(cells[2]).toHaveTextContent('Alice');
  });

  it('clears sort on third click', () => {
    wrap(<DataTable columns={COLUMNS} data={DATA} rowKey="id" />);
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    fireEvent.click(nameHeader); // asc
    fireEvent.click(nameHeader); // desc
    fireEvent.click(nameHeader); // null — back to original order
    const cells = screen.getAllByRole('cell').filter((c) =>
      ['Alice', 'Bob', 'Charlie'].includes(c.textContent ?? '')
    );
    // Original order: Charlie, Alice, Bob
    expect(cells[0]).toHaveTextContent('Charlie');
    expect(cells[1]).toHaveTextContent('Alice');
  });

  it('calls onSortChange when controlled', () => {
    const onSortChange = vi.fn();
    wrap(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        rowKey="id"
        sortKey=""
        sortDirection={null}
        onSortChange={onSortChange}
      />
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
  });
});

// ─── Selection ────────────────────────────────────────────────────────────────

describe('DataTable selection', () => {
  it('renders checkboxes when selectable', () => {
    wrap(<DataTable columns={COLUMNS} data={DATA} rowKey="id" selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 1 header checkbox + 3 row checkboxes
    expect(checkboxes).toHaveLength(4);
  });

  it('selects a single row', () => {
    const onSelectionChange = vi.fn();
    wrap(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />
    );
    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1); // skip header
    fireEvent.click(rowCheckboxes[0]);
    expect(onSelectionChange).toHaveBeenCalledWith([DATA[0]]);
  });

  it('selects all rows via header checkbox', () => {
    const onSelectionChange = vi.fn();
    wrap(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox')[0]); // header
    expect(onSelectionChange).toHaveBeenCalledWith(DATA);
  });

  it('deselects all rows when clicking header checkbox while all selected', () => {
    const onSelectionChange = vi.fn();
    wrap(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />
    );
    const headerCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(headerCheckbox); // select all
    fireEvent.click(headerCheckbox); // deselect all
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

describe('DataTableSkeleton', () => {
  it('renders the correct number of skeleton rows', () => {
    const { container } = wrap(<DataTableSkeleton columns={3} rows={4} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(4);
  });

  it('renders selectable skeleton column', () => {
    const { container } = wrap(<DataTableSkeleton columns={3} rows={2} selectable />);
    const headerCells = container.querySelectorAll('thead th');
    // selectable adds 1 extra column
    expect(headerCells).toHaveLength(4);
  });
});
