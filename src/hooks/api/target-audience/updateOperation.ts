
import { TargetAudience } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';
import { TargetAudienceUpdateInput } from './types';

/**
 * Hook for updating a target audience
 */
export const useUpdateTargetAudience = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('TargetAudienceApi');

  const updateTargetAudienceMutation = createMutation<TargetAudience, { id: string, updates: TargetAudienceUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Convert camelCase to snake_case directly
      const requestData: Record<string, any> = {};
      
      if (updates.name !== undefined) requestData.name = updates.name;
      if (updates.description !== undefined) requestData.description = updates.description;
      if (updates.painPoints !== undefined) requestData.pain_points = updates.painPoints;
      if (updates.goals !== undefined) requestData.goals = updates.goals;
      if (updates.isArchived !== undefined) requestData.is_archived = updates.isArchived;
      if (updates.usageCount !== undefined) requestData.usage_count = updates.usageCount;
      
      const { data, error } = await supabase
        .from("target_audiences")
        .update(requestData)
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToTargetAudience(data);
    },
    'updating target audience',
    {
      successMessage: 'Target audience updated successfully',
      errorMessage: 'Failed to update target audience',
      onSuccess: () => {
        invalidateQueries(['targetAudiences', user?.id]);
      }
    }
  );
  
  const updateTargetAudience = async (id: string, updates: TargetAudienceUpdateInput): Promise<TargetAudience> => {
    return updateTargetAudienceMutation.mutateAsync({ id, updates });
  };

  return {
    updateTargetAudience,
    updateTargetAudienceMutation
  };
};
