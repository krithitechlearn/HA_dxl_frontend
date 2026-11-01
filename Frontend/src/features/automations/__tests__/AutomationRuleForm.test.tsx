/**
 * AutomationRuleForm tests.
 * @see US-009, API-027
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AutomationRuleForm } from '../components/AutomationRuleForm';

expect.extend(toHaveNoViolations);

describe('AutomationRuleForm [US-009]', () => {
  const mockOnSave = jest.fn().mockResolvedValue(true);
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render rule name, trigger type, and actions fields', () => {
    render(
      <AutomationRuleForm onSave={mockOnSave} onCancel={mockOnCancel} />,
    );
    expect(screen.getByLabelText(/rule name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/trigger type/i)).toBeInTheDocument();
  });

  it('should show validation error when rule name is empty', async () => {
    const user = userEvent.setup();
    render(<AutomationRuleForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.click(screen.getByRole('button', { name: /create automation rule/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 1 character/i)).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should show validation error when no actions are added', async () => {
    const user = userEvent.setup();
    render(<AutomationRuleForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.type(screen.getByLabelText(/rule name/i), 'My Rule');
    await user.click(screen.getByRole('button', { name: /create automation rule/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least one action/i)).toBeInTheDocument();
    });
  });

  it('should add and remove actions', async () => {
    const user = userEvent.setup();
    render(<AutomationRuleForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.click(screen.getByRole('button', { name: /add action/i }));
    expect(screen.getByText(/action 1/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /remove action 1/i }));
    expect(screen.queryByText(/action 1/i)).not.toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AutomationRuleForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <AutomationRuleForm onSave={mockOnSave} onCancel={mockOnCancel} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
