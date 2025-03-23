
import { ContentDraft, ContentType, DraftStatus } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { createContentDraft } from '@/utils/modelFactory';

/**
 * Transforms Supabase response data into a ContentDraft object
 */
export const transformToDraft = (data: any): ContentDraft => {
  const transformedData = processApiResponse(data);
  
  // Extract idea title if available from the joined content_ideas
  const ideaTitle = data.content_ideas?.title;
  
  return createContentDraft({
    id: transformedData.id,
    contentIdeaId: transformedData.contentIdeaId,
    content: transformedData.content,
    contentType: (transformedData.contentType || 'linkedin') as ContentType,
    contentGoal: transformedData.contentGoal || undefined,
    version: transformedData.version,
    feedback: transformedData.feedback || '',
    status: transformedData.status as DraftStatus,
    createdAt: new Date(transformedData.createdAt),
    // Add ideaTitle as a custom property that we'll use in our adapter
    // This won't be in the return type, but we can use it in the adapter
    ideaTitle: ideaTitle || 'Untitled Draft'
  });
};
