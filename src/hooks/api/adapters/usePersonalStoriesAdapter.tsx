
import { useQuery, useMutation } from '@tanstack/react-query';
import { usePersonalStoriesApi } from '../usePersonalStoriesApi';
import { PersonalStory } from '@/types';
import { PersonalStoryCreateInput, PersonalStoryUpdateInput } from '../personal-stories/types';
import { useAuth } from '@/context/auth';

/**
 * Adapter hook that provides the same interface as the original usePersonalStories hook
 * but uses the new standardized API pattern under the hood
 */
export const usePersonalStoriesAdapter = () => {
  const storiesApi = usePersonalStoriesApi();
  const { user } = useAuth();
  const userId = user?.id;
  
  // Get all stories query
  const storiesQuery = useQuery({
    queryKey: ['personalStories', userId],
    queryFn: async () => {
      return await storiesApi.fetchPersonalStories.refetch().then(result => result.data || []);
    },
    enabled: !!userId,
    initialData: []
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
      queryFn: async () => {
        const result = await storiesApi.fetchPersonalStoryById(id);
        return result;
      },
      enabled: !!id && !!userId
    });
  };
  
  // Custom hook for getting stories by tag
  const getPersonalStoriesByTag = (tag: string) => {
    return useQuery({
      queryKey: ['personalStories', 'byTag', tag],
      queryFn: async () => {
        const result = await storiesApi.fetchPersonalStoriesByTag(tag);
        return result;
      },
      enabled: !!tag && !!userId
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
