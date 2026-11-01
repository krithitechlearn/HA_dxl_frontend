/**
 * Audit log API service.
 * @see API-035, API-036, US-011
 */
import apiClient from './apiClient';
import type { PagedResponse } from '../types/api.types';
import type {
  AuditLogResponse,
  AuditLogQueryParams,
} from '../features/audit/types/audit.types';

/**
 * Query audit logs with filters (ADMIN only).
 * @see API-035, US-011
 */
export async function getAuditLogs(
  params?: AuditLogQueryParams,
): Promise<PagedResponse<AuditLogResponse>> {
  const response = await apiClient.get<PagedResponse<AuditLogResponse>>('/api/v1/audit-logs', {
    params,
  });
  return response.data;
}

/**
 * Get a single audit log entry by ID (ADMIN only).
 * @see API-036, US-011
 */
export async function getAuditLogById(id: string): Promise<AuditLogResponse> {
  const response = await apiClient.get<AuditLogResponse>(`/api/v1/audit-logs/${id}`);
  return response.data;
}
