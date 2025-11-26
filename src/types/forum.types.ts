/**
 * @fileoverview Comprehensive TypeScript type definitions for the freeCodeCamp Forum API
 * These types model the data structures returned by the forum-proxy.freecodecamp.rocks API
 */

// ============================================================================
// Branded Types for Type Safety
// ============================================================================

/**
 * Branded type for User IDs to prevent mixing different ID types
 * @example
 * const userId: UserId = 12345 as UserId
 */
export type UserId = number & { readonly __brand: 'UserId' }

/**
 * Branded type for Topic IDs to prevent mixing different ID types
 * @example
 * const topicId: TopicId = 67890 as TopicId
 */
export type TopicId = number & { readonly __brand: 'TopicId' }

/**
 * Branded type for Category IDs to prevent mixing different ID types
 * @example
 * const categoryId: CategoryId = 421 as CategoryId
 */
export type CategoryId = number & { readonly __brand: 'CategoryId' }

/**
 * Branded type for Group IDs to prevent mixing different ID types
 * @example
 * const groupId: GroupId = 46 as GroupId
 */
export type GroupId = number & { readonly __brand: 'GroupId' }

// ============================================================================
// Trust Levels
// ============================================================================

/**
 * Forum user trust levels (0-4)
 * - 0: New User
 * - 1: Basic User
 * - 2: Member
 * - 3: Regular
 * - 4: Leader
 */
export type TrustLevel = 0 | 1 | 2 | 3 | 4

// ============================================================================
// User Types
// ============================================================================

/**
 * Represents a user in the freeCodeCamp forum
 * Contains user profile information and permissions
 */
export interface ForumUser {
  /** Unique identifier for the user */
  id: UserId
  /** Username (handle) of the user */
  username: string
  /** Display name of the user (optional) */
  name?: string | null
  /** Avatar template URL with {size} placeholder */
  avatar_template: string
  /** User's trust level (0-4) */
  trust_level: TrustLevel
  /** Primary group name the user belongs to */
  primary_group_name?: string
  /** Flair display name */
  flair_name?: string
  /** Flair icon URL or FontAwesome icon name */
  flair_url?: string
  /** Flair background color (hex color) */
  flair_bg_color?: string
  /** Flair text color (hex color) */
  flair_color?: string
  /** Group ID associated with the flair */
  flair_group_id?: GroupId
  /** Whether the user is a moderator */
  moderator?: boolean
  /** Whether the user is an admin */
  admin?: boolean
}

/**
 * Utility type for creating a user with only essential fields
 * Useful for displaying minimal user information
 */
export type MinimalUser = Pick<ForumUser, 'id' | 'username' | 'avatar_template'>

/**
 * Utility type for user data required for displaying avatars
 */
export type UserAvatarData = Pick<ForumUser, 'id' | 'username' | 'avatar_template' | 'name'>

/**
 * Utility type for partial user updates
 */
export type PartialUser = Partial<ForumUser> & Pick<ForumUser, 'id'>

// ============================================================================
// Topic Poster Types
// ============================================================================

/**
 * Represents a poster (participant) in a forum topic
 * Contains information about users who have posted in a topic
 */
export interface TopicPoster {
  /** Additional information (e.g., "latest", "frequent") */
  extras?: string | null
  /** Description of the poster's role (e.g., "Original Poster", "Most Recent Poster") */
  description: string
  /** User ID of the poster */
  user_id: UserId
  /** Primary group ID of the poster */
  primary_group_id?: GroupId | null
  /** Flair group ID of the poster */
  flair_group_id?: GroupId | null
}

// ============================================================================
// Topic Types
// ============================================================================

/**
 * Topic archetype determines the type of topic
 */
export type TopicArchetype = 'regular' | 'private_message' | 'banner'

/**
 * Represents a forum topic with all its properties
 * Contains comprehensive information about a discussion thread
 */
export interface ForumTopic {
  /** Unique identifier for the topic */
  id: TopicId
  /** Plain text title of the topic */
  title: string
  /** Formatted/fancy title with HTML entities */
  fancy_title?: string
  /** URL-friendly slug of the topic */
  slug: string
  /** Total number of posts in the topic */
  posts_count: number
  /** Number of replies (excluding the original post) */
  reply_count: number
  /** Highest post number in the topic */
  highest_post_number: number
  /** URL to the topic's featured image */
  image_url?: string | null
  /** ISO 8601 timestamp when the topic was created */
  created_at: string
  /** ISO 8601 timestamp of the last post */
  last_posted_at: string
  /** Whether the topic has been bumped */
  bumped: boolean
  /** ISO 8601 timestamp when the topic was last bumped */
  bumped_at: string
  /** Type of topic (regular, private_message, etc.) */
  archetype: TopicArchetype
  /** Whether the topic is unseen by the current user */
  unseen: boolean
  /** Whether the topic is pinned in its category */
  pinned: boolean
  /** Whether the topic has been unpinned */
  unpinned?: boolean | null
  /** Whether the topic is visible */
  visible: boolean
  /** Whether the topic is closed for new replies */
  closed: boolean
  /** Whether the topic is archived */
  archived: boolean
  /** Whether the topic is bookmarked by the current user */
  bookmarked?: boolean | null
  /** Whether the topic is liked by the current user */
  liked?: boolean | null
  /** Object containing tag descriptions */
  tags_descriptions?: Record<string, string>
  /** Number of views the topic has received */
  views: number
  /** Number of likes the topic has received */
  like_count: number
  /** Whether the topic has a summary */
  has_summary: boolean
  /** Username of the last person to post */
  last_poster_username: string
  /** Category ID the topic belongs to */
  category_id: CategoryId
  /** Whether the topic is pinned globally (all categories) */
  pinned_globally: boolean
  /** URL to an external featured link */
  featured_link?: string | null
  /** Whether the topic has an accepted answer */
  has_accepted_answer?: boolean
  /** Whether the current user can vote on this topic */
  can_vote?: boolean
  /** List of users who have posted in the topic */
  posters: TopicPoster[]
}

