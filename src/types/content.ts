
/**
 * Content-related type definitions
 */
export type ContentSource = 'manual' | 'meeting' | 'transcript' | 'ai' | 'other';
export type ContentStatus = 'draft' | 'unreviewed' | 'approved' | 'archived' | 'published' | 'rejected' | 'drafted' | 'ready';
export type ContentType = 'blog' | 'newsletter' | 'social' | 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'marketing';
export type DraftStatus = 'draft' | 'ready' | 'published' | 'archived';

export interface ContentIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  notes: string;
  source: ContentSource;
  meetingTranscriptExcerpt?: string;
  sourceUrl?: string;
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
