
import { PersonalStory } from '@/types';

export interface PersonalStoryCreateInput {
  title: string;
  content: string;
  tags: string[];
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
}

export interface PersonalStoryUpdateInput {
  title?: string;
  content?: string;
  tags?: string[];
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
  isArchived?: boolean;
}

export interface PersonalStoryApiResponse {
  fetchPersonalStories: () => Promise<PersonalStory[]>;
  fetchPersonalStoryById: (id: string) => Promise<PersonalStory | null>;
  fetchPersonalStoriesByTag: (tag: string) => Promise<PersonalStory[]>;
  createPersonalStory: (personalStory: PersonalStoryCreateInput) => Promise<PersonalStory>;
  updatePersonalStory: (id: string, personalStory: PersonalStoryUpdateInput) => Promise<PersonalStory>;
  archivePersonalStory: (id: string) => Promise<PersonalStory>;
  incrementUsageCount: (id: string) => Promise<PersonalStory>;
  isLoading: boolean;
}
