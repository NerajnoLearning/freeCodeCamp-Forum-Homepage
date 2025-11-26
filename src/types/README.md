# Type Definitions

Comprehensive TypeScript type definitions for the freeCodeCamp Forum API.

## Overview

This directory contains all TypeScript interfaces, types, and utilities for working with forum data. The types provide strong type safety, branded IDs to prevent mixing different ID types, and utility functions for common operations.

## Files

- **`forum.types.ts`** - Core type definitions for forum entities
- **`type-guards.ts`** - Runtime type guards and utility functions
- **`index.ts`** - Barrel file exporting all types and functions

## Usage

### Basic Import

Import types from the barrel file:

```typescript
import type { ForumTopic, ForumUser, UserId } from '@/types'
```

### Working with Branded IDs

Branded types prevent accidentally mixing different types of IDs:

```typescript
import { toUserId, toTopicId } from '@/types'

const userId: UserId = toUserId(12345)
const topicId: TopicId = toTopicId(67890)

// TypeScript will error if you try to use a TopicId where a UserId is expected
function getUser(id: UserId) { /* ... */ }
getUser(topicId) // ❌ Type error!
```

### Type Guards

Use type guards for runtime type checking:

```typescript
import { isForumUser, isForumTopic } from '@/types'

if (isForumUser(data)) {
  // TypeScript knows 'data' is a ForumUser
  console.log(data.username)
}

if (isForumTopic(data)) {
  // TypeScript knows 'data' is a ForumTopic
  console.log(data.title)
}
```

### Utility Types

Use utility types for specific use cases:

```typescript
import type { TopicSummary, MinimalUser, CategoryOption } from '@/types'

// Only include essential topic fields
const summary: TopicSummary = {
  id: toTopicId(1),
  title: 'Hello World',
  slug: 'hello-world',
  reply_count: 5,
  views: 100,
  last_posted_at: '2024-01-01T00:00:00Z',
  category_id: toCategoryId(1),
  posters: [],
}

// Minimal user data for avatars
const user: MinimalUser = {
  id: toUserId(1),
  username: 'john_doe',
  avatar_template: '/avatars/{size}.png',
}
```

### Filtering and Sorting

Use provided helper functions:

```typescript
import {
  filterTopicsByCategory,
  filterPinnedTopics,
  searchTopics,
  compareTopicsByLastPosted,
  toCategoryId,
} from '@/types'

// Filter topics by category
const categoryTopics = filterTopicsByCategory(topics, toCategoryId(421))

// Get only pinned topics
const pinned = filterPinnedTopics(topics)

// Search topics
const results = searchTopics(topics, 'javascript')

// Sort by last posted
const sorted = [...topics].sort(compareTopicsByLastPosted)
```

### API Responses

Use typed API responses for better error handling:

```typescript
import type { ApiResult, LatestTopicsResponse } from '@/types'
import { isSuccessResult } from '@/types'

async function fetchLatestTopics(): Promise<ApiResult<LatestTopicsResponse>> {
  try {
    const response = await fetch('https://forum-proxy.freecodecamp.rocks/latest')
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

// Usage
const result = await fetchLatestTopics()

if (isSuccessResult(result)) {
  // TypeScript knows result.data is LatestTopicsResponse
  const topics = result.data.topic_list.topics
} else {
  // TypeScript knows result.error exists
  console.error(result.error.error)
}
```

### User Permissions

Check user permissions easily:

```typescript
import { isUserStaff, isUserPrivileged } from '@/types'
import type { ForumUser } from '@/types'

function canModerate(user: ForumUser): boolean {
  return isUserStaff(user)
}

function showAdminPanel(user: ForumUser): boolean {
  return isUserPrivileged(user)
}
```

### Topic Status

Check topic status:

