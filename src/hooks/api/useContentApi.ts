
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentDraft, ContentStatus, DraftStatus, ContentSource, ContentType } from '@/types';
import { toast } from 'sonner';

/**
 * Hook for content idea API operations
 */
export const useContentIdeaApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Update a content idea's status
   */
  const updateIdeaStatus = async (
    ideaId: string, 
    newStatus: ContentStatus
  ): Promise<ContentIdea | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('content_ideas')
        .update({ status: newStatus })
        .eq('id', ideaId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform database response to match ContentIdea interface
      // Handle missing or undefined fields with defaults
      const transformedData: ContentIdea = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        notes: data.notes || '',
        source: (data.source || 'manual') as ContentSource, // Cast to ContentSource type
        meetingTranscriptExcerpt: data.meeting_transcript_excerpt,
        sourceUrl: data.source_url,
        status: data.status as ContentStatus,
        hasBeenUsed: data.has_been_used || false,
        createdAt: new Date(data.created_at),
        // The database schema may not have these fields yet
        // Using optional chaining and nullish coalescing to safely handle
        contentPillarIds: (data as any)?.content_pillar_ids || [], 
        targetAudienceIds: (data as any)?.target_audience_ids || [] 
      };
      
      toast.success(`Idea updated to ${newStatus}`);
      return transformedData;
    } catch (err) {
      console.error('Error updating idea status:', err);
      setError(err as Error);
      toast.error(`Failed to update idea: ${(err as Error).message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    updateIdeaStatus,
    isLoading,
    error
  };
};

/**
 * Hook for content draft API operations
 */
export const useContentDraftApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Update a draft's status
   */
  const updateDraftStatus = async (
    draftId: string, 
    newStatus: DraftStatus
  ): Promise<ContentDraft | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('content_drafts')
        .update({ status: newStatus })
        .eq('id', draftId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform database response to match ContentDraft interface with proper handling for missing fields
      const transformedData: ContentDraft = {
        id: data.id,
        contentIdeaId: data.content_idea_id,
        content: data.content,
        // Handle potentially missing content_type field with a default
        // Using type assertion to avoid TypeScript errors
        contentType: ((data as any)?.content_type || 'linkedin') as ContentType,
        // Handle potentially missing content_goal field
        contentGoal: (data as any)?.content_goal || undefined,
        version: data.version,
        feedback: data.feedback || '',
        status: data.status as DraftStatus,
        createdAt: new Date(data.created_at)
      };
      
      toast.success(`Draft updated to ${newStatus}`);
      return transformedData;
    } catch (err) {
      console.error('Error updating draft status:', err);
      setError(err as Error);
      toast.error(`Failed to update draft: ${(err as Error).message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    updateDraftStatus,
    isLoading,
    error
  };
};
