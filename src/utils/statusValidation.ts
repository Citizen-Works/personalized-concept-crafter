
import { 
  ContentStatus, 
  DraftStatus,
  isValidContentStatusTransition,
  isValidDraftStatusTransition
} from '@/types/status';

/**
 * Validates a content status value against allowed status values
 * @param status The status to validate
 * @returns Whether the status is valid
 */
export const validateContentStatus = (status: string): boolean => {
  const validStatuses: ContentStatus[] = ['unreviewed', 'approved', 'rejected'];
  return validStatuses.includes(status as ContentStatus);
};

/**
 * Validates a draft status value against allowed status values
 * @param status The status to validate
 * @returns Whether the status is valid
 */
export const validateDraftStatus = (status: string): boolean => {
  const validStatuses: DraftStatus[] = ['draft', 'ready', 'published', 'archived'];
  return validStatuses.includes(status as DraftStatus);
};

/**
 * Validates a content status transition
 * @param currentStatus The current status
 * @param newStatus The new status
 * @returns An object with validation result and error message if invalid
 */
export const validateContentStatusChange = (
  currentStatus: ContentStatus, 
  newStatus: ContentStatus
): { isValid: boolean; errorMessage?: string } => {
  if (currentStatus === newStatus) {
    return { isValid: true };
  }

  if (!isValidContentStatusTransition(currentStatus, newStatus)) {
    return { 
      isValid: false, 
      errorMessage: `Cannot change status from ${currentStatus} to ${newStatus}` 
    };
  }

  return { isValid: true };
};

/**
 * Validates a draft status transition
 * @param currentStatus The current status
 * @param newStatus The new status
 * @returns An object with validation result and error message if invalid
 */
export const validateDraftStatusChange = (
  currentStatus: DraftStatus, 
  newStatus: DraftStatus
): { isValid: boolean; errorMessage?: string } => {
  if (currentStatus === newStatus) {
    return { isValid: true };
  }

  if (!isValidDraftStatusTransition(currentStatus, newStatus)) {
    return { 
      isValid: false, 
      errorMessage: `Cannot change status from ${currentStatus} to ${newStatus}` 
    };
  }

  return { isValid: true };
};
