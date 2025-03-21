
import { useState, useCallback } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { DocumentType } from '@/types';

export const useTranscriptList = () => {
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptContent, setTranscriptContent] = useState<string>("");

  // Use the correct document type for the query
  const { documents, isLoading } = useDocuments({ 
    type: "transcript" as DocumentType,
    status: "active"
  });

  const handleViewTranscript = useCallback((content: string) => {
    setTranscriptContent(content);
  }, []);

  const handleExportTranscripts = useCallback(() => {
    if (!documents || documents.length === 0) {
      toast.error("No transcripts available to export");
      return;
    }
    
    try {
      const formattedData = documents.map(doc => {
        return `# ${doc.title}\nDate: ${doc.createdAt.toLocaleString()}\n\n${doc.content}\n\n---\n\n`;
      }).join('');
      
      const blob = new Blob([formattedData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `transcripts-export-${new Date().toISOString().split('T')[0]}.txt`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Transcripts exported successfully");
    } catch (error) {
      console.error("Error exporting transcripts:", error);
      toast.error("Failed to export transcripts");
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
};
