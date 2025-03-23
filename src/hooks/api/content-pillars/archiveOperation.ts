
import { ContentPillar } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useUpdateContentPillar } from './updateOperation';

/**
 * Hook for archiving a content pillar (soft delete)
 */
export const useArchiveContentPillar = () => {
  const { createMutation } = useTanstackApiQuery('ContentPillarsApi');
  const { updateContentPillar } = useUpdateContentPillar();

  const archiveContentPillarMutation = createMutation<ContentPillar, string>(
    async (id) => {
      return updateContentPillar(id, { isArchived: true });
    },
    'archiving content pillar',
    {
      successMessage: 'Content pillar archived successfully',
      errorMessage: 'Failed to archive content pillar'
    }
  );
  
  const archiveContentPillar = async (id: string): Promise<ContentPillar> => {
    return archiveContentPillarMutation.mutateAsync(id);
  };

  return {
    archiveContentPillar,
    archiveContentPillarMutation
  };
};
