/**
 * useTelemetry hook.
 * Fetches device telemetry data for display and charting.
 * @see US-007, US-008, API-026
 */
import { useState, useEffect, useCallback } from 'react';
import * as telemetryService from '../../../services/telemetryService';
import type { TelemetryResponse, TelemetryQueryParams } from '../types/telemetry.types';
import type { PagedResponse } from '../../../types/api.types';
import { getErrorMessage } from '../../../utils/errorUtils';

export function useTelemetry(deviceId: string, params: TelemetryQueryParams) {
  const [data, setData] = useState<PagedResponse<TelemetryResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await telemetryService.getDeviceTelemetry(deviceId, params);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, params.from, params.to, params.metricName, params.page, params.size]);

  useEffect(() => {
    void fetchTelemetry();
  }, [fetchTelemetry]);

  return { data, isLoading, error, refetch: fetchTelemetry };
}
