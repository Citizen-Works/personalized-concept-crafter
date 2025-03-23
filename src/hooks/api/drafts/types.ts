
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
