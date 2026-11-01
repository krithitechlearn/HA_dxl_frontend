/**
 * Auth API service.
 * Handles login, refresh, and logout API calls.
 * @see API-001, API-002, API-003, US-001
 */
import apiClient from './apiClient';
import type { LoginRequest, LoginResponse } from '../features/auth/types/auth.types';

/**
 * Authenticate user with username and password.
 * @see API-001, US-001
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', request);
  return response.data;
}

/**
 * Refresh access token using HttpOnly refresh cookie.
 * @see API-002, US-001
 */
export async function refreshToken(): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/api/v1/auth/refresh');
  return response.data;
}

/**
 * Logout current user and clear HttpOnly cookies.
 * @see API-003, US-001
 */
export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout');
}
