/**
 * Types for transcript processing functionality
 */
import { ContentType } from '@/types/content';

export interface ContentIdea {
  title: string;
  description: string;
}

export interface IdeaResponse {
  message: string;
  ideas: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}
