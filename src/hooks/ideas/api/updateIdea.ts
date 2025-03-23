
import { supabase } from "@/integrations/supabase/client";
import { ContentIdea } from "@/types";
import { IdeaUpdateInput } from "../types";
import { IdeaDbRecord, transformToContentIdea } from "./types";

export async function updateIdea(
  { id, ...updates }: { id: string } & IdeaUpdateInput, 
  userId: string
): Promise<ContentIdea> {
  if (!userId) throw new Error("User not authenticated");

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
      throw error;
    }

    return transformToContentIdea(data as IdeaDbRecord);
  } catch (error) {
    console.error("Error in updateIdea:", error);
    throw error;
  }
}
