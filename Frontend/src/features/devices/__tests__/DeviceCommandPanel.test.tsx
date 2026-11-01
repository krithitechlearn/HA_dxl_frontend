/**
 * DeviceCommandPanel tests.
 * @see US-006, API-023
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DeviceCommandPanel } from '../components/DeviceCommandPanel';

expect.extend(toHaveNoViolations);

describe('DeviceCommandPanel [US-006]', () => {
  const mockOnIssueCommand = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    mockOnIssueCommand.mockClear();
  });

  it('should render compatible commands for LIGHT device type', () => {
    render(
      <DeviceCommandPanel
        deviceId="device-1"
        deviceType="LIGHT"
        deviceStatus="ONLINE"
        onIssueCommand={mockOnIssueCommand}
      />,
    );
    expect(screen.getByLabelText(/command type/i)).toBeInTheDocument();
    expect(screen.getByText(/turn on/i)).toBeInTheDocument();
  });

  it('should show maintenance warning when device is in MAINTENANCE status', () => {
    render(
      <DeviceCommandPanel
        deviceId="device-1"
        deviceType="LIGHT"
        deviceStatus="MAINTENANCE"
        onIssueCommand={mockOnIssueCommand}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/maintenance mode/i);
    expect(screen.getByRole('button', { name: /send command/i })).toBeDisabled();
  });

  it('should call onIssueCommand when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <DeviceCommandPanel
        deviceId="device-1"
        deviceType="LIGHT"
        deviceStatus="ONLINE"
        onIssueCommand={mockOnIssueCommand}
      />,
    );
    await user.click(screen.getByRole('button', { name: /send command/i }));
    await waitFor(() => {
      expect(mockOnIssueCommand).toHaveBeenCalled();
    });
  });

  it('should show LOCK/UNLOCK commands for LOCK device type', () => {
    render(
      <DeviceCommandPanel
        deviceId="device-1"
        deviceType="LOCK"
        deviceStatus="ONLINE"
        onIssueCommand={mockOnIssueCommand}
      />,
    );
    const select = screen.getByLabelText(/command type/i) as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain('LOCK');
    expect(options).toContain('UNLOCK');
    expect(options).not.toContain('SET_BRIGHTNESS');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <DeviceCommandPanel
        deviceId="device-1"
        deviceType="LIGHT"
        deviceStatus="ONLINE"
        onIssueCommand={mockOnIssueCommand}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
