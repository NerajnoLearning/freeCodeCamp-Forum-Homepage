# Type System Examples

Practical examples demonstrating how to use the comprehensive type system in real-world scenarios.

## Example 1: Type-Safe Component Props

### ForumTopicCard.vue

```typescript
<script setup lang="ts">
import { computed } from 'vue'
import type { ForumTopic, ForumUser, UserId } from '@/types'
import { getUserAvatarUrl, isTopicPinned, isTopicLocked } from '@/types'

interface Props {
  topic: ForumTopic
  getUser: (id: UserId) => ForumUser | undefined
}

const props = defineProps<Props>()

const isPinned = computed(() => isTopicPinned(props.topic))
const isLocked = computed(() => isTopicLocked(props.topic))

const topicBadges = computed(() => {
  const badges: string[] = []
  if (isPinned.value) badges.push('📌 Pinned')
  if (isLocked.value) badges.push('🔒 Locked')
  return badges
})
</script>
```

## Example 2: Type-Safe API Service

### services/forumApi.service.ts

```typescript
import type {
  ApiResult,
  LatestTopicsResponse,
  TopicDetailsResponse,
  ForumTopic,
  TopicId,
} from '@/types'

class ForumApiService {
  private readonly baseUrl = 'https://forum-proxy.freecodecamp.rocks'

  /**
   * Fetches the latest topics from the forum
   */
  async fetchLatestTopics(): Promise<ApiResult<LatestTopicsResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/latest`)

      if (!response.ok) {
        return {
          success: false,
          error: {
            error: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
          },
        }
      }

      const data: LatestTopicsResponse = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: {
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      }
    }
  }

  /**
   * Fetches details for a specific topic
   */
  async fetchTopicDetails(topicId: TopicId): Promise<ApiResult<TopicDetailsResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/t/${topicId}`)

      if (!response.ok) {
        return {
          success: false,
          error: {
            error: `Topic not found`,
            status: response.status,
          },
        }
      }

      const data: TopicDetailsResponse = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: {
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      }
    }
  }
}

export const forumApiService = new ForumApiService()
```

## Example 3: Type-Safe Composable

### composables/useTopicFilters.ts

```typescript
import { ref, computed, type Ref } from 'vue'
import type {
  ForumTopic,
  CategoryId,
  SortableTopicField,
  SortOrder,
} from '@/types'
import {
  filterTopicsByCategory,
  filterPinnedTopics,
  filterUnpinnedTopics,
  filterOpenTopics,
  searchTopics,
  compareTopicsByLastPosted,
  compareTopicsByCreated,
  compareTopicsByViews,
  compareTopicsByReplies,
} from '@/types'

export function useTopicFilters(topics: Ref<ForumTopic[]>) {
  const searchQuery = ref('')
  const selectedCategory = ref<CategoryId | null>(null)
  const showPinnedOnly = ref(false)
  const showOpenOnly = ref(true)
  const sortBy = ref<SortableTopicField>('last_posted_at')
  const sortOrder = ref<SortOrder>('desc')

  const filteredTopics = computed(() => {
    let filtered = topics.value

    // Apply search filter
    if (searchQuery.value.trim()) {
      filtered = searchTopics(filtered, searchQuery.value)
    }

    // Apply category filter
    if (selectedCategory.value) {
      filtered = filterTopicsByCategory(filtered, selectedCategory.value)
    }

    // Apply pinned filter
    if (showPinnedOnly.value) {
      filtered = filterPinnedTopics(filtered)
    }

    // Apply open/closed filter
    if (showOpenOnly.value) {
      filtered = filterOpenTopics(filtered)
    }

    return filtered
  })

  const sortedTopics = computed(() => {
    const sorted = [...filteredTopics.value]

    const compareFn = {
      last_posted_at: compareTopicsByLastPosted,
      created_at: compareTopicsByCreated,
      views: compareTopicsByViews,
      posts_count: compareTopicsByReplies,
      like_count: (a: ForumTopic, b: ForumTopic) => b.like_count - a.like_count,
    }[sortBy.value]

    sorted.sort(compareFn)

    if (sortOrder.value === 'asc') {
      sorted.reverse()
    }

    return sorted
  })

  const pinnedTopics = computed(() => filterPinnedTopics(filteredTopics.value))
  const unpinnedTopics = computed(() => filterUnpinnedTopics(filteredTopics.value))

  return {
    // Filter state
    searchQuery,
    selectedCategory,
    showPinnedOnly,
    showOpenOnly,
    sortBy,
    sortOrder,
    // Computed results
    filteredTopics: sortedTopics,
    pinnedTopics,
    unpinnedTopics,
  }
}
```

