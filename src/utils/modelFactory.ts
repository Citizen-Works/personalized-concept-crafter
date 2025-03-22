
import { 
  ContentIdea, 
  ContentDraft, 
  ContentStatus, 
  DraftStatus, 
  ContentType, 
  ContentSource 
} from '@/types';

/**
 * Creates a new ContentIdea object with default values
 */
export const createContentIdea = (
  data: Partial<ContentIdea> & { title: string; userId: string }
): ContentIdea => {
  return {
    id: data.id || crypto.randomUUID(),
    userId: data.userId,
    title: data.title,
    description: data.description || '',
    notes: data.notes || '',
    source: data.source || 'manual' as ContentSource,
    meetingTranscriptExcerpt: data.meetingTranscriptExcerpt,
    sourceUrl: data.sourceUrl,
    status: data.status || 'unreviewed' as ContentStatus,
    hasBeenUsed: data.hasBeenUsed || false,
    createdAt: data.createdAt || new Date(),
    contentPillarIds: data.contentPillarIds || [],
    targetAudienceIds: data.targetAudienceIds || []
  };
};

/**
 * Creates a new ContentDraft object with default values
 */
export const createContentDraft = (
  data: Partial<ContentDraft> & { 
    contentIdeaId: string; 
    content: string;
    contentType: ContentType;
  }
): ContentDraft => {
  return {
    id: data.id || crypto.randomUUID(),
    contentIdeaId: data.contentIdeaId,
    content: data.content,
    contentType: data.contentType,
    contentGoal: data.contentGoal,
    version: data.version || 1,
    feedback: data.feedback || '',
    status: data.status || 'draft' as DraftStatus,
    createdAt: data.createdAt || new Date()
  };
};

/**
 * Validates if an idea status transition is valid
 */
export const isValidIdeaStatusTransition = (
  currentStatus: ContentStatus,
  newStatus: ContentStatus
): boolean => {
  // Define valid transitions
  const validTransitions: Record<ContentStatus, ContentStatus[]> = {
    'unreviewed': ['approved', 'rejected'],
    'approved': ['rejected'],
    'rejected': ['approved']
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Validates if a draft status transition is valid
 */
export const isValidDraftStatusTransition = (
  currentStatus: DraftStatus,
  newStatus: DraftStatus
): boolean => {
  // Define valid transitions
  const validTransitions: Record<DraftStatus, DraftStatus[]> = {
    'draft': ['ready', 'archived'],
    'ready': ['published', 'draft', 'archived'],
    'published': ['archived'],
    'archived': ['draft']
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};
