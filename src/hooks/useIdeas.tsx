
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentIdea, ContentStatus, ContentType, ContentSource } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export type IdeaCreateInput = Omit<ContentIdea, 'id' | 'userId' | 'createdAt'>;
export type IdeaUpdateInput = Partial<Omit<ContentIdea, 'id' | 'userId' | 'createdAt'>>;

export const useIdeas = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchIdeas = async (): Promise<ContentIdea[]> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("content_ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch ideas");
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      description: item.description || "",
      notes: item.notes || "",
      source: item.source as ContentSource,
      meetingTranscriptExcerpt: item.meeting_transcript_excerpt,
      sourceUrl: item.source_url,
      status: item.status as ContentStatus,
      contentType: item.content_type as ContentType,
      createdAt: new Date(item.created_at)
    }));
  };

  const fetchIdeaById = async (id: string): Promise<ContentIdea> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("content_ideas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to fetch idea");
      throw error;
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description || "",
      notes: data.notes || "",
      source: data.source as ContentSource,
      meetingTranscriptExcerpt: data.meeting_transcript_excerpt,
      sourceUrl: data.source_url,
      status: data.status as ContentStatus,
      contentType: data.content_type as ContentType,
      createdAt: new Date(data.created_at)
    };
  };

  const createIdea = async (idea: IdeaCreateInput): Promise<ContentIdea> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("content_ideas")
      .insert([
        {
          title: idea.title,
          description: idea.description,
          notes: idea.notes,
          source: idea.source,
          meeting_transcript_excerpt: idea.meetingTranscriptExcerpt,
          source_url: idea.sourceUrl,
          status: idea.status,
          content_type: idea.contentType,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create idea");
      throw error;
    }

    toast.success("Idea created successfully");
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description || "",
      notes: data.notes || "",
      source: data.source as ContentSource,
      meetingTranscriptExcerpt: data.meeting_transcript_excerpt,
      sourceUrl: data.source_url,
      status: data.status as ContentStatus,
      contentType: data.content_type as ContentType,
      createdAt: new Date(data.created_at)
    };
  };

  const updateIdea = async ({ id, ...updates }: { id: string } & IdeaUpdateInput): Promise<ContentIdea> => {
    if (!user) throw new Error("User not authenticated");

    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.source) updateData.source = updates.source;
    if (updates.meetingTranscriptExcerpt !== undefined) updateData.meeting_transcript_excerpt = updates.meetingTranscriptExcerpt;
    if (updates.sourceUrl !== undefined) updateData.source_url = updates.sourceUrl;
    if (updates.status) updateData.status = updates.status;
    if (updates.contentType) updateData.content_type = updates.contentType;

    const { data, error } = await supabase
      .from("content_ideas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update idea");
      throw error;
    }

    toast.success("Idea updated successfully");
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description || "",
      notes: data.notes || "",
      source: data.source as ContentSource,
      meetingTranscriptExcerpt: data.meeting_transcript_excerpt,
      sourceUrl: data.source_url,
      status: data.status as ContentStatus,
      contentType: data.content_type as ContentType,
      createdAt: new Date(data.created_at)
    };
  };

  const deleteIdea = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("content_ideas")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete idea");
      throw error;
    }

    toast.success("Idea deleted successfully");
  };

  const ideasQuery = useQuery({
    queryKey: ["ideas", user?.id],
    queryFn: fetchIdeas,
    enabled: !!user,
  });

  const ideaByIdQuery = (id: string) => useQuery({
    queryKey: ["idea", id, user?.id],
    queryFn: () => fetchIdeaById(id),
    enabled: !!user && !!id,
  });

  const createIdeaMutation = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas", user?.id] });
    },
  });

  const updateIdeaMutation = useMutation({
    mutationFn: updateIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas", user?.id] });
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas", user?.id] });
    },
  });

  return {
    ideas: ideasQuery.data || [],
    isLoading: ideasQuery.isLoading,
    isError: ideasQuery.isError,
    getIdea: ideaByIdQuery,
    createIdea: createIdeaMutation.mutate,
    updateIdea: updateIdeaMutation.mutate,
    deleteIdea: deleteIdeaMutation.mutate,
  };
};
