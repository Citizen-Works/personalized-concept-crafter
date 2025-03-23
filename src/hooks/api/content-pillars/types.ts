
export interface ContentPillarCreateInput {
  name: string;
  description?: string;
  displayOrder?: number;
}

export interface ContentPillarUpdateInput {
  name?: string;
  description?: string;
  displayOrder?: number;
  isArchived?: boolean;
  usageCount?: number;
}
