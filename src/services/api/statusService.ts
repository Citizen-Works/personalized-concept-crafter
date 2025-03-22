
import { supabase } from '@/integrations/supabase/client';
import { ContentStatus, DraftStatus } from '@/types/status';
import { toast } from 'sonner';
import { 
  validateContentStatusChange, 
  validateDraftStatusChange 
} from '@/utils/statusValidation';

/**
 * Updates the status of a content idea with validation
 * @param ideaId The ID of the content idea
 * @param newStatus The new status to apply
 * @param currentStatus The current status of the idea
 * @returns Whether the update was successful
 */
export const updateContentIdeaStatus = async (
  ideaId: string,
  newStatus: ContentStatus,
  currentStatus: ContentStatus
): Promise<boolean> => {
  // Validate the status transition
  const validation = validateContentStatusChange(currentStatus, newStatus);
  
  if (!validation.isValid) {
    toast.error(validation.errorMessage || 'Invalid status transition');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('content_ideas')
      .update({ status: newStatus })
      .eq('id', ideaId);
      
    if (error) {
      console.error('Error updating content idea status:', error);
      toast.error('Failed to update idea status');
      return false;
    }
    
    toast.success(`Idea status updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error('Error updating content idea status:', error);
    toast.error('An error occurred while updating idea status');
    return false;
  }
};

/**
 * Updates the status of a content draft with validation
 * @param draftId The ID of the content draft
 * @param newStatus The new status to apply
 * @param currentStatus The current status of the draft
 * @returns Whether the update was successful
 */
export const updateDraftStatus = async (
  draftId: string,
  newStatus: DraftStatus,
  currentStatus: DraftStatus
): Promise<boolean> => {
  // Validate the status transition
  const validation = validateDraftStatusChange(currentStatus, newStatus);
  
  if (!validation.isValid) {
    toast.error(validation.errorMessage || 'Invalid status transition');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('content_drafts')
      .update({ status: newStatus })
      .eq('id', draftId);
      
    if (error) {
      console.error('Error updating draft status:', error);
      toast.error('Failed to update draft status');
      return false;
    }
    
    toast.success(`Draft status updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error('Error updating draft status:', error);
    toast.error('An error occurred while updating draft status');
    return false;
  }
};

/**
 * Batch updates multiple content idea statuses with validation
 * @param ideaIds Array of idea IDs to update
 * @param newStatus The new status to apply
 * @param currentStatuses Map of current statuses by idea ID
 * @returns Number of successfully updated ideas
 */
export const batchUpdateContentStatus = async (
  ideaIds: string[],
  newStatus: ContentStatus,
  currentStatuses: Record<string, ContentStatus>
): Promise<number> => {
  if (!ideaIds.length) return 0;
  
  // Filter ideas that can be validly transitioned
  const validIdeaIds = ideaIds.filter(id => {
    const currentStatus = currentStatuses[id];
    if (!currentStatus) return false;
    
    const validation = validateContentStatusChange(currentStatus, newStatus);
    if (!validation.isValid) {
      console.warn(`Skipping idea ${id}: ${validation.errorMessage}`);
      return false;
    }
    
    return true;
  });
  
  if (validIdeaIds.length === 0) {
    toast.error('No valid ideas to update');
    return 0;
  }
  
  try {
    const { error, count } = await supabase
      .from('content_ideas')
      .update({ status: newStatus })
      .in('id', validIdeaIds);
      
    if (error) {
      console.error('Error batch updating content idea statuses:', error);
      toast.error('Failed to update idea statuses');
      return 0;
    }
    
    toast.success(`Updated ${count} idea${count !== 1 ? 's' : ''} to ${newStatus}`);
    return count || validIdeaIds.length;
  } catch (error) {
    console.error('Error batch updating content idea statuses:', error);
    toast.error('An error occurred while updating idea statuses');
    return 0;
  }
};

/**
 * Batch updates multiple draft statuses with validation
 * @param draftIds Array of draft IDs to update
 * @param newStatus The new status to apply
 * @param currentStatuses Map of current statuses by draft ID
 * @returns Number of successfully updated drafts
 */
export const batchUpdateDraftStatus = async (
  draftIds: string[],
  newStatus: DraftStatus,
  currentStatuses: Record<string, DraftStatus>
): Promise<number> => {
  if (!draftIds.length) return 0;
  
  // Filter drafts that can be validly transitioned
  const validDraftIds = draftIds.filter(id => {
    const currentStatus = currentStatuses[id];
    if (!currentStatus) return false;
    
    const validation = validateDraftStatusChange(currentStatus, newStatus);
    if (!validation.isValid) {
      console.warn(`Skipping draft ${id}: ${validation.errorMessage}`);
      return false;
    }
    
    return true;
  });
  
  if (validDraftIds.length === 0) {
    toast.error('No valid drafts to update');
    return 0;
  }
  
  try {
    const { error, count } = await supabase
      .from('content_drafts')
      .update({ status: newStatus })
      .in('id', validDraftIds);
      
    if (error) {
      console.error('Error batch updating draft statuses:', error);
      toast.error('Failed to update draft statuses');
      return 0;
    }
    
    toast.success(`Updated ${count} draft${count !== 1 ? 's' : ''} to ${newStatus}`);
    return count || validDraftIds.length;
  } catch (error) {
    console.error('Error batch updating draft statuses:', error);
    toast.error('An error occurred while updating draft statuses');
    return 0;
  }
};
