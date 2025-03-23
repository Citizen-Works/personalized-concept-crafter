
import { ContentIdea } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToContentIdea } from './transformUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Hook for ideas fetch operations
 */
export const useFetchIdeas = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('IdeasApi');

  // Query to fetch all ideas
  const fetchIdeasQuery = (options?: Partial<UseQueryOptions<ContentIdea[], Error>>) => 
    createQuery<ContentIdea[], Error>(
      async () => {
        if (!user?.id) return [];
        
        const { data, error } = await supabase
          .from("content_ideas")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => transformToContentIdea(item));
      },
      'fetching ideas',
      {
        queryKey: ['ideas', user?.id],
        enabled: !!user,
        ...options
      }
    );
  
  // Query to fetch a specific idea by ID
  const fetchIdeaByIdQuery = (id: string, options?: Partial<UseQueryOptions<ContentIdea | null, Error>>) => 
    createQuery<ContentIdea | null, Error>(
      async () => {
        if (!user?.id) return null;
        if (!id || id === "new") return null;
        
        try {
          const { data, error } = await supabase
            .from("content_ideas")
            .select("*")
            .eq("id", id)
            .maybeSingle();
          
          if (error) throw error;
          if (!data) {
            console.error(`No idea found with ID: ${id}`);
            return null;
          }
          
          return transformToContentIdea(data);
        } catch (error) {
          console.error(`Error fetching idea with ID ${id}:`, error);
          throw error;
        }
      },
      'fetching idea by id',
      {
        queryKey: ['idea', id, user?.id],
        enabled: !!user && !!id && id !== 'new',
        retry: 1, // Limit retries for better error handling
        ...options
      }
    );
  
  // Create a base query to monitor loading state
  const baseQuery = fetchIdeasQuery();
  
  return {
    fetchIdeas: async () => {
      const result = await baseQuery.refetch();
      return result.data || [];
    },
    fetchIdeaById: async (id: string) => {
      if (!id || id === 'new') {
        console.warn("Invalid ID provided to fetchIdeaById:", id);
        return null;
      }
      
      try {
        const query = fetchIdeaByIdQuery(id);
        const result = await query.refetch();
        return result.data;
      } catch (error) {
        console.error(`Error in fetchIdeaById for ID ${id}:`, error);
        return null;
      }
    },
    isLoading: baseQuery.isLoading
  };
};
