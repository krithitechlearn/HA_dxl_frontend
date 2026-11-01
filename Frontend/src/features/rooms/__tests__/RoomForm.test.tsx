/**
 * RoomForm tests.
 * @see US-003, API-010, API-013
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RoomForm } from '../components/RoomForm';

expect.extend(toHaveNoViolations);

describe('RoomForm [US-003]', () => {
  const mockOnSave = jest.fn().mockResolvedValue(true);
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render room name field', () => {
    render(<RoomForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/room name/i)).toBeInTheDocument();
  });

  it('should show validation error when room name is empty', async () => {
    const user = userEvent.setup();
    render(<RoomForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.click(screen.getByRole('button', { name: /create room/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 1 character/i)).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onSave with valid data', async () => {
    const user = userEvent.setup();
    render(<RoomForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.type(screen.getByLabelText(/room name/i), 'Living Room');
    await user.click(screen.getByRole('button', { name: /create room/i }));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Living Room' }),
        expect.anything(),
      );
    });
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<RoomForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
