/**
 * Shared API types matching the LLD 6.4 DTO schemas.
 * All field names in camelCase as per JSON contract.
 */

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  errorCode: string;
  message: string;
  path: string;
  traceId: string;
  fieldErrors: FieldError[];
}

export interface FieldError {
  field: string;
  rejectedValue: unknown;
  message: string;
}

export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}
