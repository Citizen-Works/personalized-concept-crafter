
import { TargetAudience } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';

/**
 * Hook containing target audience fetch operations
 */
export const useFetchTargetAudiences = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('TargetAudienceApi');

  /**
   * Fetch all target audiences for the current user
   */
  const fetchTargetAudiences = async (): Promise<TargetAudience[]> => {
    if (!user?.id) return [];
    
    const { data, error } = await supabase
      .from('target_audiences')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    return data.map(transformToTargetAudience);
  };
  
  /**
   * Fetch a single target audience by ID
   */
  const fetchTargetAudienceById = async (id: string): Promise<TargetAudience> => {
    if (!user?.id) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('target_audiences')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    
    return transformToTargetAudience(data);
  };
  
  /**
   * Fetch multiple target audiences by IDs
   */
  const fetchTargetAudiencesByIds = async (ids: string[]): Promise<TargetAudience[]> => {
    if (!user?.id || !ids.length) return [];
    
    const { data, error } = await supabase
      .from('target_audiences')
      .select('*')
      .eq('user_id', user.id)
      .in('id', ids);
    
    if (error) throw error;
    
    return data.map(transformToTargetAudience);
  };

  /**
   * Query hook for fetching all target audiences
   */
  const fetchTargetAudiencesQuery = (options?: Partial<UseQueryOptions<TargetAudience[], Error>>) => 
    createQuery<TargetAudience[], Error>(
      fetchTargetAudiences,
      'fetch-target-audiences',
      {
        enabled: !!user?.id,
        ...options
      }
    );

  /**
   * Query hook for fetching a single target audience by ID
   */
  const fetchTargetAudienceByIdQuery = (id: string, options?: Partial<UseQueryOptions<TargetAudience, Error>>) => 
    createQuery<TargetAudience, Error>(
      () => fetchTargetAudienceById(id),
      'fetch-target-audience-by-id',
      {
        enabled: !!user?.id && !!id,
        ...options
      }
    );

  /**
   * Query hook for fetching multiple target audiences by IDs
   */
  const fetchTargetAudiencesByIdsQuery = (ids: string[], options?: Partial<UseQueryOptions<TargetAudience[], Error>>) => 
    createQuery<TargetAudience[], Error>(
      () => fetchTargetAudiencesByIds(ids),
      'fetch-target-audiences-by-ids',
      {
        enabled: !!user?.id && ids.length > 0,
        ...options
      }
    );
  
  // Create base queries to monitor loading state
  const baseQuery = fetchTargetAudiencesQuery();
  
  return {
    fetchTargetAudiences: baseQuery,
    fetchTargetAudienceById: (id: string) => fetchTargetAudienceByIdQuery(id),
    fetchTargetAudiencesByIds: (ids: string[]) => fetchTargetAudiencesByIdsQuery(ids),
    isLoading: baseQuery.isLoading
  };
};
