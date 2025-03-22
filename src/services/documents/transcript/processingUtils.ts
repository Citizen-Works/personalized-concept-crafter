
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";
import { IdeaResponse } from "./types";
import { updateDocumentProcessingStatus } from "./documentStatusUpdater";

/**
 * Validates a document to ensure it has content
 */
export const validateDocument = (document: Document): void => {
  if (!document) {
    throw new Error("Document not found");
  }
  
  if (!document.content || !document.content.trim()) {
    throw new Error("Document content is empty");
  }
};

/**
 * Sanitizes document content to remove HTML/XML that might confuse AI
 */
export const sanitizeDocumentContent = (content: string | null | undefined): string => {
  if (!content) return '';
  
  // Remove any HTML-like tags to prevent confusion in AI models
  return content.replace(/<[^>]*>/g, '').trim();
};

/**
 * Handles errors during document processing
 */
export const handleProcessingError = async (
  error: any,
  documentId: string,
  userId: string,
  backgroundMode: boolean
): Promise<IdeaResponse> => {
  console.error("Error processing document:", error);
  
  // Update document status if in background mode
  if (backgroundMode) {
    await updateDocumentProcessingStatus(documentId, userId, 'failed');
  } else {
    toast.error("Failed to process document for ideas");
  }
  
  throw error;
};

/**
 * Determines if a device is mobile based on the user agent
 * Fallback detection when the hook isn't available
 */
export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined' || !navigator.userAgent) return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
