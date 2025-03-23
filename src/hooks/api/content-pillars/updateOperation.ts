
import { ContentPillar } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToContentPillar } from './transformUtils';
import { ContentPillarUpdateInput } from './types';

/**
 * Hook for updating an existing content pillar
 */
export const useUpdateContentPillar = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('ContentPillarsApi');

  const updateContentPillarMutation = createMutation<ContentPillar, { id: string, updates: ContentPillarUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case update data for Supabase
      const updateData: Record<string, any> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.displayOrder !== undefined) updateData.display_order = updates.displayOrder;
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;
      
      const { data, error } = await supabase
        .from("content_pillars")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToContentPillar(data);
    },
    'updating content pillar',
    {
      successMessage: 'Content pillar updated successfully',
      errorMessage: 'Failed to update content pillar',
      onSuccess: (data, variables) => {
        invalidateQueries(['contentPillars', user?.id]);
        invalidateQueries(['contentPillar', variables.id, user?.id]);
      }
    }
  );
  
  const updateContentPillar = async (id: string, updates: ContentPillarUpdateInput): Promise<ContentPillar> => {
    return updateContentPillarMutation.mutateAsync({ id, updates });
  };

  return {
    updateContentPillar,
    updateContentPillarMutation
  };
};
