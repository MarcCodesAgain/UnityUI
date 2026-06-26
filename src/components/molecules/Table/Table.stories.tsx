import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DataTable, DataTableSkeleton, Table } from './Table';
import { Badge } from '../../atoms/Badge';
import { Avatar } from '../../atoms/Avatar';

const meta: Meta = {
  title: 'Molecules/Table',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Two APIs in one module:

- **\`Table\`** — low-level compound API (\`Table.Head\`, \`Table.Body\`, \`Table.Row\`, \`Table.HeaderCell\`, \`Table.Cell\`) for full layout control
- **\`DataTable\`** — config-driven API that handles sorting, row selection, custom cell renderers, empty states, and sticky headers out of the box

\`\`\`tsx
import { DataTable, type ColumnDef } from '@unityui/core';

const columns: ColumnDef<User>[] = [
  { key: 'name',  header: 'Name',  accessor: 'name',  sortable: true },
  { key: 'email', header: 'Email', accessor: 'email' },
  { key: 'role',  header: 'Role',  accessor: 'role',  sortable: true },
];

<DataTable columns={columns} data={users} rowKey="id" selectable striped />
\`\`\`

Use \`DataTableSkeleton\` while data is loading.
        `,
      },
    },
  },
};
export default meta;

// ─── Sample data ──────────────────────────────────────────────────────────────

interface User {
  id:         string;
  name:       string;
  role:       string;
  email:      string;
  status:     'active' | 'inactive' | 'pending';
  joined:     string;
  commits:    number;
}

const USERS: User[] = [
  { id: '1', name: 'Marc Llopis',    role: 'Lead Designer',    email: 'marc@unity.io',   status: 'active',   joined: '2022-03-14', commits: 847 },
  { id: '2', name: 'Anna Kovacs',    role: 'Frontend Dev',     email: 'anna@unity.io',   status: 'active',   joined: '2022-07-01', commits: 1203 },
  { id: '3', name: 'James Park',     role: 'Backend Dev',      email: 'james@unity.io',  status: 'inactive', joined: '2021-11-22', commits: 512 },
  { id: '4', name: 'Lena Fischer',   role: 'Product Manager',  email: 'lena@unity.io',   status: 'active',   joined: '2023-01-08', commits: 34 },
  { id: '5', name: 'Omar Hassan',    role: 'QA Engineer',      email: 'omar@unity.io',   status: 'pending',  joined: '2023-09-15', commits: 89 },
  { id: '6', name: 'Yuki Tanaka',    role: 'Design Systems',   email: 'yuki@unity.io',   status: 'active',   joined: '2022-05-30', commits: 668 },
];

const STATUS_VARIANT = {
  active:   'primary',
  inactive: 'default',
  pending:  'outline',
} as const;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => (
    <DataTable
      rowKey="id"
      columns={[
        { key: 'name',    header: 'Name',    accessor: 'name',    sortable: true },
        { key: 'role',    header: 'Role',    accessor: 'role',    sortable: true },
        { key: 'email',   header: 'Email',   accessor: 'email' },
        { key: 'commits', header: 'Commits', accessor: 'commits', sortable: true, align: 'right' },
      ]}
      data={USERS}
    />
  ),
};

export const WithCustomCells: StoryObj = {
  render: () => (
    <DataTable
      rowKey="id"
      columns={[
        {
          key: 'name',
          header: 'Member',
          accessor: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar initials={row.name.split(' ').map((n) => n[0]).join('')} size="sm" status={row.status === 'active' ? 'online' : row.status === 'pending' ? 'away' : 'offline'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 600 }}>{row.name}</span>
                <span style={{ fontSize: '12px', color: '#636363' }}>{row.email}</span>
              </div>
            </div>
          ),
          width: '280px',
        },
        { key: 'role',    header: 'Role',    accessor: 'role',  sortable: true },
        {
          key: 'status',
          header: 'Status',
          accessor: (row) => (
            <Badge label={row.status} variant={STATUS_VARIANT[row.status]} dot={row.status === 'active'} />
          ),
        },
        {
          key: 'commits',
          header: 'Commits',
          align: 'right',
          sortable: true,
          accessor: (row) => (
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px' }}>
              {row.commits.toLocaleString()}
            </span>
          ),
        },
        { key: 'joined', header: 'Joined', accessor: 'joined', sortable: true },
      ]}
      data={USERS}
    />
  ),
};

