
import { supabase } from '@/integrations/supabase/client';
import { TargetAudience } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Fetches the target audiences for a user
 */
export async function fetchTargetAudiences(userId: string): Promise<TargetAudience[]> {
  try {
    const { data, error } = await supabase
      .from('target_audiences')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Transform response data to ensure consistent property naming
    return data.map(audience => {
      const transformedData = processApiResponse(audience);
      
      // Create a properly typed TargetAudience object
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
    });
  } catch (error) {
    console.error('Error fetching target audiences:', error);
    return [];
  }
}
