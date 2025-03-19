
import { toast } from "sonner";
import { fetchDocument } from "./fetchDocument";
import { fetchBusinessContext } from "./fetchBusinessContext";
import { generateIdeas } from "./generateIdeas";
import { saveIdeas } from "./saveIdeas";
import { IdeaResponse } from "./types";

/**
 * Processes a transcript to extract content ideas
 */
export const processTranscriptForIdeas = async (
  userId: string, 
  documentId: string
): Promise<IdeaResponse> => {
  if (!userId) throw new Error("User not authenticated");

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
      return {
        message: "No valuable content ideas were identified in this transcript.",
        ideas: []
      };
    }

    // Step 6: Save content ideas to the database
    const savedIdeas = await saveIdeas(contentIdeas, userId);

    // Step 7: Return both a summary message and the structured idea data
    return {
      message: `${savedIdeas.length} content ideas were created from this transcript.`,
      ideas: savedIdeas
    };
  } catch (error) {
    console.error("Error processing transcript:", error);
    toast.error("Failed to process transcript for ideas");
    throw error;
  }
};
