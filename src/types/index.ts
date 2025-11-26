/**
 * @fileoverview Barrel file exporting all TypeScript types for the application
 * Import types from this file instead of individual modules for better organization
 */

// ============================================================================
// Branded ID Types
// ============================================================================
export type { UserId, TopicId, CategoryId, GroupId } from './forum.types'

// ============================================================================
// Core Entity Types
// ============================================================================
export type { ForumUser, ForumTopic, ForumCategory, ForumGroup, TopicPoster } from './forum.types'

// ============================================================================
// User Utility Types
// ============================================================================
export type { MinimalUser, UserAvatarData, PartialUser } from './forum.types'

// ============================================================================
// Topic Utility Types
// ============================================================================
export type {
  TopicSummary,
  TopicMetadata,
  NewTopic,
  TopicArchetype,
  TrustLevel,
} from './forum.types'

// ============================================================================
// Category Utility Types
// ============================================================================
export type { CategoryOption } from './forum.types'

// ============================================================================
// API Response Types
// ============================================================================
export type {
  ForumApiResponse,
  LatestTopicsResponse,
  TopicDetailsResponse,
  TopicList,
  ApiErrorResponse,
  ApiResult,
} from './forum.types'

// ============================================================================
// Helper & Utility Types
// ============================================================================
export type {
  ExtractId,
  PaginatedResponse,
  SortableTopicField,
  SortOrder,
  TopicQueryParams,
} from './forum.types'

// ============================================================================
// Type Guards and Utility Functions
// ============================================================================
export {
  // ID Converters
  toUserId,
  toTopicId,
  toCategoryId,
  toGroupId,
  // Type Guards
  isTrustLevel,
  isForumUser,
  isForumTopic,
  isForumCategory,
  isSuccessResult,
  isErrorResult,
  // Validation Helpers
  getUserAvatarUrl,
  isUserPrivileged,
  isUserStaff,
  isTopicPinned,
  isTopicLocked,
  isTopicArchived,
  hasAcceptedAnswer,
  // Sorting Helpers
  compareTopicsByLastPosted,
  compareTopicsByCreated,
  compareTopicsByViews,
  compareTopicsByReplies,
  // Filter Helpers
  filterTopicsByCategory,
  filterPinnedTopics,
  filterUnpinnedTopics,
  filterOpenTopics,
  searchTopics,
} from './type-guards'
