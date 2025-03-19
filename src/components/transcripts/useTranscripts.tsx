
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';

export const useTranscripts = () => {
  const { documents, isLoading, processTranscript, uploadDocument } = useDocuments({ 
    type: "transcript",
    status: "active"
  });
  
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptContent, setTranscriptContent] = useState<string>("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ideas, setIdeas] = useState<string | null>(null);
  const [isIdeasDialogOpen, setIsIdeasDialogOpen] = useState(false);
  
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddTextDialogOpen, setIsAddTextDialogOpen] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);

  const handleViewTranscript = (content: string) => {
    setTranscriptContent(content);
    setIsViewOpen(true);
  };

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
  
  const handleUploadDocument = async (file: File, title: string) => {
    try {
      // Using "meeting_transcript" type instead of "transcript" to match database constraints
      const documentData = {
        title: title,
        type: "meeting_transcript" as const,
        purpose: "business_context" as const,
        content_type: null,
        status: "active" as const
      };
      
      await uploadDocument({ file, documentData });
      toast.success("Transcript uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
      throw error;
    }
  };
  
  const handleAddText = async (text: string, title: string) => {
    if (!text.trim()) {
      toast.error("Text content cannot be empty");
      throw new Error("Text content cannot be empty");
    }
    
    try {
      await uploadDocument({ 
        file: new File([text], `${title}.txt`, { type: "text/plain" }),
        documentData: {
          title: title,
          type: "meeting_transcript" as const,
          purpose: "business_context" as const,
          content_type: null,
          status: "active" as const
        }
      });
      
      toast.success("Text added successfully");
    } catch (error) {
      console.error("Error adding text:", error);
      toast.error("Failed to add text");
      throw error;
    }
  };

  const handleAddRecording = async (text: string, title: string): Promise<void> => {
    if (!text.trim()) {
      toast.error("Recorded text cannot be empty");
      throw new Error("Recorded text cannot be empty");
    }
    
    try {
      await handleAddText(text, title);
      toast.success("Recording transcript added successfully");
    } catch (error) {
      console.error("Error adding recording:", error);
      toast.error("Failed to add recording transcript");
      throw error;
    }
  };
  
  const handleExportTranscripts = () => {
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
  };

  return {
    documents,
    isLoading,
    isProcessing,
    selectedTranscript,
    transcriptContent,
    ideas,
    
    isViewOpen,
    isIdeasDialogOpen,
    isUploadDialogOpen,
    isAddTextDialogOpen,
    isRecordingDialogOpen,
    
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    setIsRecordingDialogOpen,
    
    handleViewTranscript,
    handleProcessTranscript,
    handleUploadDocument,
    handleAddText,
    handleAddRecording,
    handleExportTranscripts
  };
};
