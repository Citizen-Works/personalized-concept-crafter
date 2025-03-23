
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
  const { createQuery } = useTanstackApiQuery('DraftsApi');

  /**
   * Fetch all drafts
   */
  const fetchDrafts = async (): Promise<DraftWithIdea[]> => {
    const result = await createQuery<DraftWithIdea[]>(
      async () => {
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
      },
      'fetching drafts',
      {
        queryKey: ['drafts', user?.id],
        enabled: !!user
      }
    ).refetch();
    
    return result.data || [];
  };

  /**
   * Fetch a single draft by ID
   */
  const fetchDraftById = async (id: string): Promise<DraftWithIdea> => {
    const result = await createQuery<DraftWithIdea>(
      async () => {
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
      },
      `fetching draft ${id}`,
      {
        queryKey: ['draft', id, user?.id],
        enabled: !!user && !!id
      }
    ).refetch();
    
    return result.data!;
  };

  /**
   * Fetch drafts by content idea ID
   */
  const fetchDraftsByIdeaId = async (ideaId: string): Promise<DraftWithIdea[]> => {
    const result = await createQuery<DraftWithIdea[]>(
      async () => {
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
      },
      `fetching drafts for idea ${ideaId}`,
      {
        queryKey: ['drafts', 'idea', ideaId, user?.id],
        enabled: !!user && !!ideaId
      }
    ).refetch();
    
    return result.data || [];
  };

  // Get the isLoading state from one of the queries
  const { isLoading } = createQuery<DraftWithIdea[]>(
    () => Promise.resolve([]),
    'dummy query for loading state',
    {
      queryKey: ['drafts', user?.id],
      enabled: false
    }
  );

  return {
    fetchDrafts,
    fetchDraftById,
    fetchDraftsByIdeaId,
    isLoading
  };
};
