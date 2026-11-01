/**
 * Status badge component.
 * Displays a colored badge with text label.
 * Color is not the only indicator (text label also shown) per WCAG 2.1 AA (LLD 7.5).
 */

interface StatusBadgeProps {
  status: string;
  variant?: 'device' | 'command' | 'automation' | 'user' | 'default';
}

const DEVICE_STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ONLINE: { bg: '#d1fae5', text: '#065f46', label: 'Online' },
  OFFLINE: { bg: '#f3f4f6', text: '#374151', label: 'Offline' },
  ERROR: { bg: '#fee2e2', text: '#991b1b', label: 'Error' },
  MAINTENANCE: { bg: '#fef3c7', text: '#92400e', label: 'Maintenance' },
};

const COMMAND_STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
  SENT: { bg: '#dbeafe', text: '#1e40af', label: 'Sent' },
  ACKNOWLEDGED: { bg: '#d1fae5', text: '#065f46', label: 'Acknowledged' },
  FAILED: { bg: '#fee2e2', text: '#991b1b', label: 'Failed' },
};

const AUTOMATION_STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  SUCCESS: { bg: '#d1fae5', text: '#065f46', label: 'Success' },
  PARTIAL_FAILURE: { bg: '#fef3c7', text: '#92400e', label: 'Partial Failure' },
  FAILURE: { bg: '#fee2e2', text: '#991b1b', label: 'Failure' },
};

function getColors(
  status: string,
  variant: StatusBadgeProps['variant'],
): { bg: string; text: string; label: string } {
  if (variant === 'device') return DEVICE_STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#374151', label: status };
  if (variant === 'command') return COMMAND_STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#374151', label: status };
  if (variant === 'automation') return AUTOMATION_STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#374151', label: status };
  return { bg: '#f3f4f6', text: '#374151', label: status };
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const { bg, text, label } = getColors(status, variant);
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
