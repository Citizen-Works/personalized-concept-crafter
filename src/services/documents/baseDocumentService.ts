
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentFilterOptions } from "@/types";
import { toast } from "sonner";

/**
 * Fetches documents with optional filtering
 * Performance optimized with memoization in the consuming hooks
 */
export const fetchDocuments = async (
  userId: string, 
  filters?: DocumentFilterOptions
): Promise<Document[]> => {
  if (!userId) throw new Error("User not authenticated");

  let query = supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId);
  
  // Apply filters if provided
  if (filters?.type) {
    query = query.eq("type", filters.type);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.content_type) {
    query = query.eq("content_type", filters.content_type);
  }
  if (filters?.purpose) {
    query = query.eq("purpose", filters.purpose);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch documents:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    content: item.content || "",
    type: item.type as Document["type"],
    purpose: item.purpose as Document["purpose"],
    status: item.status as Document["status"],
    content_type: item.content_type as Document["content_type"],
    createdAt: new Date(item.created_at)
  }));
};

/**
 * Creates a new document
 */
export const createDocument = async (
  userId: string, 
  document: Omit<Document, "id" | "userId" | "createdAt"> & { content?: string }
): Promise<Document> => {
  if (!userId) throw new Error("User not authenticated");

  try {
    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          title: document.title,
          content: document.content,
          type: document.type,
          purpose: document.purpose,
          status: document.status,
          content_type: document.content_type,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to create document:", error);
      throw error;
    }

    // Only show success toast here, errors will be handled by the calling function
    toast.success("Document created successfully");
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content || "",
      type: data.type as Document["type"],
      purpose: data.purpose as Document["purpose"],
      status: data.status as Document["status"],
      content_type: data.content_type as Document["content_type"],
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error("Error in createDocument:", error);
    throw error;
  }
};

/**
 * Updates the status of a document
 */
export const updateDocumentStatus = async (
  userId: string, 
  id: string, 
  status: 'active' | 'archived'
): Promise<void> => {
  if (!userId) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("documents")
    .update({ status })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    toast.error("Failed to update document status");
    throw error;
  }

  toast.success("Document status updated");
};
