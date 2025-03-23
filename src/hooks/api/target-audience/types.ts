
export interface TargetAudienceCreateInput {
  name: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
}

export interface TargetAudienceUpdateInput {
  name?: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
  isArchived?: boolean;
  usageCount?: number;
}
