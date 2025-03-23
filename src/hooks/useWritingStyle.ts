import { useEffect } from 'react';
import { WritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/auth';
import { useWritingStyleApi } from './api/useWritingStyleApi';

/**
 * Hook for fetching and managing writing style profile
 */
export function useWritingStyle() {
  const { user } = useAuth();
  const { 
    fetchWritingStyleProfile, 
    fetchCustomPromptInstructions,
    isLoading 
  } = useWritingStyleApi();

  // Extract data from the query
  const profile = fetchWritingStyleProfile.data;
  const refetch = fetchWritingStyleProfile.refetch;
  
  useEffect(() => {
    // We let react-query handle the fetching with proper enabled state
  }, [user?.id]);

  return {
    profile: profile as WritingStyleProfile | null,
    isLoading,
    refetch,
  };
}
