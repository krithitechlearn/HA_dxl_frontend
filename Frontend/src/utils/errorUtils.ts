/**
 * Utility functions for normalizing API errors.
 * Maps backend error codes to user-friendly messages.
 */
import type { ApiError, FieldError } from '../types/api.types';
import { ERROR_MESSAGES } from '../messages';

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errorCode' in error &&
    'status' in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return ERROR_MESSAGES[error.errorCode] ?? error.message ?? ERROR_MESSAGES.INTERNAL_ERROR;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return ERROR_MESSAGES.INTERNAL_ERROR;
}

export function getFieldErrors(error: unknown): FieldError[] {
  if (isApiError(error) && Array.isArray(error.fieldErrors)) {
    return error.fieldErrors;
  }
  return [];
}

export function mapFieldErrorsToForm(
  fieldErrors: FieldError[],
  setError: (field: string, error: { type: string; message: string }) => void,
): void {
  fieldErrors.forEach(({ field, message }) => {
    setError(field, { type: 'server', message });
  });
}
