
import { useTanstackApiQuery } from './useTanstackApiQuery';
import { ContentIdea, ContentStatus, ContentSource } from '@/types';
import { useAuth } from '@/context/auth';
import { IdeaCreateInput, IdeaUpdateInput } from '../ideas/types';
import { supabase } from '@/integrations/supabase/client';
import { processApiResponse } from '@/utils/apiResponseUtils';
import { createContentIdea } from '@/utils/modelFactory';

/**
 * Hook for standardized Content Ideas API operations using TanStack Query
 */
export function useIdeasApi() {
  const { user } = useAuth();
  const { createQuery, createMutation, invalidateQueries } = useTanstackApiQuery('IdeasApi');
  
  /**
   * Fetch all content ideas
   */
  const fetchIdeas = (options = {}) => {
    return createQuery<ContentIdea[]>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        
        const { data, error } = await supabase
          .from("content_ideas")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        return data.map(item => {
          const transformedData = processApiResponse(item);
          
          // Ensure array types are handled correctly
          const contentPillarIds = Array.isArray(transformedData.contentPillarIds) 
            ? [...transformedData.contentPillarIds] as string[]
            : [];
            
          const targetAudienceIds = Array.isArray(transformedData.targetAudienceIds)
            ? [...transformedData.targetAudienceIds] as string[]
            : [];
          
          return createContentIdea({
            id: transformedData.id,
            userId: transformedData.userId,
            title: transformedData.title,
            description: transformedData.description || "",
            notes: transformedData.notes || "",
            source: transformedData.source as ContentSource,
            meetingTranscriptExcerpt: transformedData.meetingTranscriptExcerpt,
            sourceUrl: transformedData.sourceUrl,
            status: transformedData.status as ContentStatus,
            hasBeenUsed: transformedData.hasBeenUsed || false,
            createdAt: new Date(transformedData.createdAt),
            contentPillarIds,
            targetAudienceIds
          });
        });
      },
      'fetching ideas',
      {
        ...options,
        queryKey: ['ideas', user?.id],
        enabled: !!user
      }
    );
  };
  
  /**
   * Fetch a single content idea by ID
   */
  const fetchIdeaById = (id: string, options = {}) => {
    return createQuery<ContentIdea | null>(
      async () => {
        if (!user?.id) throw new Error("User not authenticated");
        if (id === "new") throw new Error("Cannot fetch an idea with ID 'new'");
        
        const { data, error } = await supabase
          .from("content_ideas")
          .select("*")
          .eq("id", id)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) return null;
        
        const transformedData = processApiResponse(data);
        
        // Ensure array types are handled correctly
        const contentPillarIds = Array.isArray(transformedData.contentPillarIds) 
          ? [...transformedData.contentPillarIds] as string[]
          : [];
          
        const targetAudienceIds = Array.isArray(transformedData.targetAudienceIds)
          ? [...transformedData.targetAudienceIds] as string[]
          : [];
        
        return createContentIdea({
          id: transformedData.id,
          userId: transformedData.userId,
          title: transformedData.title,
          description: transformedData.description || "",
          notes: transformedData.notes || "",
          source: transformedData.source as ContentSource,
          meetingTranscriptExcerpt: transformedData.meetingTranscriptExcerpt,
          sourceUrl: transformedData.sourceUrl,
          status: transformedData.status as ContentStatus,
          hasBeenUsed: transformedData.hasBeenUsed || false,
          createdAt: new Date(transformedData.createdAt),
          contentPillarIds,
          targetAudienceIds
        });
      },
      `fetching idea ${id}`,
      {
        ...options,
        queryKey: ['idea', id, user?.id],
        enabled: !!user && !!id && id !== 'new'
      }
    );
  };
  
  /**
   * Create a new content idea
   */
  const createIdea = () => {
    return createMutation<ContentIdea, IdeaCreateInput>(
      async (idea) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        // Prepare the snake_case input for Supabase
        const snakeCaseInput = {
          title: idea.title,
          description: idea.description || "",
          notes: idea.notes || "",
          source: idea.source,
          meeting_transcript_excerpt: idea.meetingTranscriptExcerpt,
          source_url: idea.sourceUrl || null,
          status: idea.status,
          has_been_used: idea.hasBeenUsed || false,
          user_id: user.id
        };
        
        const { data, error } = await supabase
          .from("content_ideas")
          .insert([snakeCaseInput])
          .select()
          .single();
          
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        return createContentIdea({
          id: transformedData.id,
          userId: transformedData.userId,
          title: transformedData.title,
          description: transformedData.description || "",
          notes: transformedData.notes || "",
          source: transformedData.source as ContentSource,
          meetingTranscriptExcerpt: transformedData.meetingTranscriptExcerpt,
          sourceUrl: transformedData.sourceUrl,
          status: transformedData.status as ContentStatus,
          hasBeenUsed: transformedData.hasBeenUsed || false,
          createdAt: new Date(transformedData.createdAt),
          contentPillarIds: [],
          targetAudienceIds: []
        });
      },
      'creating idea',
      {
        successMessage: 'Content idea created successfully',
        errorMessage: 'Failed to create content idea',
        onSuccess: () => {
          invalidateQueries(['ideas', user?.id]);
        }
      }
    );
  };
  
  /**
   * Update an existing content idea
   */
  const updateIdea = () => {
    return createMutation<ContentIdea, { id: string } & IdeaUpdateInput>(
      async ({ id, ...updates }) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        // Prepare the snake_case update data for Supabase
        const updateData: Record<string, any> = {};
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.notes !== undefined) updateData.notes = updates.notes;
        if (updates.source !== undefined) updateData.source = updates.source;
        if (updates.meetingTranscriptExcerpt !== undefined) updateData.meeting_transcript_excerpt = updates.meetingTranscriptExcerpt;
        if (updates.sourceUrl !== undefined) updateData.source_url = updates.sourceUrl;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.hasBeenUsed !== undefined) updateData.has_been_used = updates.hasBeenUsed;
        if (updates.contentPillarIds !== undefined) updateData.content_pillar_ids = updates.contentPillarIds;
        if (updates.targetAudienceIds !== undefined) updateData.target_audience_ids = updates.targetAudienceIds;
        
        const { data, error } = await supabase
          .from("content_ideas")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();
          
        if (error) throw error;
        
        const transformedData = processApiResponse(data);
        
        // Ensure array types are handled correctly
        const contentPillarIds = Array.isArray(transformedData.contentPillarIds) 
          ? [...transformedData.contentPillarIds] as string[]
          : [];
          
        const targetAudienceIds = Array.isArray(transformedData.targetAudienceIds)
          ? [...transformedData.targetAudienceIds] as string[]
          : [];
        
        return createContentIdea({
          id: transformedData.id,
          userId: transformedData.userId,
          title: transformedData.title,
          description: transformedData.description || "",
          notes: transformedData.notes || "",
          source: transformedData.source as ContentSource,
          meetingTranscriptExcerpt: transformedData.meetingTranscriptExcerpt,
          sourceUrl: transformedData.sourceUrl,
          status: transformedData.status as ContentStatus,
          hasBeenUsed: transformedData.hasBeenUsed || false,
          createdAt: new Date(transformedData.createdAt),
          contentPillarIds,
          targetAudienceIds
        });
      },
      'updating idea',
      {
        successMessage: 'Content idea updated successfully',
        errorMessage: 'Failed to update content idea',
        onSuccess: (_, variables) => {
          invalidateQueries(['ideas', user?.id]);
          invalidateQueries(['idea', variables.id, user?.id]);
        }
      }
    );
  };
  
  /**
   * Delete (reject) a content idea
   */
  const deleteIdea = () => {
    return createMutation<boolean, string>(
      async (id) => {
        if (!user?.id) throw new Error("User not authenticated");
        
        // Update the idea status to 'rejected' instead of deleting
        const { error } = await supabase
          .from("content_ideas")
          .update({ status: 'rejected' as ContentStatus })
          .eq("id", id);
          
        if (error) throw error;
        
        // We could implement the cleanup of old rejected ideas here, but for simplicity,
        // we're just marking as rejected in this implementation
        
        return true;
      },
      'rejecting idea',
      {
        successMessage: 'Content idea rejected successfully',
        errorMessage: 'Failed to reject content idea',
        onSuccess: () => {
          invalidateQueries(['ideas', user?.id]);
        }
      }
    );
  };
  
  return {
    fetchIdeas,
    fetchIdeaById,
    createIdea,
    updateIdea,
    deleteIdea
  };
}
