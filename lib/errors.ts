// Error types for better type safety in API routes and error handling

export interface ValidationError extends Error {
  issues?: Array<{
    code: string;
    path: (string | number)[];
    message: string;
  }>;
}

export interface AuthError extends Error {
  status?: number;
}

export interface ServiceError extends Error {
  code?: string;
  status?: number;
}

// Type guard functions
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof Error && 'issues' in error;
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof Error && (
    error.message.includes('Unauthorized') ||
    error.message.includes('Authentication') ||
    error.message.includes('permission')
  );
}

export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof Error && 'code' in error;
}

// Helper function for safe error handling
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

export function getErrorStatus(error: unknown): number {
  if (isValidationError(error)) {
    return 400;
  }
  if (isAuthError(error)) {
    return 401;
  }
  if (isServiceError(error) && error.status) {
    return error.status;
  }
  return 500;
}