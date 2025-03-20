
/**
 * Document-related type definitions
 */
export type DocumentType = 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'transcript' | 'meeting_transcript' | 'other';
export type DocumentPurpose = 'writing_sample' | 'business_context';
export type DocumentStatus = 'active' | 'archived';
export type DocumentContentType = 'linkedin' | 'newsletter' | 'marketing' | 'general' | null;

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
}
