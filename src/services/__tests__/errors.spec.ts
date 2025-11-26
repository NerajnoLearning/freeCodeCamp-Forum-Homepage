/**
 * @fileoverview Unit tests for custom error classes
 */

import { describe, it, expect } from 'vitest'
import {
  ApiError,
  NetworkError,
  TimeoutError,
  HttpError,
  ParseError,
  CancellationError,
  isApiError,
  isNetworkError,
  isTimeoutError,
  isHttpError,
  isParseError,
  isCancellationError,
  getErrorMessage,
  getErrorStatusCode,
} from '../errors'

describe('Error Classes', () => {
  describe('ApiError', () => {
    it('should create ApiError with message', () => {
      const error = new ApiError('Test error')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(ApiError)
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('ApiError')
      expect(error.statusCode).toBeUndefined()
    })

    it('should create ApiError with status code', () => {
      const error = new ApiError('Test error', 500)

      expect(error.statusCode).toBe(500)
    })

    it('should create ApiError with original error', () => {
      const originalError = new Error('Original')
      const error = new ApiError('Test error', undefined, originalError)

      expect(error.originalError).toBe(originalError)
    })
  })

  describe('NetworkError', () => {
    it('should create NetworkError with default message', () => {
      const error = new NetworkError()

      expect(error).toBeInstanceOf(ApiError)
      expect(error).toBeInstanceOf(NetworkError)
      expect(error.message).toBe('Network request failed')
      expect(error.name).toBe('NetworkError')
    })

    it('should create NetworkError with custom message', () => {
      const error = new NetworkError('Connection refused')

      expect(error.message).toBe('Connection refused')
    })

    it('should create NetworkError with original error', () => {
      const originalError = new Error('Original')
      const error = new NetworkError('Test', originalError)

      expect(error.originalError).toBe(originalError)
    })
  })

  describe('TimeoutError', () => {
    it('should create TimeoutError with timeout value', () => {
      const error = new TimeoutError('Timeout', 5000)

      expect(error).toBeInstanceOf(ApiError)
      expect(error).toBeInstanceOf(TimeoutError)
      expect(error.message).toBe('Timeout')
      expect(error.name).toBe('TimeoutError')
      expect(error.timeoutMs).toBe(5000)
    })

    it('should create TimeoutError with default message', () => {
      const error = new TimeoutError(undefined as any, 1000)

      expect(error.message).toBe('Request timed out')
    })
  })

  describe('HttpError', () => {
    it('should create HttpError with status code', () => {
      const error = new HttpError('Not found', 404)

      expect(error).toBeInstanceOf(ApiError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error.message).toBe('Not found')
      expect(error.name).toBe('HttpError')
      expect(error.statusCode).toBe(404)
    })

    it('should identify client errors (4xx)', () => {
      const error400 = new HttpError('Bad Request', 400)
      const error404 = new HttpError('Not Found', 404)
      const error500 = new HttpError('Server Error', 500)

      expect(error400.isClientError()).toBe(true)
      expect(error404.isClientError()).toBe(true)
      expect(error500.isClientError()).toBe(false)
    })

    it('should identify server errors (5xx)', () => {
      const error404 = new HttpError('Not Found', 404)
      const error500 = new HttpError('Server Error', 500)
      const error503 = new HttpError('Unavailable', 503)

      expect(error404.isServerError()).toBe(false)
      expect(error500.isServerError()).toBe(true)
      expect(error503.isServerError()).toBe(true)
    })

    it('should store response object', () => {
      const mockResponse = { status: 404 } as Response
      const error = new HttpError('Not found', 404, mockResponse)

      expect(error.response).toBe(mockResponse)
    })
  })

  describe('ParseError', () => {
    it('should create ParseError with default message', () => {
      const error = new ParseError()

      expect(error).toBeInstanceOf(ApiError)
      expect(error).toBeInstanceOf(ParseError)
      expect(error.message).toBe('Failed to parse response')
      expect(error.name).toBe('ParseError')
    })

    it('should create ParseError with custom message', () => {
      const error = new ParseError('Invalid JSON')

      expect(error.message).toBe('Invalid JSON')
    })

    it('should create ParseError with original error', () => {
      const originalError = new SyntaxError('Unexpected token')
      const error = new ParseError('Invalid JSON', originalError)

      expect(error.originalError).toBe(originalError)
    })
  })

  describe('CancellationError', () => {
    it('should create CancellationError with default message', () => {
      const error = new CancellationError()

      expect(error).toBeInstanceOf(ApiError)
      expect(error).toBeInstanceOf(CancellationError)
      expect(error.message).toBe('Request was cancelled')
      expect(error.name).toBe('CancellationError')
    })

    it('should create CancellationError with custom message', () => {
      const error = new CancellationError('User cancelled')

      expect(error.message).toBe('User cancelled')
    })
  })

  describe('Type Guards', () => {
    it('isApiError should identify ApiError instances', () => {
      const apiError = new ApiError('Test')
      const networkError = new NetworkError()
      const regularError = new Error('Test')

      expect(isApiError(apiError)).toBe(true)
      expect(isApiError(networkError)).toBe(true) // NetworkError extends ApiError
      expect(isApiError(regularError)).toBe(false)
      expect(isApiError('string')).toBe(false)
      expect(isApiError(null)).toBe(false)
    })

    it('isNetworkError should identify NetworkError instances', () => {
      const networkError = new NetworkError()
      const apiError = new ApiError('Test')

      expect(isNetworkError(networkError)).toBe(true)
      expect(isNetworkError(apiError)).toBe(false)
    })

    it('isTimeoutError should identify TimeoutError instances', () => {
      const timeoutError = new TimeoutError('Test', 5000)
      const networkError = new NetworkError()

      expect(isTimeoutError(timeoutError)).toBe(true)
      expect(isTimeoutError(networkError)).toBe(false)
    })

    it('isHttpError should identify HttpError instances', () => {
      const httpError = new HttpError('Not found', 404)
      const networkError = new NetworkError()

      expect(isHttpError(httpError)).toBe(true)
      expect(isHttpError(networkError)).toBe(false)
    })

    it('isParseError should identify ParseError instances', () => {
      const parseError = new ParseError()
      const networkError = new NetworkError()

      expect(isParseError(parseError)).toBe(true)
      expect(isParseError(networkError)).toBe(false)
    })

    it('isCancellationError should identify CancellationError instances', () => {
      const cancellationError = new CancellationError()
      const networkError = new NetworkError()

      expect(isCancellationError(cancellationError)).toBe(true)
      expect(isCancellationError(networkError)).toBe(false)
    })
  })

  describe('Utility Functions', () => {
    it('getErrorMessage should extract message from ApiError', () => {
      const error = new ApiError('Test error')

      expect(getErrorMessage(error)).toBe('Test error')
    })

    it('getErrorMessage should extract message from Error', () => {
      const error = new Error('Regular error')

      expect(getErrorMessage(error)).toBe('Regular error')
    })

    it('getErrorMessage should handle string errors', () => {
      expect(getErrorMessage('String error')).toBe('String error')
    })

    it('getErrorMessage should handle unknown errors', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred')
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred')
      expect(getErrorMessage(123)).toBe('An unknown error occurred')
    })

    it('getErrorStatusCode should extract status code from ApiError', () => {
      const error = new ApiError('Test', 500)

      expect(getErrorStatusCode(error)).toBe(500)
    })

    it('getErrorStatusCode should return undefined for errors without status', () => {
      const error = new Error('Test')

      expect(getErrorStatusCode(error)).toBeUndefined()
    })
  })

  describe('Error Inheritance', () => {
    it('should maintain prototype chain', () => {
      const networkError = new NetworkError()

      expect(networkError instanceof NetworkError).toBe(true)
      expect(networkError instanceof ApiError).toBe(true)
      expect(networkError instanceof Error).toBe(true)
    })

    it('should work with instanceof checks after serialization', () => {
      const error = new HttpError('Test', 404)

      // Simulate JSON serialization/deserialization
      const serialized = JSON.stringify(error)
      const deserialized = Object.assign(new HttpError('', 0), JSON.parse(serialized))

      expect(deserialized instanceof HttpError).toBe(true)
    })
  })
})
