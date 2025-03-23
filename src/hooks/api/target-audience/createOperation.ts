
import { TargetAudience } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
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
      
      // Convert camelCase to snake_case for the database
      const audienceData = {
        user_id: user.id,
        name: input.name,
        description: input.description || null,
        pain_points: input.painPoints || [],
        goals: input.goals || []
      };
      
      const { data, error } = await supabase
        .from("target_audiences")
        .insert([audienceData])
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
  
  const createTargetAudience = async (input: TargetAudienceCreateInput): Promise<TargetAudience> => {
    return createTargetAudienceMutation.mutateAsync(input);
  };

  return {
    createTargetAudience,
    createTargetAudienceMutation
  };
};
