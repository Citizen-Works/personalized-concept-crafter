
/**
 * Strategy-related type definitions
 */
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
