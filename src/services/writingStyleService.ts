
import { supabase } from "@/integrations/supabase/client";
import { WritingStyleProfile } from "@/types/writingStyle";

export const fetchWritingStyleProfile = async (userId: string): Promise<WritingStyleProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('writing_style_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (data) {
      return {
        id: data.id,
        userId: data.user_id,
        user_id: data.user_id,
        voice_analysis: data.voice_analysis || '',
        voiceAnalysis: data.voice_analysis || '',
        general_style_guide: data.general_style_guide || '',
        generalStyleGuide: data.general_style_guide || '',
        linkedin_style_guide: data.linkedin_style_guide || '',
        linkedinStyleGuide: data.linkedin_style_guide || '',
        newsletter_style_guide: data.newsletter_style_guide || '',
        newsletterStyleGuide: data.newsletter_style_guide || '',
        marketing_style_guide: data.marketing_style_guide || '',
        marketingStyleGuide: data.marketing_style_guide || '',
        vocabulary_patterns: data.vocabulary_patterns || '',
        vocabularyPatterns: data.vocabulary_patterns || '',
        avoid_patterns: data.avoid_patterns || '',
        avoidPatterns: data.avoid_patterns || '',
        exampleQuotes: data.example_quotes || [],
        linkedinExamples: data.linkedin_examples || [],
        newsletterExamples: data.newsletter_examples || [],
        marketingExamples: data.marketing_examples || [],
        customPromptInstructions: data.custom_prompt_instructions || '',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching writing style profile:', error);
    throw error;
  }
};

export const saveWritingStyleProfile = async (profile: WritingStyleProfile): Promise<void> => {
  try {
    if (profile.id) {
      const { error } = await supabase
        .from('writing_style_profiles')
        .update({
          voice_analysis: profile.voice_analysis,
          general_style_guide: profile.general_style_guide,
          linkedin_style_guide: profile.linkedin_style_guide,
          newsletter_style_guide: profile.newsletter_style_guide,
          marketing_style_guide: profile.marketing_style_guide,
          vocabulary_patterns: profile.vocabulary_patterns,
          avoid_patterns: profile.avoid_patterns,
        })
        .eq('id', profile.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('writing_style_profiles')
        .insert([{
          user_id: profile.user_id,
          voice_analysis: profile.voice_analysis,
          general_style_guide: profile.general_style_guide,
          linkedin_style_guide: profile.linkedin_style_guide,
          newsletter_style_guide: profile.newsletter_style_guide,
          marketing_style_guide: profile.marketing_style_guide,
          vocabulary_patterns: profile.vocabulary_patterns,
          avoid_patterns: profile.avoid_patterns,
        }]);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving writing style profile:', error);
    throw error;
  }
};
