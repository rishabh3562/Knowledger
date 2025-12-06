import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          id: string
          title: string
          summary: string
          tags: string[]
          cover_image: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          tags: string[]
          cover_image?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          tags?: string[]
          cover_image?: string | null
          created_at?: string
          user_id?: string
        }
      }
      blocks: {
        Row: {
          id: string
          chapter_id: string
          type: 'text' | 'code' | 'image' | 'pdf' | 'link'
          content: string | null
          file_url: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          type: 'text' | 'code' | 'image' | 'pdf' | 'link'
          content?: string | null
          file_url?: string | null
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          type?: 'text' | 'code' | 'image' | 'pdf' | 'link'
          content?: string | null
          file_url?: string | null
          position?: number
          created_at?: string
        }
      }
      links: {
        Row: {
          id: string
          from_chapter: string
          to_chapter: string
          created_at: string
        }
        Insert: {
          id?: string
          from_chapter: string
          to_chapter: string
          created_at?: string
        }
        Update: {
          id?: string
          from_chapter?: string
          to_chapter?: string
          created_at?: string
        }
      }
    }
  }
}
