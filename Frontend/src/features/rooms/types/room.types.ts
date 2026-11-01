/**
 * Room feature TypeScript types.
 * Mirrors LLD 6.4 DTOs for room endpoints API-010 to API-014.
 */

export interface RoomResponse {
  id: string;
  name: string;
  description?: string;
  floorLevel?: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomCreateRequest {
  name: string;
  description?: string;
  floorLevel?: string;
}

export interface RoomUpdateRequest {
  name: string;
  description?: string;
  floorLevel?: string;
}
