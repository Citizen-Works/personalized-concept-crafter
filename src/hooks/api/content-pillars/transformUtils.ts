
import { ContentPillar } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms Supabase response data into a ContentPillar object
 */
export const transformToContentPillar = (data: any): ContentPillar => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    name: transformedData.name,
    description: transformedData.description || "",
    userId: transformedData.userId,
    isArchived: transformedData.isArchived || false,
    displayOrder: transformedData.displayOrder || 0,
    usageCount: transformedData.usageCount || 0,
    createdAt: new Date(transformedData.createdAt)
  } as ContentPillar;
};
