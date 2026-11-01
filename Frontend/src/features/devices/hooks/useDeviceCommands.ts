/**
 * useDeviceCommands hook.
 * Manages device command issuance and command history.
 * @see US-006, API-023, API-024
 */
import { useState, useEffect, useCallback } from 'react';
import * as deviceService from '../../../services/deviceService';
import type { DeviceCommandRequest, DeviceCommandResponse } from '../types/device.types';
import type { PagedResponse } from '../../../types/api.types';
import { useNotificationStore } from '../../../store/notificationStore';
import { getErrorMessage } from '../../../utils/errorUtils';
import { DEVICE_MESSAGES } from '../../../messages';

export function useDeviceCommands(deviceId: string, page: number, size: number) {
  const [data, setData] = useState<PagedResponse<DeviceCommandResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deviceService.getCommandHistory(deviceId, { page, size, sort: 'issuedAt,desc' });
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, page, size]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const issueCommand = async (request: DeviceCommandRequest): Promise<boolean> => {
    try {
      await deviceService.issueCommand(deviceId, request);
      addNotification('success', DEVICE_MESSAGES.commandIssued);
      void fetchHistory();
      return true;
    } catch (err) {
      addNotification('error', getErrorMessage(err));
      return false;
    }
  };

  return { data, isLoading, error, refetch: fetchHistory, issueCommand };
}
