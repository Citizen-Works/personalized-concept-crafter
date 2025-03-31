// Custom error types for different categories of errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 401, 'AUTH_ERROR', details);
    this.name = 'AuthError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 429, 'RATE_LIMIT', details);
    this.name = 'RateLimitError';
  }
}

interface SupabaseError {
  message: string;
  code?: string;
  details?: unknown;
}

interface ClaudeError {
  error: {
    message: string;
    type?: string;
  };
}

// Error handling utility functions
export const handleApiError = (error: unknown): ApiError => {
  console.error('API Error:', error);

  // If it's already our custom error type, return it
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as SupabaseError;
    
    switch (supabaseError.code) {
      case 'PGRST116': // Not found
        return new NotFoundError(supabaseError.message, supabaseError.details);
      case '42501': // Permission denied
        return new AuthError('You do not have permission to perform this action', supabaseError.details);
      case '23505': // Unique violation
        return new ValidationError('This record already exists', supabaseError.details);
      default:
        return new ApiError(supabaseError.message, 500, 'DATABASE_ERROR', supabaseError.details);
    }
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
  }

  // Handle Claude API errors
  if (error && typeof error === 'object' && 'error' in error) {
    const claudeError = error as ClaudeError;
    return new ApiError(claudeError.error.message, 500, 'AI_ERROR', claudeError.error);
  }

  // Default error
  return new ApiError(
    'An unexpected error occurred. Please try again later.',
    500,
    'UNKNOWN_ERROR'
  );
};

/**
 * Wraps an async operation with error handling
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Gets a user-friendly error message based on the error type
 */
export const getUserFriendlyMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.constructor) {
      case AuthError:
        return 'Please sign in to continue.';
      case ValidationError:
        return 'Please check your input and try again.';
      case NotFoundError:
        return 'The requested resource was not found.';
      case RateLimitError:
        return 'Too many requests. Please try again later.';
      default:
        return error.message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
}; 