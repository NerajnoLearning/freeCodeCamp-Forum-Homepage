/**
 * @fileoverview Robust API service for interacting with the freeCodeCamp Forum API
 * Features:
 * - Type-safe API calls
 * - Exponential backoff retry logic (3 attempts)
 * - Request timeout (10s default)
 * - Response caching with TTL (5 minutes)
 * - Request cancellation support
 * - Comprehensive error handling
 */

import type { LatestTopicsResponse, TopicDetailsResponse, TopicId } from '@/types'
import {
  ApiError,
  NetworkError,
  TimeoutError,
  HttpError,
  ParseError,
  CancellationError,
} from './errors'

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Configuration options for the API service
 */
export interface ApiServiceConfig {
  /** Base URL for API requests */
  baseUrl: string
  /** Default timeout in milliseconds */
  timeout: number
  /** Maximum number of retry attempts */
  maxRetries: number
  /** Initial delay for exponential backoff in milliseconds */
  retryDelay: number
  /** Cache TTL in milliseconds */
  cacheTTL: number
  /** Whether to enable caching */
  enableCache: boolean
}

/**
 * Options for individual API requests
 */
export interface RequestOptions {
  /** Request timeout in milliseconds (overrides default) */
  timeout?: number
  /** Abort signal for cancellation */
  signal?: AbortSignal
  /** Whether to skip cache for this request */
  skipCache?: boolean
  /** Whether to skip retries for this request */
  skipRetries?: boolean
}

/**
 * Cache entry with TTL
 */
interface CacheEntry<T> {
  /** Cached data */
  data: T
  /** Timestamp when cached */
  timestamp: number
  /** Time-to-live in milliseconds */
  ttl: number
}

// ============================================================================
// Forum API Service Class
// ============================================================================

/**
 * Main API service class for forum data
 */
export class ForumApiService {
  private readonly config: ApiServiceConfig
  private readonly cache: Map<string, CacheEntry<unknown>>
  private activeRequests: Map<string, AbortController>

  constructor(config?: Partial<ApiServiceConfig>) {
    this.config = {
      baseUrl: import.meta.env.VITE_API_URL || 'https://forum-proxy.freecodecamp.rocks',
      timeout: 10000, // 10 seconds
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      enableCache: true,
      ...config,
    }

    this.cache = new Map()
    this.activeRequests = new Map()

    // Cleanup cache every minute
    if (this.config.enableCache) {
      setInterval(() => this.cleanupCache(), 60000)
    }
  }

  // ============================================================================
  // Public API Methods
  // ============================================================================

  /**
   * Fetches the latest topics from the forum
   * @param options - Request options
   * @returns Promise with latest topics response
   * @throws {NetworkError} When network request fails
   * @throws {TimeoutError} When request times out
   * @throws {HttpError} When server returns error status
   * @throws {ParseError} When response parsing fails
   * @throws {CancellationError} When request is cancelled
   */
  async fetchLatestTopics(options?: RequestOptions): Promise<LatestTopicsResponse> {
    const cacheKey = 'latest-topics'
    return this.fetchWithCache<LatestTopicsResponse>('/latest', cacheKey, options)
  }

  /**
   * Fetches details for a specific topic
   * @param topicId - The topic ID
   * @param options - Request options
   * @returns Promise with topic details response
   */
  async fetchTopicDetails(
    topicId: TopicId,
    options?: RequestOptions
  ): Promise<TopicDetailsResponse> {
    const cacheKey = `topic-${topicId}`
    return this.fetchWithCache<TopicDetailsResponse>(`/t/${topicId}`, cacheKey, options)
  }

  /**
   * Clears all cached responses
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Clears cache for a specific key
   */
  clearCacheEntry(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Cancels all active requests
   */
  cancelAllRequests(): void {
    this.activeRequests.forEach((controller) => controller.abort())
    this.activeRequests.clear()
  }

  /**
   * Cancels a specific request by cache key
   */
  cancelRequest(cacheKey: string): void {
    const controller = this.activeRequests.get(cacheKey)
    if (controller) {
      controller.abort()
      this.activeRequests.delete(cacheKey)
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Fetch with caching support
   */
  private async fetchWithCache<T>(
    endpoint: string,
    cacheKey: string,
    options?: RequestOptions
  ): Promise<T> {
    // Check cache first
    if (!options?.skipCache && this.config.enableCache) {
      const cached = this.getFromCache<T>(cacheKey)
      if (cached !== null) {
        return cached
      }
    }

    // Make request with retry logic
    const data = await this.fetchWithRetry<T>(endpoint, options)

    // Cache the response
    if (this.config.enableCache) {
      this.setCache(cacheKey, data, this.config.cacheTTL)
    }

    return data
  }

  /**
   * Fetch with retry logic and exponential backoff
   */
  private async fetchWithRetry<T>(
    endpoint: string,
    options?: RequestOptions,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await this.fetch<T>(endpoint, options)
    } catch (error) {
      // Don't retry if:
      // - Max retries reached
      // - Retries are skipped
      // - Error is a client error (4xx)
      // - Request was cancelled
      const shouldRetry =
        attempt < this.config.maxRetries &&
        !options?.skipRetries &&
        !(error instanceof HttpError && error.isClientError()) &&
        !(error instanceof CancellationError)

      if (!shouldRetry) {
        throw error
      }

      // Calculate exponential backoff delay
      const delay = this.config.retryDelay * Math.pow(2, attempt)

      // Wait before retrying
      await this.sleep(delay)

      // Retry
      return this.fetchWithRetry<T>(endpoint, options, attempt + 1)
    }
  }

  /**
   * Core fetch method with timeout and cancellation support
   */
  private async fetch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`
    const timeout = options?.timeout ?? this.config.timeout

    // Create abort controller for timeout and cancellation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // Handle external abort signal
    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort())
    }

    try {
      // Store active request for cancellation
      const requestKey = endpoint
      this.activeRequests.set(requestKey, controller)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      clearTimeout(timeoutId)

      // Clear active request
      this.activeRequests.delete(requestKey)

      // Check for HTTP errors
      if (!response.ok) {
        throw new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        )
      }

      // Parse JSON response
      try {
        const data: T = await response.json()
        return data
      } catch (error) {
        throw new ParseError('Failed to parse JSON response', error)
      }
    } catch (error) {
      clearTimeout(timeoutId)

      // Handle different error types
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        // Check if request was aborted
        if (error.name === 'AbortError') {
          if (options?.signal?.aborted) {
            throw new CancellationError('Request was cancelled by user')
          }
          throw new TimeoutError(`Request timed out after ${timeout}ms`, timeout)
        }

        // Network error
        throw new NetworkError(`Network request failed: ${error.message}`, error)
      }

      throw new ApiError('An unknown error occurred', undefined, error)
    }
  }

  /**
   * Get value from cache if not expired
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Store value in cache with TTL
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now()

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp
      if (age > entry.ttl) {
        this.cache.delete(key)
      }
    })
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Get current cache size
   */
  getCacheSize(): number {
    return this.cache.size
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries())
    const now = Date.now()

    return {
      totalEntries: entries.length,
      entries: entries.map(([key, entry]) => ({
        key,
        age: now - entry.timestamp,
        ttl: entry.ttl,
        expired: now - entry.timestamp > entry.ttl,
      })),
    }
  }
}

// ============================================================================
// Default Instance Export
// ============================================================================

/**
 * Default forum API service instance
 * Use this for most cases, or create a new instance with custom config
 */
export const forumApiService = new ForumApiService()