```typescript
import { isTopicPinned, isTopicLocked, hasAcceptedAnswer } from '@/types'
import type { ForumTopic } from '@/types'

function getTopicBadges(topic: ForumTopic): string[] {
  const badges: string[] = []

  if (isTopicPinned(topic)) badges.push('📌 Pinned')
  if (isTopicLocked(topic)) badges.push('🔒 Locked')
  if (hasAcceptedAnswer(topic)) badges.push('✅ Solved')

  return badges
}
```

## Available Types

### Core Entities

- `ForumUser` - Complete user profile with permissions
- `ForumTopic` - Complete topic with metadata
- `ForumCategory` - Category information
- `ForumGroup` - User group information
- `TopicPoster` - Poster information in a topic

### Branded ID Types

- `UserId` - Type-safe user ID
- `TopicId` - Type-safe topic ID
- `CategoryId` - Type-safe category ID
- `GroupId` - Type-safe group ID

### Utility Types

- `MinimalUser` - Essential user fields only
- `UserAvatarData` - User data for avatars
- `TopicSummary` - Essential topic fields only
- `TopicMetadata` - Topic metadata only
- `NewTopic` - Fields for creating a topic
- `CategoryOption` - Category for dropdowns

### API Response Types

- `LatestTopicsResponse` - Response from /latest endpoint
- `TopicDetailsResponse` - Single topic response
- `ApiErrorResponse` - Error response structure
- `ApiResult<T>` - Generic success/error wrapper

### Helper Types

- `TrustLevel` - User trust level (0-4)
- `TopicArchetype` - Topic type
- `SortableTopicField` - Fields that can be sorted
- `SortOrder` - Sort direction ('asc' | 'desc')
- `TopicQueryParams` - Query parameters for topics

## Type Safety Features

### Branded Types

Branded types use TypeScript's type system to prevent mixing IDs:

```typescript
// Without branded types:
const userId = 123
const topicId = 456
fetchUser(topicId) // Oops! Wrong ID type, but TypeScript allows it

// With branded types:
const userId = toUserId(123)
const topicId = toTopicId(456)
fetchUser(topicId) // ❌ TypeScript error! topicId is not a UserId
```

### Strict Null Checking

All types properly handle nullable fields:

```typescript
interface ForumUser {
  name?: string | null // Explicitly nullable
  avatar_template: string // Required, never null
}
```

### Discriminated Unions

API results use discriminated unions for type-safe error handling:

```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiErrorResponse }

// TypeScript enforces checking success before accessing data
if (result.success) {
  console.log(result.data) // ✅ OK
} else {
  console.log(result.error) // ✅ OK
}
```

## Best Practices

1. **Always use branded types for IDs**
   ```typescript
   // ✅ Good
   const userId = toUserId(response.id)

   // ❌ Bad
   const userId: UserId = response.id as UserId
   ```

2. **Import from barrel file**
   ```typescript
   // ✅ Good
   import type { ForumUser, ForumTopic } from '@/types'

   // ❌ Bad
   import type { ForumUser } from '@/types/forum.types'
   ```

3. **Use type guards for runtime checks**
   ```typescript
   // ✅ Good
   if (isForumUser(data)) {
     // Type-safe operations
   }

   // ❌ Bad
   if (data && typeof data === 'object') {
     // No type safety
   }
   ```

4. **Leverage utility types**
   ```typescript
   // ✅ Good - only include what you need
   const user: MinimalUser = { id, username, avatar_template }

   // ❌ Bad - including unnecessary fields
   const user: ForumUser = { ...allUserData }
   ```

5. **Use ApiResult for async operations**
   ```typescript
   // ✅ Good - type-safe error handling
   async function fetchData(): Promise<ApiResult<Data>> {
     try {
       return { success: true, data }
     } catch {
       return { success: false, error: { error: 'Failed' } }
     }
   }
   ```

## Contributing

When adding new types:

1. Add comprehensive JSDoc comments
2. Use branded types for IDs
3. Export from the barrel file (`index.ts`)
4. Add type guards if appropriate
5. Create utility types for common use cases
6. Update this README with usage examples

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Branded Types](https://egghead.io/blog/using-branded-types-in-typescript)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
