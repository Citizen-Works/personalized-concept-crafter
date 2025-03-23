
import { ContentIdea, ContentStatus, ContentSource } from '@/types';
import { IdeaDbRecord } from './types';
import { createContentIdea } from '@/utils/modelFactory';

/**
 * Transforms a database record into a ContentIdea
 */
export const transformToContentIdea = (record: IdeaDbRecord): ContentIdea => {
  // Ensure array types are handled correctly
  const contentPillarIds = Array.isArray(record.content_pillar_ids) 
    ? [...record.content_pillar_ids] as string[]
    : [];
    
  const targetAudienceIds = Array.isArray(record.target_audience_ids)
    ? [...record.target_audience_ids] as string[]
    : [];

  return createContentIdea({
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
    contentPillarIds,
    targetAudienceIds
  });
};
