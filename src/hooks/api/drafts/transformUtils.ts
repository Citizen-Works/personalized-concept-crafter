
import { ContentDraft, ContentType, DraftStatus } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { createContentDraft } from '@/utils/modelFactory';
import { DraftWithIdea } from './types';

/**
 * Transforms Supabase response data into a ContentDraft object
 */
export const transformToDraft = (data: any): ContentDraft => {
  const transformedData = processApiResponse(data);
  
  return createContentDraft({
    id: transformedData.id,
    contentIdeaId: transformedData.contentIdeaId,
    content: transformedData.content,
    contentType: (transformedData.contentType || 'linkedin') as ContentType,
    contentGoal: transformedData.contentGoal || undefined,
    version: transformedData.version,
    feedback: transformedData.feedback || '',
    status: transformedData.status as DraftStatus,
    createdAt: new Date(transformedData.createdAt)
  });
};

/**
 * Transforms a ContentDraft to a DraftWithIdea
 * Adds the ideaTitle property from the joined content_ideas data if available
 */
export const transformToDraftWithIdea = (draft: ContentDraft, ideaTitle?: string): DraftWithIdea => {
  return {
    ...draft,
    ideaTitle: ideaTitle || 'Untitled Draft'
  };
};

/**
 * Transforms Supabase response data with joined content_ideas directly to a DraftWithIdea
 */
export const transformToJoinedDraft = (data: any): DraftWithIdea => {
  const draft = transformToDraft(data);
  // Extract idea title if available from the joined content_ideas
  const ideaTitle = data.content_ideas?.title;
  
  return transformToDraftWithIdea(draft, ideaTitle);
};
