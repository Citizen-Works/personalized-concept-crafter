
import { supabase } from '@/integrations/supabase/client';
import { WritingStyleProfile } from '@/types/writingStyle';

/**
 * Fetches the writing style profile for a user
 */
export async function fetchWritingStyleProfile(userId: string): Promise<WritingStyleProfile | null> {
  try {
    const { data, error } = await supabase
      .from('writing_style_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      user_id: data.user_id,
      userId: data.user_id,
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
  } catch (error) {
    console.error('Error fetching writing style profile:', error);
    return null;
  }
}

/**
 * Fetches custom prompt instructions for a user
 */
export async function fetchCustomPromptInstructions(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('writing_style_profiles')
      .select('custom_prompt_instructions')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.custom_prompt_instructions || null;
  } catch (error) {
    console.error('Error fetching custom prompt instructions:', error);
    return null;
  }
}
