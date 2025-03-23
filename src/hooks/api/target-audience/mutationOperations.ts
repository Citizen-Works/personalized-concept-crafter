
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TargetAudience } from '@/types';
import { useApiRequest } from '@/hooks/useApiRequest';
import { transformToTargetAudience } from './transformUtils';
import { TargetAudienceCreateInput, TargetAudienceUpdateInput } from './types';

/**
 * Hook for target audience mutation operations
 */
export const useTargetAudienceMutations = () => {
  const api = useApiRequest<TargetAudience>('TargetAudienceMutationApi');

  /**
   * Create a new target audience
   */
  const createTargetAudience = async (
    input: TargetAudienceCreateInput, 
    userId: string
  ): Promise<TargetAudience | null> => {
    return api.request(
      async () => {
        // Manually create the snake_case object instead of using prepareApiRequest
        const snakeCaseInput = {
          user_id: userId,
          name: input.name,
          description: input.description || '',
          pain_points: input.painPoints || [],
          goals: input.goals || []
        };

        const { data, error } = await supabase
          .from('target_audiences')
          .insert([snakeCaseInput])
          .select()
          .single();
        
        if (error) throw error;
        
        return transformToTargetAudience(data);
      },
      'creating target audience',
      {
        successMessage: 'Target audience created successfully',
        errorMessage: 'Failed to create target audience'
      }
    );
  };

  /**
   * Update a target audience
   */
  const updateTargetAudience = async (
    id: string, 
    updates: TargetAudienceUpdateInput, 
    userId: string
  ): Promise<TargetAudience | null> => {
    return api.request(
      async () => {
        // Manually create the snake_case object for updates
        const snakeCaseUpdates: Record<string, any> = {};
        
        if (updates.name !== undefined) snakeCaseUpdates.name = updates.name;
        if (updates.description !== undefined) snakeCaseUpdates.description = updates.description;
        if (updates.painPoints !== undefined) snakeCaseUpdates.pain_points = updates.painPoints;
        if (updates.goals !== undefined) snakeCaseUpdates.goals = updates.goals;
        if (updates.isArchived !== undefined) snakeCaseUpdates.is_archived = updates.isArchived;
        
        const { data, error } = await supabase
          .from('target_audiences')
          .update(snakeCaseUpdates)
          .eq('id', id)
          .eq('user_id', userId) // Security check
          .select()
          .single();
        
        if (error) throw error;
        
        return transformToTargetAudience(data);
      },
      'updating target audience',
      {
        successMessage: 'Target audience updated successfully',
        errorMessage: 'Failed to update target audience'
      }
    );
  };

  /**
   * Archive a target audience
   */
  const archiveTargetAudience = async (
    id: string, 
    userId: string
  ): Promise<boolean> => {
    return api.request(
      async () => {
        const { error } = await supabase
          .from('target_audiences')
          .update({ is_archived: true })
          .eq('id', id)
          .eq('user_id', userId); // Security check
        
        if (error) throw error;
        
        return true;
      },
      'archiving target audience',
      {
        successMessage: 'Target audience archived successfully',
        errorMessage: 'Failed to archive target audience'
      }
    ) || false;
  };

  return {
    createTargetAudience,
    updateTargetAudience,
    archiveTargetAudience,
    isLoading: api.isLoading
  };
};
