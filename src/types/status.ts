
/**
 * Centralized status types and utilities
 */

// Content Idea Status
export type ContentStatus = 'unreviewed' | 'approved' | 'rejected';

// Draft Status
export type DraftStatus = 'draft' | 'ready' | 'published' | 'archived';

// Document Status
export type DocumentStatus = 'active' | 'archived';

// Document Processing Status
export type DocumentProcessingStatus = 'idle' | 'processing' | 'completed' | 'failed';

/**
 * Status display utilities
 */

// Get display properties for ContentStatus
export const getContentStatusProps = (status: ContentStatus): { 
  label: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
} => {
  switch (status) {
    case 'unreviewed':
      return {
        label: 'Needs Review',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    case 'approved':
      return {
        label: 'Approved',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    case 'rejected':
      return {
        label: 'Rejected',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
  }
};

// Get display properties for DraftStatus
export const getDraftStatusProps = (status: DraftStatus): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} => {
  switch (status) {
    case 'draft':
      return {
        label: 'In Progress',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    case 'ready':
      return {
        label: 'Ready to Publish',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    case 'published':
      return {
        label: 'Published',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    case 'archived':
      return {
        label: 'Archived',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
  }
};

// Get CSS classes for ContentStatus
export const getContentStatusClasses = (status: ContentStatus): string => {
  const props = getContentStatusProps(status);
  return `${props.bgColor} ${props.color} ${props.borderColor} dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800`;
};

// Get CSS classes for DraftStatus
export const getDraftStatusClasses = (status: DraftStatus): string => {
  const props = getDraftStatusProps(status);
  return `${props.bgColor} ${props.color} ${props.borderColor}`;
};

// Valid status transitions for ContentStatus
export const isValidContentStatusTransition = (current: ContentStatus, next: ContentStatus): boolean => {
  // Unreviewed can become approved or rejected
  if (current === 'unreviewed') {
    return next === 'approved' || next === 'rejected';
  }
  
  // Approved can become rejected
  if (current === 'approved') {
    return next === 'rejected';
  }
  
  // Rejected can become approved
  if (current === 'rejected') {
    return next === 'approved';
  }
  
  return false;
};

// Valid status transitions for DraftStatus
export const isValidDraftStatusTransition = (current: DraftStatus, next: DraftStatus): boolean => {
  // Draft can become ready or archived
  if (current === 'draft') {
    return next === 'ready' || next === 'archived';
  }
  
  // Ready can become published or archived or back to draft
  if (current === 'ready') {
    return next === 'published' || next === 'archived' || next === 'draft';
  }
  
  // Published can become archived
  if (current === 'published') {
    return next === 'archived';
  }
  
  // Archived can be restored to draft
  if (current === 'archived') {
    return next === 'draft';
  }
  
  return false;
};
