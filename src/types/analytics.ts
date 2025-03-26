/**
 * Analytics-related type definitions
 */

// Content status count statistics
export interface ContentStatusCounts {
  needsReview: number;
  approvedIdeas: number;
  inProgress: number;
  readyToPublish: number;
  published: number;
  archived: number;
  rejectedIdeas: number;
}

// Weekly stats for charting
export interface WeeklyStats {
  date: string;
  ideas: number;
  drafts: number;
  published: number;
}

// Activity feed item
export interface ActivityFeedItem {
  id: string;
  type: 'idea' | 'draft' | 'published' | 'profile';
  action: 'created' | 'updated' | 'published';
  title: string;
  timestamp: Date;
  entityId: string;
  route?: string;
}
