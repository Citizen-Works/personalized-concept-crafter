
import { WritingStyleProfile } from '@/types/writingStyle';
import { WritingStyleUpdateInput } from './types';
import { prepareApiRequest } from '@/utils/apiResponseUtils';

/**
 * Transform a WritingStyleProfile to a database record format
 */
export const transformToDbRecord = (data: WritingStyleUpdateInput): Record<string, any> => {
  const dbRecord: Record<string, any> = {};
  
  if (data.voiceAnalysis !== undefined) dbRecord.voice_analysis = data.voiceAnalysis;
  if (data.generalStyleGuide !== undefined) dbRecord.general_style_guide = data.generalStyleGuide;
  if (data.linkedinStyleGuide !== undefined) dbRecord.linkedin_style_guide = data.linkedinStyleGuide;
  if (data.newsletterStyleGuide !== undefined) dbRecord.newsletter_style_guide = data.newsletterStyleGuide;
  if (data.marketingStyleGuide !== undefined) dbRecord.marketing_style_guide = data.marketingStyleGuide;
  if (data.vocabularyPatterns !== undefined) dbRecord.vocabulary_patterns = data.vocabularyPatterns;
  if (data.avoidPatterns !== undefined) dbRecord.avoid_patterns = data.avoidPatterns;
  
  return dbRecord;
};

/**
 * Transform a database record to a WritingStyleProfile
 */
export const transformToWritingStyleProfile = (data: any): WritingStyleProfile => {
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
  };
};
