
import { supabase } from '@/integrations/supabase/client';
import { ContentPillar } from '@/types';
import { processApiResponse } from '@/utils/apiResponseUtils';

/**
 * Fetches the content pillars for a user
 */
export async function fetchContentPillars(userId: string): Promise<ContentPillar[]> {
  try {
    const { data, error } = await supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Transform response data to ensure consistent property naming
    return data.map(pillar => {
      const transformedData = processApiResponse(pillar);
      
      return {
        id: transformedData.id,
        userId: transformedData.userId,
        name: transformedData.name,
        description: transformedData.description || '',
        createdAt: new Date(transformedData.createdAt)
      };
    });
  } catch (error) {
    console.error('Error fetching content pillars:', error);
    return [];
  }
}
