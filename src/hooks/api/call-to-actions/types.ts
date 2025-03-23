
import { CallToAction } from '@/types';

export interface CallToActionCreateInput {
  text: string;
  type: string;
  description?: string;
  url?: string;
}

export interface CallToActionUpdateInput {
  text?: string;
  type?: string;
  description?: string;
  url?: string;
  isArchived?: boolean;
}

export interface CallToActionApiResponse {
  fetchCallToActions: () => Promise<CallToAction[]>;
  fetchCallToActionById: (id: string) => Promise<CallToAction | null>;
  createCallToAction: (cta: CallToActionCreateInput) => Promise<CallToAction>;
  updateCallToAction: (id: string, cta: CallToActionUpdateInput) => Promise<CallToAction>;
  archiveCallToAction: (id: string) => Promise<CallToAction>;
  incrementUsageCount: (id: string) => Promise<CallToAction>;
  selectedCallToAction: CallToAction | null;
  setSelectedCallToAction: (cta: CallToAction | null) => void;
  isLoading: boolean;
}
