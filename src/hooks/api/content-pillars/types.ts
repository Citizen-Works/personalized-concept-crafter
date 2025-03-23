
import { ContentPillar } from '@/types';

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
}

export interface ContentPillarApiResponse {
  fetchContentPillars: () => Promise<ContentPillar[]>;
  fetchContentPillarById: (id: string) => Promise<ContentPillar | null>;
  createContentPillar: (pillar: ContentPillarCreateInput) => Promise<ContentPillar>;
  updateContentPillar: (id: string, pillar: ContentPillarUpdateInput) => Promise<ContentPillar>;
  archiveContentPillar: (id: string) => Promise<ContentPillar>;
  selectedPillar: ContentPillar | null;
  setSelectedPillar: (pillar: ContentPillar | null) => void;
  isLoading: boolean;
}
