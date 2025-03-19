
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetches a document from Supabase by its ID for a specific user
 */
export const fetchDocument = async (
  userId: string,
  documentId: string
): Promise<{ id: string; title: string; content: string }> => {
  if (!userId) throw new Error("User not authenticated");

  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (docError || !document) {
    toast.error("Failed to retrieve document");
    throw docError || new Error("Document not found");
  }

  return document;
};
