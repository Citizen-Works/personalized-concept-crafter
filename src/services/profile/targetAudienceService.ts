
import { supabase } from '@/integrations/supabase/client';
import { TargetAudience } from '@/types';

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
    
    return data.map(audience => ({
      id: audience.id,
      userId: audience.user_id,
      name: audience.name,
      description: audience.description || '',
      painPoints: audience.pain_points || [],
      goals: audience.goals || [],
      createdAt: new Date(audience.created_at)
    }));
  } catch (error) {
    console.error('Error fetching target audiences:', error);
    return [];
  }
}
