/**
 * Telemetry API service.
 * @see API-025, API-026, US-007, US-008
 */
import apiClient from './apiClient';
import type { PagedResponse } from '../types/api.types';
import type {
  TelemetryResponse,
  TelemetryIngestRequest,
  TelemetryQueryParams,
} from '../features/telemetry/types/telemetry.types';

/**
 * Ingest telemetry data (SYSTEM/ADMIN only).
 * @see API-025, US-007
 */
export async function ingestTelemetry(
  request: TelemetryIngestRequest,
): Promise<TelemetryResponse> {
  const response = await apiClient.post<TelemetryResponse>('/api/v1/telemetry', request);
  return response.data;
}

/**
 * Get telemetry data for a device.
 * @see API-026, US-007, US-008
 */
export async function getDeviceTelemetry(
  deviceId: string,
  params?: TelemetryQueryParams,
): Promise<PagedResponse<TelemetryResponse>> {
  const response = await apiClient.get<PagedResponse<TelemetryResponse>>(
    `/api/v1/devices/${deviceId}/telemetry`,
    { params },
  );
  return response.data;
}
