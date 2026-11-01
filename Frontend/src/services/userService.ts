/**
 * User management API service.
 * @see API-004 to API-009, US-002
 */
import apiClient from './apiClient';
import type { PagedResponse, PaginationParams } from '../types/api.types';
import type {
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
  ChangePasswordRequest,
} from '../features/users/types/user.types';

/**
 * Create a new user (ADMIN only).
 * @see API-004, US-002
 */
export async function createUser(request: UserCreateRequest): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/api/v1/users', request);
  return response.data;
}

/**
 * List all users with pagination (ADMIN only).
 * @see API-005, US-002
 */
export async function getUsers(params?: PaginationParams): Promise<PagedResponse<UserResponse>> {
  const response = await apiClient.get<PagedResponse<UserResponse>>('/api/v1/users', { params });
  return response.data;
}

/**
 * Get a user by ID.
 * @see API-006, US-002
 */
export async function getUserById(id: string): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>(`/api/v1/users/${id}`);
  return response.data;
}

/**
 * Update user details.
 * @see API-007, US-002
 */
export async function updateUser(id: string, request: UserUpdateRequest): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>(`/api/v1/users/${id}`, request);
  return response.data;
}

/**
 * Deactivate a user (ADMIN only).
 * @see API-008, US-002
 */
export async function deactivateUser(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/users/${id}`);
}

/**
 * Change user password.
 * @see API-009, US-002
 */
export async function changePassword(id: string, request: ChangePasswordRequest): Promise<void> {
  await apiClient.put(`/api/v1/users/${id}/password`, request);
}
