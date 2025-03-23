
import { PersonalStory } from '@/types';

export interface PersonalStoryCreateInput {
  title: string;
  content: string;
  lesson?: string;
  usageGuidance?: string;
  tags?: string[];
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
}

export interface PersonalStoryUpdateInput {
  title?: string;
  content?: string;
  lesson?: string;
  usageGuidance?: string;
  tags?: string[];
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
  isArchived?: boolean;
  usageCount?: number;
  lastUsedDate?: Date;
}

export interface PersonalStoryApiResponse {
  fetchPersonalStories: () => Promise<PersonalStory[]>;
  fetchPersonalStoryById: (id: string) => Promise<PersonalStory | null>;
  fetchPersonalStoriesByTag: (tag: string) => Promise<PersonalStory[]>;
  createPersonalStory: (story: PersonalStoryCreateInput) => Promise<PersonalStory>;
  updatePersonalStory: (id: string, story: PersonalStoryUpdateInput) => Promise<PersonalStory>;
  archivePersonalStory: (id: string) => Promise<PersonalStory>;
  incrementUsageCount: (id: string) => Promise<number>;
  isLoading: boolean;
}
