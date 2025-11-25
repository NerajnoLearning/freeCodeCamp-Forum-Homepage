export interface ForumUser {
  id: number
  username: string
  name?: string
  avatar_template: string
}

export interface TopicPoster {
  extras?: string
  description: string
  user_id: number
  primary_group_id?: number
}

export interface ForumTopic {
  id: number
  title: string
  fancy_title?: string
  slug: string
  posts_count: number
  reply_count: number
  highest_post_number: number
  image_url?: string | null
  created_at: string
  last_posted_at: string
  bumped: boolean
  bumped_at: string
  archetype: string
  unseen: boolean
  pinned: boolean
  unpinned?: boolean | null
  visible: boolean
  closed: boolean
  archived: boolean
  bookmarked?: boolean | null
  liked?: boolean | null
  views: number
  like_count: number
  has_summary: boolean
  last_poster_username: string
  category_id: number
  pinned_globally: boolean
  featured_link?: string | null
  posters: TopicPoster[]
}

export interface ForumApiResponse {
  users: ForumUser[]
  topic_list: {
    topics: ForumTopic[]
  }
}
