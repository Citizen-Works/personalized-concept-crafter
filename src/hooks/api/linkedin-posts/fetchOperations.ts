
import { LinkedinPost } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToLinkedinPost } from './transformUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Hook for LinkedIn posts fetch operations
 */
export const useFetchLinkedinPosts = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('LinkedinPostsApi');

  // Query to fetch all LinkedIn posts
  const fetchLinkedinPostsQuery = (options?: Partial<UseQueryOptions<LinkedinPost[], Error>>) => 
    createQuery<LinkedinPost[], Error>(
      async () => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from("linkedin_posts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return data.map(item => transformToLinkedinPost(item));
      },
      'fetching linkedin posts',
      {
        queryKey: ['linkedinPosts', user?.id],
        enabled: !!user,
        ...options
      }
    );
  
  // Query to fetch a specific LinkedIn post by ID
  const fetchLinkedinPostByIdQuery = (id: string, options?: Partial<UseQueryOptions<LinkedinPost | null, Error>>) => 
    createQuery<LinkedinPost | null, Error>(
      async () => {
        if (!user?.id || !id) return null;

        const { data, error } = await supabase
          .from("linkedin_posts")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null; // Not found
          throw error;
        }

        return transformToLinkedinPost(data);
      },
      'fetching linkedin post by id',
      {
        queryKey: ['linkedinPost', id, user?.id],
        enabled: !!user && !!id,
        ...options
      }
    );
  
  // Create a base query to monitor loading state
  const baseQuery = fetchLinkedinPostsQuery();
  
  return {
    fetchLinkedinPosts: async () => {
      const result = await baseQuery.refetch();
      return result.data || [];
    },
    fetchLinkedinPostById: async (id: string) => {
      const query = fetchLinkedinPostByIdQuery(id);
      const result = await query.refetch();
      return result.data;
    },
    isLoading: baseQuery.isLoading
  };
};
