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
      admin_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: []
      }
      call_to_actions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean | null
          text: string
          type: string
          updated_at: string
          url: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean | null
          text: string
          type: string
          updated_at?: string
          url?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean | null
          text?: string
          type?: string
          updated_at?: string
          url?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      content_drafts: {
        Row: {
          content: string
          content_idea_id: string
          created_at: string
          feedback: string | null
          id: string
          status: string
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
          status?: string
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
          status?: string
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
          content_type: string | null
          created_at: string
          description: string | null
          id: string
          meeting_transcript_excerpt: string | null
          notes: string | null
          published_at: string | null
          source: string | null
          source_url: string | null
          status: string
          status_changed_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          meeting_transcript_excerpt?: string | null
          notes?: string | null
          published_at?: string | null
          source?: string | null
          source_url?: string | null
          status?: string
          status_changed_at?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          meeting_transcript_excerpt?: string | null
          notes?: string | null
          published_at?: string | null
          source?: string | null
          source_url?: string | null
          status?: string
          status_changed_at?: string | null
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
          display_order: number | null
          id: string
          is_archived: boolean | null
          name: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_archived?: boolean | null
          name: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_archived?: boolean | null
          name?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          has_ideas: boolean | null
          id: string
          ideas_count: number | null
          is_encrypted: boolean | null
          processing_status: string | null
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
          has_ideas?: boolean | null
          id?: string
          ideas_count?: number | null
          is_encrypted?: boolean | null
          processing_status?: string | null
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
          has_ideas?: boolean | null
          id?: string
          ideas_count?: number | null
          is_encrypted?: boolean | null
          processing_status?: string | null
          purpose?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      landing_page_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          order: number
          section_key: string
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          order?: number
          section_key: string
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          order?: number
          section_key?: string
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      linkedin_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          published_at: string | null
          tag: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          published_at?: string | null
          tag?: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          published_at?: string | null
          tag?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      personal_stories: {
        Row: {
          content: string
          content_pillar_ids: string[] | null
          created_at: string
          id: string
          is_archived: boolean | null
          last_used_date: string | null
          lesson: string | null
          tags: string[] | null
          target_audience_ids: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
          usage_guidance: string | null
          user_id: string
        }
        Insert: {
          content: string
          content_pillar_ids?: string[] | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_used_date?: string | null
          lesson?: string | null
          tags?: string[] | null
          target_audience_ids?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
          usage_guidance?: string | null
          user_id: string
        }
        Update: {
          content?: string
          content_pillar_ids?: string[] | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_used_date?: string | null
          lesson?: string | null
          tags?: string[] | null
          target_audience_ids?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          usage_guidance?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pillar_audience_links: {
        Row: {
          audience_id: string | null
          created_at: string
          id: string
          pillar_id: string | null
          relationship_strength: number | null
          user_id: string
        }
        Insert: {
          audience_id?: string | null
          created_at?: string
          id?: string
          pillar_id?: string | null
          relationship_strength?: number | null
          user_id: string
        }
        Update: {
          audience_id?: string | null
          created_at?: string
          id?: string
          pillar_id?: string | null
          relationship_strength?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_audience_links_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "target_audiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pillar_audience_links_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "content_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_description: string | null
          business_name: string | null
          created_at: string
          id: string
          job_title: string | null
          linkedin_url: string | null
          name: string | null
          updated_at: string
        }
        Insert: {
          business_description?: string | null
          business_name?: string | null
          created_at?: string
          id: string
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          updated_at?: string
        }
        Update: {
          business_description?: string | null
          business_name?: string | null
          created_at?: string
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          category: string
          content: string
          content_type: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          parent_version: string | null
          template_key: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          category: string
          content: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          parent_version?: string | null
          template_key: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          category?: string
          content?: string
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          parent_version?: string | null
          template_key?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_templates_parent_version_fkey"
            columns: ["parent_version"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      story_usage: {
        Row: {
          content_id: string
          created_at: string
          id: string
          story_id: string
          usage_date: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          story_id: string
          usage_date?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          story_id?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_usage_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "personal_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      target_audiences: {
        Row: {
          created_at: string
          description: string | null
          goals: string[] | null
          id: string
          is_archived: boolean | null
          name: string
          pain_points: string[] | null
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          goals?: string[] | null
          id?: string
          is_archived?: boolean | null
          name: string
          pain_points?: string[] | null
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          goals?: string[] | null
          id?: string
          is_archived?: boolean | null
          name?: string
          pain_points?: string[] | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          api_key: string | null
          created_at: string
          custom_instructions: string | null
          id: string
          notification_app: boolean | null
          notification_email: boolean | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          custom_instructions?: string | null
          id?: string
          notification_app?: boolean | null
          notification_email?: boolean | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string
          custom_instructions?: string | null
          id?: string
          notification_app?: boolean | null
          notification_email?: boolean | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      webhook_configurations: {
        Row: {
          api_key: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_connected: string | null
          service_name: string
          settings: Json | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_connected?: string | null
          service_name: string
          settings?: Json | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_connected?: string | null
          service_name?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          error: string | null
          event_type: string
          id: string
          payload: Json | null
          processed: boolean | null
          service_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          service_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          service_name?: string
          user_id?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment: {
        Args: {
          row_id: string
        }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
