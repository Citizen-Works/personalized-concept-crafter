import { useState, useCallback, useEffect } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { DocumentType } from '@/types';
import { useNavigate } from 'react-router-dom';

// Interface for idea items returned from the API
interface IdeaItem {
  id: string;
  title: string;
  description: string;
}

// Interface for the structured ideas response
interface IdeasResponse {
  message: string;
  ideas: IdeaItem[];
}

export const useTranscripts = () => {
  const navigate = useNavigate();
  
  // Use the correct document type for the query
  const { documents, isLoading, processTranscript, uploadDocument } = useDocuments({ 
    type: "transcript" as DocumentType,
    status: "active"
  });
  
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptContent, setTranscriptContent] = useState<string>("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDocuments, setProcessingDocuments] = useState<Set<string>>(new Set());
  const [ideas, setIdeas] = useState<IdeasResponse | string | null>(null);
  const [isIdeasDialogOpen, setIsIdeasDialogOpen] = useState(false);
  
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddTextDialogOpen, setIsAddTextDialogOpen] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);

  // Check for processing documents in local storage on initial load
  useEffect(() => {
    const storedProcessingDocs = localStorage.getItem('processingDocuments');
    if (storedProcessingDocs) {
      try {
        setProcessingDocuments(new Set(JSON.parse(storedProcessingDocs)));
      } catch (e) {
        console.error('Error parsing processing documents from localStorage:', e);
      }
    }
  }, []);

  // Update local storage when processing documents change
  useEffect(() => {
    if (processingDocuments.size > 0) {
      localStorage.setItem('processingDocuments', JSON.stringify([...processingDocuments]));
    } else {
      localStorage.removeItem('processingDocuments');
    }
  }, [processingDocuments]);
  
  // Update processing documents based on document status
  useEffect(() => {
    if (documents && documents.length > 0) {
      // Check if any documents have processing_status = 'processing'
      documents.forEach(doc => {
        if (doc.processing_status === 'processing') {
          setProcessingDocuments(prev => new Set([...prev, doc.id]));
        } else if (doc.processing_status === 'completed' || doc.processing_status === 'failed') {
          // Remove from processing list if completed or failed
          setProcessingDocuments(prev => {
            const next = new Set([...prev]);
            next.delete(doc.id);
            return next;
          });
          
          // Show completion toast if it was in the processing set
          if (processingDocuments.has(doc.id) && doc.processing_status === 'completed') {
            toast.success(`Ideas extracted from "${doc.title}"`, {
              duration: 5000,
              action: {
                label: "View Ideas",
                onClick: () => navigate('/ideas')
              }
            });
          }
        }
      });
    }
  }, [documents, processingDocuments, navigate]);

  const handleViewTranscript = (content: string) => {
    setTranscriptContent(content);
    setIsViewOpen(true);
  };

  const handleProcessTranscript = async (id: string) => {
    try {
      // Mark as processing in UI
      setProcessingDocuments(prev => new Set([...prev, id]));
      
      // Start background processing
      toast.info("Starting idea extraction in the background. You can continue using the app.", {
        duration: 5000,
        description: "You'll be notified when it's complete."
      });
      
      // Process in background mode
      await processTranscript(id, true);
      
      // We don't show the results directly anymore, just notify the user
      toast.success("Transcript is being processed. You'll be notified when it's complete.", {
        duration: 5000,
        action: {
          label: "View Ideas",
          onClick: () => navigate('/ideas')
        }
      });
    } catch (error) {
      console.error("Failed to process transcript:", error);
      toast.error("Failed to start idea extraction");
      
      // Remove from processing list
      setProcessingDocuments(prev => {
        const next = new Set([...prev]);
        next.delete(id);
        return next;
      });
    }
  };
  
  const handleUploadDocument = async (file: File, title: string) => {
    try {
      // Using "transcript" type to match database constraints
      const documentData = {
        title: title,
        type: "transcript" as DocumentType,
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
          type: "transcript" as DocumentType,
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

  // Check if a document is currently being processed
  const isDocumentProcessing = useCallback((id: string) => {
    const doc = documents.find(d => d.id === id);
    return processingDocuments.has(id) || (doc && doc.processing_status === 'processing');
  }, [processingDocuments, documents]);

  return {
    documents,
    isLoading,
    isProcessing,
    selectedTranscript,
    transcriptContent,
    ideas,
    processingDocuments,
    isDocumentProcessing,
    
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
