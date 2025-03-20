
/**
 * User-related type definitions
 */
export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessDescription: string;
  linkedinUrl: string;
  jobTitle: string;
  createdAt: Date;
}

export interface WritingStyleProfile {
  id: string;
  userId: string;
  
  // General writing style analysis
  voiceAnalysis: string;
  generalStyleGuide: string;
  exampleQuotes: string[];
  vocabularyPatterns: string;
  avoidPatterns: string;
  
  // Content-type specific style guides
  linkedinStyleGuide: string;
  linkedinExamples: string[];
  
  newsletterStyleGuide: string;
  newsletterExamples: string[];
  
  marketingStyleGuide: string;
  marketingExamples: string[];
  
  // Custom prompt instructions
  customPromptInstructions?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
