import { toast } from "sonner";
import { fetchDocument } from "@/services/documents/transcript/fetchDocument";
import { fetchBusinessContext } from "@/services/documents/transcript/fetchBusinessContext";
import { generateIdeas } from "@/services/documents/transcript/generateIdeas";
import { saveIdeas } from "@/services/documents/transcript/saveIdeas";
import { IdeaResponse } from "@/services/documents/transcript/types";
import { DocumentProcessingStatus } from "@/types/documents";
import { updateDocumentProcessingStatus } from "@/services/documents/transcript/documentStatusUpdater";
import { 
  handleProcessingError, 
  validateDocument,
  sanitizeDocumentContent
} from "@/services/documents/transcript/processingUtils";
import { withErrorHandling, ApiError, ValidationError } from './errorHandling';

interface TranscriptionProgressCallback {
  (progress: number, stage: string): void;
}

interface TranscriptionStage {
  preparing: number;
  uploading: number;
  transcribing: number;
  complete: number;
}

const TRANSCRIPTION_STAGES: TranscriptionStage = {
  preparing: 40,
  uploading: 50,
  transcribing: 70,
  complete: 100
};

/**
 * Processes a document to extract content ideas
 * @param userId - The ID of the user processing the document
 * @param documentId - The ID of the document to process
 * @param backgroundMode - Whether to run in background mode (defaults to false)
 * @returns Promise with the processing results
 */
export const processDocumentForIdeas = async (
  userId: string, 
  documentId: string,
  backgroundMode: boolean = false
): Promise<IdeaResponse> => {
  return withErrorHandling(
    async () => {
      if (!userId) {
        throw new ValidationError("User not authenticated");
      }

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
        
        // Step 5: Generate content ideas
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
        console.error('Error in processDocumentForIdeas:', error);
        if (backgroundMode) {
          await updateDocumentProcessingStatus(documentId, userId, 'failed');
        }
        throw error;
      }
    },
    'processDocumentForIdeas'
  );
};

/**
 * Transcribes audio data to text using the API
 * @param audioBlob - The recorded audio blob
 * @param onProgress - Callback for progress updates during transcription
 * @returns Promise with the transcribed text
 */
export const transcribeAudio = async (
  audioBlob: Blob, 
  onProgress: TranscriptionProgressCallback
): Promise<string> => {
  return withErrorHandling(
    async () => {
      // Validate audio data
      if (!audioBlob || audioBlob.size === 0) {
        throw new ValidationError("No audio detected. Please check your microphone and try again.");
      }
      
      // Log audio metadata for debugging
      console.log("Audio metadata sent for transcription:", {
        type: audioBlob.type,
        size: audioBlob.size,
        lastModified: new Date().toISOString()
      });
      
      // Update stage to preparing
      onProgress(TRANSCRIPTION_STAGES.preparing, 'preparing');
      
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob, (progress) => {
        // Calculate progress from 10% to 40%
        const calculatedProgress = 10 + (progress * 30);
        onProgress(Math.round(calculatedProgress), 'preparing');
      });
      
      // Validate base64 data
      if (!base64Audio || base64Audio.length === 0) {
        throw new ValidationError("Failed to encode audio. Please try again.");
      }
      
      console.log(`Base64 audio prepared, length: ${base64Audio.length} characters`);
      
      // Update stage to uploading
      onProgress(TRANSCRIPTION_STAGES.uploading, 'uploading');
      
      // Make API call to transcribe audio
      const response = await fetch(`${window.location.origin}/api/functions/transcribe-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          audio: base64Audio,
          fileType: audioBlob.type || 'audio/webm' 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Transcription API error:", errorData);
        throw new ApiError(`Transcription failed: ${response.statusText || 'Error communicating with transcription service'}`);
      }
      
      // Update stage to transcribing
      onProgress(TRANSCRIPTION_STAGES.transcribing, 'transcribing');
      
      const result = await response.json();
      
      // Check if result contains text
      if (!result.text || result.text.trim() === '') {
        throw new ValidationError("No speech detected in the audio. Please speak clearly and try again.");
      }
      
      console.log("Transcription received:", {
        textLength: result.text.length,
        firstWords: result.text.slice(0, 30) + "..."
      });
      
      // Update stage to complete
      onProgress(TRANSCRIPTION_STAGES.complete, 'complete');
      
      return result.text;
    },
    'transcribeAudio'
  );
};

// Helper function to convert blob to base64
async function blobToBase64(blob: Blob, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = event.loaded / event.total;
        onProgress(progress);
      }
    };
    reader.readAsDataURL(blob);
  });
} 