
import { PersonalStory } from '@/types';

/**
 * Transform supabase response to PersonalStory object
 */
export const transformToPersonalStory = (data: any): PersonalStory => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    contentPillarIds: data.content_pillar_ids || [],
    targetAudienceIds: data.target_audience_ids || [],
    lesson: data.lesson || "",
    usageGuidance: data.usage_guidance || "",
    usageCount: data.usage_count || 0,
    lastUsedDate: data.last_used_date,
    isArchived: data.is_archived || false,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};
