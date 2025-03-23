
import { Document } from '@/types';

export interface MarketingExampleCreateInput {
  title: string;
  content: string;
}

export interface MarketingExampleUpdateInput {
  title?: string;
  content?: string;
}

export interface MarketingExampleApiResponse {
  fetchMarketingExamples: () => Promise<Document[]>;
  fetchMarketingExampleById: (id: string) => Promise<Document | null>;
  createMarketingExample: (example: MarketingExampleCreateInput) => Promise<Document>;
  updateMarketingExample: (id: string, example: MarketingExampleUpdateInput) => Promise<Document>;
  deleteMarketingExample: (id: string) => Promise<void>;
  isLoading: boolean;
}
