/**
 * LoginForm tests.
 * @see US-001, API-001
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LoginForm } from '../components/LoginForm';

expect.extend(toHaveNoViolations);

describe('LoginForm [US-001]', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render username and password fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation error when username is too short', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />);
    await user.type(screen.getByLabelText(/username/i), 'ab');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error when username has invalid characters', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />);
    await user.type(screen.getByLabelText(/username/i), 'user name!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/alphanumeric/i)).toBeInTheDocument();
    });
  });

  it('should show validation error when password is empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />);
    await user.type(screen.getByLabelText(/username/i), 'validuser');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with valid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />);
    await user.type(screen.getByLabelText(/username/i), 'validuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { username: 'validuser', password: 'password123' },
        expect.anything(),
      );
    });
  });

  it('should disable submit button while loading', () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('should show error message when error prop is provided', () => {
    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} error="Invalid credentials" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
