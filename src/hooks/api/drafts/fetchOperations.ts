
import { useQuery } from '@tanstack/react-query';
import { ContentDraft } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transformToDraft } from './transformUtils';

/**
 * Hook for fetching all drafts
 */
export const useFetchDrafts = () => {
  /**
   * Fetch all drafts
   */
  const fetchDrafts = async (): Promise<ContentDraft[]> => {
    const { data, error } = await supabase
      .from('content_drafts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }

    return data.map(transformToDraft);
  };

  /**
   * Fetch a single draft by ID
   */
  const fetchDraftById = async (id: string): Promise<ContentDraft> => {
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

    return transformToDraft(data);
  };

  /**
   * Fetch drafts by content idea ID
   */
  const fetchDraftsByIdeaId = async (ideaId: string): Promise<ContentDraft[]> => {
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

    return data.map(transformToDraft);
  };

  return {
    fetchDrafts,
    fetchDraftById,
    fetchDraftsByIdeaId
  };
};
