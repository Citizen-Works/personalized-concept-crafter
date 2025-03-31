import { useState, useCallback, useMemo } from 'react';
import { Document } from '@/types';
import { IdeaItem } from '../useTranscriptProcessing';
import { useTranscriptDialogs } from '../useTranscriptDialogs';
import { useTranscriptsApi } from '@/hooks/api/useTranscriptsApi';

export interface IdeasResponse {
  message: string;
  ideas: IdeaItem[];
}

export const useDocumentProcessing = (
  documents: Document[] = []
) => {
  const [processingDocuments, setProcessingDocuments] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [processingError, setProcessingError] = useState<string>();
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const { setIsIdeasDialogOpen } = useTranscriptDialogs();
  const { processTranscript } = useTranscriptsApi();

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
      console.log('Starting document processing:', { id, isProcessing });
      if (isDocumentProcessing(id)) {
        console.log('Document already processing, returning');
        return;
      }

      console.log('Setting initial states');
      setProcessingDocuments((prev) => [...prev, id]);
      setProcessingError(undefined);
      console.log('Initial states set');
      
      try {
        console.log('Calling processTranscript');
        // Process the transcript and get the results
        const result = await processTranscript(id);
        console.log('Process result:', result);
        
        // Update the ideas state with the results
        if (result && result.ideas) {
          console.log('Setting ideas:', result.ideas);
          setIdeas(result.ideas);
        }
        
      } catch (error) {
        console.error('Error processing document:', error);
        setProcessingError(error instanceof Error ? error.message : 'Failed to process document');
        throw error; // Propagate error to parent
      } finally {
        console.log('Cleaning up processing state');
        setProcessingDocuments((prev) => prev.filter((docId) => docId !== id));
      }
    },
    [isDocumentProcessing, processTranscript]
  );

  // Cancel processing for all documents
  const cancelProcessing = useCallback(() => {
    setProcessingDocuments([]);
  }, []);

  // Handle viewing all ideas
  const handleViewIdeas = useCallback(() => {
    setIsProgressDialogOpen(false);
    setIsIdeasDialogOpen(true);
  }, [setIsIdeasDialogOpen]);

  return useMemo(
    () => ({
      isProcessing,
      processingDocuments,
      ideas,
      processingError,
      isProgressDialogOpen,
      handleProcessTranscript,
      isDocumentProcessing,
      updateProcessingDocuments,
      cancelProcessing,
      handleViewIdeas,
      setIsProgressDialogOpen,
      setProcessingError
    }),
    [
      isProcessing,
      processingDocuments,
      ideas,
      processingError,
      isProgressDialogOpen,
      handleProcessTranscript,
      isDocumentProcessing,
      updateProcessingDocuments,
      cancelProcessing,
      handleViewIdeas,
      setIsProgressDialogOpen,
      setProcessingError
    ]
  );
};
