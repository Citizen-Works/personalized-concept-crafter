
import { ContentIdea, ContentDraft, ContentStatus, DraftStatus, ContentType, ContentSource } from '@/types';
import { isValidContentStatusTransition, isValidDraftStatusTransition } from '@/types';

/**
 * Validates a ContentIdea object
 * @returns An array of validation errors, empty if valid
 */
export const validateContentIdea = (idea: Partial<ContentIdea>): string[] => {
  const errors: string[] = [];
  
  // Required fields
  if (!idea.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!idea.userId) {
    errors.push('User ID is required');
  }
  
  // Validate status value
  const validStatuses: ContentStatus[] = ['unreviewed', 'approved', 'rejected'];
  if (idea.status && !validStatuses.includes(idea.status)) {
    errors.push(`Invalid status: ${idea.status}. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  // Validate source value
  const validSources: ContentSource[] = ['manual', 'meeting', 'transcript', 'document', 'external', 'ai', 'other'];
  if (idea.source && !validSources.includes(idea.source)) {
    errors.push(`Invalid source: ${idea.source}. Must be one of: ${validSources.join(', ')}`);
  }
  
  // URL validation if present
  if (idea.sourceUrl && !/^https?:\/\//.test(idea.sourceUrl)) {
    errors.push('Source URL must be a valid URL starting with http:// or https://');
  }
  
  return errors;
};

/**
 * Validates a ContentDraft object
 * @returns An array of validation errors, empty if valid
 */
export const validateContentDraft = (draft: Partial<ContentDraft>): string[] => {
  const errors: string[] = [];
  
  // Required fields
  if (!draft.content?.trim()) {
    errors.push('Content is required');
  }
  
  if (!draft.contentIdeaId) {
    errors.push('Content Idea ID is required');
  }
  
  // Validate status value
  const validStatuses: DraftStatus[] = ['draft', 'ready', 'published', 'archived'];
  if (draft.status && !validStatuses.includes(draft.status)) {
    errors.push(`Invalid status: ${draft.status}. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  // Validate content type
  const validContentTypes: ContentType[] = ['linkedin', 'newsletter', 'marketing', 'social'];
  if (draft.contentType && !validContentTypes.includes(draft.contentType)) {
    errors.push(`Invalid content type: ${draft.contentType}. Must be one of: ${validContentTypes.join(', ')}`);
  }
  
  // Version must be positive
  if (draft.version !== undefined && draft.version <= 0) {
    errors.push('Version must be a positive number');
  }
  
  return errors;
};

/**
 * Validates a content status transition
 * @returns Boolean indicating if the transition is valid
 */
export const validateContentStatusTransition = (
  currentStatus: ContentStatus,
  newStatus: ContentStatus
): boolean => {
  return isValidContentStatusTransition(currentStatus, newStatus);
};

/**
 * Validates a draft status transition
 * @returns Boolean indicating if the transition is valid
 */
export const validateDraftStatusTransition = (
  currentStatus: DraftStatus,
  newStatus: DraftStatus
): boolean => {
  return isValidDraftStatusTransition(currentStatus, newStatus);
};
