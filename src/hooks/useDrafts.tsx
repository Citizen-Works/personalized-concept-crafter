
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContentDraft, ContentType } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export type DraftWithIdea = ContentDraft & {
  ideaTitle: string;
  contentType: ContentType;
};

export const useDrafts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchDrafts = async (): Promise<DraftWithIdea[]> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("content_drafts")
      .select(`
        *,
        content_ideas:content_idea_id (
          title,
          content_type
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch drafts");
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      contentIdeaId: item.content_idea_id,
      ideaTitle: item.content_ideas?.title || "Untitled",
      content: item.content,
      version: item.version,
      feedback: item.feedback || "",
      contentType: (item.content_ideas?.content_type as ContentType) || "linkedin",
      createdAt: new Date(item.created_at)
    }));
  };

  const fetchDraftById = async (id: string): Promise<DraftWithIdea> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("content_drafts")
      .select(`
        *,
        content_ideas:content_idea_id (
          title,
          content_type
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to fetch draft");
      throw error;
    }

    return {
      id: data.id,
      contentIdeaId: data.content_idea_id,
      ideaTitle: data.content_ideas?.title || "Untitled",
      content: data.content,
      version: data.version,
      feedback: data.feedback || "",
      contentType: (data.content_ideas?.content_type as ContentType) || "linkedin",
      createdAt: new Date(data.created_at)
    };
  };

  const createDraft = async (draft: Omit<ContentDraft, "id" | "createdAt">) => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("content_drafts")
      .insert([
        {
          content_idea_id: draft.contentIdeaId,
          content: draft.content,
          version: draft.version,
          feedback: draft.feedback,
          content_type: draft.contentType
        }
      ])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create draft");
      throw error;
    }

    toast.success("Draft created successfully");
    return data;
  };

  const updateDraft = async ({ id, ...draft }: { id: string } & Partial<Omit<ContentDraft, "id" | "createdAt">>) => {
    if (!user) throw new Error("User not authenticated");

    const updates: any = {};
    if (draft.content) updates.content = draft.content;
    if (draft.feedback) updates.feedback = draft.feedback;
    if (draft.version) updates.version = draft.version;

    const { data, error } = await supabase
      .from("content_drafts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update draft");
      throw error;
    }

    toast.success("Draft updated successfully");
    return data;
  };

  const deleteDraft = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("content_drafts")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete draft");
      throw error;
    }

    toast.success("Draft deleted successfully");
  };

  const draftsQuery = useQuery({
    queryKey: ["drafts", user?.id],
    queryFn: fetchDrafts,
    enabled: !!user,
  });

  const draftByIdQuery = (id: string) => useQuery({
    queryKey: ["draft", id, user?.id],
    queryFn: () => fetchDraftById(id),
    enabled: !!user && !!id,
  });

  const createDraftMutation = useMutation({
    mutationFn: createDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", user?.id] });
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: updateDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", user?.id] });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: deleteDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", user?.id] });
    },
  });

  return {
    drafts: draftsQuery.data || [],
    isLoading: draftsQuery.isLoading,
    isError: draftsQuery.isError,
    getDraft: draftByIdQuery,
    createDraft: createDraftMutation.mutate,
    updateDraft: updateDraftMutation.mutate,
    deleteDraft: deleteDraftMutation.mutate,
  };
};
