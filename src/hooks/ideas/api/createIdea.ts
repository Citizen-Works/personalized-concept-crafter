
import { supabase } from "@/integrations/supabase/client";
import { ContentIdea } from "@/types";
import { IdeaCreateInput } from "../types";
import { IdeaDbRecord, transformToContentIdea } from "./types";

export async function createIdea(idea: IdeaCreateInput, userId: string): Promise<ContentIdea> {
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
    throw error;
  }

  return transformToContentIdea(data as IdeaDbRecord);
}
