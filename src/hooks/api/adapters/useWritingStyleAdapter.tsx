
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWritingStyleApi } from '../useWritingStyleApi';
import { WritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/auth';

// Backward compatibility adapter for writing style API
export const useWritingStyleAdapter = () => {
  const {
    fetchWritingStyleProfile,
    fetchCustomPromptInstructions,
    createWritingStyleProfile,
    updateWritingStyleProfile,
    isLoading
  } = useWritingStyleApi();
  
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  // Legacy function signatures for backward compatibility
  const getWritingStyleProfile = async (): Promise<WritingStyleProfile | null> => {
    try {
      if (!fetchWritingStyleProfile.data) {
        // If no data is cached yet, force a refetch
        const result = await fetchWritingStyleProfile.refetch();
        return result.data || null;
      }
      return fetchWritingStyleProfile.data;
    } catch (error) {
      console.error('Error in getWritingStyleProfile:', error);
      throw error;
    }
  };

  const saveWritingStyleProfile = async (profile: WritingStyleProfile): Promise<void> => {
    try {
      if (profile.id) {
        // Strip off any non-updateable fields
        const updateData = {
          voiceAnalysis: profile.voiceAnalysis || profile.voice_analysis || '',
          generalStyleGuide: profile.generalStyleGuide || profile.general_style_guide || '',
          linkedinStyleGuide: profile.linkedinStyleGuide || profile.linkedin_style_guide || '',
          newsletterStyleGuide: profile.newsletterStyleGuide || profile.newsletter_style_guide || '',
          marketingStyleGuide: profile.marketingStyleGuide || profile.marketing_style_guide || '',
          vocabularyPatterns: profile.vocabularyPatterns || profile.vocabulary_patterns || '',
          avoidPatterns: profile.avoidPatterns || profile.avoid_patterns || ''
        };
        
        await updateWritingStyleProfile(profile.id, updateData);
      } else {
        await createWritingStyleProfile({
          voiceAnalysis: profile.voiceAnalysis || profile.voice_analysis || '',
          generalStyleGuide: profile.generalStyleGuide || profile.general_style_guide || '',
          linkedinStyleGuide: profile.linkedinStyleGuide || profile.linkedin_style_guide || '',
          newsletterStyleGuide: profile.newsletterStyleGuide || profile.newsletter_style_guide || '',
          marketingStyleGuide: profile.marketingStyleGuide || profile.marketing_style_guide || '',
          vocabularyPatterns: profile.vocabularyPatterns || profile.vocabulary_patterns || '',
          avoidPatterns: profile.avoidPatterns || profile.avoid_patterns || ''
        });
      }
      
      // Invalidate queries after mutation
      queryClient.invalidateQueries({ queryKey: ['writingStyleProfile', userId] });
    } catch (error) {
      console.error('Error in saveWritingStyleProfile:', error);
      throw error;
    }
  };

  const getCustomPromptInstructions = async (): Promise<string | null> => {
    try {
      const result = await fetchCustomPromptInstructions.refetch();
      return result.data || null;
    } catch (error) {
      console.error('Error in getCustomPromptInstructions:', error);
      throw error;
    }
  };

  return {
    fetchWritingStyleProfile: getWritingStyleProfile,
    saveWritingStyleProfile,
    fetchCustomPromptInstructions: getCustomPromptInstructions,
    isLoading
  };
};
