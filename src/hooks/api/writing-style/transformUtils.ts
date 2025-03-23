
import { WritingStyleProfile } from '@/types/writingStyle';
import { WritingStyleDbRecord } from './types';

/**
 * Transforms a database record into a WritingStyleProfile
 */
export const transformToWritingStyleProfile = (record: WritingStyleDbRecord): WritingStyleProfile => {
  return {
    id: record.id,
    userId: record.user_id,
    user_id: record.user_id,
    voice_analysis: record.voice_analysis || '',
    voiceAnalysis: record.voice_analysis || '',
    general_style_guide: record.general_style_guide || '',
    generalStyleGuide: record.general_style_guide || '',
    linkedin_style_guide: record.linkedin_style_guide || '',
    linkedinStyleGuide: record.linkedin_style_guide || '',
    newsletter_style_guide: record.newsletter_style_guide || '',
    newsletterStyleGuide: record.newsletter_style_guide || '',
    marketing_style_guide: record.marketing_style_guide || '',
    marketingStyleGuide: record.marketing_style_guide || '',
    vocabulary_patterns: record.vocabulary_patterns || '',
    vocabularyPatterns: record.vocabulary_patterns || '',
    avoid_patterns: record.avoid_patterns || '',
    avoidPatterns: record.avoid_patterns || '',
    exampleQuotes: record.example_quotes || [],
    linkedinExamples: record.linkedin_examples || [],
    newsletterExamples: record.newsletter_examples || [],
    marketingExamples: record.marketing_examples || [],
    customPromptInstructions: record.custom_prompt_instructions || '',
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at)
  };
};

/**
 * Transform a WritingStyleProfile to database format
 */
export const transformToDbRecord = (profile: Partial<WritingStyleProfile>): Record<string, any> => {
  const record: Record<string, any> = {};
  
  if ('voiceAnalysis' in profile) record.voice_analysis = profile.voiceAnalysis;
  if ('generalStyleGuide' in profile) record.general_style_guide = profile.generalStyleGuide;
  if ('linkedinStyleGuide' in profile) record.linkedin_style_guide = profile.linkedinStyleGuide;
  if ('newsletterStyleGuide' in profile) record.newsletter_style_guide = profile.newsletterStyleGuide;
  if ('marketingStyleGuide' in profile) record.marketing_style_guide = profile.marketingStyleGuide;
  if ('vocabularyPatterns' in profile) record.vocabulary_patterns = profile.vocabularyPatterns;
  if ('avoidPatterns' in profile) record.avoid_patterns = profile.avoidPatterns;
  
  return record;
};
