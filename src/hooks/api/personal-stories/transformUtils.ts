
import { PersonalStory } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms Supabase response data into a PersonalStory object
 */
export const transformToPersonalStory = (data: any): PersonalStory => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    userId: transformedData.userId,
    title: transformedData.title,
    content: transformedData.content,
    tags: Array.isArray(transformedData.tags) ? transformedData.tags : [],
    contentPillarIds: Array.isArray(transformedData.contentPillarIds) ? transformedData.contentPillarIds : [],
    targetAudienceIds: Array.isArray(transformedData.targetAudienceIds) ? transformedData.targetAudienceIds : [],
    isArchived: transformedData.isArchived || false,
    usageCount: transformedData.usageCount || 0,
    lesson: transformedData.lesson || "",
    usageGuidance: transformedData.usageGuidance || "",
    lastUsedDate: transformedData.lastUsedDate || null,
    createdAt: new Date(transformedData.createdAt),
    updatedAt: new Date(transformedData.updatedAt || transformedData.createdAt)
  } as PersonalStory;
};
