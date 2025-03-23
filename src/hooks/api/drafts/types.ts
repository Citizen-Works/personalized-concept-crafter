
import { ContentType, DraftStatus } from '@/types';

export interface DraftCreateInput {
  contentIdeaId: string;
  content: string;
  contentType?: ContentType;
  contentGoal?: string;
  version: number;
  feedback?: string;
  status: DraftStatus;
}

export interface DraftUpdateInput {
  content?: string;
  contentType?: ContentType;
  contentGoal?: string;
  version?: number;
  feedback?: string;
  status?: DraftStatus;
}

// Add this type to our drafts types file for better organization
export interface DraftWithIdea {
  id: string;
  contentIdeaId: string;
  ideaTitle: string;
  content: string;
  contentType: ContentType;
  contentGoal?: string;
  version: number;
  feedback: string;
  status: DraftStatus;
  createdAt: Date;
}
