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
    hasBeenUsed: item.has_been_used || false, // Map from the database field
    createdAt: new Date(item.created_at),
    contentPillarIds: [], // Default since field doesn't exist in DB yet
    targetAudienceIds: [] // Default since field doesn't exist in DB yet
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
    hasBeenUsed: data.has_been_used || false, // Map from the database field
    createdAt: new Date(data.created_at),
    contentPillarIds: [], // Default since field doesn't exist in DB yet
    targetAudienceIds: [] // Default since field doesn't exist in DB yet
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
        has_been_used: idea.hasBeenUsed || false, // Map to the database field
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
    hasBeenUsed: data.has_been_used || false, // Map from the database field
    createdAt: new Date(data.created_at),
    contentPillarIds: [], // Default since field doesn't exist in DB yet
    targetAudienceIds: [] // Default since field doesn't exist in DB yet
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
  if (updates.status) updateData.status = updates.status; // This should accept 'rejected'
  if (updates.hasBeenUsed !== undefined) updateData.has_been_used = updates.hasBeenUsed; // Map to the database field

  try {
    console.log("Updating idea with data:", updateData);
    
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
      hasBeenUsed: data.has_been_used || false, // Map from the database field
      createdAt: new Date(data.created_at),
      contentPillarIds: [], // Default since field doesn't exist in DB yet
      targetAudienceIds: [] // Default since field doesn't exist in DB yet
    };
  } catch (error) {
    console.error("Error in updateIdea:", error);
    throw error;
  }
};

export const deleteIdea = async (id: string, userId: string): Promise<void> => {
  if (!userId) throw new Error("User not authenticated");

  try {
    // First, update the idea status to 'rejected' instead of deleting
    const { error: updateError } = await supabase
      .from("content_ideas")
      .update({ status: 'rejected' as ContentStatus })
      .eq("id", id);

    if (updateError) {
      console.error("Error rejecting idea:", updateError);
      throw updateError;
    }

    // Then, check if we need to clean up old rejected ideas
    // Get count of rejected ideas for this user
    const { count, error: countError } = await supabase
      .from("content_ideas")
      .select("id", { count: 'exact', head: true })
      .eq("user_id", userId)
      .eq("status", 'rejected');

    if (countError) {
      console.error("Error counting rejected ideas:", countError);
      // Continue anyway, as the main operation succeeded
    } else if (count && count > 100) {
      // If we have more than 100 rejected ideas, delete the oldest ones
      // First, get the IDs of all rejected ideas, sorted by creation date
      const { data: rejectedIdeas, error: fetchError } = await supabase
        .from("content_ideas")
        .select("id, created_at")
        .eq("user_id", userId)
        .eq("status", 'rejected')
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error("Error fetching rejected ideas:", fetchError);
        // Continue anyway, as the main operation succeeded
      } else if (rejectedIdeas) {
        // Calculate how many we need to delete to get down to 100
        const deleteCount = rejectedIdeas.length - 100;
        if (deleteCount > 0) {
          // Get the IDs of the oldest rejected ideas
          const idsToDelete = rejectedIdeas.slice(0, deleteCount).map(idea => idea.id);
          
          // Delete the oldest rejected ideas
          const { error: deleteError } = await supabase
            .from("content_ideas")
            .delete()
            .in("id", idsToDelete);

          if (deleteError) {
            console.error("Error cleaning up old rejected ideas:", deleteError);
            // Continue anyway, as the main operation succeeded
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in deleteIdea:", error);
    throw error;
  }
};
