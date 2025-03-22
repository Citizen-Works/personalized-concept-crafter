
// Re-export all type definitions for easier imports

// Export the status.ts file first and use named exports to avoid conflicts
import { 
  ContentStatus,
  DraftStatus,
  DocumentStatus,
  DocumentProcessingStatus
} from './status';

// Re-export status types to avoid ambiguity
export {
  ContentStatus,
  DraftStatus,
  DocumentStatus,
  DocumentProcessingStatus,
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

// For user types, we need to handle the WritingStyleProfile ambiguity
// Export everything except WritingStyleProfile to avoid conflict
export {
  UserSettings,
  UserRole,
  BaseUser,
  UserProfile
} from './user';

export * from './writingStyle';
