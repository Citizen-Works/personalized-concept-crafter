
export type WritingStyleProfile = {
  id?: string;
  userId?: string;
  user_id: string;
  
  // Map from snake_case DB fields to camelCase for frontend use
  voice_analysis: string;
  voiceAnalysis?: string;
  
  general_style_guide: string;
  generalStyleGuide?: string;
  
  linkedin_style_guide: string;
  linkedinStyleGuide?: string;
  
  newsletter_style_guide: string;
  newsletterStyleGuide?: string;
  
  marketing_style_guide: string;
  marketingStyleGuide?: string;
  
  vocabulary_patterns: string;
  vocabularyPatterns?: string;
  
  avoid_patterns: string;
  avoidPatterns?: string;
  
  // Arrays for examples
  exampleQuotes?: string[];
  linkedinExamples?: string[];
  newsletterExamples?: string[];
  marketingExamples?: string[];
  
  // Additional properties
  customPromptInstructions?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
