
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
    ['linkedin-posts', user?.id]
  );
  
  const fetchLinkedinPostByIdQuery = createQuery<LinkedinPost | null, string>(
    async (id) => {
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
    (id) => ['linkedin-post', id, user?.id]
  );
  
  return {
    fetchLinkedinPosts: fetchLinkedinPostsQuery.fetch,
    fetchLinkedinPostById: fetchLinkedinPostByIdQuery.fetch
  };
};
