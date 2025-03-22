
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { Document, DocumentType, DocumentCreateInput } from '@/types';
import { toast } from 'sonner';

type ProcessTranscriptStatus = {
  [key: string]: boolean;
};

export const useDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDocumentProcessing, setIsDocumentProcessing] = useState<ProcessTranscriptStatus>({});

  // Query to fetch all documents
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        const response = await fetch('/api/documents');
        if (!response.ok) throw new Error('Failed to fetch documents');
        
        const data = await response.json();
        
        // Convert date strings to Date objects
        return data.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        }));
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to fetch documents');
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  // Mutation to create a document
  const createDocumentMutation = useMutation({
    mutationFn: async (documentData: DocumentCreateInput) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...documentData,
            user_id: user.id,
          }),
        });
        
        if (!response.ok) throw new Error('Failed to create document');
        
        return await response.json();
      } catch (error) {
        console.error('Error creating document:', error);
        toast.error('Failed to create document');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast.success('Document created successfully');
    },
  });

  // Upload a document
  const uploadDocument = useCallback(async (file: File, documentData: Omit<DocumentCreateInput, 'content'>) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      // First, parse the file content using FileReader
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      // Then create the document with parsed content
      return await createDocumentMutation.mutateAsync({
        ...documentData,
        content,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      throw error;
    }
  }, [user?.id, createDocumentMutation]);

  // Mutation to process a transcript
  const processTranscriptMutation = useMutation({
    mutationFn: async (documentId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        setIsDocumentProcessing(prev => ({ ...prev, [documentId]: true }));
        
        const response = await fetch(`/api/documents/${documentId}/process`, {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to process document');
        
        return await response.json();
      } catch (error) {
        console.error('Error processing document:', error);
        toast.error('Failed to process document');
        throw error;
      } finally {
        setIsDocumentProcessing(prev => ({ ...prev, [documentId]: false }));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['ideas', user?.id] });
    },
  });

  // Function to create a document asynchronously and get the result
  const createDocumentAsync = useCallback(async (documentData: DocumentCreateInput) => {
    return await createDocumentMutation.mutateAsync(documentData);
  }, [createDocumentMutation]);

  // Function to process a transcript and get the result
  const processTranscript = useCallback(async (documentId: string) => {
    return await processTranscriptMutation.mutateAsync(documentId);
  }, [processTranscriptMutation]);

  return {
    documents,
    isLoading,
    error,
    createDocument: createDocumentMutation.mutate,
    createDocumentAsync,
    uploadDocument,
    processTranscript,
    isDocumentProcessing,
    refetch,
  };
};
