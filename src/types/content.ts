
/**
 * Content-related type definitions
 */
export type ContentSource = 'manual' | 'meeting' | 'transcript' | 'document' | 'external' | 'ai' | 'other';
export type ContentStatus = 'unreviewed' | 'approved' | 'rejected'; // Standard content idea statuses
export type ContentType = 'linkedin' | 'newsletter' | 'marketing' | 'social';
export type DraftStatus = 'draft' | 'ready' | 'published' | 'archived'; // Status for drafts

export interface ContentIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  notes: string; // Keep for additional context
  source: ContentSource;
  meetingTranscriptExcerpt?: string;
  sourceUrl?: string;
  status: ContentStatus; // Using standardized ContentStatus type
  hasBeenUsed: boolean; // Tracks if idea has been used for drafts
  createdAt: Date;
  contentPillarIds: string[];  // Array of content pillar IDs
  targetAudienceIds: string[]; // Array of target audience IDs
}

export interface ContentDraft {
  id: string;
  contentIdeaId: string;
  content: string;
  contentType: ContentType; // Added: specific to draft
  contentGoal?: string;     // Added: specific to draft
  version: number;
  feedback: string;
  status: DraftStatus;      // Updated: draft-specific statuses
  createdAt: Date;
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

// Renamed to ContentCallToAction to avoid conflict with strategy.ts CallToAction
export interface ContentCallToAction {
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
