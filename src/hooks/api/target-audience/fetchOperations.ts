
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TargetAudience } from '@/types';
import { useApiRequest } from '@/hooks/useApiRequest';
import { transformToTargetAudience } from './transformUtils';

/**
 * Hook for target audience fetch operations
 */
export const useFetchTargetAudience = () => {
  const api = useApiRequest<TargetAudience[]>('TargetAudienceFetchApi');
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience | null>(null);

  /**
   * Fetch all target audiences for a user
   */
  const fetchTargetAudiences = async (userId: string): Promise<TargetAudience[]> => {
    return api.request(
      async () => {
        const { data, error } = await supabase
          .from('target_audiences')
          .select('*')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        return data.map(audience => transformToTargetAudience(audience));
      },
      'fetching target audiences',
      {
        errorMessage: 'Failed to fetch target audiences'
      }
    ) || [];
  };

  /**
   * Fetch a single target audience by ID
   */
  const fetchTargetAudienceById = async (id: string, userId: string): Promise<TargetAudience | null> => {
    return api.request(
      async () => {
        const { data, error } = await supabase
          .from('target_audiences')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error) throw error;
        if (!data) return null;
        
        return transformToTargetAudience(data);
      },
      'fetching target audience',
      {
        errorMessage: `Failed to fetch target audience with ID: ${id}`
      }
    );
  };

  return {
    fetchTargetAudiences,
    fetchTargetAudienceById,
    selectedAudience,
    setSelectedAudience,
    isLoading: api.isLoading
  };
};
