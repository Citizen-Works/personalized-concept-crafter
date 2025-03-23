
import { Document, DocumentType, DocumentPurpose } from '@/types';

export interface TranscriptCreateInput {
  title: string;
  content: string;
  type: DocumentType;
  purpose?: DocumentPurpose;
  isEncrypted?: boolean;
}

export interface TranscriptUpdateInput {
  title?: string;
  content?: string;
  type?: DocumentType;
  purpose?: DocumentPurpose;
  isEncrypted?: boolean;
}

export interface TranscriptFilterOptions {
  type?: DocumentType | DocumentType[];
  purpose?: DocumentPurpose;
}

export interface TranscriptProcessingResult {
  message: string;
  ideas: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}
