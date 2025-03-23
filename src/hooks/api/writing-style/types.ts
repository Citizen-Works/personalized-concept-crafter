
import { WritingStyleProfile } from '@/types/writingStyle';

export interface WritingStyleCreateInput {
  voiceAnalysis: string;
  generalStyleGuide: string;
  linkedinStyleGuide: string;
  newsletterStyleGuide: string;
  marketingStyleGuide: string;
  vocabularyPatterns: string;
  avoidPatterns: string;
}

export interface WritingStyleUpdateInput extends Partial<WritingStyleCreateInput> {}

export interface WritingStyleDbRecord {
  id: string;
  user_id: string;
  voice_analysis: string | null;
  general_style_guide: string | null;
  linkedin_style_guide: string | null;
  newsletter_style_guide: string | null;
  marketing_style_guide: string | null;
  vocabulary_patterns: string | null;
  avoid_patterns: string | null;
  example_quotes: string[] | null;
  linkedin_examples: string[] | null;
  newsletter_examples: string[] | null;
  marketing_examples: string[] | null;
  custom_prompt_instructions: string | null;
  created_at: string;
  updated_at: string;
}
