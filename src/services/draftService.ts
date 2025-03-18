
import { supabase } from "@/integrations/supabase/client";
import { ContentDraft, ContentType } from "@/types";
import { toast } from "sonner";

export type DraftWithIdea = ContentDraft & {
  ideaTitle: string;
  contentType: ContentType;
  status?: 'draft' | 'published' | 'archived';
};

export const fetchDrafts = async (userId: string): Promise<DraftWithIdea[]> => {
  if (!userId) throw new Error("User not authenticated");

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
    status: item.status || "draft",
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
        title,
        content_type
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
    contentType: (item.content_ideas?.content_type as ContentType) || "linkedin",
    status: item.status || "draft",
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
    status: data.status || "draft",
    createdAt: new Date(data.created_at)
  };
};

export const createDraft = async (
  draft: Omit<ContentDraft, "id" | "createdAt">, 
  userId: string
) => {
  if (!userId) throw new Error("User not authenticated");

  // Remove contentType if it's included in the draft object
  // since it doesn't exist in the database table
  const { contentType, ...draftData } = draft as any;

  console.log("Creating draft with data:", {
    content_idea_id: draftData.contentIdeaId,
    content: draftData.content,
    version: draftData.version,
    feedback: draftData.feedback,
    status: draftData.status || "draft"
  });

  const { data, error } = await supabase
    .from("content_drafts")
    .insert([
      {
        content_idea_id: draftData.contentIdeaId,
        content: draftData.content,
        version: draftData.version,
        feedback: draftData.feedback,
        status: draftData.status || "draft"
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
  { id, ...draft }: { id: string } & Partial<Omit<ContentDraft, "id" | "createdAt"> & { status?: 'draft' | 'published' | 'archived' }>,
  userId: string
) => {
  if (!userId) throw new Error("User not authenticated");

  const updates: any = {};
  if (draft.content !== undefined) updates.content = draft.content;
  if (draft.feedback !== undefined) updates.feedback = draft.feedback;
  if (draft.version !== undefined) updates.version = draft.version;
  if (draft.status !== undefined) updates.status = draft.status;

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
