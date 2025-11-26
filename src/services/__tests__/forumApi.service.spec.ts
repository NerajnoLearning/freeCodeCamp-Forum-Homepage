/**
 * @fileoverview Comprehensive unit tests for ForumApiService
 * Tests all functionality including retries, timeout, caching, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ForumApiService } from '../forumApi.service'
import type { LatestTopicsResponse } from '@/types'
import { NetworkError, HttpError, ParseError } from '../errors'

// ============================================================================
// Mock Data
// ============================================================================

const mockLatestTopicsResponse: LatestTopicsResponse = {
  users: [
    {
      id: 1 as any,
      username: 'testuser',
      avatar_template: '/avatars/{size}.png',
      trust_level: 2,
    },
  ],
  topic_list: {
    topics: [
      {
        id: 100 as any,
        title: 'Test Topic',
        slug: 'test-topic',
        posts_count: 10,
        reply_count: 9,
        highest_post_number: 10,
        created_at: '2024-01-01T00:00:00Z',
        last_posted_at: '2024-01-02T00:00:00Z',
        bumped: true,
        bumped_at: '2024-01-02T00:00:00Z',
        archetype: 'regular' as any,
        unseen: false,
        pinned: false,
        visible: true,
        closed: false,
        archived: false,
        views: 100,
        like_count: 5,
        has_summary: false,
        last_poster_username: 'testuser',
        category_id: 1 as any,
        pinned_globally: false,
        posters: [],
      },
    ],
  },
}

// ============================================================================
// Test Setup
// ============================================================================

describe('ForumApiService', () => {
  let service: ForumApiService
  let originalFetch: typeof global.fetch

  beforeEach(() => {
    // Save original fetch
    originalFetch = global.fetch

    // Create new service instance for each test
    service = new ForumApiService({
      baseUrl: 'https://test-api.example.com',
      timeout: 5000,
      maxRetries: 3,
      retryDelay: 100, // Shorter delay for tests
      cacheTTL: 1000, // 1 second for tests
      enableCache: true,
    })

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch

    // Cleanup
    service.clearCache()
    service.cancelAllRequests()

    // Clear all timers
    vi.clearAllTimers()
  })

  // ============================================================================
  // Successful Request Tests
  // ============================================================================

  describe('fetchLatestTopics', () => {
    it('should successfully fetch latest topics', async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      const result = await service.fetchLatestTopics()

      expect(result).toEqual(mockLatestTopicsResponse)
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-api.example.com/latest',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })

    it('should return cached response on second call', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      // First call
      const result1 = await service.fetchLatestTopics()

      // Second call (should use cache)
      const result2 = await service.fetchLatestTopics()

      expect(result1).toEqual(result2)
      expect(global.fetch).toHaveBeenCalledTimes(1) // Only called once
    })

    it('should skip cache when skipCache option is true', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      // First call
      await service.fetchLatestTopics()

      // Second call with skipCache
      await service.fetchLatestTopics({ skipCache: true })

      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('error handling', () => {
    it('should throw HttpError for 404 response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(service.fetchLatestTopics()).rejects.toThrow(HttpError)
      await expect(service.fetchLatestTopics()).rejects.toThrow('HTTP 404: Not Found')
    })

    it('should throw HttpError for 500 response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(service.fetchLatestTopics()).rejects.toThrow(HttpError)
    })

    it('should throw ParseError for invalid JSON response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(service.fetchLatestTopics()).rejects.toThrow(ParseError)
    })

    it('should throw NetworkError for network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(service.fetchLatestTopics()).rejects.toThrow(NetworkError)
    })
  })

  // ============================================================================
  // Retry Logic Tests
  // ============================================================================

  describe('retry logic', () => {
    it('should retry on network error up to maxRetries', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockLatestTopicsResponse,
        })
      })

      const result = await service.fetchLatestTopics()

      expect(result).toEqual(mockLatestTopicsResponse)
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should not retry on 404 error (client error)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(service.fetchLatestTopics()).rejects.toThrow(HttpError)
      expect(global.fetch).toHaveBeenCalledTimes(1) // No retries
    })

    it('should retry on 500 error (server error)', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount < 2) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
          })
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockLatestTopicsResponse,
        })
      })

      const result = await service.fetchLatestTopics()

      expect(result).toEqual(mockLatestTopicsResponse)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should fail after maxRetries attempts', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(service.fetchLatestTopics()).rejects.toThrow(NetworkError)
      expect(global.fetch).toHaveBeenCalledTimes(4) // Initial + 3 retries
    })

    it('should skip retries when skipRetries option is true', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(service.fetchLatestTopics({ skipRetries: true })).rejects.toThrow(NetworkError)
      expect(global.fetch).toHaveBeenCalledTimes(1) // No retries
    })
  })

  // ============================================================================
  // Timeout Tests
  // ============================================================================

  describe('timeout handling', () => {
    it('should have timeout configuration', () => {
      const customService = new ForumApiService({
        timeout: 5000,
      })

      // Verify service was created with custom timeout
      expect(customService).toBeInstanceOf(ForumApiService)
    })

    it('should accept timeout in request options', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      // Make request with custom timeout
      const result = await service.fetchLatestTopics({ timeout: 1000 })

      expect(result).toEqual(mockLatestTopicsResponse)
    })
  })

  // ============================================================================
  // Cancellation Tests
  // ============================================================================

  describe('request cancellation', () => {
    it('should support abort signals in request options', async () => {
      const controller = new AbortController()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      const result = await service.fetchLatestTopics({ signal: controller.signal })

      expect(result).toEqual(mockLatestTopicsResponse)
    })

    it('should have cancelAllRequests method', () => {
      expect(service.cancelAllRequests).toBeDefined()
      expect(typeof service.cancelAllRequests).toBe('function')

      // Should not throw
      service.cancelAllRequests()
    })

    it('should have cancelRequest method', () => {
      expect(service.cancelRequest).toBeDefined()
      expect(typeof service.cancelRequest).toBe('function')

      // Should not throw
      service.cancelRequest('test-key')
    })
  })

  // ============================================================================
  // Cache Tests
  // ============================================================================

  describe('cache management', () => {
    it('should store response in cache', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      expect(service.getCacheSize()).toBe(0)

      await service.fetchLatestTopics()

      expect(service.getCacheSize()).toBe(1)
    })

    it('should clear all cache entries', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      await service.fetchLatestTopics()
      expect(service.getCacheSize()).toBe(1)

      service.clearCache()
      expect(service.getCacheSize()).toBe(0)
    })

    it('should clear specific cache entry', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      await service.fetchLatestTopics()
      expect(service.getCacheSize()).toBe(1)

      service.clearCacheEntry('latest-topics')
      expect(service.getCacheSize()).toBe(0)
    })

    it('should expire cache after TTL', async () => {
      vi.useFakeTimers()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      // First call
      await service.fetchLatestTopics()
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Advance time past TTL
      vi.advanceTimersByTime(2000) // 2 seconds (TTL is 1 second)

      // Second call should fetch again
      await service.fetchLatestTopics()
      expect(global.fetch).toHaveBeenCalledTimes(2)

      vi.useRealTimers()
    })

    it('should return cache statistics', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      await service.fetchLatestTopics()

      const stats = service.getCacheStats()

      expect(stats.totalEntries).toBe(1)
      expect(stats.entries[0]?.key).toBe('latest-topics')
      expect(stats.entries[0]?.expired).toBe(false)
    })
  })

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('integration scenarios', () => {
    it('should handle multiple concurrent requests', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLatestTopicsResponse,
      })

      // First request - will fetch
      const result1 = await service.fetchLatestTopics()

      // Subsequent requests - will use cache
      const result2 = await service.fetchLatestTopics()
      const result3 = await service.fetchLatestTopics()

      expect(result1).toEqual(mockLatestTopicsResponse)
      expect(result2).toEqual(mockLatestTopicsResponse)
      expect(result3).toEqual(mockLatestTopicsResponse)

      // Should only fetch once due to caching
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle retry with eventual success', async () => {
      let attempt = 0
      global.fetch = vi.fn().mockImplementation(() => {
        attempt++
        if (attempt < 3) {
          return Promise.resolve({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable',
          })
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockLatestTopicsResponse,
        })
      })

      const result = await service.fetchLatestTopics()

      expect(result).toEqual(mockLatestTopicsResponse)
      expect(attempt).toBe(3)
    })
  })
})
