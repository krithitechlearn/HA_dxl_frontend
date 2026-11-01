/**
 * DeviceTable component.
 * Renders a paginated list of devices with status badges and action buttons.
 * @see US-004, US-005
 */
import type { DeviceResponse } from '../types/device.types';
import { DeviceStatusBadge } from './DeviceStatusBadge';
import { formatDateTime } from '../../../utils/dateUtils';
import { useAuthStore } from '../../../store/authStore';

interface DeviceTableProps {
  devices: DeviceResponse[];
  onEdit: (device: DeviceResponse) => void;
  onDeactivate: (device: DeviceResponse) => void;
  onViewDetail: (device: DeviceResponse) => void;
}

export function DeviceTable({ devices, onEdit, onDeactivate, onViewDetail }: DeviceTableProps) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div style={{ overflowX: 'auto' }}>
      <table aria-label="Devices list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Room</th>
            <th scope="col">Last Seen</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>
                <button
                  type="button"
                  onClick={() => onViewDetail(device)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 500,
                  }}
                >
                  {device.name}
                </button>
              </td>
              <td>{device.deviceType}</td>
              <td><DeviceStatusBadge status={device.status} /></td>
              <td>{device.roomName ?? '—'}</td>
              <td>{formatDateTime(device.lastSeenAt)}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(isAdmin || user?.role === 'USER') && (
                    <button
                      type="button"
                      onClick={() => onEdit(device)}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
                      aria-label={`Edit device ${device.name}`}
                    >
                      Edit
                    </button>
                  )}
                  {isAdmin && device.isActive && (
                    <button
                      type="button"
                      onClick={() => onDeactivate(device)}
                      className="btn-danger"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
                      aria-label={`Deactivate device ${device.name}`}
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
