
// Re-export all type definitions for easier imports

// Export the status.ts file first and use named exports to avoid conflicts
import { 
  ContentStatus as StatusContentStatus,
  DraftStatus as StatusDraftStatus,
  DocumentStatus as StatusDocumentStatus,
  DocumentProcessingStatus as StatusDocumentProcessingStatus
} from './status';

// Export renamed status types to avoid ambiguity
export {
  StatusContentStatus as ContentStatus,
  StatusDraftStatus as DraftStatus,
  StatusDocumentStatus as DocumentStatus,
  StatusDocumentProcessingStatus as DocumentProcessingStatus,
  // Export other items from status
  getContentStatusProps,
  getDraftStatusProps,
  getContentStatusClasses,
  getDraftStatusClasses,
  isValidContentStatusTransition,
  isValidDraftStatusTransition
} from './status';

// Then export all other type files 
export * from './content';
export * from './documents';
export * from './strategy';
export * from './ui';
export * from './user';
export * from './writingStyle';
