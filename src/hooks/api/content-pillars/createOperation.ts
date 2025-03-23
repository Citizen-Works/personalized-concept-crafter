
import { ContentPillar } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToContentPillar } from './transformUtils';
import { ContentPillarCreateInput } from './types';

/**
 * Hook for creating a new content pillar
 */
export const useCreateContentPillar = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('ContentPillarsApi');

  const createContentPillarMutation = createMutation<ContentPillar, ContentPillarCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Prepare the snake_case input for Supabase
      const snakeCaseInput = {
        name: input.name,
        description: input.description || "",
        display_order: input.displayOrder || 0,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("content_pillars")
        .insert([snakeCaseInput])
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToContentPillar(data);
    },
    'creating content pillar',
    {
      successMessage: 'Content pillar created successfully',
      errorMessage: 'Failed to create content pillar',
      onSuccess: () => {
        invalidateQueries(['contentPillars', user?.id]);
      }
    }
  );
  
  const createContentPillar = async (pillar: ContentPillarCreateInput): Promise<ContentPillar> => {
    return createContentPillarMutation.mutateAsync(pillar);
  };

  return {
    createContentPillar,
    createContentPillarMutation
  };
};
