/**
 * @fileoverview Type guard functions and utility helpers for working with forum types
 * These functions provide runtime type checking and safe type conversions
 */

import type {
  ForumUser,
  ForumTopic,
  ForumCategory,
  UserId,
  TopicId,
  CategoryId,
  GroupId,
  TrustLevel,
  ApiResult,
} from './forum.types'

// ============================================================================
// ID Conversion Helpers
// ============================================================================

/**
 * Safely converts a number to a UserId
 * @param id - The number to convert
 * @returns The branded UserId
 */
export const toUserId = (id: number): UserId => id as UserId

/**
 * Safely converts a number to a TopicId
 * @param id - The number to convert
 * @returns The branded TopicId
 */
export const toTopicId = (id: number): TopicId => id as TopicId

/**
 * Safely converts a number to a CategoryId
 * @param id - The number to convert
 * @returns The branded CategoryId
 */
export const toCategoryId = (id: number): CategoryId => id as CategoryId

/**
 * Safely converts a number to a GroupId
 * @param id - The number to convert
 * @returns The branded GroupId
 */
export const toGroupId = (id: number): GroupId => id as GroupId

// ============================================================================
// Type Guard Functions
// ============================================================================

/**
 * Type guard to check if a value is a valid TrustLevel
 * @param value - The value to check
 * @returns True if the value is a valid TrustLevel
 */
export const isTrustLevel = (value: unknown): value is TrustLevel => {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 4
}

/**
 * Type guard to check if an object is a ForumUser
 * @param obj - The object to check
 * @returns True if the object is a ForumUser
 */
export const isForumUser = (obj: unknown): obj is ForumUser => {
  if (typeof obj !== 'object' || obj === null) return false
  const user = obj as Partial<ForumUser>
  return (
    typeof user.id === 'number' &&
    typeof user.username === 'string' &&
    typeof user.avatar_template === 'string' &&
    isTrustLevel(user.trust_level)
  )
}

/**
 * Type guard to check if an object is a ForumTopic
 * @param obj - The object to check
 * @returns True if the object is a ForumTopic
 */
export const isForumTopic = (obj: unknown): obj is ForumTopic => {
  if (typeof obj !== 'object' || obj === null) return false
  const topic = obj as Partial<ForumTopic>
  return (
    typeof topic.id === 'number' &&
    typeof topic.title === 'string' &&
    typeof topic.slug === 'string' &&
    Array.isArray(topic.posters) &&
    typeof topic.created_at === 'string' &&
    typeof topic.last_posted_at === 'string' &&
    typeof topic.bumped === 'boolean' &&
    typeof topic.bumped_at === 'string' &&
    typeof topic.archetype === 'string' &&
    typeof topic.unseen === 'boolean' &&
    typeof topic.visible === 'boolean' &&
    typeof topic.closed === 'boolean' &&
    typeof topic.archived === 'boolean' &&
    typeof topic.like_count === 'number' &&
    typeof topic.has_summary === 'boolean' &&
    typeof topic.last_poster_username === 'string' &&
    typeof topic.pinned_globally === 'boolean'
  )
}

/**
 * Type guard to check if an object is a ForumCategory
 * @param obj - The object to check
 * @returns True if the object is a ForumCategory
 */
export const isForumCategory = (obj: unknown): obj is ForumCategory => {
  if (typeof obj !== 'object' || obj === null) return false
  const category = obj as Partial<ForumCategory>
  return (
    typeof category.id === 'number' &&
    typeof category.name === 'string' &&
    typeof category.slug === 'string' &&
    typeof category.color === 'string' &&
    typeof category.text_color === 'string'
  )
}

/**
 * Type guard to check if an ApiResult is successful
 * @param result - The API result to check
 * @returns True if the result is successful
 */
export const isSuccessResult = <T>(result: ApiResult<T>): result is { success: true; data: T } => {
  return result.success === true
}

/**
 * Type guard to check if an ApiResult is an error
 * @param result - The API result to check
 * @returns True if the result is an error
 */
