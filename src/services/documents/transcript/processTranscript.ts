
import { toast } from "sonner";
import { fetchDocument } from "./fetchDocument";
import { fetchBusinessContext } from "./fetchBusinessContext";
import { generateIdeas } from "./generateIdeas";
import { saveIdeas } from "./saveIdeas";
import { IdeaResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { DocumentProcessingStatus } from "@/types/documents";

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
    try {
      await supabase
        .from("documents")
        .update({ processing_status: 'processing' as DocumentProcessingStatus })
        .eq("id", documentId)
        .eq("user_id", userId);
      
      console.log(`Updated document ${documentId} status to 'processing'`);
    } catch (updateError) {
      console.error("Error updating document processing status:", updateError);
      // Continue with processing even if status update fails
    }
  }

  try {
    // Step 1: Use direct Supabase query to fetch the document
    console.log(`Fetching document ${documentId}`);
    
    let document;
    try {
      // Always use direct query approach to handle both UUID and non-UUID IDs
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .eq("user_id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching document via Supabase query:", error);
        throw error;
      }
      
      if (!data) {
        console.error("Document not found for ID:", documentId);
        throw new Error("Document not found");
      }
      
      document = data;
      console.log(`Successfully fetched document: ${document.title} (ID: ${document.id})`);
    } catch (docError) {
      console.error("Error fetching document:", docError);
      throw new Error(`Failed to find document: ${docError instanceof Error ? docError.message : 'Unknown error'}`);
    }
    
    // Step 2: Get business context for better idea generation
    let businessContext = '';
    try {
      businessContext = await fetchBusinessContext(userId);
      console.log("Retrieved business context for idea generation");
    } catch (contextError) {
      console.error("Error fetching business context:", contextError);
      // Continue without business context if it fails
    }
    
    // Step 3: Sanitize content to prevent HTML/XML confusion
    const sanitizedContent = document.content 
      ? document.content.replace(/<[^>]*>/g, '') // Remove any HTML-like tags
      : '';
    
    if (!sanitizedContent.trim()) {
      throw new Error("Document content is empty");
    }
    
    // Step 4: Call the edge function directly with document content
    let contentIdeas;
    try {
      console.log(`Calling edge function to generate ideas for: ${document.title} (ID: ${document.id})`);
      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke(
        "process-document", 
        {
          body: {
            documentId: document.id, 
            userId,
            content: sanitizedContent,
            title: document.title,
            type: document.type || 'generic'
          }
        }
      );
      
      if (edgeFunctionError) {
        console.error("Edge function error:", edgeFunctionError);
        throw edgeFunctionError;
      }
      
      if (!edgeFunctionData) {
        console.error("Edge function returned no data");
        throw new Error("No data returned from edge function");
      }
      
      contentIdeas = edgeFunctionData?.ideas || [];
      console.log(`Generated ${contentIdeas.length} ideas via edge function`);
    } catch (generateError) {
      console.error("Error generating ideas via edge function:", generateError);
      
      try {
        // Fallback to local generation
        console.log("Falling back to local idea generation");
        contentIdeas = await generateIdeas(sanitizedContent, businessContext, document.title);
        console.log(`Generated ${contentIdeas.length} ideas locally`);
      } catch (localGenerateError) {
        console.error("Local idea generation also failed:", localGenerateError);
        throw new Error(`Failed to generate ideas: ${localGenerateError instanceof Error ? localGenerateError.message : 'Unknown error'}`);
      }
    }

    // Step 5: If no ideas were generated, return a message
    if (!contentIdeas || contentIdeas.length === 0) {
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
          
          console.log(`Updated document ${documentId} status to 'completed' with no ideas`);
        } catch (updateError) {
          console.error("Error updating document status after no ideas:", updateError);
        }
      }
      
      return {
        message: "No valuable content ideas were identified in this document.",
        ideas: []
      };
    }

    // Step 6: Save content ideas to the database
    let savedIdeas;
    try {
      console.log(`Saving ${contentIdeas.length} ideas to database`);
      savedIdeas = await saveIdeas(contentIdeas, userId);
      console.log(`Successfully saved ${savedIdeas.length} ideas`);
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
        
        console.log(`Updated document ${documentId} status to 'completed' with ${savedIdeas.length} ideas`);
      } catch (updateError) {
        console.error("Error updating document status after processing:", updateError);
        // Continue to return ideas even if status update fails
      }
    }

    // Step 8: Return both a summary message and the structured idea data
    return {
      message: `${savedIdeas.length} content ideas were created from this document.`,
      ideas: savedIdeas
    };
  } catch (error) {
    console.error("Error processing document:", error);
    
    // Update document status if in background mode
    if (backgroundMode) {
      try {
        await supabase
          .from("documents")
          .update({ processing_status: 'failed' as DocumentProcessingStatus })
          .eq("id", documentId)
          .eq("user_id", userId);
        
        console.log(`Updated document ${documentId} status to 'failed'`);
      } catch (updateError) {
        console.error("Error updating document status after failure:", updateError);
      }
    } else {
      toast.error("Failed to process document for ideas");
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