## Example 4: Type-Safe Store/State Management

### composables/useForumData.ts

```typescript
import { ref, computed } from 'vue'
import type {
  ForumTopic,
  ForumUser,
  UserId,
  TopicId,
  LatestTopicsResponse,
} from '@/types'
import { toUserId, toTopicId, isSuccessResult } from '@/types'
import { forumApiService } from '@/services'

export function useForumData() {
  const topics = ref<ForumTopic[]>([])
  const users = ref<ForumUser[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const usersById = computed(() => {
    const map = new Map<UserId, ForumUser>()
    users.value.forEach((user) => {
      map.set(user.id, user)
    })
    return map
  })

  const topicsById = computed(() => {
    const map = new Map<TopicId, ForumTopic>()
    topics.value.forEach((topic) => {
      map.set(topic.id, topic)
    })
    return map
  })

  const getUser = (id: number): ForumUser | undefined => {
    return usersById.value.get(toUserId(id))
  }

  const getTopic = (id: number): ForumTopic | undefined => {
    return topicsById.value.get(toTopicId(id))
  }

  const fetchLatestTopics = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    const result = await forumApiService.fetchLatestTopics()

    if (isSuccessResult(result)) {
      topics.value = result.data.topic_list.topics
      users.value = result.data.users
    } else {
      error.value = result.error.error
    }

    isLoading.value = false
  }

  return {
    // State
    topics,
    users,
    isLoading,
    error,
    // Computed
    usersById,
    topicsById,
    // Methods
    getUser,
    getTopic,
    fetchLatestTopics,
  }
}
```

## Example 5: Type-Safe Utility Functions

### utils/formatters.ts

```typescript
import type { ForumTopic, ForumUser } from '@/types'
import { isUserStaff } from '@/types'

/**
 * Formats a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

/**
 * Gets the display name for a user (name or username)
 */
export function getUserDisplayName(user: ForumUser): string {
  return user.name || user.username
}

/**
 * Gets user role badge text
 */
export function getUserRoleBadge(user: ForumUser): string | null {
  if (user.admin) return 'Admin'
  if (user.moderator) return 'Moderator'
  if (isUserStaff(user)) return 'Staff'
  return null
}

/**
 * Formats topic view count with abbreviations (1.2k, 1.5M, etc.)
 */
export function formatViewCount(views: number): string {
  if (views < 1000) return views.toString()
  if (views < 1000000) return `${(views / 1000).toFixed(1)}k`
  return `${(views / 1000000).toFixed(1)}M`
}

/**
 * Gets a color class based on topic activity
 */
export function getTopicActivityColor(topic: ForumTopic): string {
  const hoursSinceActivity =
    (Date.now() - new Date(topic.last_posted_at).getTime()) / (1000 * 60 * 60)

  if (hoursSinceActivity < 1) return 'text-green-600'
  if (hoursSinceActivity < 24) return 'text-blue-600'
  if (hoursSinceActivity < 168) return 'text-gray-600'
  return 'text-gray-400'
}
```

## Example 6: Advanced Type Usage - Generic Filter Component

### components/TopicFilter.vue

```typescript
<script setup lang="ts" generic="T extends ForumTopic">
import { ref, computed } from 'vue'
import type { CategoryId, SortableTopicField, SortOrder } from '@/types'

interface Props {
  topics: T[]
  categories: Array<{ id: CategoryId; name: string }>
}

interface Emits {
  (e: 'update:filtered', topics: T[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const selectedCategory = ref<CategoryId | null>(null)
const sortField = ref<SortableTopicField>('last_posted_at')
const sortOrder = ref<SortOrder>('desc')

const filteredTopics = computed(() => {
  let filtered = props.topics

  // Apply filters...
  // ...

  emit('update:filtered', filtered)
  return filtered
})
</script>
```

## Example 7: Type-Safe Error Handling

### utils/errorHandling.ts

