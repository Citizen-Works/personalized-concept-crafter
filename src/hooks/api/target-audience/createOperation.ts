
import { TargetAudience } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';
import { TargetAudienceCreateInput } from './types';

/**
 * Hook for creating a new target audience
 */
export const useCreateTargetAudience = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('TargetAudienceApi');

  const createTargetAudienceMutation = createMutation<TargetAudience, TargetAudienceCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Create the request data with appropriate field names
      const requestData = {
        name: input.name,
        description: input.description,
        pain_points: input.painPoints,
        goals: input.goals,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("target_audiences")
        .insert(requestData)
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
