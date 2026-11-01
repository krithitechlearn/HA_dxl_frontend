/**
 * Toast notification component.
 * Auto-dismisses after 5 seconds per LLD 7.5.
 */
import { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import type { Notification } from '../../store/notificationStore';

const TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  success: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  error: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  info: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  warning: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
};

function ToastItem({ notification }: { notification: Notification }) {
  const removeNotification = useNotificationStore((s) => s.removeNotification);

  useEffect(() => {
    const timer = setTimeout(() => removeNotification(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, removeNotification]);

  const styles = TYPE_STYLES[notification.type] ?? TYPE_STYLES.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        border: `1px solid ${styles.border}`,
        backgroundColor: styles.bg,
        color: styles.text,
        fontSize: '0.875rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '20rem',
        maxWidth: '28rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      }}
    >
      <span>{notification.message}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => removeNotification(notification.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: styles.text,
          fontSize: '1rem',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const notifications = useNotificationStore((s) => s.notifications);

  return (
    <div
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
