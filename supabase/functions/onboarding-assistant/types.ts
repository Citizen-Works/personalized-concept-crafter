
// Type definitions for the onboarding assistant

export type UserProfile = {
  name?: string;
  businessName?: string;
  businessDescription?: string;
  jobTitle?: string;
  linkedinUrl?: string;
};

export type ContentPillar = {
  name: string;
  description: string;
};

export type TargetAudience = {
  name: string;
  description: string;
  painPoints: string[];
  goals: string[];
};

export type WritingStyleProfile = {
  voiceAnalysis: string;
  generalStyleGuide: string;
  linkedinStyleGuide: string;
  newsletterStyleGuide: string;
  marketingStyleGuide: string;
  vocabularyPatterns: string;
  avoidPatterns: string;
};

export type ProfileData = {
  userProfile: UserProfile;
  contentPillars: ContentPillar[];
  targetAudiences: TargetAudience[];
  writingStyle: WritingStyleProfile;
};

export type ChatMessage = {
  role: string;
  content: string;
};

export type RequestData = {
  messages: ChatMessage[];
  userId: string;
  existingProfileData?: ProfileData;
  extractProfile: boolean;
};

export type ClaudeResponse = {
  content: Array<{
    text: string;
    type: string;
  }>;
};
