# API Service Layer

Robust API service for fetching forum data with comprehensive error handling, retry logic, and type safety.

## Features

- ✅ **Type-safe API calls** with TypeScript
- ✅ **Exponential backoff retry logic** (3 attempts max)
- ✅ **Request timeout** (10s default, configurable)
- ✅ **Response caching with TTL** (5 minutes default)
- ✅ **Request cancellation** support with AbortController
- ✅ **Custom error classes** for detailed error information
- ✅ **Comprehensive unit tests** (55 tests with Vitest)
- ✅ **Loading and error states** built-in

## Files

- **`forumApi.service.ts`** - Main API service class
- **`errors.ts`** - Custom error classes and utilities
- **`index.ts`** - Barrel file for exports
- **`__tests__/`** - Comprehensive test suite

## Quick Start

### Basic Usage

```typescript
import { forumApiService } from '@/services'

// Fetch latest topics
const topics = await forumApiService.fetchLatestTopics()

console.log(topics.topic_list.topics)
console.log(topics.users)
```

### With Error Handling

```typescript
import { forumApiService, isHttpError, getErrorMessage } from '@/services'

try {
  const response = await forumApiService.fetchLatestTopics()
  console.log('Topics:', response.topic_list.topics)
} catch (error) {
  if (isHttpError(error) && error.statusCode === 404) {
    console.error('Topics not found')
  } else {
    console.error('Error:', getErrorMessage(error))
  }
}
```

### With Request Cancellation

```typescript
import { forumApiService } from '@/services'

const controller = new AbortController()

// Start the request
const promise = forumApiService.fetchLatestTopics({
  signal: controller.signal,
})

// Cancel if needed
controller.abort()

try {
  const result = await promise
} catch (error) {
  // Will throw CancellationError
}
```

### With Custom Timeout

```typescript
import { forumApiService } from '@/services'

// Use a custom timeout of 5 seconds
const topics = await forumApiService.fetchLatestTopics({
  timeout: 5000,
})
```

### Skipping Cache

```typescript
import { forumApiService } from '@/services'

// Skip cache and force a fresh fetch
const topics = await forumApiService.fetchLatestTopics({
  skipCache: true,
})
```

## Custom Configuration

Create a custom service instance with different settings:

```typescript
import { ForumApiService } from '@/services'

const customService = new ForumApiService({
  baseUrl: 'https://custom-api.example.com',
  timeout: 15000, // 15 seconds
  maxRetries: 5,
  retryDelay: 2000, // 2 seconds
  cacheTTL: 10 * 60 * 1000, // 10 minutes
  enableCache: true,
})

const topics = await customService.fetchLatestTopics()
```

## Error Types

The service provides detailed error types for different failure scenarios:

### ApiError

Base error class for all API errors.

```typescript
import { ApiError } from '@/services'

throw new ApiError('Something went wrong', 500)
```

### NetworkError

Thrown when network request fails (no internet, DNS failure, etc.).

```typescript
import { NetworkError, isNetworkError } from '@/services'

try {
  await forumApiService.fetchLatestTopics()
} catch (error) {
  if (isNetworkError(error)) {
    console.error('Network issue:', error.message)
  }
}
```

### TimeoutError

Thrown when request exceeds timeout limit.

```typescript
import { TimeoutError, isTimeoutError } from '@/services'

try {
  await forumApiService.fetchLatestTopics({ timeout: 1000 })
} catch (error) {
  if (isTimeoutError(error)) {
    console.error('Request timed out after', error.timeoutMs, 'ms')
  }
}
```

### HttpError

Thrown when server returns an error status code (4xx, 5xx).

```typescript
import { HttpError, isHttpError } from '@/services'

try {
  await forumApiService.fetchLatestTopics()
} catch (error) {
  if (isHttpError(error)) {
    console.error('HTTP Error:', error.statusCode, error.message)

    if (error.isClientError()) {
      console.log('Client error (4xx)')
    }

    if (error.isServerError()) {
      console.log('Server error (5xx)')
    }
  }
}
```

### ParseError

Thrown when response parsing fails (invalid JSON).

```typescript
import { ParseError, isParseError } from '@/services'

try {
  await forumApiService.fetchLatestTopics()
} catch (error) {
  if (isParseError(error)) {
    console.error('Failed to parse response')
  }
}
```

### CancellationError

Thrown when request is cancelled.

```typescript
import { CancellationError, isCancellationError } from '@/services'

try {
  const controller = new AbortController()
  const promise = forumApiService.fetchLatestTopics({
    signal: controller.signal,
  })

  controller.abort()
  await promise
} catch (error) {
  if (isCancellationError(error)) {
    console.log('Request was cancelled')
  }
}
```

## Retry Logic

The service automatically retries failed requests with exponential backoff:

- **Max retries**: 3 attempts (configurable)
- **Retry delay**: 1 second, 2 seconds, 4 seconds (exponential backoff)
- **Retryable errors**:
  - Network errors (NetworkError)
  - Server errors (5xx HttpError)
  - Timeout errors (TimeoutError)
- **Non-retryable errors**:
  - Client errors (4xx HttpError)
  - Parse errors (ParseError)
  - Cancellation errors (CancellationError)

### Skip Retries

```typescript
import { forumApiService } from '@/services'

// Skip retries for this request
try {
  const topics = await forumApiService.fetchLatestTopics({
    skipRetries: true,
  })
} catch (error) {
  // Will fail immediately without retries
}
```

## Caching

