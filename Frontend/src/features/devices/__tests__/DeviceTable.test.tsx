/**
 * DeviceTable tests.
 * @see US-004, US-005
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DeviceTable } from '../components/DeviceTable';
import type { DeviceResponse } from '../types/device.types';
import { MemoryRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);

// Mock auth store
jest.mock('../../../store/authStore', () => ({
  useAuthStore: jest.fn((selector: (state: { user: { role: string } }) => unknown) =>
    selector({ user: { role: 'ADMIN', id: 'admin-1', username: 'admin', email: 'admin@test.com' } }),
  ),
}));

const mockDevices: DeviceResponse[] = [
  {
    id: 'device-1',
    name: 'Living Room Light',
    deviceType: 'LIGHT',
    status: 'ONLINE',
    attributes: {},
    version: 0,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    roomName: 'Living Room',
  },
  {
    id: 'device-2',
    name: 'Front Door Lock',
    deviceType: 'LOCK',
    status: 'OFFLINE',
    attributes: {},
    version: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

describe('DeviceTable [US-004]', () => {
  const mockOnEdit = jest.fn();
  const mockOnDeactivate = jest.fn();
  const mockOnViewDetail = jest.fn();

  it('should render device list with correct data', () => {
    render(
      <MemoryRouter>
        <DeviceTable
          devices={mockDevices}
          onEdit={mockOnEdit}
          onDeactivate={mockOnDeactivate}
          onViewDetail={mockOnViewDetail}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Living Room Light')).toBeInTheDocument();
    expect(screen.getByText('Front Door Lock')).toBeInTheDocument();
    expect(screen.getByText('LIGHT')).toBeInTheDocument();
    expect(screen.getByText('LOCK')).toBeInTheDocument();
  });

  it('should render device status badges', () => {
    render(
      <MemoryRouter>
        <DeviceTable
          devices={mockDevices}
          onEdit={mockOnEdit}
          onDeactivate={mockOnDeactivate}
          onViewDetail={mockOnViewDetail}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('should call onViewDetail when device name is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DeviceTable
          devices={mockDevices}
          onEdit={mockOnEdit}
          onDeactivate={mockOnDeactivate}
          onViewDetail={mockOnViewDetail}
        />
      </MemoryRouter>,
    );
    await user.click(screen.getByText('Living Room Light'));
    expect(mockOnViewDetail).toHaveBeenCalledWith(mockDevices[0]);
  });

  it('should call onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DeviceTable
          devices={mockDevices}
          onEdit={mockOnEdit}
          onDeactivate={mockOnDeactivate}
          onViewDetail={mockOnViewDetail}
        />
      </MemoryRouter>,
    );
    const editButtons = screen.getAllByRole('button', { name: /edit device/i });
    await user.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockDevices[0]);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <DeviceTable
          devices={mockDevices}
          onEdit={mockOnEdit}
          onDeactivate={mockOnDeactivate}
          onViewDetail={mockOnViewDetail}
        />
      </MemoryRouter>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
