
import { useCallback, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonalStory } from "@/types";

export function usePersonalStories() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  
  // Fetch all stories for the current user
  const { 
    data: stories,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["personalStories", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("personal_stories")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data.map(story => ({
        id: story.id,
        title: story.title,
        content: story.content,
        tags: story.tags || [],
        contentPillarIds: story.content_pillar_ids || [],
        targetAudienceIds: story.target_audience_ids || [],
        lesson: story.lesson || "",
        usageGuidance: story.usage_guidance || "",
        usageCount: story.usage_count || 0,
        lastUsedDate: story.last_used_date,
        isArchived: story.is_archived || false,
        createdAt: new Date(story.created_at),
        updatedAt: new Date(story.updated_at),
      })) as PersonalStory[];
    },
    enabled: !!userId
  });
  
  // Create a new story
  const createMutation = useMutation({
    mutationFn: async (storyData: Omit<PersonalStory, "id" | "createdAt" | "updatedAt" | "usageCount" | "lastUsedDate" | "isArchived">) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("personal_stories")
        .insert({
          user_id: userId,
          title: storyData.title,
          content: storyData.content,
          tags: storyData.tags,
          content_pillar_ids: storyData.contentPillarIds,
          target_audience_ids: storyData.targetAudienceIds,
          lesson: storyData.lesson,
          usage_guidance: storyData.usageGuidance,
        })
        .select("*")
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalStories", userId] });
      toast.success("Story created successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to create story:", error);
      toast.error("Failed to create story");
    }
  });
  
  // Update an existing story
  const updateMutation = useMutation({
    mutationFn: async (storyData: PersonalStory) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("personal_stories")
        .update({
          title: storyData.title,
          content: storyData.content,
          tags: storyData.tags,
          content_pillar_ids: storyData.contentPillarIds,
          target_audience_ids: storyData.targetAudienceIds,
          lesson: storyData.lesson,
          usage_guidance: storyData.usageGuidance,
          updated_at: new Date().toISOString()
        })
        .eq("id", storyData.id)
        .eq("user_id", userId)
        .select("*")
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalStories", userId] });
      toast.success("Story updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update story:", error);
      toast.error("Failed to update story");
    }
  });
  
  // Archive a story
  const archiveMutation = useMutation({
    mutationFn: async (storyId: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("personal_stories")
        .update({
          is_archived: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", storyId)
        .eq("user_id", userId)
        .select("*")
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalStories", userId] });
      toast.success("Story archived");
    },
    onError: (error: Error) => {
      console.error("Failed to archive story:", error);
      toast.error("Failed to archive story");
    }
  });
  
  // Restore (unarchive) a story
  const restoreMutation = useMutation({
    mutationFn: async (storyId: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("personal_stories")
        .update({
          is_archived: false,
          updated_at: new Date().toISOString()
        })
        .eq("id", storyId)
        .eq("user_id", userId)
        .select("*")
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalStories", userId] });
      toast.success("Story restored");
    },
    onError: (error: Error) => {
      console.error("Failed to restore story:", error);
      toast.error("Failed to restore story");
    }
  });
  
  // Extract all unique tags used across all stories
  const tags = useMemo(() => {
    if (!stories) return [];
    
    const tagSet = new Set<string>();
    stories.forEach(story => {
      story.tags.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet);
  }, [stories]);
  
  // Track story usage
  const trackUsageMutation = useMutation({
    mutationFn: async ({ storyId, contentId }: { storyId: string, contentId: string }) => {
      if (!userId) throw new Error("User not authenticated");
      
      // First create a usage record
      const { error: usageError } = await supabase
        .from("story_usage")
        .insert({
          story_id: storyId,
          content_id: contentId,
          user_id: userId,
          usage_date: new Date().toISOString()
        });
      
      if (usageError) throw usageError;
      
      // Then update the story's usage count and last used date
      // Fix: Don't try to assign the PostgrestFilterBuilder to a number
      await supabase.rpc("increment", { row_id: storyId });
      
      const { data, error: storyError } = await supabase
        .from("personal_stories")
        .update({
          last_used_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", storyId)
        .eq("user_id", userId)
        .select("*")
        .single();
      
      if (storyError) throw storyError;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalStories", userId] });
    },
    onError: (error: Error) => {
      console.error("Failed to track story usage:", error);
    }
  });
  
  // Helper methods that expose the mutations
  const createStory = useCallback(
    async (storyData: Omit<PersonalStory, "id" | "createdAt" | "updatedAt" | "usageCount" | "lastUsedDate" | "isArchived">) => {
      await createMutation.mutateAsync(storyData);
    },
    [createMutation]
  );
  
  const updateStory = useCallback(
    async (storyData: PersonalStory) => {
      await updateMutation.mutateAsync(storyData);
    },
    [updateMutation]
  );
  
  const archiveStory = useCallback(
    async (storyId: string) => {
      await archiveMutation.mutateAsync(storyId);
    },
    [archiveMutation]
  );
  
  const restoreStory = useCallback(
    async (storyId: string) => {
      await restoreMutation.mutateAsync(storyId);
    },
    [restoreMutation]
  );
  
  const trackStoryUsage = useCallback(
    async (storyId: string, contentId: string) => {
      await trackUsageMutation.mutateAsync({ storyId, contentId });
    },
    [trackUsageMutation]
  );
  
  return {
    stories,
    isLoading,
    isError,
    error,
    tags,
    createStory,
    updateStory,
    archiveStory,
    restoreStory,
    trackStoryUsage
  };
}
