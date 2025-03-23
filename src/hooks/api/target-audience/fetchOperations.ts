
import { TargetAudience } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';

/**
 * Hook for fetching target audiences data
 */
export const useFetchTargetAudiences = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('TargetAudienceApi');

  const fetchTargetAudiences = (options = {}) => {
    return createQuery<TargetAudience[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from("target_audiences")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => transformToTargetAudience(item));
      },
      'fetching target audiences',
      {
        ...options,
        queryKey: ['targetAudiences', user?.id],
        enabled: !!user
      }
    );
  };
  
  const fetchTargetAudienceById = (id: string, options = {}) => {
    return createQuery<TargetAudience | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!id) throw new Error("Target audience ID is required");
        
        const { data, error } = await supabase
          .from("target_audiences")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) return null;
        
        return transformToTargetAudience(data);
      },
      `fetching target audience ${id}`,
      {
        ...options,
        queryKey: ['targetAudience', id, user?.id],
        enabled: !!user && !!id
      }
    );
  };

  return {
    fetchTargetAudiences,
    fetchTargetAudienceById
  };
};
