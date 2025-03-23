
import { ContentSource, ContentStatus } from '@/types';

export interface IdeaCreateInput {
  title: string;
  description?: string;
  notes?: string;
  source: ContentSource;
  meetingTranscriptExcerpt?: string | null;
  sourceUrl?: string | null;
  status: ContentStatus;
  hasBeenUsed?: boolean; // Added to support marking an idea as used when it's created
  contentPillarIds?: string[]; // Add this field
  targetAudienceIds?: string[]; // Add this field
}

export interface IdeaUpdateInput {
  title?: string;
  description?: string;
  notes?: string;
  source?: ContentSource;
  meetingTranscriptExcerpt?: string | null;
  sourceUrl?: string | null;
  status?: ContentStatus;
  hasBeenUsed?: boolean; // Added to support updating the hasBeenUsed field
  contentPillarIds?: string[]; // Add this field
  targetAudienceIds?: string[]; // Add this field
}
