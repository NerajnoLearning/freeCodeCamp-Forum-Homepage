/**
 * @fileoverview Barrel file exporting all services and error classes
 */

// ============================================================================
// API Service
// ============================================================================
export { ForumApiService, forumApiService } from './forumApi.service'
export type { ApiServiceConfig, RequestOptions } from './forumApi.service'

// ============================================================================
// Error Classes
// ============================================================================
export {
  ApiError,
  NetworkError,
  TimeoutError,
  HttpError,
  ParseError,
  CancellationError,
  // Error type guards
  isApiError,
  isNetworkError,
  isTimeoutError,
  isHttpError,
  isParseError,
  isCancellationError,
  // Error utilities
  getErrorMessage,
  getErrorStatusCode,
} from './errors'
