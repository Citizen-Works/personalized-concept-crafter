
import { TargetAudience } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Transforms Supabase response data into a TargetAudience object
 */
export const transformToTargetAudience = (data: any): TargetAudience => {
  const transformedData = processApiResponse(data);
  
  return {
    id: transformedData.id,
    userId: transformedData.userId,
    name: transformedData.name,
    description: transformedData.description || "",
    painPoints: Array.isArray(transformedData.painPoints) ? transformedData.painPoints : [],
    goals: Array.isArray(transformedData.goals) ? transformedData.goals : [],
    isArchived: transformedData.isArchived || false,
    usageCount: transformedData.usageCount || 0,
    createdAt: new Date(transformedData.createdAt)
  } as TargetAudience;
};
