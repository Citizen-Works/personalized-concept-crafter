
import { CallToAction } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useUpdateCallToAction } from './updateOperation';

/**
 * Hook for archiving a call to action (soft delete)
 */
export const useArchiveCallToAction = () => {
  const { createMutation } = useTanstackApiQuery('CallToActionsApi');
  const { updateCallToAction } = useUpdateCallToAction();

  const archiveCallToActionMutation = createMutation<CallToAction, string>(
    async (id) => {
      return updateCallToAction(id, { isArchived: true });
    },
    'archiving call to action',
    {
      successMessage: 'Call to action archived successfully',
      errorMessage: 'Failed to archive call to action'
    }
  );
  
  const archiveCallToAction = async (id: string): Promise<CallToAction> => {
    return archiveCallToActionMutation.mutateAsync(id);
  };

  return {
    archiveCallToAction,
    archiveCallToActionMutation
  };
};
