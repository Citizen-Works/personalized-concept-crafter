
import { ContentPillar } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { ContentPillarCreateInput, ContentPillarUpdateInput } from './types';

/**
 * Hook for content pillar mutation operations
 */
export const useContentPillarMutations = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('ContentPillarsApi');

  /**
   * Create a new content pillar
   */
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
      
      const transformedData = processApiResponse(data);
      
      return {
        id: transformedData.id,
        name: transformedData.name,
        description: transformedData.description || "",
        userId: transformedData.userId,
        isArchived: transformedData.isArchived || false,
        displayOrder: transformedData.displayOrder || 0,
        usageCount: transformedData.usageCount || 0,
        createdAt: new Date(transformedData.createdAt)
      } as ContentPillar;
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
  
  /**
   * Update an existing content pillar
   */
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
      
      const transformedData = processApiResponse(data);
      
      return {
        id: transformedData.id,
        name: transformedData.name,
        description: transformedData.description || "",
        userId: transformedData.userId,
        isArchived: transformedData.isArchived || false,
        displayOrder: transformedData.displayOrder || 0,
        usageCount: transformedData.usageCount || 0,
        createdAt: new Date(transformedData.createdAt)
      } as ContentPillar;
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
  
  /**
   * Archive a content pillar (soft delete)
   */
  const archiveContentPillarMutation = createMutation<ContentPillar, string>(
    async (id) => {
      return updateContentPillar(id, { isArchived: true });
    },
    'archiving content pillar',
    {
      successMessage: 'Content pillar archived successfully',
      errorMessage: 'Failed to archive content pillar'
    }
  );
  
  const archiveContentPillar = async (id: string): Promise<ContentPillar> => {
    return archiveContentPillarMutation.mutateAsync(id);
  };

  // Properly determine the loading state from all mutations
  const isLoading = 
    createContentPillarMutation.isPending || 
    updateContentPillarMutation.isPending || 
    archiveContentPillarMutation.isPending;

  return {
    createContentPillar,
    updateContentPillar,
    archiveContentPillar,
    isLoading
  };
};
