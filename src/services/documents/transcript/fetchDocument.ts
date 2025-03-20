
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentType, DocumentPurpose, DocumentStatus, DocumentContentType } from "@/types";
import { decryptContent } from "@/utils/encryptionUtils";

/**
 * Fetches a single document by ID with encrypted content decryption
 */
export const fetchDocument = async (userId: string, documentId: string): Promise<Document> => {
  if (!userId) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch document:", error);
    throw error;
  }

  // Handle decryption if the document is encrypted
  let content = data.content || "";
  // Check if is_encrypted exists on the data object before accessing it
  const isEncrypted = 'is_encrypted' in data ? data.is_encrypted === true : false;
  
  if (isEncrypted) {
    try {
      content = await decryptContent(content, userId);
    } catch (err) {
      console.error("Failed to decrypt document content:", err);
      // Fallback to using the encrypted content
    }
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: content,
    type: data.type as DocumentType,
    purpose: data.purpose as DocumentPurpose,
    status: data.status as DocumentStatus,
    content_type: data.content_type as DocumentContentType,
    createdAt: new Date(data.created_at),
    isEncrypted: isEncrypted
  };
};
