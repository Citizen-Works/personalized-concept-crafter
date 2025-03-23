
import { Document } from '@/types';

export interface NewsletterExampleCreateInput {
  title: string;
  content: string;
}

export interface NewsletterExampleUpdateInput {
  title?: string;
  content?: string;
}

export interface NewsletterExampleApiResponse {
  fetchNewsletterExamples: () => Promise<Document[]>;
  fetchNewsletterExampleById: (id: string) => Promise<Document | null>;
  createNewsletterExample: (example: NewsletterExampleCreateInput) => Promise<Document>;
  updateNewsletterExample: (id: string, example: NewsletterExampleUpdateInput) => Promise<Document>;
  deleteNewsletterExample: (id: string) => Promise<void>;
  isLoading: boolean;
}
