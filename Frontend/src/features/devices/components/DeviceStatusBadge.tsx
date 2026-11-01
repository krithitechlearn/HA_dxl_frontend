/**
 * DeviceStatusBadge component.
 * Color + text label for device status (WCAG 2.1 AA compliant).
 * @see US-004, US-005, LLD 7.5
 */
import type { DeviceStatus } from '../types/device.types';

interface DeviceStatusBadgeProps {
  status: DeviceStatus;
}

const STATUS_CONFIG: Record<DeviceStatus, { bg: string; text: string; label: string }> = {
  ONLINE: { bg: '#d1fae5', text: '#065f46', label: 'Online' },
  OFFLINE: { bg: '#f3f4f6', text: '#374151', label: 'Offline' },
  ERROR: { bg: '#fee2e2', text: '#991b1b', label: 'Error' },
  MAINTENANCE: { bg: '#fef3c7', text: '#92400e', label: 'Maintenance' },
};

export function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { bg: '#f3f4f6', text: '#374151', label: status };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          backgroundColor: config.text,
          display: 'inline-block',
        }}
      />
      {config.label}
    </span>
  );
}