export const WithSelection: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<User[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', color: '#636363' }}>
          {selected.length === 0
            ? 'No rows selected'
            : `${selected.length} row${selected.length > 1 ? 's' : ''} selected: ${selected.map((r) => r.name).join(', ')}`}
        </div>
        <DataTable
          rowKey="id"
          selectable
          onSelectionChange={setSelected}
          columns={[
            { key: 'name',    header: 'Name',    accessor: 'name',    sortable: true },
            { key: 'role',    header: 'Role',    accessor: 'role',    sortable: true },
            { key: 'status',  header: 'Status',  accessor: 'status' },
            { key: 'commits', header: 'Commits', accessor: 'commits', sortable: true, align: 'right' },
          ]}
          data={USERS}
        />
      </div>
    );
  },
};

export const Striped: StoryObj = {
  render: () => (
    <DataTable
      rowKey="id"
      striped
      columns={[
        { key: 'name',    header: 'Name',    accessor: 'name',    sortable: true },
        { key: 'role',    header: 'Role',    accessor: 'role' },
        { key: 'joined',  header: 'Joined',  accessor: 'joined', sortable: true },
        { key: 'commits', header: 'Commits', accessor: 'commits', sortable: true, align: 'right' },
      ]}
      data={USERS}
    />
  ),
};

export const Dense: StoryObj = {
  render: () => (
    <DataTable
      rowKey="id"
      dense
      striped
      columns={[
        { key: 'name',    header: 'Name',    accessor: 'name',    sortable: true },
        { key: 'role',    header: 'Role',    accessor: 'role',    sortable: true },
        { key: 'email',   header: 'Email',   accessor: 'email' },
        { key: 'status',  header: 'Status',  accessor: 'status' },
        { key: 'commits', header: 'Commits', accessor: 'commits', sortable: true, align: 'right' },
        { key: 'joined',  header: 'Joined',  accessor: 'joined',  sortable: true },
      ]}
      data={USERS}
    />
  ),
};

export const EmptyState: StoryObj = {
  render: () => (
    <DataTable
      rowKey="id"
      columns={[
        { key: 'name',   header: 'Name',   accessor: 'name' },
        { key: 'role',   header: 'Role',   accessor: 'role' },
        { key: 'status', header: 'Status', accessor: 'status' },
      ]}
      data={[]}
      emptyMessage="No members found — try adjusting your filters"
    />
  ),
};

export const LoadingSkeleton: StoryObj = {
  render: () => (
    <DataTableSkeleton columns={5} rows={6} />
  ),
};

export const LoadingSkeletonWithSelection: StoryObj = {
  render: () => (
    <DataTableSkeleton columns={4} rows={5} selectable />
  ),
};

export const LowLevelPrimitives: StoryObj = {
  name: 'Low-level: Table.* primitives',
  render: () => (
    <Table striped>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell sortable sorted="asc" onSort={() => {}}>Name</Table.HeaderCell>
          <Table.HeaderCell>Department</Table.HeaderCell>
          <Table.HeaderCell align="right">Salary</Table.HeaderCell>
          <Table.HeaderCell align="center">Active</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {[
          { name: 'Marc Llopis',  dept: 'Design',      salary: 95000, active: true },
          { name: 'Anna Kovacs',  dept: 'Engineering', salary: 110000, active: true },
          { name: 'James Park',   dept: 'Engineering', salary: 98000, active: false },
          { name: 'Lena Fischer', dept: 'Product',     salary: 105000, active: true },
        ].map((row) => (
          <Table.Row key={row.name} selected={row.name === 'Anna Kovacs'}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.dept}</Table.Cell>
            <Table.Cell align="right">€{row.salary.toLocaleString()}</Table.Cell>
            <Table.Cell align="center">
              <Badge label={row.active ? 'Yes' : 'No'} variant={row.active ? 'primary' : 'default'} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell colSpan={2}>Total</Table.Cell>
          <Table.Cell align="right">€408,000</Table.Cell>
          <Table.Cell />
        </Table.Row>
      </Table.Footer>
    </Table>
  ),
};
