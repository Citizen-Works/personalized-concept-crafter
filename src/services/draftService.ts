
import { supabase } from "@/integrations/supabase/client";
import { ContentDraft, ContentType, DraftStatus } from "@/types";
import { toast } from "sonner";

export type DraftWithIdea = ContentDraft & {
  ideaTitle: string;
  contentType: ContentType;
  status: DraftStatus;
};

export const fetchDrafts = async (userId: string): Promise<DraftWithIdea[]> => {
  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("content_drafts")
    .select(`
      *,
      content_ideas:content_idea_id (
        title
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
    contentType: (item.content_type as ContentType) || "linkedin",
    status: (item.status || "draft") as DraftStatus,
    createdAt: new Date(item.created_at)
  }));
};

export const fetchDraftsByIdeaId = async (ideaId: string, userId: string): Promise<DraftWithIdea[]> => {
  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("content_drafts")
    .select(`
      *,
      content_ideas:content_idea_id (
        title
      )
    `)
    .eq("content_idea_id", ideaId)
    .order("created_at", { ascending: false });

  if (error) {
    toast.error("Failed to fetch drafts for this idea");
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    contentIdeaId: item.content_idea_id,
    ideaTitle: item.content_ideas?.title || "Untitled",
    content: item.content,
    version: item.version,
    feedback: item.feedback || "",
    contentType: (item.content_type as ContentType) || "linkedin",
    status: (item.status || "draft") as DraftStatus,
    createdAt: new Date(item.created_at)
  }));
};

export const fetchDraftById = async (id: string, userId: string): Promise<DraftWithIdea> => {
  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("content_drafts")
    .select(`
      *,
      content_ideas:content_idea_id (
        title
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
    contentType: (data.content_type as ContentType) || "linkedin",
    status: (data.status || "draft") as DraftStatus,
    createdAt: new Date(data.created_at)
  };
};

export const createDraft = async (
  draft: Omit<ContentDraft, "id" | "createdAt">, 
  userId: string
) => {
  if (!userId) throw new Error("User not authenticated");

  // Ensure we're using the standardized status values
  const validStatus: DraftStatus = draft.status || "draft";

  console.log("Creating draft with data:", {
    content_idea_id: draft.contentIdeaId,
    content: draft.content,
    content_type: draft.contentType, // Send content_type to the database
    version: draft.version,
    feedback: draft.feedback,
    status: validStatus
  });

  const { data, error } = await supabase
    .from("content_drafts")
    .insert([
      {
        content_idea_id: draft.contentIdeaId,
        content: draft.content,
        content_type: draft.contentType, // Store content_type in the database
        version: draft.version,
        feedback: draft.feedback,
        status: validStatus
      }
    ])
    .select()
    .single();

  if (error) {
    toast.error("Failed to create draft");
    console.error("Database error:", error);
    throw error;
  }

  toast.success("Draft created successfully");
  return data;
};

export const updateDraft = async (
  { id, ...draft }: { id: string } & Partial<Omit<ContentDraft, "id" | "createdAt"> & { status?: DraftStatus }>,
  userId: string
) => {
  if (!userId) throw new Error("User not authenticated");

  const updates: any = {};
  if (draft.content !== undefined) updates.content = draft.content;
  if (draft.feedback !== undefined) updates.feedback = draft.feedback;
  if (draft.version !== undefined) updates.version = draft.version;
  if (draft.status !== undefined) updates.status = draft.status;
  if (draft.contentType !== undefined) updates.content_type = draft.contentType;

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

export const deleteDraft = async (id: string, userId: string) => {
  if (!userId) throw new Error("User not authenticated");

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
