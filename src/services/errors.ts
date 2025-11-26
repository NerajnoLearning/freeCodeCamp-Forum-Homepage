/**
 * @fileoverview Custom error classes for API service layer
 * Provides detailed error information for better error handling and debugging
 */

/**
 * Base API error class
 * All API errors extend from this class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Network error - thrown when network request fails
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network request failed', originalError?: unknown) {
    super(message, undefined, originalError)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

/**
 * Timeout error - thrown when request exceeds timeout limit
 */
export class TimeoutError extends ApiError {
  constructor(
    message: string = 'Request timed out',
    public readonly timeoutMs: number
  ) {
    super(message)
    this.name = 'TimeoutError'
    Object.setPrototypeOf(this, TimeoutError.prototype)
  }
}

/**
 * HTTP error - thrown when server returns an error status code
 */
export class HttpError extends ApiError {
  constructor(
    message: string,
    statusCode: number,
    public readonly response?: Response
  ) {
    super(message, statusCode)
    this.name = 'HttpError'
    Object.setPrototypeOf(this, HttpError.prototype)
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 400 && this.statusCode < 500
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 500 && this.statusCode < 600
  }
}

/**
 * Parse error - thrown when response parsing fails
 */
export class ParseError extends ApiError {
  constructor(message: string = 'Failed to parse response', originalError?: unknown) {
    super(message, undefined, originalError)
    this.name = 'ParseError'
    Object.setPrototypeOf(this, ParseError.prototype)
  }
}

/**
 * Cancellation error - thrown when request is cancelled
 */
export class CancellationError extends ApiError {
  constructor(message: string = 'Request was cancelled') {
    super(message)
    this.name = 'CancellationError'
    Object.setPrototypeOf(this, CancellationError.prototype)
  }
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Type guard to check if error is a NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

/**
 * Type guard to check if error is a TimeoutError
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError
}

/**
 * Type guard to check if error is an HttpError
 */
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError
}

/**
 * Type guard to check if error is a ParseError
 */
export function isParseError(error: unknown): error is ParseError {
  return error instanceof ParseError
}

/**
 * Type guard to check if error is a CancellationError
 */
export function isCancellationError(error: unknown): error is CancellationError {
  return error instanceof CancellationError
}

/**
 * Get a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unknown error occurred'
}

/**
 * Get HTTP status code from error if available
 */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.statusCode
  }
  return undefined
}
