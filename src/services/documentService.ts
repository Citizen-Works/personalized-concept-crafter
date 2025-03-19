
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentFilterOptions, DocumentCreateInput } from "@/types";
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
  document: DocumentCreateInput
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

/**
 * Processes a transcript to extract content ideas
 */
export const processTranscriptForIdeas = async (
  userId: string, 
  documentId: string
): Promise<string> => {
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

  try {
    // Get user's business info from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("business_name, business_description")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.warn("Could not retrieve user business info:", profileError);
    }
    
    // Prepare business context
    const businessContext = profileData ? 
      `\nBusiness Context:
      Business Name: ${profileData.business_name || 'Not specified'}
      Business Description: ${profileData.business_description || 'Not specified'}\n` : '';

    const response = await fetch(`${window.location.origin}/api/functions/generate-with-claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        prompt: `You are an expert content strategist tasked with identifying potential content ideas from meeting transcripts. 
        
        Analyze the following meeting transcript and extract 3-5 potential content ideas. For each idea:
        1. Provide a clear, concise title
        2. Write a brief description explaining what the content would cover
        3. Identify which sections of the transcript support this idea (include relevant quotes)
        
        ${businessContext}
        
        If the transcript doesn't contain any valuable content ideas that would be relevant to the business context, respond with "No valuable content ideas found in this transcript." and a brief explanation why.
        
        Meeting Transcript:
        ${document.content}`,
        contentType: "content_ideas",
        idea: { title: document.title },
        task: "transcript_analysis"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from claude function:", errorText);
      throw new Error(`Error processing transcript: ${response.statusText}`);
    }

    const result = await response.json();
    return result.content;
  } catch (error) {
    console.error("Error processing transcript:", error);
    toast.error("Failed to process transcript for ideas");
    throw error;
  }
};
