
import { TargetAudience } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms database response into a TargetAudience object
 */
export const transformToTargetAudience = (data: any): TargetAudience => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    userId: transformedData.userId,
    name: transformedData.name,
    description: transformedData.description || '',
    // Ensure arrays are handled correctly by explicitly converting to native arrays
    painPoints: Array.isArray(transformedData.painPoints) ? 
      [...transformedData.painPoints] as string[] : [],
    goals: Array.isArray(transformedData.goals) ? 
      [...transformedData.goals] as string[] : [],
    createdAt: new Date(transformedData.createdAt),
    isArchived: transformedData.isArchived || false,
    usageCount: transformedData.usageCount || 0
  } as TargetAudience;
};
