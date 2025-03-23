
import { LinkedinPost } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToLinkedinPost } from './transformUtils';

/**
 * Hook for LinkedIn posts fetch operations
 */
export const useFetchLinkedinPosts = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('LinkedinPostsApi');

  const fetchLinkedinPostsQuery = createQuery<LinkedinPost[]>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("linkedin_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(item => transformToLinkedinPost(item));
    },
    // Fix: Pass a proper string for the queryKey, not an array
    `linkedin-posts-${user?.id || 'anonymous'}`
  );
  
  // Fix: Define a function that takes an id parameter and properly configure the query
  const createFetchByIdQuery = (id: string) => {
    return createQuery<LinkedinPost | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");

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
      // Fix: Pass a proper string for the queryKey, not an array
      `linkedin-post-${id}-${user?.id || 'anonymous'}`
    );
  };
  
  return {
    // Fix: Use refetch instead of fetch for queries
    fetchLinkedinPosts: async () => {
      const result = await fetchLinkedinPostsQuery.refetch();
      return result.data || [];
    },
    fetchLinkedinPostById: async (id: string) => {
      const query = createFetchByIdQuery(id);
      const result = await query.refetch();
      return result.data || null;
    }
  };
};
