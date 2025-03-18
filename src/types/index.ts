
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

export interface ContentPillar {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface TargetAudience {
  id: string;
  userId: string;
  name: string;
  description: string;
  painPoints: string[];
  goals: string[];
  createdAt: Date;
}

export interface LinkedinPost {
  id: string;
  userId: string;
  content: string;
  publishedAt: Date;
  url: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'other';
  purpose: 'writing_sample' | 'business_context';
  status: 'active' | 'archived';
  content_type: 'linkedin' | 'newsletter' | 'marketing' | 'general' | null;
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

export type ContentStatus = 'unreviewed' | 'approved' | 'drafted' | 'ready' | 'published';
export type ContentType = 'linkedin' | 'newsletter' | 'marketing';
export type ContentSource = 'meeting' | 'manual' | 'other';
export type DraftStatus = 'draft' | 'published' | 'archived';

export interface ContentIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  notes: string;
  source: ContentSource;
  meetingTranscriptExcerpt: string | null;
  sourceUrl: string | null;
  status: ContentStatus;
  contentType: ContentType;
  createdAt: Date;
}

export interface ContentDraft {
  id: string;
  contentIdeaId: string;
  content: string;
  version: number;
  feedback: string;
  createdAt: Date;
  status?: DraftStatus;
}