export const isErrorResult = <T>(
  result: ApiResult<T>
): result is { success: false; error: { error: string } } => {
  return result.success === false
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates and returns a user's avatar URL with the specified size
 * @param user - The forum user
 * @param size - The desired avatar size (default: 40)
 * @returns The avatar URL with size applied
 */
export const getUserAvatarUrl = (user: ForumUser | undefined, size: number = 40): string => {
  if (!user) return ''
  return user.avatar_template.replace('{size}', size.toString())
}

/**
 * Checks if a user is a moderator or admin
 * @param user - The forum user
 * @returns True if the user has moderator or admin privileges
 */
export const isUserPrivileged = (user: ForumUser): boolean => {
  return user.moderator === true || user.admin === true
}

/**
 * Checks if a user is a staff member (moderator or admin)
 * @param user - The forum user
 * @returns True if the user is staff
 */
export const isUserStaff = (user: ForumUser): boolean => {
  return isUserPrivileged(user)
}

/**
 * Checks if a topic is pinned (either in category or globally)
 * @param topic - The forum topic
 * @returns True if the topic is pinned
 */
export const isTopicPinned = (topic: ForumTopic): boolean => {
  return topic.pinned === true || topic.pinned_globally === true
}

/**
 * Checks if a topic is locked (closed)
 * @param topic - The forum topic
 * @returns True if the topic is closed
 */
export const isTopicLocked = (topic: ForumTopic): boolean => {
  return topic.closed === true
}

/**
 * Checks if a topic is archived
 * @param topic - The forum topic
 * @returns True if the topic is archived
 */
export const isTopicArchived = (topic: ForumTopic): boolean => {
  return topic.archived === true
}

/**
 * Checks if a topic has an accepted answer
 * @param topic - The forum topic
 * @returns True if the topic has an accepted answer
 */
export const hasAcceptedAnswer = (topic: ForumTopic): boolean => {
  return topic.has_accepted_answer === true
}

// ============================================================================
// Sorting Helpers
// ============================================================================

/**
 * Compares two topics by last posted date (most recent first)
 * @param a - First topic
 * @param b - Second topic
 * @returns Comparison result for sorting
 */
export const compareTopicsByLastPosted = (a: ForumTopic, b: ForumTopic): number => {
  return new Date(b.last_posted_at).getTime() - new Date(a.last_posted_at).getTime()
}

/**
 * Compares two topics by creation date (most recent first)
 * @param a - First topic
 * @param b - Second topic
 * @returns Comparison result for sorting
 */
export const compareTopicsByCreated = (a: ForumTopic, b: ForumTopic): number => {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

/**
 * Compares two topics by view count (most viewed first)
 * @param a - First topic
 * @param b - Second topic
 * @returns Comparison result for sorting
 */
export const compareTopicsByViews = (a: ForumTopic, b: ForumTopic): number => {
  return b.views - a.views
}

/**
 * Compares two topics by reply count (most replies first)
 * @param a - First topic
 * @param b - Second topic
 * @returns Comparison result for sorting
 */
export const compareTopicsByReplies = (a: ForumTopic, b: ForumTopic): number => {
  return b.reply_count - a.reply_count
}

// ============================================================================
// Filter Helpers
// ============================================================================

/**
 * Filters topics by category ID
 * @param topics - Array of topics to filter
 * @param categoryId - The category ID to filter by
 * @returns Filtered array of topics
 */
export const filterTopicsByCategory = (
  topics: ForumTopic[],
  categoryId: CategoryId
): ForumTopic[] => {
  return topics.filter((topic) => topic.category_id === categoryId)
}

/**
 * Filters topics to only show pinned topics
 * @param topics - Array of topics to filter
 * @returns Filtered array of pinned topics
 */
export const filterPinnedTopics = (topics: ForumTopic[]): ForumTopic[] => {
  return topics.filter(isTopicPinned)
}

/**
 * Filters topics to exclude pinned topics
 * @param topics - Array of topics to filter
 * @returns Filtered array of non-pinned topics
 */
export const filterUnpinnedTopics = (topics: ForumTopic[]): ForumTopic[] => {
  return topics.filter((topic) => !isTopicPinned(topic))
}

/**
 * Filters topics to only show open (not closed) topics
 * @param topics - Array of topics to filter
 * @returns Filtered array of open topics
 */
export const filterOpenTopics = (topics: ForumTopic[]): ForumTopic[] => {
  return topics.filter((topic) => !isTopicLocked(topic))
}

/**
 * Filters topics by search query (searches title)
 * @param topics - Array of topics to filter
 * @param query - The search query
 * @returns Filtered array of topics matching the query
 */
export const searchTopics = (topics: ForumTopic[], query: string): ForumTopic[] => {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return topics

  return topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(lowerQuery) ||
      topic.fancy_title?.toLowerCase()?.includes(lowerQuery)
  )
}
