
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TargetAudience } from '@/types';
import { toast } from 'sonner';
import { useApiRequest } from '@/hooks/useApiRequest';
import { processApiResponse, prepareApiRequest } from '@/utils/apiResponseUtils';

/**
 * Type for creating a new target audience
 */
export interface TargetAudienceCreateInput {
  name: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
}

/**
 * Type for updating a target audience
 */
export interface TargetAudienceUpdateInput {
  name?: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
  isArchived?: boolean;
}

/**
 * Hook for target audience API operations
 */
export const useTargetAudienceApi = () => {
  const api = useApiRequest<TargetAudience[]>('TargetAudienceApi');
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience | null>(null);

  /**
   * Fetch all target audiences for a user
   */
  const fetchTargetAudiences = async (userId: string): Promise<TargetAudience[]> => {
    return api.request(
      async () => {
        const { data, error } = await supabase
          .from('target_audiences')
          .select('*')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        return data.map(audience => {
          const transformedData = processApiResponse(audience);
          
          // Create a properly typed TargetAudience object
          return {
            id: transformedData.id,
            userId: transformedData.userId,
            name: transformedData.name,
            description: transformedData.description || '',
            // Ensure arrays are handled correctly by explicitly converting to native arrays
            painPoints: Array.isArray(transformedData.painPoints) ? 
              [...transformedData.painPoints] as string[] : [],
            goals: Array.isArray(transformedData.goals) ? 
              [...transformedData.goals] as string[] : [],
            createdAt: new Date(transformedData.createdAt),
            isArchived: transformedData.isArchived || false,
            usageCount: transformedData.usageCount || 0
          } as TargetAudience;
        });
      },
      'fetching target audiences',
      {
        errorMessage: 'Failed to fetch target audiences'
      }
    ) || [];
  };

  /**
   * Fetch a single target audience by ID
   */
  const fetchTargetAudienceById = async (id: string, userId: string): Promise<TargetAudience | null> => {
    return api.request(
      async () => {
        const { data, error } = await supabase
          .from('target_audiences')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error) throw error;
        if (!data) return null;
        
        const transformedData = processApiResponse(data);
        
        // Create a properly typed TargetAudience object
        return {
          id: transformedData.id,
          userId: transformedData.userId,
          name: transformedData.name,
          description: transformedData.description || '',
          painPoints: Array.isArray(transformedData.painPoints) ? 
            [...transformedData.painPoints] as string[] : [],
          goals: Array.isArray(transformedData.goals) ? 
            [...transformedData.goals] as string[] : [],
          createdAt: new Date(transformedData.createdAt),
          isArchived: transformedData.isArchived || false,
          usageCount: transformedData.usageCount || 0
        } as TargetAudience;
      },
      'fetching target audience',
      {
        errorMessage: `Failed to fetch target audience with ID: ${id}`
      }
    );
  };

  /**
   * Create a new target audience
   */
  const createTargetAudience = async (
    input: TargetAudienceCreateInput, 
    userId: string
  ): Promise<TargetAudience | null> => {
    return api.request(
      async () => {
        // Transform input to snake_case for the database
        const dbInput = prepareApiRequest({
          ...input,
          userId
        });
        
        const { data, error } = await supabase
          .from('target_audiences')
          .insert([dbInput])
          .select()
          .single();
        
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        return {
          id: transformedData.id,
          userId: transformedData.userId,
          name: transformedData.name,
          description: transformedData.description || '',
          painPoints: Array.isArray(transformedData.painPoints) ? 
            [...transformedData.painPoints] as string[] : [],
          goals: Array.isArray(transformedData.goals) ? 
            [...transformedData.goals] as string[] : [],
          createdAt: new Date(transformedData.createdAt),
          isArchived: false,
          usageCount: 0
        } as TargetAudience;
      },
      'creating target audience',
      {
        successMessage: `Target audience "${input.name}" created successfully`,
        errorMessage: 'Failed to create target audience'
      }
    );
  };

  /**
   * Update an existing target audience
   */
  const updateTargetAudience = async (
    id: string,
    updates: TargetAudienceUpdateInput,
    userId: string
  ): Promise<TargetAudience | null> => {
    return api.request(
      async () => {
        // Transform updates to snake_case for the database
        const dbUpdates = prepareApiRequest(updates);
        
        const { data, error } = await supabase
          .from('target_audiences')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();
        
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        return {
          id: transformedData.id,
          userId: transformedData.userId,
          name: transformedData.name,
          description: transformedData.description || '',
          painPoints: Array.isArray(transformedData.painPoints) ? 
            [...transformedData.painPoints] as string[] : [],
          goals: Array.isArray(transformedData.goals) ? 
            [...transformedData.goals] as string[] : [],
          createdAt: new Date(transformedData.createdAt),
          isArchived: transformedData.isArchived || false,
          usageCount: transformedData.usageCount || 0
        } as TargetAudience;
      },
      'updating target audience',
      {
        successMessage: 'Target audience updated successfully',
        errorMessage: 'Failed to update target audience'
      }
    );
  };

  /**
   * Archive a target audience (soft delete)
   */
  const archiveTargetAudience = async (id: string, userId: string): Promise<boolean> => {
    return api.request(
      async () => {
        const { error } = await supabase
          .from('target_audiences')
          .update({ is_archived: true })
          .eq('id', id)
          .eq('user_id', userId);
        
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
    fetchTargetAudiences,
    fetchTargetAudienceById,
    createTargetAudience,
    updateTargetAudience,
    archiveTargetAudience,
    selectedAudience,
    setSelectedAudience,
    isLoading: api.isLoading
  };
};
