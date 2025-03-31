/// <reference types="https://deno.land/x/types/index.d.ts" />

import { corsHeaders as _corsHeaders } from "./cors.ts";

// Standard library imports
export { serve } from "std/http/server.ts";
export { createClient } from "@supabase/supabase-js";

// Types
export type { ConnInfo } from "https://deno.land/std@0.201.0/http/server.ts";
export type { SupabaseClient } from "@supabase/supabase-js";

// Constants
export const CORS_HEADERS = _corsHeaders;

export interface ContentPillar {
  id: string;
  user_id: string;
  name: string;
  description: string;
  display_order: number;
  is_archived: boolean;
  created_at: string;
}

export interface TargetAudience {
  id: string;
  user_id: string;
  name: string;
  description: string;
  is_archived: boolean;
  created_at: string;
}

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
      }
      content_pillars: {
        Row: ContentPillar
      }
      target_audiences: {
        Row: TargetAudience
      }
    }
  }
}

export interface ProcessDocumentPayload {
  documentId: string
  userId: string
}

// Deno environment type declarations
declare global {
  namespace Deno {
    interface Env {
      get(key: string): string | undefined
    }
    var env: Env
  }
}

// Add Deno types
/// <reference types="https://deno.land/x/types/index.d.ts" /> 