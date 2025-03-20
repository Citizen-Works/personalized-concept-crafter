
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types";
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
  if (data.is_encrypted === true) {
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
    type: data.type,
    purpose: data.purpose,
    status: data.status,
    content_type: data.content_type,
    createdAt: new Date(data.created_at),
    isEncrypted: data.is_encrypted
  };
};
