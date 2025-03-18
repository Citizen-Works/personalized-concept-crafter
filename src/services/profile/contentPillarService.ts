
import { supabase } from '@/integrations/supabase/client';
import { ContentPillar } from '@/types';

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
    
    return data.map(pillar => ({
      id: pillar.id,
      userId: pillar.user_id,
      name: pillar.name,
      description: pillar.description || '',
      createdAt: new Date(pillar.created_at)
    }));
  } catch (error) {
    console.error('Error fetching content pillars:', error);
    return [];
  }
}
