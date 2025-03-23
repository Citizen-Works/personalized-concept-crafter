
export interface DocumentCreateInput {
  title: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: Record<string, any>;
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
}
