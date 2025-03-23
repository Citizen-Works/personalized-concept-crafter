
import { supabase } from "@/integrations/supabase/client";
import { ContentIdea } from "@/types";
import { IdeaDbRecord, transformToContentIdea } from "./types";

export async function fetchIdeas(userId: string): Promise<ContentIdea[]> {
  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("content_ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }

  return (data as IdeaDbRecord[]).map(item => transformToContentIdea(item));
}
