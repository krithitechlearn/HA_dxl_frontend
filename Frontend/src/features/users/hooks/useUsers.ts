/**
 * useUsers hook.
 * Manages user list, create, update, deactivate, and password change operations.
 * @see US-002, API-004 to API-009
 */
import { useState, useEffect, useCallback } from 'react';
import * as userService from '../../../services/userService';
import type { UserResponse, UserCreateRequest, UserUpdateRequest, ChangePasswordRequest } from '../types/user.types';
import type { PagedResponse } from '../../../types/api.types';
import { useNotificationStore } from '../../../store/notificationStore';
import { getErrorMessage, mapFieldErrorsToForm, getFieldErrors } from '../../../utils/errorUtils';
import { USER_MESSAGES } from '../../../messages';

export function useUsers(page: number, size: number) {
  const [data, setData] = useState<PagedResponse<UserResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.getUsers({ page, size, sort: 'username,asc' });
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const createUser = async (
    request: UserCreateRequest,
    setError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await userService.createUser(request);
      addNotification('success', USER_MESSAGES.userCreated);
      void fetchUsers();
      return true;
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        mapFieldErrorsToForm(fieldErrors, setError);
      } else {
        addNotification('error', getErrorMessage(err));
      }
      return false;
    }
  };

  const updateUser = async (
    id: string,
    request: UserUpdateRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await userService.updateUser(id, request);
      addNotification('success', USER_MESSAGES.userUpdated);
      void fetchUsers();
      return true;
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        mapFieldErrorsToForm(fieldErrors, setFormError);
      } else {
        addNotification('error', getErrorMessage(err));
      }
      return false;
    }
  };

  const deactivateUser = async (id: string): Promise<boolean> => {
    try {
      await userService.deactivateUser(id);
      addNotification('success', USER_MESSAGES.userDeactivated);
      void fetchUsers();
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  const changePassword = async (
    id: string,
    request: ChangePasswordRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await userService.changePassword(id, request);
      addNotification('success', USER_MESSAGES.passwordChanged);
      return true;
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors.length > 0) {
        mapFieldErrorsToForm(fieldErrors, setFormError);
      } else {
        addNotification('error', getErrorMessage(err));
      }
      return false;
    }
  };

  return { data, isLoading, error, refetch: fetchUsers, createUser, updateUser, deactivateUser, changePassword };
}

export function useUserById(id: string) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    userService.getUserById(id)
      .then((data) => { if (!cancelled) setUser(data); })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { user, isLoading, error };
}
