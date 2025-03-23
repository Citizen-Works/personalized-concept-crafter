
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PersonalStory } from '@/types';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToPersonalStory } from './transformUtils';

/**
 * Hook for fetching personal stories
 */
export const useFetchPersonalStories = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('PersonalStoriesApi');
  const [selectedStory, setSelectedStory] = useState<PersonalStory | null>(null);

  /**
   * Fetch all personal stories
   */
  const fetchPersonalStories = async (): Promise<PersonalStory[]> => {
    if (!user?.id) return [];

    const { data, error } = await supabase
      .from("personal_stories")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(transformToPersonalStory);
  };

  /**
   * Fetch a single personal story by ID
   */
  const fetchPersonalStoryById = async (id: string): Promise<PersonalStory | null> => {
    if (!user?.id || !id) return null;

    const { data, error } = await supabase
      .from("personal_stories")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    return transformToPersonalStory(data);
  };

  /**
   * Fetch personal stories by tag
   */
  const fetchPersonalStoriesByTag = async (tag: string): Promise<PersonalStory[]> => {
    if (!user?.id || !tag) return [];

    const { data, error } = await supabase
      .from("personal_stories")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .contains("tags", [tag])
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(transformToPersonalStory);
  };

  /**
   * Query hook for fetching all personal stories
   */
  const personalStoriesQuery = createQuery<PersonalStory[]>(
    fetchPersonalStories,
    'fetching personal stories',
    {
      queryKey: ['personalStories', user?.id],
      enabled: !!user
    }
  );

  return {
    fetchPersonalStories: () => personalStoriesQuery.refetch().then(result => result.data || []),
    fetchPersonalStoryById,
    fetchPersonalStoriesByTag,
    selectedStory,
    setSelectedStory,
    isLoading: personalStoriesQuery.isLoading,
  };
};
