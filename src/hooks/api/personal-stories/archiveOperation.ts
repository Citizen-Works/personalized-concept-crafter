
import { PersonalStory } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useUpdatePersonalStory } from './updateOperation';

/**
 * Hook for archiving a personal story (soft delete)
 */
export const useArchivePersonalStory = () => {
  const { createMutation } = useTanstackApiQuery('PersonalStoriesApi');
  const { updatePersonalStory } = useUpdatePersonalStory();

  const archivePersonalStoryMutation = createMutation<PersonalStory, string>(
    async (id) => {
      return updatePersonalStory(id, { isArchived: true });
    },
    'archiving personal story',
    {
      successMessage: 'Personal story archived successfully',
      errorMessage: 'Failed to archive personal story'
    }
  );
  
  const archivePersonalStory = async (id: string): Promise<PersonalStory> => {
    return archivePersonalStoryMutation.mutateAsync(id);
  };

  return {
    archivePersonalStory,
    archivePersonalStoryMutation
  };
};
