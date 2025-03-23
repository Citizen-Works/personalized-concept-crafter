
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook containing personal stories fetch operations
 */
export const useFetchPersonalStories = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('PersonalStoriesApi');

  /**
   * Fetch all personal stories for the current user
   */
  const fetchPersonalStories = async (): Promise<PersonalStory[]> => {
    if (!user?.id) return [];
    
    const { data, error } = await supabase
      .from('personal_stories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the response to match our PersonalStory type
    return data.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      tags: story.tags || [],
      contentPillarIds: story.content_pillar_ids || [],
      targetAudienceIds: story.target_audience_ids || [],
      lesson: story.lesson || "",
      usageGuidance: story.usage_guidance || "",
      usageCount: story.usage_count || 0,
      lastUsedDate: story.last_used_date,
      isArchived: story.is_archived || false,
      createdAt: new Date(story.created_at),
      updatedAt: new Date(story.updated_at)
    }));
  };
  
  /**
   * Fetch a single personal story by ID
   */
  const fetchPersonalStoryById = async (id: string): Promise<PersonalStory> => {
    if (!user?.id) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('personal_stories')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    
    // Transform the response to match our PersonalStory type
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
  
  /**
   * Fetch personal stories by tag
   */
  const fetchPersonalStoriesByTag = async (tag: string): Promise<PersonalStory[]> => {
    if (!user?.id) return [];
    
    const { data, error } = await supabase
      .from('personal_stories')
      .select('*')
      .eq('user_id', user.id)
      .contains('tags', [tag]);
    
    if (error) throw error;
    
    // Transform the response to match our PersonalStory type
    return data.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      tags: story.tags || [],
      contentPillarIds: story.content_pillar_ids || [],
      targetAudienceIds: story.target_audience_ids || [],
      lesson: story.lesson || "",
      usageGuidance: story.usage_guidance || "",
      usageCount: story.usage_count || 0,
      lastUsedDate: story.last_used_date,
      isArchived: story.is_archived || false,
      createdAt: new Date(story.created_at),
      updatedAt: new Date(story.updated_at)
    }));
  };

  /**
   * Query hook for fetching all personal stories
   */
  const fetchPersonalStoriesQuery = (options?: Partial<UseQueryOptions<PersonalStory[], Error>>) => 
    createQuery<PersonalStory[], Error>(
      fetchPersonalStories,
      'fetch-personal-stories',
      {
        enabled: !!user?.id,
        ...options
      }
    );

  /**
   * Query hook for fetching a single personal story by ID
   */
  const fetchPersonalStoryByIdQuery = (id: string, options?: Partial<UseQueryOptions<PersonalStory, Error>>) => 
    createQuery<PersonalStory, Error>(
      () => fetchPersonalStoryById(id),
      'fetch-personal-story-by-id',
      {
        enabled: !!user?.id && !!id,
        ...options
      }
    );

  /**
   * Query hook for fetching personal stories by tag
   */
  const fetchPersonalStoriesByTagQuery = (tag: string, options?: Partial<UseQueryOptions<PersonalStory[], Error>>) => 
    createQuery<PersonalStory[], Error>(
      () => fetchPersonalStoriesByTag(tag),
      'fetch-personal-stories-by-tag',
      {
        enabled: !!user?.id && !!tag,
        ...options
      }
    );
  
  // Create base queries to monitor loading state
  const baseQuery = fetchPersonalStoriesQuery();
  
  return {
    fetchPersonalStories: baseQuery,
    fetchPersonalStoryById: (id: string) => fetchPersonalStoryByIdQuery(id),
    fetchPersonalStoriesByTag: (tag: string) => fetchPersonalStoriesByTagQuery(tag),
    isLoading: baseQuery.isLoading
  };
};