/**
 * Utility type for topic summaries/previews
 * Contains only essential fields for displaying topic lists
 */
export type TopicSummary = Pick<
  ForumTopic,
  'id' | 'title' | 'slug' | 'reply_count' | 'views' | 'last_posted_at' | 'category_id' | 'posters'
>

/**
 * Utility type for topic metadata
 * Contains only metadata fields without content
 */
export type TopicMetadata = Pick<
  ForumTopic,
  'id' | 'created_at' | 'last_posted_at' | 'views' | 'like_count' | 'posts_count' | 'reply_count'
>

/**
 * Utility type for creating new topics
 * Omits auto-generated fields
 */
export type NewTopic = Pick<ForumTopic, 'title' | 'category_id'> &
  Partial<Pick<ForumTopic, 'featured_link' | 'archetype'>>

// ============================================================================
// Category Types
// ============================================================================

/**
 * Represents a forum category
 * Categories organize topics into different sections
 */
export interface ForumCategory {
  /** Unique identifier for the category */
  id: CategoryId
  /** Name of the category */
  name: string
  /** URL-friendly slug of the category */
  slug: string
  /** Color code for the category (hex color) */
  color: string
  /** Text color for the category (hex color) */
  text_color: string
  /** Description of the category */
  description?: string | null
  /** HTML description of the category */
  description_text?: string | null
  /** Number of topics in the category */
  topic_count?: number
  /** URL to the category's logo */
  logo_url?: string | null
  /** URL to the category's background image */
  background_url?: string | null
  /** Whether the category can have topics */
  has_children?: boolean
  /** Parent category ID if this is a subcategory */
  parent_category_id?: CategoryId | null
  /** Position/order of the category in the list */
  position?: number
  /** Number of topics created in the last week */
  topics_week?: number
  /** Number of topics created in the last month */
  topics_month?: number
  /** Number of topics created in the last year */
  topics_year?: number
  /** Number of topics created all time */
  topics_all_time?: number
}

/**
 * Utility type for category display in dropdowns/selects
 */
export type CategoryOption = Pick<ForumCategory, 'id' | 'name' | 'slug' | 'color'>

// ============================================================================
// Group Types
// ============================================================================

/**
 * Represents a user group in the forum
 */
export interface ForumGroup {
  /** Unique identifier for the group */
  id: GroupId
  /** Name of the group */
  name: string
  /** Display name of the group */
  display_name?: string
  /** Flair URL or icon for the group */
  flair_url?: string
  /** Flair background color */
  flair_bg_color?: string
  /** Flair text color */
  flair_color?: string
}

// ============================================================================
// Topic List Types
// ============================================================================

/**
 * Contains a list of topics with metadata
 * Represents the topic list portion of API responses
 */
export interface TopicList {
  /** Array of forum topics */
  topics: ForumTopic[]
  /** Whether more topics can be loaded */
  can_create_topic?: boolean
  /** Per-page limit for topics */
  per_page?: number
  /** Array of tag filters applied */
  tags?: string[]
  /** Top-level categories */
  categories?: ForumCategory[]
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Response from the /latest endpoint
 * Contains the latest topics and associated users
 */
export interface LatestTopicsResponse {
  /** List of users referenced in the topics */
  users: ForumUser[]
  /** Topic list with metadata */
  topic_list: TopicList
  /** Primary groups in the forum */
  primary_groups?: ForumGroup[]
  /** Flair groups in the forum */
  flair_groups?: ForumGroup[]
}

/**
 * Generic API response type for forum data
 * @deprecated Use LatestTopicsResponse for better type safety
 */
export interface ForumApiResponse {
  /** List of users */
  users: ForumUser[]
  /** Topic list container */
  topic_list: {
    /** Array of topics */
    topics: ForumTopic[]
  }
}

/**
 * Response from a single topic endpoint
 */
export interface TopicDetailsResponse {
  /** The topic details */
  topic: ForumTopic
  /** Users mentioned in the topic */
  users: ForumUser[]
  /** Related topics */
  suggested_topics?: ForumTopic[]
}

/**
 * Generic API error response
 */
export interface ApiErrorResponse {
  /** Error message */
  error: string
  /** Error type */
  error_type?: string
  /** HTTP status code */
  status?: number
}

/**
 * Generic API result wrapper
 * Useful for handling success and error states
 */
export type ApiResult<T> = { success: true; data: T } | { success: false; error: ApiErrorResponse }

// ============================================================================
// Utility Helper Types
// ============================================================================

/**
 * Helper type to extract the ID type from a branded type
 */
export type ExtractId<T> = T extends { id: infer U } ? U : never

/**
 * Helper type for paginated responses
 */
export interface PaginatedResponse<T> {
  /** The data items */
  data: T[]
  /** Current page number */
  page: number
  /** Total number of pages */
  total_pages: number
  /** Total number of items */
  total_items: number
  /** Items per page */
  per_page: number
}

/**
 * Helper type for sortable fields
 */
export type SortableTopicField =
  | 'created_at'
  | 'last_posted_at'
  | 'views'
  | 'like_count'
  | 'posts_count'

/**
 * Helper type for sort order
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Topic query parameters
 */
export interface TopicQueryParams {
  /** Category to filter by */
  category?: CategoryId
  /** Tag to filter by */
  tag?: string
  /** Field to sort by */
  sort?: SortableTopicField
  /** Sort order */
  order?: SortOrder
  /** Page number */
  page?: number
  /** Items per page */
  per_page?: number
}
