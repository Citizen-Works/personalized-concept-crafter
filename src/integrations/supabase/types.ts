export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content_drafts: {
        Row: {
          content: string
          content_idea_id: string
          created_at: string
          feedback: string | null
          id: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          content: string
          content_idea_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Update: {
          content?: string
          content_idea_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_drafts_content_idea_id_fkey"
            columns: ["content_idea_id"]
            isOneToOne: false
            referencedRelation: "content_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ideas: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          id: string
          meeting_transcript_excerpt: string | null
          notes: string | null
          source: string
          source_url: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          meeting_transcript_excerpt?: string | null
          notes?: string | null
          source?: string
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          meeting_transcript_excerpt?: string | null
          notes?: string | null
          source?: string
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_pillars: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          id: string
          purpose: string
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          purpose?: string
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          purpose?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      linkedin_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          published_at: string | null
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          published_at?: string | null
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          published_at?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_description: string | null
          business_name: string | null
          created_at: string
          id: string
          linkedin_url: string | null
          name: string | null
          updated_at: string
        }
        Insert: {
          business_description?: string | null
          business_name?: string | null
          created_at?: string
          id: string
          linkedin_url?: string | null
          name?: string | null
          updated_at?: string
        }
        Update: {
          business_description?: string | null
          business_name?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      target_audiences: {
        Row: {
          created_at: string
          description: string | null
          goals: string[] | null
          id: string
          name: string
          pain_points: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          goals?: string[] | null
          id?: string
          name: string
          pain_points?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          goals?: string[] | null
          id?: string
          name?: string
          pain_points?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      writing_style_profiles: {
        Row: {
          avoid_patterns: string | null
          created_at: string
          custom_prompt_instructions: string | null
          example_quotes: string[] | null
          general_style_guide: string | null
          id: string
          linkedin_examples: string[] | null
          linkedin_style_guide: string | null
          marketing_examples: string[] | null
          marketing_style_guide: string | null
          newsletter_examples: string[] | null
          newsletter_style_guide: string | null
          updated_at: string
          user_id: string
          vocabulary_patterns: string | null
          voice_analysis: string | null
        }
        Insert: {
          avoid_patterns?: string | null
          created_at?: string
          custom_prompt_instructions?: string | null
          example_quotes?: string[] | null
          general_style_guide?: string | null
          id?: string
          linkedin_examples?: string[] | null
          linkedin_style_guide?: string | null
          marketing_examples?: string[] | null
          marketing_style_guide?: string | null
          newsletter_examples?: string[] | null
          newsletter_style_guide?: string | null
          updated_at?: string
          user_id: string
          vocabulary_patterns?: string | null
          voice_analysis?: string | null
        }
        Update: {
          avoid_patterns?: string | null
          created_at?: string
          custom_prompt_instructions?: string | null
          example_quotes?: string[] | null
          general_style_guide?: string | null
          id?: string
          linkedin_examples?: string[] | null
          linkedin_style_guide?: string | null
          marketing_examples?: string[] | null
          marketing_style_guide?: string | null
          newsletter_examples?: string[] | null
          newsletter_style_guide?: string | null
          updated_at?: string
          user_id?: string
          vocabulary_patterns?: string | null
          voice_analysis?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
