
import { WritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToWritingStyleProfile } from './transformUtils';
import { WritingStyleDbRecord } from './types';

/**
 * Hook for fetching writing style operations
 */
export const useFetchWritingStyle = () => {
  const { user } = useAuth();
  const { createQuery } = useTanstackApiQuery('WritingStyleAPI');
  
  /**
   * Fetch the user's writing style profile
   */
  const fetchWritingStyleProfile = createQuery<WritingStyleProfile, Error>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('writing_style_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (!data) return null;
      
      return transformToWritingStyleProfile(data as WritingStyleDbRecord);
    },
    'fetching writing style profile',
    {
      queryKey: ['writing-style', user?.id],
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  /**
   * Fetch custom prompt instructions for a user
   */
  const fetchCustomPromptInstructions = createQuery<string | null, Error>(
    async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('writing_style_profiles')
        .select('custom_prompt_instructions')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data?.custom_prompt_instructions || null;
    },
    'fetching custom prompt instructions',
    {
      queryKey: ['writing-style', 'custom-instructions', user?.id],
      enabled: !!user?.id,
    }
  );
  
  return {
    fetchWritingStyleProfile,
    fetchCustomPromptInstructions,
    isLoading: fetchWritingStyleProfile.isPending
  };
};
