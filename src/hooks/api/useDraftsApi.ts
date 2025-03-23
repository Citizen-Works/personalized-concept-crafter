
import { useTanstackApiQuery } from './useTanstackApiQuery';
import { ContentDraft, DraftStatus, ContentType } from '@/types';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { createContentDraft } from '@/utils/modelFactory';

export interface DraftCreateInput {
  contentIdeaId: string;
  content: string;
  contentType?: ContentType;
  contentGoal?: string;
  version: number;
  feedback?: string;
  status: DraftStatus;
}

export interface DraftUpdateInput {
  content?: string;
  contentType?: ContentType;
  contentGoal?: string;
  version?: number;
  feedback?: string;
  status?: DraftStatus;
}

/**
 * Hook for standardized Content Drafts API operations using TanStack Query
 */
export function useDraftsApi() {
  const { user } = useAuth();
  const { createQuery, createMutation, invalidateQueries } = useTanstackApiQuery('DraftsApi');
  
  /**
   * Fetch all content drafts
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
        
        return data.map(draft => {
          const transformedData = processApiResponse(draft);
          
          return createContentDraft({
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
        });
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
        
        return data.map(draft => {
          const transformedData = processApiResponse(draft);
          
          return createContentDraft({
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
        });
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
        
        const transformedData = processApiResponse(data);
        
        return createContentDraft({
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
      },
      `fetching draft ${id}`,
      {
        ...options,
        queryKey: ['draft', id, user?.id],
        enabled: !!user && !!id
      }
    );
  };
  
  /**
   * Create a new content draft
   */
  const createDraft = () => {
    return createMutation<ContentDraft, DraftCreateInput>(
      async (draft) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        // Prepare the snake_case input for Supabase
        const snakeCaseInput = {
          content_idea_id: draft.contentIdeaId,
          content: draft.content,
          content_type: draft.contentType || 'linkedin',
          content_goal: draft.contentGoal,
          version: draft.version,
          feedback: draft.feedback || '',
          status: draft.status,
          user_id: user.id
        };
        
        const { data, error } = await supabase
          .from("content_drafts")
          .insert([snakeCaseInput])
          .select()
          .single();
          
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        return createContentDraft({
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
      },
      'creating draft',
      {
        successMessage: 'Content draft created successfully',
        errorMessage: 'Failed to create content draft',
        onSuccess: (draft) => {
          invalidateQueries(['drafts', user?.id]);
          invalidateQueries(['drafts', 'idea', draft.contentIdeaId, user?.id]);
        }
      }
    );
  };
  
  /**
   * Update an existing content draft
   */
  const updateDraft = () => {
    return createMutation<ContentDraft, { id: string } & DraftUpdateInput>(
      async ({ id, ...updates }) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        // Prepare the snake_case update data for Supabase
        const updateData: Record<string, any> = {};
        if (updates.content !== undefined) updateData.content = updates.content;
        if (updates.contentType !== undefined) updateData.content_type = updates.contentType;
        if (updates.contentGoal !== undefined) updateData.content_goal = updates.contentGoal;
        if (updates.version !== undefined) updateData.version = updates.version;
        if (updates.feedback !== undefined) updateData.feedback = updates.feedback;
        if (updates.status !== undefined) updateData.status = updates.status;
        
        const { data, error } = await supabase
          .from("content_drafts")
          .update(updateData)
          .eq("id", id)
          .eq("user_id", user.id) // Security check
          .select()
          .single();
          
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        return createContentDraft({
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
      },
      'updating draft',
      {
        successMessage: 'Content draft updated successfully',
        errorMessage: 'Failed to update content draft',
        onSuccess: (draft) => {
          invalidateQueries(['drafts', user?.id]);
          invalidateQueries(['draft', draft.id, user?.id]);
          invalidateQueries(['drafts', 'idea', draft.contentIdeaId, user?.id]);
        }
      }
    );
  };
  
  /**
   * Delete a content draft
   */
  const deleteDraft = () => {
    return createMutation<boolean, { id: string, contentIdeaId: string }>(
      async ({ id, contentIdeaId }) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { error } = await supabase
          .from("content_drafts")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id); // Security check
          
        if (error) throw error;
        
        return true;
      },
      'deleting draft',
      {
        successMessage: 'Content draft deleted successfully',
        errorMessage: 'Failed to delete content draft',
        onSuccess: (_, variables) => {
          invalidateQueries(['drafts', user?.id]);
          invalidateQueries(['drafts', 'idea', variables.contentIdeaId, user?.id]);
        }
      }
    );
  };
  
  return {
    fetchDrafts,
    fetchDraftsByIdeaId,
    fetchDraftById,
    createDraft,
    updateDraft,
    deleteDraft
  };
}
