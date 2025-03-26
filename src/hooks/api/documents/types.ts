export interface DocumentCreateInput {
  title: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  fileSize?: number;
  type: string; // Required by the database schema
  purpose?: string;
  contentType?: string;
  status?: string;
}

export interface DocumentUpdateInput {
  title?: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: Record<string, any>;
  isArchived?: boolean;
  type?: string;
  purpose?: string;
  contentType?: string;
  status?: string;
}
