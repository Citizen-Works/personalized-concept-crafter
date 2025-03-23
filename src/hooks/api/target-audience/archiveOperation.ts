
import { TargetAudience } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useUpdateTargetAudience } from './updateOperation';

/**
 * Hook for archiving a target audience (soft delete)
 */
export const useArchiveTargetAudience = () => {
  const { createMutation } = useTanstackApiQuery('TargetAudienceApi');
  const { updateTargetAudience } = useUpdateTargetAudience();

  const archiveTargetAudienceMutation = createMutation<TargetAudience, string>(
    async (id) => {
      return updateTargetAudience(id, { isArchived: true });
    },
    'archiving target audience',
    {
      successMessage: 'Target audience archived successfully',
      errorMessage: 'Failed to archive target audience'
    }
  );
  
  const archiveTargetAudience = async (id: string): Promise<TargetAudience> => {
    return archiveTargetAudienceMutation.mutateAsync(id);
  };

  return {
    archiveTargetAudience,
    archiveTargetAudienceMutation
  };
};
