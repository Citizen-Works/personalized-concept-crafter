import { useState, useCallback, useEffect } from 'react';
import { useTranscriptsApi } from '@/hooks/api/useTranscriptsApi';
import { Document } from '@/types';
import { saveAs } from 'file-saver';

/**
 * Hook for managing transcript list functionality
 */
export function useTranscriptList() {
  const { fetchTranscripts } = useTranscriptsApi();
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptContent, setTranscriptContent] = useState<string>('');

  console.log('useTranscriptList - Raw fetchTranscripts:', fetchTranscripts);
  
  const documents = fetchTranscripts.data || [];
  const isLoading = fetchTranscripts.isPending;

  // Log whenever documents change
  useEffect(() => {
    console.log('Documents updated:', {
      count: documents.length,
      documents,
      queryState: {
        isLoading: fetchTranscripts.isPending,
        isError: fetchTranscripts.isError,
        error: fetchTranscripts.error
      }
    });
  }, [documents, fetchTranscripts]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (fetchTranscripts.refetch) {
      console.log('Initial fetch of transcripts');
      fetchTranscripts.refetch();
    }
  }, [fetchTranscripts]);

  /**
   * Handle viewing a transcript
   */
  const handleViewTranscript = useCallback((content: string) => {
    setTranscriptContent(content);
  }, []);

  /**
   * Handle exporting transcripts
   */
  const handleExportTranscripts = useCallback(async () => {
    try {
      // Create a text file with all transcript content
      const content = documents
        .map(doc => `${doc.title}\n\n${doc.content}\n\n---\n\n`)
        .join('');
      
      // Create and save the file
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'transcripts.txt');
    } catch (error) {
      console.error('Error exporting transcripts:', error);
    }
  }, [documents]);

  return {
    documents,
    isLoading,
    selectedTranscript,
    transcriptContent,
    handleViewTranscript,
    handleExportTranscripts
  };
}
