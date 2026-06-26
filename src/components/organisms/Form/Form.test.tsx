import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { theme } from '../../../styles/theme';
import { Form } from './Form';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const BASIC_FIELDS = [
  { name: 'name',  type: 'input'    as const, label: 'Name',  required: true },
  { name: 'email', type: 'input'    as const, label: 'Email', inputType: 'email' as const, required: true },
  { name: 'agree', type: 'checkbox' as const, checkboxLabel: 'Agree', required: true },
];

describe('Form', () => {
  it('renders all fields', () => {
    wrap(<Form fields={BASIC_FIELDS} onSubmit={() => {}} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Agree')).toBeInTheDocument();
  });

  it('renders title and description when provided', () => {
    wrap(
      <Form
        fields={BASIC_FIELDS}
        title="Sign up"
        description="Create your account"
        onSubmit={() => {}}
      />
    );
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('renders submit button with custom label', () => {
    wrap(<Form fields={BASIC_FIELDS} onSubmit={() => {}} submitLabel="Go →" />);
    expect(screen.getByRole('button', { name: 'Go →' })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    wrap(<Form fields={BASIC_FIELDS} onSubmit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });
  });

  it('shows email validation error for invalid email', async () => {
    wrap(<Form fields={BASIC_FIELDS} onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Marc' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('does not call onSubmit when validation fails', async () => {
    const onSubmit = vi.fn();
    wrap(<Form fields={BASIC_FIELDS} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('calls onSubmit with correct values when valid', async () => {
    const onSubmit = vi.fn();
    wrap(<Form fields={BASIC_FIELDS} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Marc' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'marc@example.com' } });
    fireEvent.click(screen.getByLabelText('Agree'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name:  'Marc',
        email: 'marc@example.com',
        agree: true,
      });
    });
  });

  it('clears field error when user starts typing', async () => {
    wrap(<Form fields={BASIC_FIELDS} onSubmit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'M' } });
    await waitFor(() => {
      expect(screen.queryByText(/Name is required/i)).not.toBeInTheDocument();
    });
  });

  it('shows success message after successful submit', async () => {
    wrap(
      <Form
        fields={[{ name: 'email', type: 'input', label: 'Email', inputType: 'email', required: true }]}
        onSubmit={() => {}}
        successMessage="Done!"
      />
    );
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'marc@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText('Done!')).toBeInTheDocument();
    });
  });

  it('pre-fills fields from initialValues', () => {
    wrap(
      <Form
        fields={[{ name: 'name', type: 'input', label: 'Name' }]}
        initialValues={{ name: 'Marc' }}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Marc');
  });

  it('renders select field', () => {
    wrap(
      <Form
        fields={[{
          name: 'role', type: 'select', label: 'Role',
          options: [{ value: 'dev', label: 'Developer' }],
        }]}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('renders textarea field', () => {
    wrap(
      <Form
        fields={[{ name: 'bio', type: 'textarea', label: 'Bio' }]}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
