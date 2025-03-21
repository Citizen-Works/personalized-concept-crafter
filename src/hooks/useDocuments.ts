
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentType, DocumentPurpose, DocumentCreateInput, DocumentFilterOptions } from "@/types";
import { useAuth } from "@/context/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocument } from "@/services/documents/transcript/fetchDocument";

interface DocumentUploadParams {
  file: File;
  documentData: Omit<DocumentCreateInput, "content">;
}

interface AddTextDocumentParams {
  title: string;
  content: string;
  type: DocumentType;
}

const extractTextFromFile = async (file: File): Promise<string> => {
  const textTypes = ['text/plain', 'text/markdown', 'application/json'];
  
  if (textTypes.includes(file.type)) {
    return await file.text();
  }
  
  // For other file types, you would need more complex extraction logic
  // like parsing PDF, Word documents, etc.
  // This is a simplified placeholder
  return await file.text().catch(() => 'Content could not be extracted from this file type.');
};

export const useDocuments = (filters?: DocumentFilterOptions) => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const [error, setError] = useState<Error | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch all documents
  const {
    data: documents,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["documents", userId, filters],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");

      let query = supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId);
      
      // Apply filters if provided
      if (filters) {
        if (filters.type) query = query.eq("type", filters.type);
        if (filters.purpose) query = query.eq("purpose", filters.purpose);
        if (filters.status) query = query.eq("status", filters.status);
        if (filters.content_type) query = query.eq("content_type", filters.content_type);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((doc) => ({
        id: doc.id,
        userId: doc.user_id,
        title: doc.title,
        content: doc.content,
        type: doc.type,
        purpose: doc.purpose,
        status: doc.status,
        content_type: doc.content_type,
        createdAt: new Date(doc.created_at),
        isEncrypted: doc.is_encrypted,
        processing_status: doc.processing_status,
        has_ideas: doc.has_ideas,
        ideas_count: doc.ideas_count
      })) as Document[];
    },
    enabled: !!userId,
  });

  // Upload a document
  const uploadDocument = useCallback(
    async ({ file, documentData }: DocumentUploadParams) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        setUploadProgress(10);
        // Extract text content from the file
        const content = await extractTextFromFile(file);
        setUploadProgress(50);

        // Insert document in Supabase
        const { data, error } = await supabase
          .from("documents")
          .insert({
            user_id: userId,
            title: documentData.title,
            content,
            type: documentData.type,
            purpose: documentData.purpose,
            content_type: documentData.content_type,
            status: documentData.status,
          })
          .select()
          .single();

        if (error) throw error;
        setUploadProgress(100);

        // Invalidate the documents query to refetch
        queryClient.invalidateQueries({ queryKey: ["documents", userId] });

        return data;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to upload document"));
        throw err;
      } finally {
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [userId, queryClient]
  );

  // Create document (direct content)
  const createDocument = useCallback(
    async (documentData: DocumentCreateInput) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const { data, error } = await supabase
          .from("documents")
          .insert({
            user_id: userId,
            title: documentData.title,
            content: documentData.content,
            type: documentData.type,
            purpose: documentData.purpose,
            content_type: documentData.content_type,
            status: documentData.status,
          })
          .select()
          .single();

        if (error) throw error;

        // Invalidate the documents query to refetch
        queryClient.invalidateQueries({ queryKey: ["documents", userId] });

        return data;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to create document"));
        throw err;
      }
    },
    [userId, queryClient]
  );

  // Update document status
  const updateDocumentStatus = useCallback(
    async (id: string, status: 'active' | 'archived') => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const { error } = await supabase
          .from("documents")
          .update({ status })
          .eq("id", id)
          .eq("user_id", userId);

        if (error) throw error;

        // Invalidate the documents query to refetch
        queryClient.invalidateQueries({ queryKey: ["documents", userId] });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to update document status"));
        throw err;
      }
    },
    [userId, queryClient]
  );

  // Process a transcript to extract ideas
  const processTranscript = useCallback(
    async (documentId: string) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        // First update document status to processing
        const { error: updateError } = await supabase
          .from("documents")
          .update({ processing_status: "processing" })
          .eq("id", documentId)
          .eq("user_id", userId);

        if (updateError) throw updateError;

        // Call the edge function to process the document
        // Pass 'extract_ideas' as the type parameter
        const { error: functionError } = await supabase.functions.invoke(
          "process-document",
          {
            body: { 
              documentId, 
              userId,
              type: 'extract_ideas' // Specify that we're extracting ideas
            },
          }
        );

        if (functionError) throw functionError;

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["documents", userId] });
        
        return true;
      } catch (err) {
        console.error("Error processing transcript:", err);
        
        // Update document status back to idle on error
        await supabase
          .from("documents")
          .update({ processing_status: "idle" })
          .eq("id", documentId)
          .eq("user_id", userId);
          
        setError(err instanceof Error ? err : new Error("Failed to process transcript"));
        throw err;
      }
    },
    [userId, queryClient]
  );

  return {
    documents,
    isLoading,
    error,
    refetch,
    uploadDocument,
    createDocument,
    updateDocumentStatus,
    processTranscript,
    uploadProgress,
    fetchDocument: useCallback((id: string) => fetchDocument(userId as string, id), [userId]),
  };
};
