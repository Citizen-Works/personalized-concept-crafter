import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformToDraft, transformToJoinedDraft } from './transformUtils';
import { DraftWithIdea } from './types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';

/**
 * Hook for fetching drafts data
 */
export const useFetchDrafts = () => {
  const { user } = useAuth();

  /**
   * Fetch all drafts
   */
  const fetchDrafts = async (): Promise<DraftWithIdea[]> => {
    if (!user?.id) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        content_ideas:content_idea_id (title)
      `)
      .eq('user_id', user.id)
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
    if (!user?.id) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        content_ideas:content_idea_id (title)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
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
    if (!user?.id) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        content_ideas:content_idea_id (title)
      `)
      .eq('content_idea_id', ideaId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts by idea ID:', error);
      throw error;
    }

    return data.map(transformToJoinedDraft);
  };

  // Create queries using React Query
  const draftsQuery = useQuery({
    queryKey: ['drafts', user?.id],
    queryFn: fetchDrafts,
    enabled: !!user?.id
  });

  const draftByIdQuery = (id: string) => useQuery({
    queryKey: ['draft', id, user?.id],
    queryFn: () => fetchDraftById(id),
    enabled: !!user?.id && !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5 // Consider data fresh for 5 minutes
  });

  const draftsByIdeaIdQuery = (ideaId: string) => useQuery({
    queryKey: ['drafts-by-idea', ideaId, user?.id],
    queryFn: () => fetchDraftsByIdeaId(ideaId),
    enabled: !!user?.id && !!ideaId
  });

  return {
    draftsQuery,
    draftByIdQuery,
    draftsByIdeaIdQuery,
    isLoading: draftsQuery.isLoading
  };
};
