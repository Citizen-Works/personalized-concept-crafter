export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          type: string
          purpose: string
          status: string
          content_type: string | null
          created_at: string
          processing_status: string
          has_ideas: boolean
          ideas_count: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          type: string
          purpose: string
          status: string
          content_type?: string | null
          created_at?: string
          processing_status?: string
          has_ideas?: boolean
          ideas_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          type?: string
          purpose?: string
          status?: string
          content_type?: string | null
          created_at?: string
          processing_status?: string
          has_ideas?: boolean
          ideas_count?: number
        }
      }
      webhook_configurations: {
        Row: {
          id: string
          user_id: string
          service_name: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_name: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_name?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 