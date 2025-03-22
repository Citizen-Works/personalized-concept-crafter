
import { supabase } from "@/integrations/supabase/client";
import { DocumentProcessingStatus } from "@/types/documents";

/**
 * Updates the processing status of a document in the database
 */
export const updateDocumentProcessingStatus = async (
  documentId: string,
  userId: string,
  status: DocumentProcessingStatus,
  hasIdeas: boolean = false,
  ideasCount: number = 0
): Promise<void> => {
  try {
    const updateData: Record<string, any> = { 
      processing_status: status 
    };
    
    // Only update ideas-related fields if we're completing the processing
    if (status === 'completed') {
      updateData.has_ideas = hasIdeas;
      // Only update ideas count if there are actually ideas
      if (hasIdeas) {
        updateData.ideas_count = ideasCount;
      }
    }
    
    await supabase
      .from("documents")
      .update(updateData)
      .eq("id", documentId)
      .eq("user_id", userId);
    
    console.log(`Updated document ${documentId} status to '${status}'${
      status === 'completed' ? ` with ${hasIdeas ? ideasCount : 'no'} ideas` : ''
    }`);
  } catch (updateError) {
    console.error(`Error updating document status to ${status}:`, updateError);
    // Non-critical error, we continue processing
  }
};
