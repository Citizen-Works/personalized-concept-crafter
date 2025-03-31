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
          type: 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'transcript' | 'other'
          purpose: 'writing_sample' | 'content_idea' | 'research'
          status: 'active' | 'archived'
          content_type: 'linkedin' | 'newsletter' | 'marketing' | 'general' | null
          created_at: string
          processing_status: 'idle' | 'processing' | 'completed' | 'failed'
          has_ideas: boolean
          ideas_count: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          type: 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'transcript' | 'other'
          purpose: 'writing_sample' | 'content_idea' | 'research'
          status?: 'active' | 'archived'
          content_type?: 'linkedin' | 'newsletter' | 'marketing' | 'general' | null
          created_at?: string
          processing_status?: 'idle' | 'processing' | 'completed' | 'failed'
          has_ideas?: boolean
          ideas_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          type?: 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'transcript' | 'other'
          purpose?: 'writing_sample' | 'content_idea' | 'research'
          status?: 'active' | 'archived'
          content_type?: 'linkedin' | 'newsletter' | 'marketing' | 'general' | null
          created_at?: string
          processing_status?: 'idle' | 'processing' | 'completed' | 'failed'
          has_ideas?: boolean
          ideas_count?: number
        }
      }
      content_ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          source: 'transcript' | 'manual' | 'ai_generated'
          source_url: string | null
          status: 'unreviewed' | 'approved' | 'rejected'
          has_been_used: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          source: 'transcript' | 'manual' | 'ai_generated'
          source_url?: string | null
          status?: 'unreviewed' | 'approved' | 'rejected'
          has_been_used?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          source?: 'transcript' | 'manual' | 'ai_generated'
          source_url?: string | null
          status?: 'unreviewed' | 'approved' | 'rejected'
          has_been_used?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_context: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_description: string
          target_audience: string
          content_pillars: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_description: string
          target_audience: string
          content_pillars: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_description?: string
          target_audience?: string
          content_pillars?: string[]
          created_at?: string
          updated_at?: string
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