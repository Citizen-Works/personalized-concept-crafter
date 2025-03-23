
import { TargetAudience } from '@/types';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { transformToTargetAudience } from './transformUtils';

/**
 * Hook for archiving a target audience
 */
export const useArchiveTargetAudience = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('TargetAudienceApi');

  const archiveTargetAudienceMutation = createMutation<TargetAudience, string>(
    async (id) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("target_audiences")
        .update({ is_archived: true })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return transformToTargetAudience(data);
    },
    'archiving target audience',
    {
      successMessage: 'Target audience archived',
      errorMessage: 'Failed to archive target audience',
      onSuccess: (_, id) => {
        invalidateQueries(['targetAudiences', user?.id]);
        invalidateQueries(['targetAudience', id]);
      }
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
