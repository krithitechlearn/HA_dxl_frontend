/**
 * ChangePasswordModal component.
 * Modal dialog for changing a user's password.
 * @see US-002, API-009
 */
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordFormValues } from '../../../utils/validationSchemas';
import type { UserResponse } from '../types/user.types';
import { USER_MESSAGES, COMMON_MESSAGES } from '../../../messages';

interface ChangePasswordModalProps {
  user: UserResponse | null;
  onSave: (
    id: string,
    values: ChangePasswordFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ) => Promise<boolean>;
  onClose: () => void;
  isLoading?: boolean;
}

export function ChangePasswordModal({ user, onSave, onClose, isLoading = false }: ChangePasswordModalProps) {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (user) {
      reset();
      firstInputRef.current?.focus();
    }
  }, [user, reset]);

  if (!user) return null;

  const handleFormSubmit = async (values: ChangePasswordFormValues) => {
    const success = await onSave(
      user.id,
      values,
      setError as (field: string, err: { type: string; message: string }) => void,
    );
    if (success) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '28rem' }}
      >
        <h2 id="change-password-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
          {USER_MESSAGES.changePassword} &mdash; {user.username}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="current-password" className="form-label">Current Password</label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              ref={firstInputRef}
              className={`form-input${errors.currentPassword ? ' error' : ''}`}
              aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
              aria-invalid={!!errors.currentPassword}
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p id="current-password-error" className="form-error" role="alert">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="new-password" className="form-label">New Password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              className={`form-input${errors.newPassword ? ' error' : ''}`}
              aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
              aria-invalid={!!errors.newPassword}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p id="new-password-error" className="form-error" role="alert">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="form-error" role="alert">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>
              {COMMON_MESSAGES.cancel}
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? COMMON_MESSAGES.saving : COMMON_MESSAGES.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
