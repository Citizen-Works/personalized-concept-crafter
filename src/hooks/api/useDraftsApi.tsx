import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/auth';
import { ContentDraft } from '../../types/content';
import { DraftWithIdea } from './drafts/types';
import { useFetchDrafts } from './drafts/fetchOperations';
import { supabase } from '../../integrations/supabase/client';
import { transformToDraft } from './drafts/transformUtils';

export interface DraftCreateInput {
  contentIdeaId: string;
  title: string;
  content: string;
  status: string;
}

export interface DraftUpdateInput {
  title?: string;
  content?: string;
  status?: string;
  contentIdeaId?: string;
}

export const useDraftsApi = () => {
  const { user } = useAuth();
  const { draftsQuery, draftByIdQuery, draftsByIdeaIdQuery, isLoading } = useFetchDrafts();

  return {
    draftsQuery,
    draftByIdQuery,
    draftsByIdeaIdQuery,
    createDraft: async (input: DraftCreateInput): Promise<ContentDraft> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('content_drafts')
        .insert([{
          content: input.content,
          content_idea_id: input.contentIdeaId,
          status: input.status,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating draft:', error);
        throw error;
      }

      return transformToDraft(data);
    },
    updateDraft: async (params: { id: string } & DraftUpdateInput): Promise<ContentDraft> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { id, content, status, contentIdeaId } = params;
      const { data, error } = await supabase
        .from('content_drafts')
        .update({
          content,
          status,
          content_idea_id: contentIdeaId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating draft:', error);
        throw error;
      }

      return transformToDraft(data);
    },
    deleteDraft: async (id: string): Promise<void> => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('content_drafts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting draft:', error);
        throw error;
      }
    },
    isLoading
  };
}; 