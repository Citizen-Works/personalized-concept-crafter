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
  displayOrder?: number;
  isArchived?: boolean;
  usageCount?: number;
}

export interface TargetAudience {
  id: string;
  userId: string;
  name: string;
  description: string;
  painPoints: string[];
  goals: string[];
  createdAt: Date;
  isArchived?: boolean;
  usageCount?: number;
}

export interface LinkedinPost {
  id: string;
  userId: string;
  content: string;
  publishedAt: Date;
  url: string;
  createdAt: Date;
  tag: string;
}

// Document Types
export type DocumentType = 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'transcript' | 'meeting_transcript' | 'other';
export type DocumentPurpose = 'writing_sample' | 'business_context';
export type DocumentStatus = 'active' | 'archived';
export type DocumentContentType = 'linkedin' | 'newsletter' | 'marketing' | 'general' | null;

export interface DocumentFilterOptions {
  type?: DocumentType;
  purpose?: DocumentPurpose;
  status?: DocumentStatus;
  content_type?: DocumentContentType;
}

export interface DocumentCreateInput {
  title: string;
  content: string;
  type: DocumentType;
  purpose: DocumentPurpose;
  status: DocumentStatus;
  content_type: DocumentContentType;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: DocumentType;
  purpose: DocumentPurpose;
  status: DocumentStatus;
  content_type: DocumentContentType;
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

// Content Types
export type ContentStatus = 'unreviewed' | 'approved' | 'drafted' | 'ready' | 'published' | 'archived';
export type ContentType = 'linkedin' | 'newsletter' | 'marketing';
export type ContentSource = 'meeting' | 'transcript' | 'manual' | 'other';
export type DraftStatus = 'draft' | 'ready' | 'published' | 'archived';

export interface ContentIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  notes: string;
  source: ContentSource | null;
  meetingTranscriptExcerpt: string | null;
  sourceUrl: string | null;
  status: ContentStatus;
  contentType: ContentType | null;
  createdAt: Date;
  contentPillarIds?: string[];  // Optional array of content pillar IDs
  targetAudienceIds?: string[]; // Optional array of target audience IDs
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

// Theme provider types
export type Attribute = 'class' | 'data-theme' | 'data-mode';

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  forcedTheme?: string;
  enableColorScheme?: boolean;
}

// Transcription types
export type TranscriptionStage = 'idle' | 'preparing' | 'uploading' | 'transcribing' | 'complete';

export interface TranscriptionProgressCallback {
  (progress: number, stage: TranscriptionStage): void;
}

// Marketing example types
export interface MarketingExample {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface ExampleInput {
  title: string;
  content: string;
}

// Call to Action types
export interface CallToAction {
  id: string;
  userId: string;
  text: string;
  description: string | null;
  type: string;
  url: string | null;
  usageCount: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Strategy types
export interface PillarAudienceLink {
  id: string;
  pillarId: string;
  audienceId: string;
  relationshipStrength: number;
  userId: string;
  createdAt: Date;
}

export interface PersonalStory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  contentPillarIds: string[];
  targetAudienceIds: string[];
  lesson: string;
  usageGuidance: string;
  usageCount: number;
  lastUsedDate: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryUsage {
  id: string;
  storyId: string;
  contentId: string;
  usageDate: Date;
  createdAt: Date;
}
