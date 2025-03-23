
import { ContentIdea, ContentStatus, ContentSource } from "@/types";

// Type for the raw data from Supabase
export interface IdeaDbRecord {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  notes: string | null;
  source: string;
  meeting_transcript_excerpt: string | null;
  source_url: string | null;
  status: string;
  has_been_used: boolean;
  created_at: string;
  content_pillar_ids?: string[];
  target_audience_ids?: string[];
}

// Function to transform from DB record to ContentIdea
export function transformToContentIdea(record: IdeaDbRecord): ContentIdea {
  return {
    id: record.id,
    userId: record.user_id,
    title: record.title,
    description: record.description || "",
    notes: record.notes || "",
    source: record.source as ContentSource,
    meetingTranscriptExcerpt: record.meeting_transcript_excerpt,
    sourceUrl: record.source_url,
    status: record.status as ContentStatus,
    hasBeenUsed: record.has_been_used || false,
    createdAt: new Date(record.created_at),
    contentPillarIds: Array.isArray(record.content_pillar_ids) ? [...record.content_pillar_ids] : [],
    targetAudienceIds: Array.isArray(record.target_audience_ids) ? [...record.target_audience_ids] : []
  };
}
