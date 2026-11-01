/**
 * Automation rules API service.
 * @see API-027 to API-034, US-009, US-010
 */
import apiClient from './apiClient';
import type { PagedResponse, PaginationParams } from '../types/api.types';
import type {
  AutomationRuleResponse,
  AutomationRuleCreateRequest,
  AutomationRuleUpdateRequest,
  AutomationToggleRequest,
  AutomationExecutionLogResponse,
} from '../features/automations/types/automation.types';

/**
 * Create an automation rule.
 * @see API-027, US-009
 */
export async function createAutomationRule(
  request: AutomationRuleCreateRequest,
): Promise<AutomationRuleResponse> {
  const response = await apiClient.post<AutomationRuleResponse>('/api/v1/automations', request);
  return response.data;
}

/**
 * List automation rules.
 * @see API-028, US-009, US-010
 */
export async function getAutomationRules(
  params?: PaginationParams,
): Promise<PagedResponse<AutomationRuleResponse>> {
  const response = await apiClient.get<PagedResponse<AutomationRuleResponse>>(
    '/api/v1/automations',
    { params },
  );
  return response.data;
}

/**
 * Get an automation rule by ID.
 * @see API-029, US-009
 */
export async function getAutomationRuleById(id: string): Promise<AutomationRuleResponse> {
  const response = await apiClient.get<AutomationRuleResponse>(`/api/v1/automations/${id}`);
  return response.data;
}

/**
 * Update an automation rule.
 * @see API-030, US-010
 */
export async function updateAutomationRule(
  id: string,
  request: AutomationRuleUpdateRequest,
): Promise<AutomationRuleResponse> {
  const response = await apiClient.put<AutomationRuleResponse>(
    `/api/v1/automations/${id}`,
    request,
  );
  return response.data;
}

/**
 * Delete an automation rule.
 * @see API-031, US-010
 */
export async function deleteAutomationRule(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/automations/${id}`);
}

/**
 * Toggle enable/disable an automation rule.
 * @see API-032, US-010
 */
export async function toggleAutomationRule(
  id: string,
  request: AutomationToggleRequest,
): Promise<AutomationRuleResponse> {
  const response = await apiClient.patch<AutomationRuleResponse>(
    `/api/v1/automations/${id}/toggle`,
    request,
  );
  return response.data;
}

/**
 * Manually trigger an automation rule.
 * @see API-033, US-010
 */
export async function triggerAutomationRule(
  id: string,
): Promise<AutomationExecutionLogResponse> {
  const response = await apiClient.post<AutomationExecutionLogResponse>(
    `/api/v1/automations/${id}/trigger`,
  );
  return response.data;
}

/**
 * Get execution logs for an automation rule.
 * @see API-034, US-010
 */
export async function getAutomationExecutionLogs(
  id: string,
  params?: PaginationParams,
): Promise<PagedResponse<AutomationExecutionLogResponse>> {
  const response = await apiClient.get<PagedResponse<AutomationExecutionLogResponse>>(
    `/api/v1/automations/${id}/logs`,
    { params },
  );
  return response.data;
}
