
export interface WritingStyleDbRecord {
  id: string;
  user_id: string;
  voice_analysis: string;
  general_style_guide: string;
  linkedin_style_guide: string;
  newsletter_style_guide: string;
  marketing_style_guide: string;
  vocabulary_patterns: string;
  avoid_patterns: string;
  example_quotes?: string[];
  linkedin_examples?: string[];
  newsletter_examples?: string[];
  marketing_examples?: string[];
  custom_prompt_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface WritingStyleCreateInput {
  voiceAnalysis: string;
  generalStyleGuide: string;
  linkedinStyleGuide: string;
  newsletterStyleGuide: string;
  marketingStyleGuide: string;
  vocabularyPatterns: string;
  avoidPatterns: string;
}

export interface WritingStyleUpdateInput {
  voiceAnalysis?: string;
  generalStyleGuide?: string;
  linkedinStyleGuide?: string;
  newsletterStyleGuide?: string;
  marketingStyleGuide?: string;
  vocabularyPatterns?: string;
  avoidPatterns?: string;
}
