/**
 * LoginForm component.
 * Renders the login form with Zod validation and submits via authService.
 * @see US-001, API-001
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../../../utils/validationSchemas';
import { AUTH_MESSAGES } from '../../../messages';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Sign in form">
      {error && (
        <div
          role="alert"
          style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="username" className="form-label">
          {AUTH_MESSAGES.usernameLabel}
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          className={`form-input${errors.username ? ' error' : ''}`}
          aria-describedby={errors.username ? 'username-error' : undefined}
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        {errors.username && (
          <p id="username-error" className="form-error" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          {AUTH_MESSAGES.passwordLabel}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={`form-input${errors.password ? ' error' : ''}`}
          aria-describedby={errors.password ? 'password-error' : undefined}
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p id="password-error" className="form-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {isLoading ? AUTH_MESSAGES.loggingIn : AUTH_MESSAGES.loginButton}
      </button>
    </form>
  );
}
