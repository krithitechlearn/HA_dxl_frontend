/**
 * LoginPage.
 * Public page for user authentication.
 * @see US-001, API-001
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { AUTH_MESSAGES } from '../../../messages';
import { getErrorMessage } from '../../../utils/errorUtils';
import type { LoginFormValues } from '../../../utils/validationSchemas';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/devices';

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const success = await login(values);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '24rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            {AUTH_MESSAGES.loginTitle}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            {AUTH_MESSAGES.loginSubtitle}
          </p>
        </div>
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
