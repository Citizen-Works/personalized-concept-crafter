
import { supabase } from "@/integrations/supabase/client";
import { PersonalStory } from "@/types";

/**
 * Fetches personal stories for a user
 */
export const fetchPersonalStories = async (userId: string): Promise<PersonalStory[]> => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("personal_stories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching personal stories:", error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    content: item.content,
    isArchived: item.is_archived || false,
    usageCount: item.usage_count || 0,
    lastUsedDate: item.last_used_date ? new Date(item.last_used_date) : null,
    contentPillarIds: item.content_pillar_ids || [],
    targetAudienceIds: item.target_audience_ids || [],
    tags: item.tags || [],
    lesson: item.lesson || "",  // Added the missing 'lesson' property
    usageGuidance: item.usage_guidance || "",
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  }));
};
