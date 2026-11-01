/**
 * User feature TypeScript types.
 * Mirrors LLD 6.4 DTOs for user endpoints API-004 to API-009.
 */

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateRequest {
  username: string;
  email: string;
  role: UserRole;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
