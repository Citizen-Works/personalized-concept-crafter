
import { useState, useCallback, useMemo } from 'react';
import { Document } from '@/types';

export interface IdeaItem {
  id: string;
  title: string;
  description: string;
}

export interface IdeasResponse {
  message: string;
  ideas: IdeaItem[];
}

export const useDocumentProcessing = (
  documents: Document[] = [],
  processTranscript: (id: string) => Promise<void>
) => {
  const [processingDocuments, setProcessingDocuments] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);

  // Check if processing is happening
  const isProcessing = processingDocuments.length > 0;

  // Check if a specific document is being processed
  const isDocumentProcessing = useCallback(
    (id: string) => processingDocuments.includes(id),
    [processingDocuments]
  );

  // Update the list of documents being processed
  const updateProcessingDocuments = useCallback((ids: string[]) => {
    setProcessingDocuments(ids);
  }, []);

  // Handle processing a transcript
  const handleProcessTranscript = useCallback(
    async (id: string) => {
      if (isDocumentProcessing(id)) return;

      try {
        setProcessingDocuments((prev) => [...prev, id]);
        
        // Now processTranscript will handle the 'extract_ideas' type
        await processTranscript(id);
        
      } catch (error) {
        console.error('Error processing document:', error);
      } finally {
        setProcessingDocuments((prev) => prev.filter((docId) => docId !== id));
      }
    },
    [isDocumentProcessing, processTranscript]
  );

  // Cancel processing for all documents
  const cancelProcessing = useCallback(() => {
    setProcessingDocuments([]);
  }, []);

  return useMemo(
    () => ({
      isProcessing,
      processingDocuments,
      ideas,
      handleProcessTranscript,
      isDocumentProcessing,
      updateProcessingDocuments,
      cancelProcessing
    }),
    [
      isProcessing,
      processingDocuments,
      ideas,
      handleProcessTranscript,
      isDocumentProcessing,
      updateProcessingDocuments,
      cancelProcessing
    ]
  );
};
