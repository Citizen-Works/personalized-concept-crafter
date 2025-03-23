
import { ContentIdea, ContentStatus, ContentSource } from '@/types';

export interface IdeaCreateInput {
  title: string;
  description?: string;
  notes?: string;
  source: ContentSource;
  meetingTranscriptExcerpt?: string;
  sourceUrl?: string;
  status: ContentStatus;
  hasBeenUsed?: boolean;
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
}

export interface IdeaUpdateInput {
  title?: string;
  description?: string;
  notes?: string;
  source?: ContentSource;
  meetingTranscriptExcerpt?: string;
  sourceUrl?: string;
  status?: ContentStatus;
  hasBeenUsed?: boolean;
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
}

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
