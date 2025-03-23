
import { WritingStyleProfile } from '@/types/writingStyle';
import { useAuth } from '@/context/auth';
import { useTanstackApiQuery } from '../useTanstackApiQuery';
import { supabase } from '@/integrations/supabase/client';
import { transformToDbRecord } from './transformUtils';
import { WritingStyleCreateInput, WritingStyleUpdateInput } from './types';

/**
 * Hook for writing style mutation operations
 */
export const useWritingStyleMutations = () => {
  const { user } = useAuth();
  const { createMutation, invalidateQueries } = useTanstackApiQuery('WritingStyleAPI');

  /**
   * Create a new writing style profile
   */
  const createProfileMutation = createMutation<WritingStyleProfile, WritingStyleCreateInput>(
    async (input) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const profileData = {
        user_id: user.id,
        voice_analysis: input.voiceAnalysis,
        general_style_guide: input.generalStyleGuide,
        linkedin_style_guide: input.linkedinStyleGuide,
        newsletter_style_guide: input.newsletterStyleGuide,
        marketing_style_guide: input.marketingStyleGuide,
        vocabulary_patterns: input.vocabularyPatterns,
        avoid_patterns: input.avoidPatterns,
      };
      
      const { data, error } = await supabase
        .from('writing_style_profiles')
        .insert([profileData])
        .select('*')
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        user_id: data.user_id,
        voiceAnalysis: data.voice_analysis || '',
        voice_analysis: data.voice_analysis || '',
        generalStyleGuide: data.general_style_guide || '',
        general_style_guide: data.general_style_guide || '',
        linkedinStyleGuide: data.linkedin_style_guide || '',
        linkedin_style_guide: data.linkedin_style_guide || '',
        newsletterStyleGuide: data.newsletter_style_guide || '',
        newsletter_style_guide: data.newsletter_style_guide || '',
        marketingStyleGuide: data.marketing_style_guide || '',
        marketing_style_guide: data.marketing_style_guide || '',
        vocabularyPatterns: data.vocabulary_patterns || '',
        vocabulary_patterns: data.vocabulary_patterns || '',
        avoidPatterns: data.avoid_patterns || '',
        avoid_patterns: data.avoid_patterns || '',
        exampleQuotes: data.example_quotes || [],
        linkedinExamples: data.linkedin_examples || [],
        newsletterExamples: data.newsletter_examples || [],
        marketingExamples: data.marketing_examples || [],
        customPromptInstructions: data.custom_prompt_instructions || '',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as WritingStyleProfile;
    },
    'creating writing style profile',
    {
      successMessage: 'Writing style profile created successfully',
      errorMessage: 'Failed to create writing style profile',
      onSuccess: () => {
        invalidateQueries(['writing-style', user?.id]);
      }
    }
  );

  /**
   * Update an existing writing style profile
   */
  const updateProfileMutation = createMutation<WritingStyleProfile, { id: string; data: WritingStyleUpdateInput }>(
    async ({ id, data }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const profileData = transformToDbRecord(data);
      
      const { data: updatedData, error } = await supabase
        .from('writing_style_profiles')
        .update(profileData)
        .eq('id', id)
        .eq('user_id', user.id) // Security check
        .select('*')
        .single();
      
      if (error) throw error;
      
      return {
        id: updatedData.id,
        userId: updatedData.user_id,
        user_id: updatedData.user_id,
        voiceAnalysis: updatedData.voice_analysis || '',
        voice_analysis: updatedData.voice_analysis || '',
        generalStyleGuide: updatedData.general_style_guide || '',
        general_style_guide: updatedData.general_style_guide || '',
        linkedinStyleGuide: updatedData.linkedin_style_guide || '',
        linkedin_style_guide: updatedData.linkedin_style_guide || '',
        newsletterStyleGuide: updatedData.newsletter_style_guide || '',
        newsletter_style_guide: updatedData.newsletter_style_guide || '',
        marketingStyleGuide: updatedData.marketing_style_guide || '',
        marketing_style_guide: updatedData.marketing_style_guide || '',
        vocabularyPatterns: updatedData.vocabulary_patterns || '',
        vocabulary_patterns: updatedData.vocabulary_patterns || '',
        avoidPatterns: updatedData.avoid_patterns || '',
        avoid_patterns: updatedData.avoid_patterns || '',
        exampleQuotes: updatedData.example_quotes || [],
        linkedinExamples: updatedData.linkedin_examples || [],
        newsletterExamples: updatedData.newsletter_examples || [],
        marketingExamples: updatedData.marketing_examples || [],
        customPromptInstructions: updatedData.custom_prompt_instructions || '',
        createdAt: new Date(updatedData.created_at),
        updatedAt: new Date(updatedData.updated_at)
      } as WritingStyleProfile;
    },
    'updating writing style profile',
    {
      successMessage: 'Writing style profile updated successfully',
      errorMessage: 'Failed to update writing style profile',
      onSuccess: () => {
        invalidateQueries(['writing-style', user?.id]);
      }
    }
  );

  const createWritingStyleProfile = async (input: WritingStyleCreateInput): Promise<WritingStyleProfile> => {
    return createProfileMutation.mutateAsync(input);
  };

  const updateWritingStyleProfile = async (id: string, data: WritingStyleUpdateInput): Promise<WritingStyleProfile> => {
    return updateProfileMutation.mutateAsync({ id, data });
  };

  return {
    createWritingStyleProfile,
    updateWritingStyleProfile,
    isLoading: createProfileMutation.isPending || updateProfileMutation.isPending
  };
};
