
import { CallToAction } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { CallToActionCreateInput, CallToActionUpdateInput } from './types';

/**
 * Hook for call to action mutation operations
 */
export const useCallToActionMutations = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('CallToActionsApi');

  /**
   * Create a new call to action
   */
  const createCallToAction = async (cta: CallToActionCreateInput): Promise<CallToAction> => {
    const result = await createMutation<CallToAction, CallToActionCreateInput>(
      async (input) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        // Prepare the snake_case input for Supabase
        const snakeCaseInput = {
          text: input.text,
          type: input.type,
          description: input.description || "",
          url: input.url || null,
          user_id: user.id
        };
        
        const { data, error } = await supabase
          .from("call_to_actions")
          .insert([snakeCaseInput])
          .select()
          .single();
          
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        return {
          id: transformedData.id,
          text: transformedData.text,
          type: transformedData.type,
          description: transformedData.description || "",
          url: transformedData.url || "",
          userId: transformedData.userId,
          isArchived: transformedData.isArchived || false,
          usageCount: transformedData.usageCount || 0,
          createdAt: new Date(transformedData.createdAt)
        } as CallToAction;
      },
      'creating call to action',
      {
        successMessage: 'Call to action created successfully',
        errorMessage: 'Failed to create call to action',
        onSuccess: () => {
          invalidateQueries(['callToActions', user?.id]);
        }
      }
    ).mutateAsync(cta);
    
    return result;
  };
  
  /**
   * Update an existing call to action
   */
  const updateCallToAction = async (id: string, updates: CallToActionUpdateInput): Promise<CallToAction> => {
    const result = await createMutation<CallToAction, { id: string, updates: CallToActionUpdateInput }>(
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
        
        const transformedData = processApiResponse(data);
        
        return {
          id: transformedData.id,
          text: transformedData.text,
          type: transformedData.type,
          description: transformedData.description || "",
          url: transformedData.url || "",
          userId: transformedData.userId,
          isArchived: transformedData.isArchived || false,
          usageCount: transformedData.usageCount || 0,
          createdAt: new Date(transformedData.createdAt)
        } as CallToAction;
      },
      'updating call to action',
      {
        successMessage: 'Call to action updated successfully',
        errorMessage: 'Failed to update call to action',
        onSuccess: () => {
          invalidateQueries(['callToActions', user?.id]);
          invalidateQueries(['callToAction', id, user?.id]);
        }
      }
    ).mutateAsync({ id, updates });
    
    return result;
  };
  
  /**
   * Archive a call to action (soft delete)
   */
  const archiveCallToAction = async (id: string): Promise<CallToAction> => {
    return updateCallToAction(id, { isArchived: true });
  };
  
  /**
   * Increment usage count for a call to action
   */
  const incrementUsageCount = async (id: string): Promise<CallToAction> => {
    const result = await createMutation<CallToAction, string>(
      async (id) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        // Use RPC to increment the usage count
        const { data, error } = await supabase
          .rpc('increment', { row_id: id })
          .then(async () => {
            // Fetch the updated record
            return await supabase
              .from("call_to_actions")
              .select("*")
              .eq("id", id)
              .single();
          });
          
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        return {
          id: transformedData.id,
          text: transformedData.text,
          type: transformedData.type,
          description: transformedData.description || "",
          url: transformedData.url || "",
          userId: transformedData.userId,
          isArchived: transformedData.isArchived || false,
          usageCount: transformedData.usageCount || 0,
          createdAt: new Date(transformedData.createdAt)
        } as CallToAction;
      },
      'incrementing usage count',
      {
        errorMessage: 'Failed to increment usage count',
        onSuccess: () => {
          invalidateQueries(['callToActions', user?.id]);
          invalidateQueries(['callToAction', id, user?.id]);
        }
      }
    ).mutateAsync(id);
    
    return result;
  };
  
  // Get the isLoading state from one of the mutations
  const { isLoading } = createMutation<any, any>(
    async () => null,
    'dummy mutation for loading state',
    { onSuccess: () => {} }
  );

  return {
    createCallToAction,
    updateCallToAction,
    archiveCallToAction,
    incrementUsageCount,
    isLoading
  };
};
