
export interface PersonalStoryCreateInput {
  title: string;
  content: string;
  tags?: string[];
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
  lesson?: string;
  usageGuidance?: string;
}

export interface PersonalStoryUpdateInput {
  title?: string;
  content?: string;
  tags?: string[];
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
  lesson?: string;
  usageGuidance?: string;
  usageCount?: number;
  isArchived?: boolean;
}
