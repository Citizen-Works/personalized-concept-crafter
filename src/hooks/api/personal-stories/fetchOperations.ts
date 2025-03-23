
import { PersonalStory } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToPersonalStory } from './transformUtils';

/**
 * Hook for fetching personal stories data
 */
export const useFetchPersonalStories = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('PersonalStoriesApi');

  // Query to fetch all personal stories
  const fetchPersonalStoriesQuery = createQuery<PersonalStory[]>(
    async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("personal_stories")
        .select("*")
        .eq("user_id", user.id)
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
  
  // Function to fetch a specific personal story by ID
  const fetchPersonalStoryByIdQuery = (id: string) => 
    createQuery<PersonalStory | null>(
      async () => {
        if (!user?.id || !id) return null;
        
        const { data, error } = await supabase
          .from("personal_stories")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') return null; // No data found
          throw error;
        }
        
        return transformToPersonalStory(data);
      },
      'fetching personal story by id',
      {
        queryKey: ['personalStory', id, user?.id],
        enabled: !!user && !!id
      }
    );
  
  // Function to fetch personal stories by tag
  const fetchPersonalStoriesByTagQuery = (tag: string) => 
    createQuery<PersonalStory[]>(
      async () => {
        if (!user?.id || !tag) return [];
        
        const { data, error } = await supabase
          .from("personal_stories")
          .select("*")
          .eq("user_id", user.id)
          .contains("tags", [tag])
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(transformToPersonalStory);
      },
      'fetching personal stories by tag',
      {
        queryKey: ['personalStories', 'byTag', tag, user?.id],
        enabled: !!user && !!tag
      }
    );
  
  // Function to fetch all personal stories
  const fetchPersonalStories = async (): Promise<PersonalStory[]> => {
    const result = await fetchPersonalStoriesQuery.refetch();
    return result.data || [];
  };
  
  // Function to fetch a personal story by ID
  const fetchPersonalStoryById = async (id: string): Promise<PersonalStory | null> => {
    const query = fetchPersonalStoryByIdQuery(id);
    const result = await query.refetch();
    return result.data || null;
  };
  
  // Function to fetch personal stories by tag
  const fetchPersonalStoriesByTag = async (tag: string): Promise<PersonalStory[]> => {
    const query = fetchPersonalStoriesByTagQuery(tag);
    const result = await query.refetch();
    return result.data || [];
  };
  
  return {
    fetchPersonalStories,
    fetchPersonalStoryById,
    fetchPersonalStoriesByTag,
    isLoading: fetchPersonalStoriesQuery.isLoading
  };
};
