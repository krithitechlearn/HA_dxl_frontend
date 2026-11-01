/**
 * UserForm component.
 * Handles both create and edit user operations.
 * @see US-002, API-004, API-007
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  userCreateSchema,
  userUpdateSchema,
  type UserCreateFormValues,
  type UserUpdateFormValues,
} from '../../../utils/validationSchemas';
import type { UserResponse } from '../types/user.types';
import { USER_MESSAGES, COMMON_MESSAGES } from '../../../messages';

interface UserFormProps {
  user?: UserResponse;
  onSave: (
    values: UserCreateFormValues | UserUpdateFormValues,
    setError: (field: string, err: { type: string; message: string }) => void,
  ) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSave, onCancel, isLoading = false }: UserFormProps) {
  const isEdit = !!user;

  const createForm = useForm<UserCreateFormValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: { username: '', email: '', password: '', role: 'USER' },
  });

  const editForm = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: { username: user?.username ?? '', email: user?.email ?? '', role: user?.role ?? 'USER' },
  });

  const form = isEdit ? editForm : createForm;
  const { register, handleSubmit, formState: { errors }, setError } = form;

  useEffect(() => {
    if (user) {
      editForm.reset({ username: user.username, email: user.email, role: user.role });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFormSubmit = async (values: UserCreateFormValues | UserUpdateFormValues) => {
    await onSave(values, setError as (field: string, err: { type: string; message: string }) => void);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate aria-label={isEdit ? 'Edit user form' : 'Create user form'}>
      <div className="form-group">
        <label htmlFor="user-username" className="form-label">Username</label>
        <input
          id="user-username"
          type="text"
          className={`form-input${errors.username ? ' error' : ''}`}
          aria-describedby={errors.username ? 'user-username-error' : undefined}
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        {errors.username && (
          <p id="user-username-error" className="form-error" role="alert">{errors.username.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="user-email" className="form-label">Email</label>
        <input
          id="user-email"
          type="email"
          className={`form-input${errors.email ? ' error' : ''}`}
          aria-describedby={errors.email ? 'user-email-error' : undefined}
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p id="user-email-error" className="form-error" role="alert">{errors.email.message}</p>
        )}
      </div>

      {!isEdit && (
        <div className="form-group">
          <label htmlFor="user-password" className="form-label">Password</label>
          <input
            id="user-password"
            type="password"
            autoComplete="new-password"
            className={`form-input${'password' in errors && errors.password ? ' error' : ''}`}
            aria-describedby={'password' in errors && errors.password ? 'user-password-error' : undefined}
            aria-invalid={!!(('password' in errors) && errors.password)}
            {...register('password' as keyof UserCreateFormValues)}
          />
          {'password' in errors && errors.password && (
            <p id="user-password-error" className="form-error" role="alert">
              {(errors as { password?: { message?: string } }).password?.message}
            </p>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="user-role" className="form-label">Role</label>
        <select
          id="user-role"
          className={`form-input${errors.role ? ' error' : ''}`}
          aria-describedby={errors.role ? 'user-role-error' : undefined}
          aria-invalid={!!errors.role}
          {...register('role')}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="GUEST">GUEST</option>
        </select>
        {errors.role && (
          <p id="user-role-error" className="form-error" role="alert">{errors.role.message}</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
          {COMMON_MESSAGES.cancel}
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? COMMON_MESSAGES.saving : (isEdit ? COMMON_MESSAGES.save : USER_MESSAGES.createUser)}
        </button>
      </div>
    </form>
  );
}
