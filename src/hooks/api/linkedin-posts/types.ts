
import { LinkedinPost } from '@/types';

export interface LinkedinPostCreateInput {
  content: string;
  url?: string | null;
  tag?: string;
}

export interface LinkedinPostUpdateInput {
  content?: string;
  url?: string | null;
  tag?: string;
  publishedAt?: Date;
}

export interface LinkedinPostApiResponse {
  fetchLinkedinPosts: () => Promise<LinkedinPost[]>;
  fetchLinkedinPostById: (id: string) => Promise<LinkedinPost | null>;
  createLinkedinPost: (post: LinkedinPostCreateInput) => Promise<LinkedinPost>;
  updateLinkedinPost: (id: string, post: LinkedinPostUpdateInput) => Promise<LinkedinPost>;
  deleteLinkedinPost: (id: string) => Promise<void>;
  isLoading: boolean;
}
