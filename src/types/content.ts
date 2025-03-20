
/**
 * Content-related type definitions
 */
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
