import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';

export const useTranscripts = () => {
  const { documents, isLoading, processTranscript, uploadDocument } = useDocuments({ 
    type: "transcript",
    status: "active"
  });
  
  // State management for transcript viewing and processing
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptContent, setTranscriptContent] = useState<string>("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ideas, setIdeas] = useState<string | null>(null);
  const [isIdeasDialogOpen, setIsIdeasDialogOpen] = useState(false);
  
  // Dialog state management
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddTextDialogOpen, setIsAddTextDialogOpen] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);

  /**
   * Opens the transcript viewer dialog with the specified content
   */
  const handleViewTranscript = (content: string) => {
    setTranscriptContent(content);
    setIsViewOpen(true);
  };

  /**
   * Processes a transcript to extract ideas
   */
  const handleProcessTranscript = async (id: string) => {
    setIsProcessing(true);
    setSelectedTranscript(id);
    
    try {
      const result = await processTranscript(id);
      setIdeas(result);
      setIsIdeasDialogOpen(true);
      toast.success("Transcript processed successfully");
    } catch (error) {
      console.error("Failed to process transcript:", error);
      toast.error("Failed to process transcript");
    } finally {
      setIsProcessing(false);
      setSelectedTranscript(null);
    }
  };
  
  /**
   * Uploads a document file with metadata
   */
  const handleUploadDocument = async (file: File, title: string) => {
    try {
      const documentData = {
        title: title,
        type: "other" as const,
        purpose: "business_context" as const,
        content_type: null,
        status: "active" as const
      };
      
      await uploadDocument({ file, documentData });
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
      throw error;
    }
  };
  
  /**
   * Adds text content as a document
   */
  const handleAddText = async (text: string, title: string) => {
    try {
      await uploadDocument({ 
        file: new File([text], `${title}.txt`, { type: "text/plain" }),
        documentData: {
          title: title,
          type: "other",
          purpose: "business_context",
          content_type: null,
          status: "active"
        }
      });
      
      toast.success("Text added successfully");
    } catch (error) {
      console.error("Error adding text:", error);
      toast.error("Failed to add text");
      throw error;
    }
  };

  /**
   * Handles adding a recording transcript
   */
  const handleAddRecording = async (text: string, title: string) => {
    return handleAddText(text, title);
  };
  
  /**
   * Exports transcripts to a downloadable file
   */
  const handleExportTranscripts = () => {
    if (!documents || documents.length === 0) {
      toast.error("No transcripts available to export");
      return;
    }
    
    try {
      // Create a formatted text with all transcripts
      const formattedData = documents.map(doc => {
        return `# ${doc.title}\nDate: ${doc.createdAt.toLocaleString()}\n\n${doc.content}\n\n---\n\n`;
      }).join('');
      
      // Create a blob and download link
      const blob = new Blob([formattedData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set up download attributes
      link.href = url;
      link.download = `transcripts-export-${new Date().toISOString().split('T')[0]}.txt`;
      
      // Add to DOM, trigger download, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Transcripts exported successfully");
    } catch (error) {
      console.error("Error exporting transcripts:", error);
      toast.error("Failed to export transcripts");
    }
  };

  return {
    // Data
    documents,
    isLoading,
    isProcessing,
    selectedTranscript,
    transcriptContent,
    ideas,
    
    // Dialog states
    isViewOpen,
    isIdeasDialogOpen,
    isUploadDialogOpen,
    isAddTextDialogOpen,
    isRecordingDialogOpen,
    
    // Dialog actions
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    setIsRecordingDialogOpen,
    
    // Handler methods
    handleViewTranscript,
    handleProcessTranscript,
    handleUploadDocument,
    handleAddText,
    handleAddRecording,
    handleExportTranscripts
  };
};
