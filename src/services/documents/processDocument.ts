import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  DocumentProcessingStatus, 
  Document, 
  IdeaResponse,
  ContentIdea 
} from "@/types/documents";

/**
 * Fetches a document by ID
 */
async function fetchDocument(userId: string, documentId: string): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Document not found");

  return data as Document;
}

/**
 * Fetches business context for the user
 */
async function fetchBusinessContext(userId: string): Promise<string> {
  const { data: userContext, error } = await supabase
    .from('user_context')
    .select('business_context')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return userContext?.business_context || '';
}

/**
 * Validates document content
 */
function validateDocument(document: Document): void {
  if (!document) throw new Error("Document not found");
  if (!document.content) throw new Error("Document has no content");
  if (document.content.trim().length === 0) throw new Error("Document content is empty");
}

/**
 * Sanitizes document content
 */
function sanitizeDocumentContent(content: string): string {
  if (!content) return '';
  // Remove any HTML/XML tags that might confuse the AI
  return content.replace(/<[^>]*>/g, ' ').trim();
}

/**
 * Updates document processing status
 */
async function updateDocumentProcessingStatus(
  documentId: string,
  userId: string,
  status: DocumentProcessingStatus,
  hasIdeas: boolean = false,
  ideasCount: number = 0
): Promise<void> {
  const { error } = await supabase
    .from("documents")
    .update({
      processing_status: status,
      has_ideas: hasIdeas,
      ideas_count: ideasCount,
      updated_at: new Date().toISOString()
    })
    .eq("id", documentId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating document status:", error);
    throw error;
  }
}

/**
 * Generates ideas from document content using the Edge Function
 */
async function generateIdeas(
  content: string,
  businessContext: string,
  title: string,
  documentId: string,
  userId: string,
  type: string = 'document'
): Promise<any[]> {
  const { data, error } = await supabase.functions.invoke(
    "process-document",
    {
      body: {
        content,
        title,
        type,
        userId,
        businessContext,
        documentId
      }
    }
  );

  if (error) throw error;
  if (!data?.ideas) throw new Error("No ideas were generated");

  return data.ideas;
}

/**
 * Saves generated ideas to the database
 */
async function saveIdeas(ideas: any[], userId: string): Promise<any[]> {
  if (!ideas || ideas.length === 0) return [];

  const { data, error } = await supabase
    .from("content_ideas")
    .insert(
      ideas.map(idea => ({
        ...idea,
        user_id: userId,
        status: 'pending'
      }))
    )
    .select();

  if (error) throw error;
  return data || [];
}

/**
 * Processes a document to extract content ideas - can run in background
 */
export const processDocumentForIdeas = async (
  userId: string, 
  documentId: string,
  backgroundMode: boolean = false
): Promise<IdeaResponse> => {
  if (!userId) throw new Error("User not authenticated");

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
};

/**
 * Checks the processing status of a document
 */
export const checkProcessingStatus = async (
  userId: string,
  documentId: string
): Promise<{
  status: DocumentProcessingStatus;
  hasIdeas: boolean;
  ideasCount: number;
}> => {
  if (!userId) throw new Error("User not authenticated");
  
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("processing_status, has_ideas, ideas_count")
      .eq("id", documentId)
      .eq("user_id", userId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return {
        status: 'idle' as DocumentProcessingStatus,
        hasIdeas: false,
        ideasCount: 0
      };
    }
    
    return {
      status: (data.processing_status || 'idle') as DocumentProcessingStatus,
      hasIdeas: data.has_ideas || false,
      ideasCount: data.ideas_count || 0
    };
  } catch (error) {
    console.error("Error checking processing status:", error);
    return {
      status: 'idle' as DocumentProcessingStatus,
      hasIdeas: false,
      ideasCount: 0
    };
  }
}; 