
import { TargetAudience } from '@/types';

/**
 * Type for creating a new target audience
 */
export interface TargetAudienceCreateInput {
  name: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
}

/**
 * Type for updating a target audience
 */
export interface TargetAudienceUpdateInput {
  name?: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
  isArchived?: boolean;
}

/**
 * Response from target audience API
 */
export interface TargetAudienceApiResponse {
  fetchTargetAudiences: (userId: string) => Promise<TargetAudience[]>;
  fetchTargetAudienceById: (id: string, userId: string) => Promise<TargetAudience | null>;
  createTargetAudience: (input: TargetAudienceCreateInput, userId: string) => Promise<TargetAudience | null>;
  updateTargetAudience: (id: string, updates: TargetAudienceUpdateInput, userId: string) => Promise<TargetAudience | null>;
  archiveTargetAudience: (id: string, userId: string) => Promise<boolean>;
  selectedAudience: TargetAudience | null;
  setSelectedAudience: (audience: TargetAudience | null) => void;
  isLoading: boolean;
}
