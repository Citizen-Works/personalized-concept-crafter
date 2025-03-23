
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
      
      return {
        id: transformedData.id,
        userId: transformedData.userId,
        name: transformedData.name,
        description: transformedData.description || '',
        painPoints: transformedData.painPoints || [],
        goals: transformedData.goals || [],
        createdAt: new Date(transformedData.createdAt)
      };
    });
  } catch (error) {
    console.error('Error fetching target audiences:', error);
    return [];
  }
}
