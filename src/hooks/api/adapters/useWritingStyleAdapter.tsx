
import { useWritingStyleApi } from '../useWritingStyleApi';
import { WritingStyleProfile } from '@/types/writingStyle';

// Backward compatibility adapter for writing style API
export const useWritingStyleAdapter = () => {
  const {
    fetchWritingStyleProfile,
    fetchCustomPromptInstructions,
    createWritingStyleProfile,
    updateWritingStyleProfile,
    isLoading
  } = useWritingStyleApi();

  // Legacy function signatures for backward compatibility
  const getWritingStyleProfile = async (userId: string): Promise<WritingStyleProfile | null> => {
    try {
      // This ignores the userId parameter since the hook already uses the current user
      const result = await fetchWritingStyleProfile.refetch();
      return result.data || null;
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
          voiceAnalysis: profile.voiceAnalysis || profile.voice_analysis,
          generalStyleGuide: profile.generalStyleGuide || profile.general_style_guide,
          linkedinStyleGuide: profile.linkedinStyleGuide || profile.linkedin_style_guide,
          newsletterStyleGuide: profile.newsletterStyleGuide || profile.newsletter_style_guide,
          marketingStyleGuide: profile.marketingStyleGuide || profile.marketing_style_guide,
          vocabularyPatterns: profile.vocabularyPatterns || profile.vocabulary_patterns,
          avoidPatterns: profile.avoidPatterns || profile.avoid_patterns
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
    } catch (error) {
      console.error('Error in saveWritingStyleProfile:', error);
      throw error;
    }
  };

  const getCustomPromptInstructions = async (userId: string): Promise<string | null> => {
    try {
      // This ignores the userId parameter since the hook already uses the current user
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
