
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentIdea, ContentStatus, ContentSource } from "@/types";
import { IdeaCreateInput, IdeaUpdateInput } from "./types";

export const fetchIdeas = async (userId: string): Promise<ContentIdea[]> => {
  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("content_ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ideas:", error);
    throw error; // Don't show a toast here, let the calling component handle it
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
    hasBeenUsed: item.has_been_used || false, // Add default value if not present in DB
    createdAt: new Date(item.created_at),
    contentPillarIds: item.content_pillar_ids || [], // Add default value if not present in DB
    targetAudienceIds: item.target_audience_ids || [] // Add default value if not present in DB
  }));
};

export const fetchIdeaById = async (id: string, userId: string): Promise<ContentIdea> => {
  if (!userId) throw new Error("User not authenticated");
  
  if (id === "new") {
    throw new Error("Cannot fetch an idea with ID 'new'");
  }

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
    hasBeenUsed: data.has_been_used || false, // Add default value if not present in DB
    createdAt: new Date(data.created_at),
    contentPillarIds: data.content_pillar_ids || [], // Add default value if not present in DB
    targetAudienceIds: data.target_audience_ids || [] // Add default value if not present in DB
  };
};

export const createIdea = async (idea: IdeaCreateInput, userId: string): Promise<ContentIdea> => {
  if (!userId) throw new Error("User not authenticated");

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
        has_been_used: idea.hasBeenUsed || false,
        content_pillar_ids: idea.contentPillarIds || [],
        target_audience_ids: idea.targetAudienceIds || [],
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating idea:", error);
    throw error; // Don't show toast here, let the calling component handle it
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
    hasBeenUsed: data.has_been_used || false, // Add default value if not present in DB
    createdAt: new Date(data.created_at),
    contentPillarIds: data.content_pillar_ids || [], // Add default value if not present in DB
    targetAudienceIds: data.target_audience_ids || [] // Add default value if not present in DB
  };
};

export const updateIdea = async ({ id, ...updates }: { id: string } & IdeaUpdateInput, userId: string): Promise<ContentIdea> => {
  if (!userId) throw new Error("User not authenticated");

  const updateData: any = {};
  if (updates.title) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.source) updateData.source = updates.source;
  if (updates.meetingTranscriptExcerpt !== undefined) updateData.meeting_transcript_excerpt = updates.meetingTranscriptExcerpt;
  if (updates.sourceUrl !== undefined) updateData.source_url = updates.sourceUrl;
  if (updates.status) updateData.status = updates.status;
  if (updates.hasBeenUsed !== undefined) updateData.has_been_used = updates.hasBeenUsed;
  if (updates.contentPillarIds !== undefined) updateData.content_pillar_ids = updates.contentPillarIds;
  if (updates.targetAudienceIds !== undefined) updateData.target_audience_ids = updates.targetAudienceIds;

  try {
    const { data, error } = await supabase
      .from("content_ideas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating idea:", error);
      throw error; // Let the component handle the toast
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
      hasBeenUsed: data.has_been_used || false, // Add default value if not present in DB
      createdAt: new Date(data.created_at),
      contentPillarIds: data.content_pillar_ids || [], // Add default value if not present in DB
      targetAudienceIds: data.target_audience_ids || [] // Add default value if not present in DB
    };
  } catch (error) {
    console.error("Error in updateIdea:", error);
    throw error;
  }
};

export const deleteIdea = async (id: string, userId: string): Promise<void> => {
  if (!userId) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("content_ideas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting idea:", error);
    throw error; // Let the component handle the toast
  }
};
