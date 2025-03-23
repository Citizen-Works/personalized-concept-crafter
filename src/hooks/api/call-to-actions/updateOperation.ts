
import { CallToAction } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToCallToAction } from './transformUtils';
import { CallToActionUpdateInput } from './types';

/**
 * Hook for updating an existing call to action
 */
export const useUpdateCallToAction = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('CallToActionsApi');

  const updateCallToActionMutation = createMutation<CallToAction, { id: string, updates: CallToActionUpdateInput }>(
    async ({ id, updates }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case update data for Supabase
      const updateData: Record<string, any> = {};
      if (updates.text !== undefined) updateData.text = updates.text;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.url !== undefined) updateData.url = updates.url;
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;
      
      const { data, error } = await supabase
        .from("call_to_actions")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id) // Security check
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToCallToAction(data);
    },
    'updating call to action',
    {
      successMessage: 'Call to action updated successfully',
      errorMessage: 'Failed to update call to action',
      onSuccess: (data, variables) => {
        invalidateQueries(['callToActions', user?.id]);
        invalidateQueries(['callToAction', variables.id, user?.id]);
      }
    }
  );
  
  const updateCallToAction = async (id: string, updates: CallToActionUpdateInput): Promise<CallToAction> => {
    return updateCallToActionMutation.mutateAsync({ id, updates });
  };

  return {
    updateCallToAction,
    updateCallToActionMutation
  };
};
