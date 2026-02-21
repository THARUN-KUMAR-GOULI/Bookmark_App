export type Bookmark = {
  id: number
  user_id: string
  url: string
  title: string
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email?: string
  user_metadata?: {
    avatar_url?: string
    full_name?: string
    name?: string
  }
}