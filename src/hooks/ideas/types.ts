
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
}
