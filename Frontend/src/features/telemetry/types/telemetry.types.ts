/**
 * Telemetry feature TypeScript types.
 * Mirrors LLD 6.4 DTOs for telemetry endpoints API-025, API-026.
 */

export interface TelemetryResponse {
  id: string;
  deviceId: string;
  metricName: string;
  metricValue: number;
  unit?: string;
  rawPayload?: Record<string, unknown>;
  recordedAt: string;
}

export interface TelemetryIngestRequest {
  deviceId: string;
  metricName: string;
  metricValue: number;
  unit?: string;
  rawPayload?: Record<string, unknown>;
  recordedAt: string;
}

export interface TelemetryQueryParams {
  from?: string;
  to?: string;
  metricName?: string;
  page?: number;
  size?: number;
}
