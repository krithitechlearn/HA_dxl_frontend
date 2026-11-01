/**
 * useDevices hook.
 * Manages device list, create, update, deactivate, and access operations.
 * @see US-003, US-004, US-005, API-015 to API-022
 */
import { useState, useEffect, useCallback } from 'react';
import * as deviceService from '../../../services/deviceService';
import type {
  DeviceResponse,
  DeviceCreateRequest,
  DeviceUpdateRequest,
  DeviceAccessRequest,
  DeviceFilterParams,
} from '../types/device.types';
import type { PagedResponse } from '../../../types/api.types';
import { useNotificationStore } from '../../../store/notificationStore';
import { getErrorMessage, mapFieldErrorsToForm, getFieldErrors } from '../../../utils/errorUtils';
import { DEVICE_MESSAGES } from '../../../messages';

export function useDevices(params: DeviceFilterParams & { page: number; size: number }) {
  const [data, setData] = useState<PagedResponse<DeviceResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deviceService.getDevices(params);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.size, params.roomId, params.status, params.type]);

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  const createDevice = async (
    request: DeviceCreateRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await deviceService.createDevice(request);
      addNotification('success', DEVICE_MESSAGES.deviceCreated);
      void fetchDevices();
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

  const updateDevice = async (
    id: string,
    request: DeviceUpdateRequest,
    setFormError: (field: string, err: { type: string; message: string }) => void,
  ): Promise<boolean> => {
    try {
      await deviceService.updateDevice(id, request);
      addNotification('success', DEVICE_MESSAGES.deviceUpdated);
      void fetchDevices();
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

  const deactivateDevice = async (id: string): Promise<boolean> => {
    try {
      await deviceService.deactivateDevice(id);
      addNotification('success', DEVICE_MESSAGES.deviceDeactivated);
      void fetchDevices();
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  const grantAccess = async (deviceId: string, request: DeviceAccessRequest): Promise<boolean> => {
    try {
      await deviceService.grantDeviceAccess(deviceId, request);
      addNotification('success', DEVICE_MESSAGES.accessGranted);
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  const revokeAccess = async (deviceId: string, userId: string): Promise<boolean> => {
    try {
      await deviceService.revokeDeviceAccess(deviceId, userId);
      addNotification('success', DEVICE_MESSAGES.accessRevoked);
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  return { data, isLoading, error, refetch: fetchDevices, createDevice, updateDevice, deactivateDevice, grantAccess, revokeAccess };
}

export function useDeviceById(id: string) {
  const [device, setDevice] = useState<DeviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevice = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await deviceService.getDeviceById(id);
      setDevice(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDevice();
  }, [fetchDevice]);

  return { device, isLoading, error, refetch: fetchDevice };
}
