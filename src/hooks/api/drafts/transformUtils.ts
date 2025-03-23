
import { ContentDraft, ContentType, DraftStatus } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { createContentDraft } from '@/utils/modelFactory';

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
