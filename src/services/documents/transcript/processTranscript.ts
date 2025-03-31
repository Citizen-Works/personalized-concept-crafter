import { toast } from "sonner";
import { fetchDocument } from "./fetchDocument";
import { fetchBusinessContext } from "./fetchBusinessContext";
import { generateIdeas } from "./generateIdeas";
import { saveIdeas } from "./saveIdeas";
import { IdeaResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { DocumentProcessingStatus } from "@/types/documents";
import { updateDocumentProcessingStatus } from "./documentStatusUpdater";
import { 
  handleProcessingError, 
  validateDocument,
  sanitizeDocumentContent
} from "./processingUtils";

/**
 * Processes a document to extract content ideas - can run in background
 */
export const processTranscriptForIdeas = async (
  userId: string, 
  documentId: string,
  backgroundMode: boolean = false
): Promise<IdeaResponse> => {
  if (!userId) throw new Error("User not authenticated");

  console.log(`Starting to process document ID: ${documentId} for user ${userId}`);

  // If in background mode, update the document's processing status
  if (backgroundMode) {
    await updateDocumentProcessingStatus(documentId, userId, 'processing');
  }

  try {
    // Step 1: Fetch and validate the document
    console.log(`Fetching document ${documentId}`);
    const document = await fetchDocument(userId, documentId);
    
    // Step 2: Validate document content
    console.log('Validating document content:', {
      hasContent: !!document.content,
      contentLength: document.content?.length || 0,
      preview: document.content?.substring(0, 100) + '...'
    });
    validateDocument(document);
    
    // Step 3: Get business context for better idea generation
    let businessContext = '';
    try {
      businessContext = await fetchBusinessContext(userId);
      console.log("Retrieved business context for idea generation", {
        hasContext: !!businessContext,
        contextLength: businessContext?.length || 0
      });
    } catch (contextError) {
      console.error("Error fetching business context:", contextError);
      // Continue without business context if it fails
    }
    
    // Step 4: Sanitize content to prevent HTML/XML confusion
    console.log('Sanitizing content...');
    const sanitizedContent = sanitizeDocumentContent(document.content);
    console.log('Content sanitized:', {
      originalLength: document.content?.length || 0,
      sanitizedLength: sanitizedContent?.length || 0,
      preview: sanitizedContent?.substring(0, 100) + '...'
    });
    
    // Step 5: Generate content ideas (via edge function or local fallback)
    const contentIdeas = await generateIdeas(
      sanitizedContent, 
      businessContext, 
      document.title,
      document.id,
      userId,
      document.type
    );
    
    // Step 6: If no ideas were generated, update document and return a message
    if (!contentIdeas || contentIdeas.length === 0) {
      if (backgroundMode) {
        await updateDocumentProcessingStatus(documentId, userId, 'completed', false);
      }
      
      return {
        message: "No valuable content ideas were identified in this document.",
        ideas: []
      };
    }

    // Step 7: Save content ideas to the database
    const savedIdeas = await saveIdeas(contentIdeas, userId);
    console.log(`Successfully saved ${savedIdeas.length} ideas`);

    // Step 8: Update document status if in background mode
    if (backgroundMode) {
      await updateDocumentProcessingStatus(
        documentId, 
        userId, 
        'completed', 
        true, 
        savedIdeas.length
      );
    }

    // Step 9: Return both a summary message and the structured idea data
    return {
      message: `${savedIdeas.length} content ideas were created from this document.`,
      ideas: savedIdeas
    };
  } catch (error) {
    console.error('Error in processTranscriptForIdeas:', error);
    if (backgroundMode) {
      await updateDocumentProcessingStatus(documentId, userId, 'failed');
    }
    throw error;
  }
};

/**
 * Checks the processing status of a document
 */
export const checkProcessingStatus = async (
  userId: string,
  documentId: string
): Promise<{
  status: DocumentProcessingStatus;
  hasIdeas: boolean;
  ideasCount: number;
}> => {
  if (!userId) throw new Error("User not authenticated");
  
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("processing_status, has_ideas, ideas_count")
      .eq("id", documentId)
      .eq("user_id", userId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return {
        status: 'idle' as DocumentProcessingStatus,
        hasIdeas: false,
        ideasCount: 0
      };
    }
    
    return {
      status: (data.processing_status || 'idle') as DocumentProcessingStatus,
      hasIdeas: data.has_ideas || false,
      ideasCount: data.ideas_count || 0
    };
  } catch (error) {
    console.error("Error checking processing status:", error);
    return {
      status: 'idle' as DocumentProcessingStatus,
      hasIdeas: false,
      ideasCount: 0
    };
  }
};
