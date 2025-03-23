
import { TargetAudience } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';
import { UseQueryOptions } from '@tanstack/react-query';

/**
 * Hook for fetching target audience data
 */
export const useFetchTargetAudiences = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('TargetAudienceApi');

  // Query to fetch all target audiences
  const fetchTargetAudiencesQuery = (options?: Partial<UseQueryOptions<TargetAudience[], Error>>) => 
    createQuery<TargetAudience[], Error>(
      async () => {
        if (!user?.id) return [];
        
        const { data, error } = await supabase
          .from("target_audiences")
          .select("*")
          .eq("user_id", user.id)
          .order("name");
          
        if (error) throw error;
        
        return data.map(transformToTargetAudience);
      },
      'fetching target audiences',
      {
        queryKey: ['targetAudiences', user?.id],
        enabled: !!user,
        ...options
      }
    );
  
  // Query to fetch a specific target audience by ID
  const fetchTargetAudienceByIdQuery = (id: string, options?: Partial<UseQueryOptions<TargetAudience | null, Error>>) => 
    createQuery<TargetAudience | null, Error>(
      async () => {
        if (!user?.id || !id) return null;
        
        const { data, error } = await supabase
          .from("target_audiences")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') return null; // No data found
          throw error;
        }
        
        return transformToTargetAudience(data);
      },
      'fetching target audience by id',
      {
        queryKey: ['targetAudience', id, user?.id],
        enabled: !!user && !!id,
        ...options
      }
    );
  
  // Query to fetch target audiences by ids
  const fetchTargetAudiencesByIdsQuery = (ids: string[], options?: Partial<UseQueryOptions<TargetAudience[], Error>>) => 
    createQuery<TargetAudience[], Error>(
      async () => {
        if (!user?.id || ids.length === 0) return [];
        
        const { data, error } = await supabase
          .from("target_audiences")
          .select("*")
          .eq("user_id", user.id)
          .in("id", ids)
          .order("name");
          
        if (error) throw error;
        
        return data.map(transformToTargetAudience);
      },
      'fetching target audiences by ids',
      {
        queryKey: ['targetAudiences', 'byIds', ids, user?.id],
        enabled: !!user && ids.length > 0,
        ...options
      }
    );
  
  // Create a base query to monitor loading state
  const baseQuery = fetchTargetAudiencesQuery();
  
  return {
    fetchTargetAudiences: fetchTargetAudiencesQuery,
    fetchTargetAudienceById: fetchTargetAudienceByIdQuery,
    fetchTargetAudiencesByIds: fetchTargetAudiencesByIdsQuery,
    isLoading: baseQuery.isLoading
  };
};
