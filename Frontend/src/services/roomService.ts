/**
 * Room management API service.
 * @see API-010 to API-014, US-003
 */
import apiClient from './apiClient';
import type { PagedResponse, PaginationParams } from '../types/api.types';
import type {
  RoomResponse,
  RoomCreateRequest,
  RoomUpdateRequest,
} from '../features/rooms/types/room.types';

/**
 * Create a new room (ADMIN only).
 * @see API-010, US-003
 */
export async function createRoom(request: RoomCreateRequest): Promise<RoomResponse> {
  const response = await apiClient.post<RoomResponse>('/api/v1/rooms', request);
  return response.data;
}

/**
 * List all rooms with pagination.
 * @see API-011, US-003
 */
export async function getRooms(params?: PaginationParams): Promise<PagedResponse<RoomResponse>> {
  const response = await apiClient.get<PagedResponse<RoomResponse>>('/api/v1/rooms', { params });
  return response.data;
}

/**
 * Get a room by ID.
 * @see API-012, US-003
 */
export async function getRoomById(id: string): Promise<RoomResponse> {
  const response = await apiClient.get<RoomResponse>(`/api/v1/rooms/${id}`);
  return response.data;
}

/**
 * Update room details (ADMIN only).
 * @see API-013, US-003
 */
export async function updateRoom(id: string, request: RoomUpdateRequest): Promise<RoomResponse> {
  const response = await apiClient.put<RoomResponse>(`/api/v1/rooms/${id}`, request);
  return response.data;
}

/**
 * Delete a room (ADMIN only).
 * @see API-014, US-003
 */
export async function deleteRoom(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/rooms/${id}`);
}
