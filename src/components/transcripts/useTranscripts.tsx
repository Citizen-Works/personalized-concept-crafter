
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
      const documentData = {
        title: title,
        type: "transcript" as const,
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
  
  const handleAddText = async (text: string, title: string) => {
    try {
      await uploadDocument({ 
        file: new File([text], `${title}.txt`, { type: "text/plain" }),
        documentData: {
          title: title,
          type: "transcript",
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
    setIsViewOpen,
    setIsIdeasDialogOpen,
    setIsUploadDialogOpen,
    setIsAddTextDialogOpen,
    handleViewTranscript,
    handleProcessTranscript,
    handleUploadDocument,
    handleAddText
  };
};
