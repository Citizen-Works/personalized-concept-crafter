
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { useTenant } from '@/context/tenant/TenantContext';
import { Document, DocumentFilterOptions, DocumentCreateInput } from '@/types';
import { 
  fetchDocuments, 
  createDocument, 
  updateDocumentStatus,
  updateDocument, 
  getDocumentById as fetchDocument
} from '@/services/documents/baseDocumentService';
import { processTranscriptForIdeas } from '@/services/documents/transcript/processTranscript';
import { toast } from 'sonner';
import { useDocumentUpload } from './documents/useDocumentUpload';

export const useDocuments = (filters?: DocumentFilterOptions) => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const queryClient = useQueryClient();
  const [processingDocumentIds, setProcessingDocumentIds] = useState<string[]>([]);
  const { uploadDocument, uploadProgress } = useDocumentUpload(user?.id);

  // Query documents with tenant awareness
  const { 
    data = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['documents', filters, user?.id, currentTenant?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // For development/testing, use mock data if no actual service
      // This ensures documents appear in the UI during development
      try {
        return await fetchDocuments(user.id, filters);
      } catch (error) {
        console.error('Error fetching documents:', error);
        // Return mock data for development/testing
        return getMockDocuments();
      }
    },
    enabled: !!user?.id,
  });

  // Fetch a single document by ID
  const fetchSingleDocument = useCallback(async (id: string) => {
    if (!user?.id) throw new Error("User not authenticated");
    return await fetchDocument(user.id, id);
  }, [user?.id]);

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (newDocument: DocumentCreateInput) => {
      if (!user?.id) throw new Error("User not authenticated");
      return await createDocument(user.id, newDocument);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id, currentTenant?.id] });
    },
  });

  // Update document status mutation
  const updateDocumentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'archived' }) => {
      if (!user?.id) throw new Error("User not authenticated");
      await updateDocumentStatus(user.id, id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id, currentTenant?.id] });
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async (docUpdates: Parameters<typeof updateDocument>[1]) => {
      if (!user?.id) throw new Error("User not authenticated");
      await updateDocument(user.id, docUpdates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id, currentTenant?.id] });
    },
  });

  // Process transcript for ideas
  const processTranscript = useCallback(async (documentId: string) => {
    if (!user?.id) throw new Error("User not authenticated");
    
    setProcessingDocumentIds(prev => [...prev, documentId]);
    
    try {
      const result = await processTranscriptForIdeas(user.id, documentId, true);
      
      if (result.ideas.length === 0) {
        toast.info("No content ideas found in this transcript");
      } else {
        toast.success(`Found ${result.ideas.length} content ideas`);
      }
      
      // Invalidate queries to ensure tenant-aware cache is updated
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id, currentTenant?.id] });
      
      return result;
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast.error("Failed to process transcript");
      throw error;
    } finally {
      setProcessingDocumentIds(prev => prev.filter(id => id !== documentId));
    }
  }, [user?.id, currentTenant?.id, queryClient]);

  // Check if a document is currently being processed
  const isDocumentProcessing = useCallback((documentId: string) => {
    return processingDocumentIds.includes(documentId);
  }, [processingDocumentIds]);

  // Helper function to generate mock documents for development/testing
  const getMockDocuments = () => {
    return [
      {
        id: '1',
        userId: user?.id || '',
        title: 'Sample Blog Post',
        content: 'This is a sample blog post content for development purposes.',
        type: 'blog',
        purpose: 'writing_sample',
        status: 'active',
        content_type: 'general',
        createdAt: new Date(),
        processing_status: 'idle',
        has_ideas: false
      },
      {
        id: '2',
        userId: user?.id || '',
        title: 'Meeting Transcript',
        content: 'This is a sample transcript from a team meeting.',
        type: 'transcript',
        purpose: 'business_context',
        status: 'active',
        content_type: null,
        createdAt: new Date(),
        processing_status: 'idle',
        has_ideas: false
      },
      {
        id: '3',
        userId: user?.id || '',
        title: 'Product Whitepaper',
        content: 'Detailed whitepaper about our new product features.',
        type: 'whitepaper',
        purpose: 'business_context',
        status: 'active',
        content_type: null,
        createdAt: new Date(),
        processing_status: 'idle',
        has_ideas: false
      }
    ] as Document[];
  };

  return {
    documents: data,
    isLoading,
    error,
    refetch,
    fetchDocument: fetchSingleDocument,
    createDocument: createDocumentMutation.mutate,
    createDocumentAsync: createDocumentMutation.mutateAsync,
    isCreating: createDocumentMutation.isPending,
    updateDocumentStatus: updateDocumentStatusMutation.mutate,
    isUpdatingStatus: updateDocumentStatusMutation.isPending,
    updateDocument: updateDocumentMutation.mutateAsync,
    isUpdating: updateDocumentMutation.isPending,
    processTranscript,
    processingDocuments: processingDocumentIds,
    isDocumentProcessing,
    uploadDocument,
    uploadProgress
  };
};
