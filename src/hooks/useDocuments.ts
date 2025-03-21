
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentType, DocumentPurpose } from "@/types";
import { useAuth } from "@/context/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocument } from "@/services/documents/transcript/fetchDocument";

interface DocumentUploadParams {
  file: File;
  title: string;
  type: DocumentType;
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

export const useDocuments = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const [error, setError] = useState<Error | null>(null);

  // Fetch all documents
  const {
    data: documents,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["documents", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId);

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
    async ({ file, title, type }: DocumentUploadParams) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        // Extract text content from the file
        const content = await extractTextFromFile(file);

        // Insert document in Supabase
        const { data, error } = await supabase
          .from("documents")
          .insert({
            user_id: userId,
            title,
            content,
            type,
            purpose: "business_context" as DocumentPurpose,
            content_type: file.type,
          })
          .select()
          .single();

        if (error) throw error;

        // Invalidate the documents query to refetch
        queryClient.invalidateQueries({ queryKey: ["documents", userId] });

        return data;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to upload document"));
        throw err;
      }
    },
    [userId, queryClient]
  );

  // Add text document
  const addTextDocument = useCallback(
    async ({ title, content, type }: AddTextDocumentParams) => {
      if (!userId) throw new Error("User not authenticated");

      try {
        const { data, error } = await supabase
          .from("documents")
          .insert({
            user_id: userId,
            title,
            content,
            type,
            purpose: "business_context" as DocumentPurpose,
            content_type: "text/plain",
          })
          .select()
          .single();

        if (error) throw error;

        // Invalidate the documents query to refetch
        queryClient.invalidateQueries({ queryKey: ["documents", userId] });

        return data;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to add text document"));
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
    addTextDocument,
    processTranscript,
    fetchDocument: useCallback((id: string) => fetchDocument(userId as string, id), [userId]),
  };
};
