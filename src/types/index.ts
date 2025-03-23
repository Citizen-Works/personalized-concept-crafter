
// Re-export all type definitions for easier imports

// Import types from status.ts to avoid naming conflicts
import { 
  ContentStatus,
  DraftStatus,
  DocumentStatus,
  DocumentProcessingStatus,
  getContentStatusProps,
  getDraftStatusProps,
  getContentStatusClasses,
  getDraftStatusClasses,
} from './status';

// Import status validation functions
import {
  isValidContentStatusTransition,
  isValidDraftStatusTransition
} from '@/utils/statusValidation';

// Re-export status types
export type { ContentStatus, DraftStatus, DocumentStatus, DocumentProcessingStatus };

// Export status utility functions
export {
  getContentStatusProps,
  getDraftStatusProps,
  getContentStatusClasses,
  getDraftStatusClasses,
  isValidContentStatusTransition,
  isValidDraftStatusTransition
};

// Then export all other type files 
export * from './content';
export * from './documents';
export * from './strategy';
export * from './ui';
export * from './analytics'; // Add export for analytics types

// Import and re-export User interface directly to avoid conflicts
export type { User } from './user';

// Export user sub-types directly to avoid naming conflicts
// The WritingStyleProfile from user.ts will not be exported to avoid conflict
export type { WritingStyleProfile } from './writingStyle';
