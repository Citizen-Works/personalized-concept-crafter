// import { Document } from './database';

/**
 * Document-related type definitions
 */
export type DocumentType = 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'transcript' | 'other';
export type DocumentPurpose = 'writing_sample' | 'business_context';
export type DocumentStatus = 'active' | 'archived';
export type DocumentContentType = 'linkedin' | 'newsletter' | 'marketing' | 'general' | null;
export type DocumentProcessingStatus = 'idle' | 'processing' | 'completed' | 'failed';

export interface DocumentFilterOptions {
  type?: DocumentType;
  purpose?: DocumentPurpose;
  status?: DocumentStatus;
  content_type?: DocumentContentType;
}

export interface DocumentCreateInput {
  title: string;
  content: string;
  type: DocumentType;
  purpose: DocumentPurpose;
  status: DocumentStatus;
  content_type: DocumentContentType;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: DocumentType;
  purpose: DocumentPurpose;
  status: DocumentStatus;
  content_type: DocumentContentType;
  createdAt: Date;
  isEncrypted?: boolean;
  processing_status?: DocumentProcessingStatus;
  has_ideas?: boolean;
  ideas_count?: number;
}

export interface ContentIdea {
  id?: string;
  title: string;
  description: string;
  user_id?: string;
  document_id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: Date;
}

export interface IdeaResponse {
  message: string;
  ideas: ContentIdea[];
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  data?: any;
  error?: Error;
}
