
import { toast } from "sonner";
import { fetchDocument } from "./fetchDocument";
import { fetchBusinessContext } from "./fetchBusinessContext";
import { generateIdeas } from "./generateIdeas";
import { saveIdeas } from "./saveIdeas";
import { IdeaResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Processes a transcript to extract content ideas - can run in background
 */
export const processTranscriptForIdeas = async (
  userId: string, 
  documentId: string,
  backgroundMode: boolean = false
): Promise<IdeaResponse> => {
  if (!userId) throw new Error("User not authenticated");

  // If in background mode, update the document's processing status
  if (backgroundMode) {
    await supabase
      .from("documents")
      .update({ processing_status: 'processing' })
      .eq("id", documentId)
      .eq("user_id", userId);
  }

  try {
    // Step 1: Fetch the document
    const document = await fetchDocument(userId, documentId);
    
    // Step 2: Get business context for better idea generation
    const businessContext = await fetchBusinessContext(userId);
    
    // Step 3: Sanitize transcript content to prevent HTML/XML confusion
    const sanitizedContent = document.content 
      ? document.content.replace(/<[^>]*>/g, '') // Remove any HTML-like tags
      : '';
    
    // Step 4: Generate content ideas using Claude AI
    const contentIdeas = await generateIdeas(sanitizedContent, businessContext, document.title);

    // Step 5: If no ideas were generated, return a message
    if (contentIdeas.length === 0) {
      // Update document status if in background mode
      if (backgroundMode) {
        await supabase
          .from("documents")
          .update({ processing_status: 'completed', has_ideas: false })
          .eq("id", documentId)
          .eq("user_id", userId);
      }
      
      return {
        message: "No valuable content ideas were identified in this transcript.",
        ideas: []
      };
    }

    // Step 6: Save content ideas to the database
    const savedIdeas = await saveIdeas(contentIdeas, userId);

    // Step 7: Update document status if in background mode
    if (backgroundMode) {
      await supabase
        .from("documents")
        .update({ 
          processing_status: 'completed', 
          has_ideas: true,
          ideas_count: savedIdeas.length
        })
        .eq("id", documentId)
        .eq("user_id", userId);
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
      await supabase
        .from("documents")
        .update({ processing_status: 'failed' })
        .eq("id", documentId)
        .eq("user_id", userId);
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
  status: 'idle' | 'processing' | 'completed' | 'failed';
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
      .single();
    
    if (error) throw error;
    
    return {
      status: data.processing_status || 'idle',
      hasIdeas: data.has_ideas || false,
      ideasCount: data.ideas_count || 0
    };
  } catch (error) {
    console.error("Error checking processing status:", error);
    return {
      status: 'idle',
      hasIdeas: false,
      ideasCount: 0
    };
  }
};
