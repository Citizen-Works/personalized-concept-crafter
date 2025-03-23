
import { TargetAudience } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';
import { TargetAudienceUpdateInput } from './types';

/**
 * Hook for updating an existing target audience
 */
export const useUpdateTargetAudience = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('TargetAudienceApi');

  const updateTargetAudienceMutation = createMutation<TargetAudience, { id: string, updates: TargetAudienceUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Convert camelCase to snake_case for the database
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.painPoints !== undefined) updateData.pain_points = updates.painPoints;
      if (updates.goals !== undefined) updateData.goals = updates.goals;
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;
      if (updates.usageCount !== undefined) updateData.usage_count = updates.usageCount;
      
      const { data, error } = await supabase
        .from("target_audiences")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToTargetAudience(data);
    },
    'updating target audience',
    {
      successMessage: 'Target audience updated successfully',
      errorMessage: 'Failed to update target audience',
      onSuccess: (_, { id }) => {
        invalidateQueries(['targetAudiences', user?.id]);
        invalidateQueries(['targetAudience', id]);
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
