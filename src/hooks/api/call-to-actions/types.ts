import { CallToAction } from '@/types';

export interface CallToActionCreateInput {
  text: string;
  description?: string | null;
  type: string;
  url?: string | null;
}

export interface CallToActionUpdateInput {
  text?: string;
  description?: string | null;
  type?: string;
  url?: string | null;
  isArchived?: boolean;
  usageCount?: number;
}

export interface CallToActionApiResponse {
  fetchCallToActions: () => Promise<CallToAction[]>;
  fetchCallToActionById: (id: string) => Promise<CallToAction | null>;
  createCallToAction: (cta: CallToActionCreateInput) => Promise<CallToAction>;
  updateCallToAction: (id: string, cta: CallToActionUpdateInput) => Promise<CallToAction>;
  archiveCallToAction: (id: string) => Promise<CallToAction>;
  incrementUsageCount: (id: string) => Promise<number>;
  isLoading: boolean;
}
