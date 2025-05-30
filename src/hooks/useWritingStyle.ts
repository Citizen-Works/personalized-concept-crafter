import { useEffect, useState } from 'react';
import { WritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/auth';
import { useWritingStyleApi } from './api/useWritingStyleApi';
import { toast } from 'sonner';

/**
 * Hook for fetching and managing writing style profile
 */
export function useWritingStyle() {
  const { user } = useAuth();
  const { 
    fetchWritingStyleProfile, 
    fetchCustomPromptInstructions,
    createWritingStyleProfile,
    updateWritingStyleProfile,
    isLoading 
  } = useWritingStyleApi();

  // Extract data from the query
  const profile = fetchWritingStyleProfile.data;
  const refetch = fetchWritingStyleProfile.refetch;
  
  // For backward compatibility with tests
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // This is a no-op for now, but keeping it for test compatibility
    console.log('handleChange called with', e.target.name, e.target.value);
  };
  
  // For backward compatibility with tests
  const saveProfile = async () => {
    if (!profile) {
      toast.error('No profile to save');
      return;
    }
    
    try {
      if (profile.id) {
        await updateWritingStyleProfile(profile.id, {
          voiceAnalysis: profile.voiceAnalysis,
          generalStyleGuide: profile.generalStyleGuide,
          linkedinStyleGuide: profile.linkedinStyleGuide,
          newsletterStyleGuide: profile.newsletterStyleGuide,
          marketingStyleGuide: profile.marketingStyleGuide,
          vocabularyPatterns: profile.vocabularyPatterns,
          avoidPatterns: profile.avoidPatterns
        });
      } else {
        await createWritingStyleProfile({
          voiceAnalysis: profile.voiceAnalysis,
          generalStyleGuide: profile.generalStyleGuide,
          linkedinStyleGuide: profile.linkedinStyleGuide,
          newsletterStyleGuide: profile.newsletterStyleGuide,
          marketingStyleGuide: profile.marketingStyleGuide,
          vocabularyPatterns: profile.vocabularyPatterns,
          avoidPatterns: profile.avoidPatterns
        });
      }
      toast.success('Writing style profile saved successfully');
    } catch (error) {
      console.error('Error in saveProfile:', error);
      toast.error('Failed to save writing style profile');
    }
  };
  
  return {
    profile: profile as WritingStyleProfile | null,
    isLoading,
    refetch,
    // Add these for backward compatibility with tests
    handleChange,
    saveProfile
  };
}
