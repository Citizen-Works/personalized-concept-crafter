
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToPersonalStory } from './transformUtils';

/**
 * Hook for personal story query operations
 */
export const useFetchPersonalStories = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('PersonalStoriesApi');

  // Fetch all personal stories
  const fetchPersonalStoriesQuery = createQuery<PersonalStory[]>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("personal_stories")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return data.map(transformToPersonalStory);
    },
    'fetching personal stories',
    {
      queryKey: ['personalStories', user?.id],
      enabled: !!user
    }
  );
  
  const fetchPersonalStories = async (): Promise<PersonalStory[]> => {
    const result = await fetchPersonalStoriesQuery.refetch();
    return result.data || [];
  };
  
  // Fetch a single personal story by ID
  const fetchPersonalStoryById = async (id: string): Promise<PersonalStory | null> => {
    if (!user?.id) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("personal_stories")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return null;
    
    return transformToPersonalStory(data);
  };
  
  // Fetch personal stories by tag
  const fetchPersonalStoriesByTag = async (tag: string): Promise<PersonalStory[]> => {
    if (!user?.id) throw new Error("User not authenticated");
    if (!tag) return [];
    
    const { data, error } = await supabase
      .from("personal_stories")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .contains("tags", [tag])
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    
    return data.map(transformToPersonalStory);
  };
  
  return {
    fetchPersonalStories,
    fetchPersonalStoryById,
    fetchPersonalStoriesByTag
  };
};
