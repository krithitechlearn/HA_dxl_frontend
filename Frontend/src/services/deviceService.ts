/**
 * Device management API service.
 * @see API-015 to API-024, US-003, US-004, US-005, US-006
 */
import apiClient from './apiClient';
import type { PagedResponse, PaginationParams } from '../types/api.types';
import type {
  DeviceResponse,
  DeviceCreateRequest,
  DeviceUpdateRequest,
  DeviceCommandRequest,
  DeviceCommandResponse,
  DeviceAccessRequest,
  AssignRoomRequest,
  DeviceFilterParams,
} from '../features/devices/types/device.types';

/**
 * Register a new device (ADMIN only).
 * @see API-015, US-003, US-004
 */
export async function createDevice(request: DeviceCreateRequest): Promise<DeviceResponse> {
  const response = await apiClient.post<DeviceResponse>('/api/v1/devices', request);
  return response.data;
}

/**
 * List devices with optional filters.
 * @see API-016, US-004, US-005
 */
export async function getDevices(
  params?: DeviceFilterParams & PaginationParams,
): Promise<PagedResponse<DeviceResponse>> {
  const response = await apiClient.get<PagedResponse<DeviceResponse>>('/api/v1/devices', {
    params,
  });
  return response.data;
}

/**
 * Get a device by ID.
 * @see API-017, US-004
 */
export async function getDeviceById(id: string): Promise<DeviceResponse> {
  const response = await apiClient.get<DeviceResponse>(`/api/v1/devices/${id}`);
  return response.data;
}

/**
 * Update device details.
 * @see API-018, US-004
 */
export async function updateDevice(
  id: string,
  request: DeviceUpdateRequest,
): Promise<DeviceResponse> {
  const response = await apiClient.put<DeviceResponse>(`/api/v1/devices/${id}`, request);
  return response.data;
}

/**
 * Deactivate a device (ADMIN only).
 * @see API-019, US-004
 */
export async function deactivateDevice(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/devices/${id}`);
}

/**
 * Assign a device to a room (ADMIN only).
 * @see API-020, US-003, US-004
 */
export async function assignDeviceToRoom(
  deviceId: string,
  request: AssignRoomRequest,
): Promise<DeviceResponse> {
  const response = await apiClient.put<DeviceResponse>(
    `/api/v1/devices/${deviceId}/room`,
    request,
  );
  return response.data;
}

/**
 * Grant device access to a user (ADMIN only).
 * @see API-021, US-005
 */
export async function grantDeviceAccess(
  deviceId: string,
  request: DeviceAccessRequest,
): Promise<void> {
  await apiClient.post(`/api/v1/devices/${deviceId}/access`, request);
}

/**
 * Revoke device access from a user (ADMIN only).
 * @see API-022, US-005
 */
export async function revokeDeviceAccess(deviceId: string, userId: string): Promise<void> {
  await apiClient.delete(`/api/v1/devices/${deviceId}/access/${userId}`);
}

/**
 * Issue a command to a device.
 * @see API-023, US-006
 */
export async function issueCommand(
  deviceId: string,
  request: DeviceCommandRequest,
): Promise<DeviceCommandResponse> {
  const response = await apiClient.post<DeviceCommandResponse>(
    `/api/v1/devices/${deviceId}/commands`,
    request,
  );
  return response.data;
}

/**
 * Get command history for a device.
 * @see API-024, US-006
 */
export async function getCommandHistory(
  deviceId: string,
  params?: PaginationParams,
): Promise<PagedResponse<DeviceCommandResponse>> {
  const response = await apiClient.get<PagedResponse<DeviceCommandResponse>>(
    `/api/v1/devices/${deviceId}/commands`,
    { params },
  );
  return response.data;
}
