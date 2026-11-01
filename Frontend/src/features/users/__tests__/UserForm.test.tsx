/**
 * UserForm tests.
 * @see US-002, API-004, API-007
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserForm } from '../components/UserForm';

expect.extend(toHaveNoViolations);

describe('UserForm [US-002]', () => {
  const mockOnSave = jest.fn().mockResolvedValue(true);
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render create user form with all fields', () => {
    render(<UserForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it('should show validation error for short username', async () => {
    const user = userEvent.setup();
    render(<UserForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.type(screen.getByLabelText(/username/i), 'ab');
    await user.click(screen.getByRole('button', { name: /create user/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<UserForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.type(screen.getByLabelText(/username/i), 'validuser');
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /create user/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for weak password', async () => {
    const user = userEvent.setup();
    render(<UserForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.type(screen.getByLabelText(/username/i), 'validuser');
    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.type(screen.getByLabelText(/^password/i), 'weakpass');
    await user.click(screen.getByRole('button', { name: /create user/i }));
    await waitFor(() => {
      expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<UserForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<UserForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
