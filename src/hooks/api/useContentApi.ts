
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentDraft, ContentStatus, DraftStatus, ContentSource, ContentType } from '@/types';
import { toast } from 'sonner';
import { processApiResponse, prepareApiRequest } from '@/utils/apiResponseUtils';
import { createContentIdea, createContentDraft } from '@/utils/modelFactory';
import { isValidContentStatusTransition, isValidDraftStatusTransition } from '@/utils/statusValidation';
import { useApiRequest } from '@/hooks/useApiRequest';

/**
 * Hook for content idea API operations
 */
export const useContentIdeaApi = () => {
  const api = useApiRequest<ContentIdea>('ContentIdeaApi');
  
  /**
   * Update a content idea's status
   */
  const updateIdeaStatus = async (
    ideaId: string, 
    newStatus: ContentStatus
  ): Promise<ContentIdea | null> => {
    return api.request(
      async () => {
        const { data: currentIdea, error: fetchError } = await supabase
          .from('content_ideas')
          .select('status')
          .eq('id', ideaId)
          .single();
        
        if (fetchError) throw fetchError;
        
        // Validate status transition
        if (!isValidContentStatusTransition(currentIdea.status as ContentStatus, newStatus)) {
          throw new Error(`Invalid status transition: ${currentIdea.status} to ${newStatus}`);
        }
        
        const { data, error } = await supabase
          .from('content_ideas')
          .update({ status: newStatus })
          .eq('id', ideaId)
          .select()
          .single();
        
        if (error) throw error;
        
        // Transform database response to match ContentIdea interface
        const transformedData = processApiResponse(data);
        
        // Properly handle array types with explicit conversion
        const contentPillarIds = Array.isArray(transformedData.contentPillarIds) 
          ? [...transformedData.contentPillarIds] as string[]
          : [];
          
        const targetAudienceIds = Array.isArray(transformedData.targetAudienceIds)
          ? [...transformedData.targetAudienceIds] as string[]
          : [];
        
        // Create a properly typed ContentIdea object using the factory function
        const contentIdea = createContentIdea({
          id: transformedData.id,
          userId: transformedData.userId,
          title: transformedData.title,
          description: transformedData.description,
          notes: transformedData.notes,
          source: transformedData.source as ContentSource,
          meetingTranscriptExcerpt: transformedData.meetingTranscriptExcerpt,
          sourceUrl: transformedData.sourceUrl,
          status: transformedData.status as ContentStatus,
          hasBeenUsed: transformedData.hasBeenUsed,
          createdAt: new Date(transformedData.createdAt),
          contentPillarIds: contentPillarIds,
          targetAudienceIds: targetAudienceIds
        });
        
        return contentIdea;
      },
      'updating idea status',
      {
        successMessage: `Idea updated to ${newStatus}`,
        errorMessage: 'Failed to update idea'
      }
    );
  };
  
  return {
    updateIdeaStatus,
    isLoading: api.isLoading,
    error: null // Maintained for backward compatibility
  };
};

/**
 * Hook for content draft API operations
 */
export const useContentDraftApi = () => {
  const api = useApiRequest<ContentDraft>('ContentDraftApi');
  
  /**
   * Update a draft's status
   */
  const updateDraftStatus = async (
    draftId: string, 
    newStatus: DraftStatus
  ): Promise<ContentDraft | null> => {
    return api.request(
      async () => {
        const { data: currentDraft, error: fetchError } = await supabase
          .from('content_drafts')
          .select('status')
          .eq('id', draftId)
          .single();
        
        if (fetchError) throw fetchError;
        
        // Validate status transition
        if (!isValidDraftStatusTransition(currentDraft.status as DraftStatus, newStatus)) {
          throw new Error(`Invalid status transition: ${currentDraft.status} to ${newStatus}`);
        }
        
        const { data, error } = await supabase
          .from('content_drafts')
          .update({ status: newStatus })
          .eq('id', draftId)
          .select()
          .single();
        
        if (error) throw error;
        
        // Transform database response to match ContentDraft interface
        const transformedData = processApiResponse(data);
        
        // Create a properly typed ContentDraft object using the factory function
        const contentDraft = createContentDraft({
          id: transformedData.id,
          contentIdeaId: transformedData.contentIdeaId,
          content: transformedData.content,
          contentType: (transformedData.contentType || 'linkedin') as ContentType,
          contentGoal: transformedData.contentGoal || undefined,
          version: transformedData.version,
          feedback: transformedData.feedback || '',
          status: transformedData.status as DraftStatus,
          createdAt: new Date(transformedData.createdAt)
        });
        
        return contentDraft;
      },
      'updating draft status',
      {
        successMessage: `Draft updated to ${newStatus}`,
        errorMessage: 'Failed to update draft'
      }
    );
  };
  
  return {
    updateDraftStatus,
    isLoading: api.isLoading,
    error: null // Maintained for backward compatibility
  };
};
