import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentType, DocumentPurpose, DocumentStatus, DocumentContentType, DocumentProcessingStatus } from "@/types/documents";
import { decryptContent } from "@/utils/encryptionUtils";

/**
 * Fetches a single document by ID with encrypted content decryption
 * Works with both UUID and non-UUID document IDs
 */
export const fetchDocument = async (userId: string, documentId: string): Promise<Document> => {
  if (!userId) throw new Error("User not authenticated");
  
  // Less restrictive document ID validation - allow any non-empty string
  if (!documentId || documentId.trim() === '') {
    console.error("Empty document ID provided");
    throw new Error("Invalid document ID: empty ID provided");
  }

  try {
    console.log(`Attempting to fetch document with ID: ${documentId} for user ${userId}`);
    
    // Mobile-friendly approach: Use string comparison for all IDs
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error(`Failed to fetch document ${documentId}:`, error);
      throw new Error(`Document fetch failed: ${error.message}`);
    }

    if (!data) {
      console.error(`Document not found for ID: ${documentId}`);
      throw new Error("Document not found");
    }

    console.log(`Document found: ${data.title} (ID: ${data.id})`);

    // Handle decryption if the document is encrypted
    let content = data.content || "";
    
    // Check if is_encrypted exists on the data object before accessing it
    const isEncrypted = 'is_encrypted' in data ? data.is_encrypted === true : false;
    
    if (isEncrypted) {
      try {
        console.log("Attempting to decrypt document content");
        content = await decryptContent(content, userId);
      } catch (err) {
        console.error("Failed to decrypt document content:", err);
        // Fallback to using the encrypted content
      }
    }

    // Ensure all required fields are present
    const document = {
      id: data.id,
      userId: data.user_id,
      title: data.title || "Untitled Document",
      content: content,
      type: data.type as DocumentType,
      purpose: data.purpose as DocumentPurpose,
      status: data.status as DocumentStatus,
      content_type: data.content_type as DocumentContentType,
      createdAt: new Date(data.created_at),
      isEncrypted: isEncrypted,
      processing_status: (data.processing_status || 'idle') as DocumentProcessingStatus,
      has_ideas: data.has_ideas || false,
      ideas_count: data.ideas_count || 0
    };

    console.log('Document content preview:', {
      contentLength: document.content?.length || 0,
      preview: document.content?.substring(0, 100) + '...',
      type: document.type,
      status: document.status,
      processingStatus: document.processing_status
    });

    return document;
  } catch (error) {
    console.error(`Error fetching document ${documentId}:`, error);
    // Add more context to the error
    throw new Error(`Error retrieving document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
