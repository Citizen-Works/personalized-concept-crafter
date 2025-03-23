
import { TargetAudience } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';
import { TargetAudienceCreateInput } from './types';
import { prepareApiRequest } from '@/utils/apiResponseUtils';

/**
 * Hook for creating a new target audience
 */
export const useCreateTargetAudience = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('TargetAudienceApi');

  const createTargetAudienceMutation = createMutation<TargetAudience, TargetAudienceCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the input for Supabase with snake_case keys
      const requestData = {
        ...prepareApiRequest(input),
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("target_audiences")
        .insert([requestData])
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToTargetAudience(data);
    },
    'creating target audience',
    {
      successMessage: 'Target audience created successfully',
      errorMessage: 'Failed to create target audience',
      onSuccess: () => {
        invalidateQueries(['targetAudiences', user?.id]);
      }
    }
  );
  
  const createTargetAudience = async (audience: TargetAudienceCreateInput): Promise<TargetAudience> => {
    return createTargetAudienceMutation.mutateAsync(audience);
  };

  return {
    createTargetAudience,
    createTargetAudienceMutation
  };
};
