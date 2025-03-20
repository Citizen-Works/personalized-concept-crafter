
import { ContentPillar, TargetAudience } from "@/types";

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

export interface PillarAudienceLink {
  id: string;
  pillarId: string;
  audienceId: string;
  relationshipStrength: number;
  userId: string;
  createdAt: Date;
}

export interface EnhancedContentPillar extends ContentPillar {
  displayOrder: number;
  isArchived: boolean;
  usageCount: number;
}

export interface EnhancedTargetAudience extends TargetAudience {
  isArchived: boolean;
  usageCount: number;
}

export interface StrategyStats {
  pillarsCount: number;
  audiencesCount: number;
  ctasCount: number;
  writingStyleCompletion: number;
  overallCompletion: number;
}
