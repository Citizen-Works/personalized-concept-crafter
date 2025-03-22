
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentIdea, ContentDraft, ContentStatus, DraftStatus } from '@/types';
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
      
      toast.success(`Idea updated to ${newStatus}`);
      return data;
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
      
      toast.success(`Draft updated to ${newStatus}`);
      return data;
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
