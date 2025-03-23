
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentIdea } from "@/types";
import { IdeaDbRecord, transformToContentIdea } from "./types";

export async function fetchIdeaById(id: string, userId: string): Promise<ContentIdea> {
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

  return transformToContentIdea(data as IdeaDbRecord);
}
