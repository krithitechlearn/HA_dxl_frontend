/**
 * Auth feature TypeScript types.
 * Mirrors LLD 6.4 DTOs for auth endpoints API-001, API-002, API-003.
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
}
