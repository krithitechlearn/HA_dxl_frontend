/**
 * Navbar component with user info and logout button.
 */
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { logout } from '../../services/authService';
import { AUTH_MESSAGES } from '../../messages';

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      addNotification('info', AUTH_MESSAGES.logoutSuccess);
      navigate('/login');
    }
  };

  return (
    <header
      style={{
        height: '3.5rem',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 1.5rem',
        gap: '1rem',
      }}
    >
      {user && (
        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
          {user.username}{' '}
          <span
            style={{
              fontSize: '0.75rem',
              backgroundColor: '#e5e7eb',
              padding: '0.1rem 0.4rem',
              borderRadius: '0.25rem',
            }}
          >
            {user.role}
          </span>
        </span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        style={{
          padding: '0.375rem 0.875rem',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        Sign Out
      </button>
    </header>
  );
}
