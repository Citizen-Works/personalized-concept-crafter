
import { toast } from "sonner";
import { fetchDocument } from "./fetchDocument";
import { fetchBusinessContext } from "./fetchBusinessContext";
import { generateIdeas } from "./generateIdeas";
import { saveIdeas } from "./saveIdeas";
import { IdeaResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { DocumentProcessingStatus, DocumentType } from "@/types/documents";

/**
 * Processes a document to extract content ideas - can run in background
 */
export const processTranscriptForIdeas = async (
  userId: string, 
  documentId: string,
  backgroundMode: boolean = false
): Promise<IdeaResponse> => {
  if (!userId) throw new Error("User not authenticated");

  // If in background mode, update the document's processing status
  if (backgroundMode) {
    try {
      await supabase
        .from("documents")
        .update({ processing_status: 'processing' as DocumentProcessingStatus })
        .eq("id", documentId)
        .eq("user_id", userId);
    } catch (updateError) {
      console.error("Error updating document processing status:", updateError);
      // Continue with processing even if status update fails
    }
  }

  try {
    // Step 1: Fetch the document with optimistic error handling
    let document;
    try {
      document = await fetchDocument(userId, documentId);
    } catch (docError) {
      console.error("Error fetching document:", docError);
      throw new Error(`Failed to retrieve document: ${docError instanceof Error ? docError.message : 'Unknown error'}`);
    }
    
    // Check if document is a transcript or eligible for idea extraction
    if (document.type !== "transcript") {
      throw new Error(`Only transcript documents can be processed for ideas. This document is type: ${document.type}`);
    }
    
    // Step 2: Get business context for better idea generation
    let businessContext = '';
    try {
      businessContext = await fetchBusinessContext(userId);
    } catch (contextError) {
      console.error("Error fetching business context:", contextError);
      // Continue without business context if it fails
    }
    
    // Step 3: Sanitize transcript content to prevent HTML/XML confusion
    const sanitizedContent = document.content 
      ? document.content.replace(/<[^>]*>/g, '') // Remove any HTML-like tags
      : '';
    
    if (!sanitizedContent.trim()) {
      throw new Error("Transcript content is empty");
    }
    
    // Step 4: Generate content ideas using Claude AI with chunking for large transcripts
    let contentIdeas;
    try {
      contentIdeas = await generateIdeas(sanitizedContent, businessContext, document.title);
    } catch (generateError) {
      console.error("Error generating ideas:", generateError);
      throw new Error(`Failed to generate ideas: ${generateError instanceof Error ? generateError.message : 'Unknown error'}`);
    }

    // Step 5: If no ideas were generated, return a message
    if (contentIdeas.length === 0) {
      // Update document status if in background mode
      if (backgroundMode) {
        try {
          await supabase
            .from("documents")
            .update({ 
              processing_status: 'completed' as DocumentProcessingStatus, 
              has_ideas: false 
            })
            .eq("id", documentId)
            .eq("user_id", userId);
        } catch (updateError) {
          console.error("Error updating document status after no ideas:", updateError);
        }
      }
      
      return {
        message: "No valuable content ideas were identified in this transcript.",
        ideas: []
      };
    }

    // Step 6: Save content ideas to the database
    let savedIdeas;
    try {
      savedIdeas = await saveIdeas(contentIdeas, userId);
    } catch (saveError) {
      console.error("Error saving ideas:", saveError);
      throw new Error(`Failed to save ideas: ${saveError instanceof Error ? saveError.message : 'Unknown error'}`);
    }

    // Step 7: Update document status if in background mode
    if (backgroundMode) {
      try {
        await supabase
          .from("documents")
          .update({ 
            processing_status: 'completed' as DocumentProcessingStatus, 
            has_ideas: true,
            ideas_count: savedIdeas.length
          })
          .eq("id", documentId)
          .eq("user_id", userId);
      } catch (updateError) {
        console.error("Error updating document status after processing:", updateError);
        // Continue to return ideas even if status update fails
      }
    }

    // Step 8: Return both a summary message and the structured idea data
    return {
      message: `${savedIdeas.length} content ideas were created from this transcript.`,
      ideas: savedIdeas
    };
  } catch (error) {
    console.error("Error processing transcript:", error);
    
    // Update document status if in background mode
    if (backgroundMode) {
      try {
        await supabase
          .from("documents")
          .update({ processing_status: 'failed' as DocumentProcessingStatus })
          .eq("id", documentId)
          .eq("user_id", userId);
      } catch (updateError) {
        console.error("Error updating document status after failure:", updateError);
      }
    } else {
      toast.error("Failed to process transcript for ideas");
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
