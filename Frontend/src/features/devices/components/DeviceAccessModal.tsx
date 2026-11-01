/**
 * DeviceAccessModal component.
 * ADMIN-only modal for granting/revoking device access to users.
 * @see US-005, API-021, API-022
 */
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deviceAccessSchema, type DeviceAccessFormValues } from '../../../utils/validationSchemas';
import type { UserResponse } from '../../users/types/user.types';
import { DEVICE_MESSAGES, COMMON_MESSAGES } from '../../../messages';

interface DeviceAccessModalProps {
  isOpen: boolean;
  deviceId: string;
  users: UserResponse[];
  onGrant: (values: DeviceAccessFormValues) => Promise<boolean>;
  onRevoke: (userId: string) => Promise<boolean>;
  onClose: () => void;
}

export function DeviceAccessModal({
  isOpen,
  deviceId: _deviceId,
  users,
  onGrant,
  onRevoke,
  onClose,
}: DeviceAccessModalProps) {
  const firstInputRef = useRef<HTMLSelectElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeviceAccessFormValues>({
    resolver: zodResolver(deviceAccessSchema),
    defaultValues: { userId: '', accessLevel: 'READ' },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      firstInputRef.current?.focus();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (values: DeviceAccessFormValues) => {
    const success = await onGrant(values);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-access-title"
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
      <div className="card" style={{ width: '100%', maxWidth: '28rem' }}>
        <h2 id="device-access-title" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
          Manage Device Access
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate aria-label="Grant device access form">
          <div className="form-group">
            <label htmlFor="access-user" className="form-label">User</label>
            <select
              id="access-user"
              ref={firstInputRef}
              className={`form-input${errors.userId ? ' error' : ''}`}
              aria-describedby={errors.userId ? 'access-user-error' : undefined}
              aria-invalid={!!errors.userId}
              {...register('userId')}
            >
              <option value="">-- Select User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
              ))}
            </select>
            {errors.userId && (
              <p id="access-user-error" className="form-error" role="alert">{errors.userId.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="access-level" className="form-label">Access Level</label>
            <select
              id="access-level"
              className={`form-input${errors.accessLevel ? ' error' : ''}`}
              aria-describedby={errors.accessLevel ? 'access-level-error' : undefined}
              aria-invalid={!!errors.accessLevel}
              {...register('accessLevel')}
            >
              <option value="READ">READ</option>
              <option value="CONTROL">CONTROL</option>
            </select>
            {errors.accessLevel && (
              <p id="access-level-error" className="form-error" role="alert">{errors.accessLevel.message}</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
              {COMMON_MESSAGES.cancel}
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? COMMON_MESSAGES.saving : DEVICE_MESSAGES.accessGranted}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            To revoke access, select a user and click Revoke.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {users.filter((u) => u.role === 'GUEST').map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => onRevoke(u.id)}
                className="btn-danger"
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.625rem' }}
                aria-label={`Revoke access for ${u.username}`}
              >
                Revoke {u.username}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
