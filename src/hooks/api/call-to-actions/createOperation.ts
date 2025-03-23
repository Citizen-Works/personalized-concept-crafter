
import { CallToAction } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToCallToAction } from './transformUtils';
import { CallToActionCreateInput } from './types';

/**
 * Hook for creating a new call to action
 */
export const useCreateCallToAction = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('CallToActionsApi');

  const createCallToActionMutation = createMutation<CallToAction, CallToActionCreateInput>(
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
      
      return transformToCallToAction(data);
    },
    'creating call to action',
    {
      successMessage: 'Call to action created successfully',
      errorMessage: 'Failed to create call to action',
      onSuccess: () => {
        invalidateQueries(['callToActions', user?.id]);
      }
    }
  );
  
  const createCallToAction = async (cta: CallToActionCreateInput): Promise<CallToAction> => {
    return createCallToActionMutation.mutateAsync(cta);
  };

  return {
    createCallToAction,
    createCallToActionMutation
  };
};
