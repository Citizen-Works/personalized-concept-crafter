
import { ContentDraft } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDraft } from './transformUtils';
import { useMemo } from 'react';

/**
 * Hook for fetching drafts with various operations
 */
export const useFetchDrafts = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('DraftsApi');

  /**
   * Fetch all drafts
   */
  const fetchDrafts = (options = {}) => {
    return createQuery<ContentDraft[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from("content_drafts")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(draft => transformToDraft(draft));
      },
      'fetching drafts',
      {
        ...options,
        queryKey: ['drafts', user?.id],
        enabled: !!user
      }
    );
  };
  
  /**
   * Fetch drafts for a specific content idea
   */
  const fetchDraftsByIdeaId = (ideaId: string, options = {}) => {
    return createQuery<ContentDraft[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!ideaId) throw new Error("Content idea ID is required");
        
        const { data, error } = await supabase
          .from("content_drafts")
          .select("*")
          .eq("content_idea_id", ideaId)
          .order("version", { ascending: false });
          
        if (error) throw error;
        
        return data.map(draft => transformToDraft(draft));
      },
      `fetching drafts for idea ${ideaId}`,
      {
        ...options,
        queryKey: ['drafts', 'idea', ideaId, user?.id],
        enabled: !!user && !!ideaId
      }
    );
  };
  
  /**
   * Fetch a single draft by ID
   */
  const fetchDraftById = (id: string, options = {}) => {
    return createQuery<ContentDraft | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (!id) throw new Error("Draft ID is required");
        
        const { data, error } = await supabase
          .from("content_drafts")
          .select("*")
          .eq("id", id)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) return null;
        
        return transformToDraft(data);
      },
      `fetching draft ${id}`,
      {
        ...options,
        queryKey: ['draft', id, user?.id],
        enabled: !!user && !!id
      }
    );
  };

  return useMemo(() => ({
    fetchDrafts,
    fetchDraftsByIdeaId,
    fetchDraftById
  }), [user?.id]);
};
