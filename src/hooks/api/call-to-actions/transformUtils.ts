
import { CallToAction } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms Supabase response data into a CallToAction object
 */
export const transformToCallToAction = (data: any): CallToAction => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    text: transformedData.text,
    type: transformedData.type,
    description: transformedData.description || "",
    url: transformedData.url || "",
    userId: transformedData.userId,
    isArchived: transformedData.isArchived || false,
    usageCount: transformedData.usageCount || 0,
    createdAt: new Date(transformedData.createdAt)
  } as CallToAction;
};