```typescript
import type { ApiResult, ApiErrorResponse } from '@/types'
import { isErrorResult } from '@/types'

/**
 * Extracts error message from ApiResult
 */
export function getErrorMessage<T>(result: ApiResult<T>): string | null {
  if (isErrorResult(result)) {
    return result.error.error
  }
  return null
}

/**
 * Handles API errors with logging and user feedback
 */
export function handleApiError<T>(
  result: ApiResult<T>,
  context: string
): ApiErrorResponse | null {
  if (isErrorResult(result)) {
    console.error(`[${context}]`, result.error)
    return result.error
  }
  return null
}

/**
 * Unwraps an ApiResult or throws an error
 */
export function unwrapResult<T>(result: ApiResult<T>): T {
  if (isErrorResult(result)) {
    throw new Error(result.error.error)
  }
  return result.data
}

/**
 * Safely executes an async operation with error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error('Async operation failed:', error)
    return fallback
  }
}
```

## Example 8: Type-Safe Testing

### components/__tests__/TopicCard.spec.ts

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TopicCard from '../TopicCard.vue'
import type { ForumTopic, ForumUser, UserId } from '@/types'
import { toUserId, toTopicId, toCategoryId } from '@/types'

const mockUser: ForumUser = {
  id: toUserId(1),
  username: 'testuser',
  name: 'Test User',
  avatar_template: '/avatars/{size}.png',
  trust_level: 2,
}

const mockTopic: ForumTopic = {
  id: toTopicId(100),
  title: 'Test Topic',
  slug: 'test-topic',
  posts_count: 10,
  reply_count: 9,
  highest_post_number: 10,
  created_at: '2024-01-01T00:00:00Z',
  last_posted_at: '2024-01-02T00:00:00Z',
  bumped: true,
  bumped_at: '2024-01-02T00:00:00Z',
  archetype: 'regular',
  unseen: false,
  pinned: false,
  visible: true,
  closed: false,
  archived: false,
  views: 100,
  like_count: 5,
  has_summary: false,
  last_poster_username: 'testuser',
  category_id: toCategoryId(1),
  pinned_globally: false,
  posters: [],
}

describe('TopicCard', () => {
  it('renders topic title', () => {
    const wrapper = mount(TopicCard, {
      props: {
        topic: mockTopic,
        getUser: (id: UserId) => (id === mockUser.id ? mockUser : undefined),
      },
    })

    expect(wrapper.text()).toContain('Test Topic')
  })

  it('shows pinned badge when topic is pinned', () => {
    const pinnedTopic: ForumTopic = { ...mockTopic, pinned: true }

    const wrapper = mount(TopicCard, {
      props: {
        topic: pinnedTopic,
        getUser: () => undefined,
      },
    })

    expect(wrapper.text()).toContain('Pinned')
  })
})
```

## Best Practices Summary

1. **Always use branded types for IDs** - Prevents mixing different ID types
2. **Import from the barrel file** (`@/types`) - Cleaner imports
3. **Use type guards for runtime checks** - Safe type narrowing
4. **Leverage utility types** - Only include necessary fields
5. **Use `ApiResult<T>`** - Type-safe error handling
6. **Add JSDoc comments** - Better IDE support
7. **Prefer `const` over `let`** - Immutability
8. **Use computed properties** - Reactive transformations
9. **Extract reusable logic** - Create composables
10. **Write type-safe tests** - Catch type errors early

## Common Patterns

### Pattern 1: Loading State

```typescript
const { topics, isLoading, error } = useForumData()

// In template
<div v-if="isLoading">Loading...</div>
<div v-else-if="error">{{ error }}</div>
<div v-else>
  <TopicCard v-for="topic in topics" :key="topic.id" :topic="topic" />
</div>
```

### Pattern 2: Safe User Lookup

```typescript
const user = getUser(userId)
if (user) {
  // TypeScript knows user is defined
  console.log(user.username)
}
```

### Pattern 3: Type-Safe Filtering

```typescript
const { filteredTopics, searchQuery, selectedCategory } = useTopicFilters(topics)

// Filters are automatically type-safe
selectedCategory.value = toCategoryId(421) // ✅
selectedCategory.value = 421 // ❌ Type error
```

These examples demonstrate real-world usage of the comprehensive type system to build type-safe, maintainable Vue 3 applications.
