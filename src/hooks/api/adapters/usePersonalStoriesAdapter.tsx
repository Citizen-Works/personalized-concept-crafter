
import { useQuery, useMutation } from '@tanstack/react-query';
import { usePersonalStoriesApi } from '../usePersonalStoriesApi';
import { PersonalStory } from '@/types';
import { PersonalStoryCreateInput, PersonalStoryUpdateInput } from '../personal-stories/types';

/**
 * Adapter hook that provides the same interface as the original usePersonalStories hook
 * but uses the new standardized API pattern under the hood
 */
export const usePersonalStoriesAdapter = () => {
  const storiesApi = usePersonalStoriesApi();
  
  // Get all stories query
  const storiesQuery = useQuery({
    queryKey: ['personalStories'],
    queryFn: () => storiesApi.fetchPersonalStories()
  });
  
  // Create story mutation
  const createStoryMutation = useMutation({
    mutationFn: (story: PersonalStoryCreateInput) => {
      return storiesApi.createPersonalStory(story);
    }
  });
  
  // Update story mutation
  const updateStoryMutation = useMutation({
    mutationFn: (params: { id: string, updates: PersonalStoryUpdateInput }) => {
      return storiesApi.updatePersonalStory(params.id, params.updates);
    }
  });
  
  // Archive story mutation
  const archiveStoryMutation = useMutation({
    mutationFn: (id: string) => {
      return storiesApi.archivePersonalStory(id);
    }
  });
  
  // Increment usage count mutation
  const incrementUsageCountMutation = useMutation({
    mutationFn: (id: string) => {
      return storiesApi.incrementUsageCount(id);
    }
  });
  
  // Custom hook for getting a single story
  const getPersonalStory = (id: string) => {
    return useQuery({
      queryKey: ['personalStory', id],
      queryFn: () => storiesApi.fetchPersonalStoryById(id)
    });
  };
  
  // Custom hook for getting stories by tag
  const getPersonalStoriesByTag = (tag: string) => {
    return useQuery({
      queryKey: ['personalStories', 'byTag', tag],
      queryFn: () => storiesApi.fetchPersonalStoriesByTag(tag),
      enabled: !!tag
    });
  };
  
  return {
    personalStories: storiesQuery.data || [],
    isLoading: storiesQuery.isLoading,
    isError: storiesQuery.isError,
    getPersonalStory,
    getPersonalStoriesByTag,
    createPersonalStory: createStoryMutation.mutate,
    createPersonalStoryAsync: createStoryMutation.mutateAsync,
    updatePersonalStory: updateStoryMutation.mutate,
    updatePersonalStoryAsync: updateStoryMutation.mutateAsync,
    archivePersonalStory: archiveStoryMutation.mutate
  };
};