The service caches successful responses to reduce API calls:

- **Cache TTL**: 5 minutes (default, configurable)
- **Cache key**: Based on endpoint
- **Automatic cleanup**: Expired entries are cleaned up every minute

### Cache Management

```typescript
import { forumApiService } from '@/services'

// Get cache size
const size = forumApiService.getCacheSize()
console.log('Cache entries:', size)

// Get cache statistics
const stats = forumApiService.getCacheStats()
console.log('Total entries:', stats.totalEntries)
console.log('Cache details:', stats.entries)

// Clear entire cache
forumApiService.clearCache()

// Clear specific cache entry
forumApiService.clearCacheEntry('latest-topics')
```

## Request Cancellation

The service supports request cancellation for cleanup on component unmount:

### Cancel All Active Requests

```typescript
import { forumApiService } from '@/services'

// In Vue component
import { onUnmounted } from 'vue'

onUnmounted(() => {
  forumApiService.cancelAllRequests()
})
```

### Cancel Specific Request

```typescript
import { forumApiService } from '@/services'

// Start a request
const promise = forumApiService.fetchLatestTopics()

// Cancel it by cache key
forumApiService.cancelRequest('latest-topics')
```

## Vue 3 Integration

### Composable Example

```typescript
import { ref, onUnmounted } from 'vue'
import { forumApiService, getErrorMessage } from '@/services'
import type { LatestTopicsResponse } from '@/types'

export function useLatestTopics() {
  const data = ref<LatestTopicsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const controller = new AbortController()

  const fetchLatest = async () => {
    loading.value = true
    error.value = null

    try {
      data.value = await forumApiService.fetchLatestTopics({
        signal: controller.signal,
      })
    } catch (err) {
      error.value = getErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    controller.abort()
  })

  return {
    data,
    loading,
    error,
    fetchLatest,
  }
}
```

### Component Usage

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useLatestTopics } from '@/composables/useLatestTopics'

const { data, loading, error, fetchLatest } = useLatestTopics()

onMounted(() => {
  fetchLatest()
})
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="data">
      <div v-for="topic in data.topic_list.topics" :key="topic.id">
        {{ topic.title }}
      </div>
    </div>
  </div>
</template>
```

## API Methods

### fetchLatestTopics()

Fetches the latest topics from the forum.

**Parameters:**
- `options?: RequestOptions` - Optional request configuration

**Returns:**
- `Promise<LatestTopicsResponse>`

**Throws:**
- `NetworkError` - Network request failed
- `TimeoutError` - Request timed out
- `HttpError` - Server returned error status
- `ParseError` - Response parsing failed
- `CancellationError` - Request was cancelled

```typescript
const response = await forumApiService.fetchLatestTopics()
```

### fetchTopicDetails()

Fetches details for a specific topic.

**Parameters:**
- `topicId: TopicId` - The topic ID to fetch
- `options?: RequestOptions` - Optional request configuration

**Returns:**
- `Promise<TopicDetailsResponse>`

```typescript
import { toTopicId } from '@/types'

const topicId = toTopicId(12345)
const details = await forumApiService.fetchTopicDetails(topicId)
```

## Configuration Options

```typescript
interface ApiServiceConfig {
  /** Base URL for API requests (default: VITE_API_URL env var) */
  baseUrl: string

  /** Default timeout in milliseconds (default: 10000) */
  timeout: number

  /** Maximum number of retry attempts (default: 3) */
  maxRetries: number

  /** Initial delay for exponential backoff in ms (default: 1000) */
  retryDelay: number

  /** Cache TTL in milliseconds (default: 300000 = 5 minutes) */
  cacheTTL: number

  /** Whether to enable caching (default: true) */
  enableCache: boolean
}
```

## Request Options

```typescript
interface RequestOptions {
  /** Request timeout in milliseconds (overrides default) */
  timeout?: number

  /** Abort signal for cancellation */
  signal?: AbortSignal

  /** Whether to skip cache for this request */
  skipCache?: boolean

  /** Whether to skip retries for this request */
  skipRetries?: boolean
}
```

## Testing

The service includes comprehensive unit tests covering all functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- ✅ 55 tests passing
- ✅ Successful requests
- ✅ Error handling (all error types)
- ✅ Retry logic with exponential backoff
- ✅ Timeout handling
- ✅ Request cancellation
- ✅ Cache management
- ✅ Integration scenarios

## Best Practices

1. **Always handle errors**
   ```typescript
   try {
     const data = await forumApiService.fetchLatestTopics()
   } catch (error) {
     console.error(getErrorMessage(error))
   }
   ```

2. **Cancel requests on unmount**
   ```typescript
   onUnmounted(() => {
     forumApiService.cancelAllRequests()
   })
   ```

3. **Use type guards for specific error handling**
   ```typescript
   if (isHttpError(error) && error.statusCode === 404) {
     // Handle 404 specifically
   }
   ```

4. **Configure timeouts based on expected response time**
   ```typescript
   // For slower endpoints
   await service.fetchLatestTopics({ timeout: 30000 })
   ```

5. **Use cache efficiently**
   ```typescript
   // Clear cache when data needs to be refreshed
   service.clearCache()
   const fresh = await service.fetchLatestTopics()
   ```

## Contributing

When adding new API methods:

1. Add method to `ForumApiService` class
2. Follow existing patterns (retry, timeout, caching)
3. Add proper TypeScript types
4. Add comprehensive unit tests
5. Update this documentation

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vitest Documentation](https://vitest.dev/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
