import { supabase } from "@/integrations/supabase/client";
import { ContentIdea } from "./types";
import { isMobileDevice } from "./processingUtils";
import { withErrorHandling, ApiError, ValidationError } from '@/utils/errorHandling';

/**
 * Splits a long transcript into smaller chunks that won't exceed token limits
 * @param text - The transcript text to chunk
 * @param maxChunkLength - Maximum characters per chunk (default 6000)
 * @returns Array of text chunks
 */
function chunkTranscript(text: string, maxChunkLength: number = 6000): string[] {
  // If text is already small enough, return as single chunk
  if (text.length <= maxChunkLength) {
    return [text];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + maxChunkLength;
    
    // Try to end at a sentence or paragraph boundary if possible
    if (endIndex < text.length) {
      // Look for paragraph break
      const paragraphBreak = text.lastIndexOf('\n\n', endIndex);
      if (paragraphBreak > startIndex + maxChunkLength * 0.7) {
        endIndex = paragraphBreak + 2; // Include the newlines
      } else {
        // Look for sentence break (period followed by space)
        const sentenceBreak = text.lastIndexOf('. ', endIndex);
        if (sentenceBreak > startIndex + maxChunkLength * 0.7) {
          endIndex = sentenceBreak + 2; // Include the period and space
        }
      }
    } else {
      endIndex = text.length;
    }

    // Extract chunk and add to array
    chunks.push(text.substring(startIndex, endIndex));
    startIndex = endIndex;
  }

  console.log(`Split transcript into ${chunks.length} chunks for processing`);
  return chunks;
}

/**
 * Attempts to generate ideas via the Supabase edge function
 */
export async function generateIdeasViaEdgeFunction(
  documentId: string,
  userId: string,
  contentLength: number,
  title: string,
  type: string
) {
  return withErrorHandling(
    async () => {
      console.log('Processing transcript with length:', contentLength, 'characters');
      
      // Validate input
      if (!documentId || !userId) {
        throw new ValidationError('Missing required parameters: documentId and userId');
      }

      if (contentLength < 100) {
        throw new ValidationError('Content is too short to generate ideas');
      }

      console.log('Calling edge function to generate ideas for:', title, '(ID:', documentId, ')');
      
      const payload = {
        documentId,
        userId,
        contentLength,
        title,
        type
      };
      
      console.log('Edge function payload:', payload);
      
      console.log('Making edge function call...');
      const { data, error } = await supabase.functions.invoke(
        'process-document',
        { body: payload }
      );
      
      console.log('Edge function response:', {
        error,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : []
      });
      
      if (error) {
        throw error;
      }
      
      if (!data || !Array.isArray(data.ideas)) {
        throw new ApiError('Invalid response format from edge function');
      }
      
      console.log('Generated', data.ideas.length, 'ideas via edge function');
      return data.ideas;
    },
    'generateIdeasViaEdgeFunction'
  );
}

/**
 * Calls the Claude AI service to generate content ideas from transcript text
 */
export const generateIdeas = async (
  sanitizedContent: string,
  businessContext: string,
  documentTitle: string,
  documentId?: string,
  userId?: string,
  documentType?: string
): Promise<ContentIdea[]> => {
  console.log(`Processing transcript with length: ${sanitizedContent.length} characters`);

  // Only proceed if we have both documentId and userId
  if (!documentId || !userId) {
    throw new Error("Document ID and User ID are required for idea generation");
  }

  // Use the edge function to generate ideas
  return await generateIdeasViaEdgeFunction(
    documentId,
    userId,
    sanitizedContent.length,
    documentTitle,
    documentType || 'generic'
  );
};
