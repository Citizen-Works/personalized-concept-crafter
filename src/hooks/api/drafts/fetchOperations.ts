
import { useQuery } from '@tanstack/react-query';
import { ContentDraft } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transformToDraft, transformToJoinedDraft } from './transformUtils';
import { DraftWithIdea } from './types';

/**
 * Hook for fetching all drafts
 */
export const useFetchDrafts = () => {
  /**
   * Fetch all drafts
   */
  const fetchDrafts = async (): Promise<DraftWithIdea[]> => {
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        content_ideas:content_idea_id (title)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }

    return data.map(transformToJoinedDraft);
  };

  /**
   * Fetch a single draft by ID
   */
  const fetchDraftById = async (id: string): Promise<DraftWithIdea> => {
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        content_ideas:content_idea_id (title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching draft by ID:', error);
      throw error;
    }

    return transformToJoinedDraft(data);
  };

  /**
   * Fetch drafts by content idea ID
   */
  const fetchDraftsByIdeaId = async (ideaId: string): Promise<DraftWithIdea[]> => {
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        content_ideas:content_idea_id (title)
      `)
      .eq('content_idea_id', ideaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts by idea ID:', error);
      throw error;
    }

    return data.map(transformToJoinedDraft);
  };

  return {
    fetchDrafts,
    fetchDraftById,
    fetchDraftsByIdeaId
  };
};
