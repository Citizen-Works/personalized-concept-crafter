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
  const handleExportTranscripts = useCallback(() => {
    // Generate a CSV string from the documents
    const header = "Title,Created At,Content\n";
    const csvContent = documents.reduce((acc, doc) => {
      const title = doc.title.replace(/,/g, ' ');
      const content = doc.content.replace(/,/g, ' ').replace(/\n/g, ' ');
      const createdAt = doc.createdAt.toLocaleDateString();
      return acc + `"${title}","${createdAt}","${content}"\n`;
    }, header);

    // Create a blob and save it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `transcripts-export-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [documents]);

  return {
    documents,
    isLoading,
    selectedTranscript,
    transcriptContent,
    handleViewTranscript,
    handleExportTranscripts,
    refetch: fetchTranscripts.refetch
  };
}
