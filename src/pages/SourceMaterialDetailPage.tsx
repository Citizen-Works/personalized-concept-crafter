
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft,
  FileText,
  Calendar,
  Lightbulb,
  Download,
  ClipboardCopy,
  ExternalLink,
  FileType,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const SourceMaterialDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isContentCopied, setIsContentCopied] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    fetchDocument, 
    isLoading, 
    error,
    processTranscript
  } = useDocuments();
  
  const [document, setDocument] = useState<any>(null);
  
  // Function to poll document status
  const pollDocumentStatus = async (docId: string) => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("processing_status, has_ideas, ideas_count")
        .eq("id", docId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Update local document state with latest status
        setDocument(prev => ({
          ...prev,
          processing_status: data.processing_status,
          has_ideas: data.has_ideas,
          ideas_count: data.ideas_count
        }));
        
        // If still processing, continue polling
        if (data.processing_status === 'processing') {
          setTimeout(() => pollDocumentStatus(docId), 2000);
        } else if (data.processing_status === 'failed') {
          setProcessingError("Processing failed. Please try again.");
          setIsProcessing(false);
        } else {
          setIsProcessing(false);
          
          // Show success message if ideas were generated
          if (data.has_ideas) {
            toast({
              title: "Ideas generated successfully",
              description: `Generated ${data.ideas_count} ideas from this document`,
            });
          } else {
            toast({
              title: "Processing complete",
              description: "No ideas were found in this document",
            });
          }
        }
      }
    } catch (err) {
      console.error("Error polling document status:", err);
      // Don't set processing error here, just stop polling
      setIsProcessing(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      console.log(`Fetching document with ID: ${id}`);
      
      // First try direct Supabase query as fallback
      const fetchDirectly = async () => {
        try {
          const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("id", id)
            .single();
            
          if (error) {
            console.log("Direct fetch failed, trying service layer:", error);
            // Fall back to service layer
            return fetchDocument(id)
              .then(doc => {
                console.log("Document fetched successfully via service:", doc.title);
                setDocument(doc);
              })
              .catch(err => handleFetchError(err));
          }
          
          if (data) {
            console.log("Document fetched successfully via direct query:", data.title);
            setDocument(data);
          } else {
            toast({
              variant: "destructive",
              title: "Document not found",
              description: "Could not find the requested document."
            });
          }
        } catch (err) {
          handleFetchError(err);
        }
      };
      
      const handleFetchError = (err: any) => {
        console.error("Failed to fetch document:", err);
        
        toast({
          variant: "destructive",
          title: "Error loading document",
          description: "Could not load the requested document. Redirecting to materials list.",
        });
        
        setTimeout(() => {
          navigate('/source-materials');
        }, 2000);
      };
      
      fetchDirectly();
    }
  }, [id, fetchDocument, navigate, toast]);
  
  const handleExtractIdeas = async () => {
    if (!document) return;
    
    setProcessingError(null);
    setIsProcessing(true);
    setRetryCount(prev => prev + 1);
    
    try {
      console.log(`Starting idea extraction for document: ${document.id} (Attempt ${retryCount + 1})`);
      
      // Update the document status to processing
      try {
        await supabase
          .from("documents")
          .update({ processing_status: 'processing' })
          .eq("id", document.id);
      } catch (statusError) {
        console.error("Error updating status:", statusError);
        // Continue even if status update fails
      }
      
      // Start processing
      await processTranscript(document.id);
      
      // Start polling for status updates
      pollDocumentStatus(document.id);
      
      toast({
        title: "Processing started",
        description: "We're extracting ideas from this document",
      });
    } catch (error) {
      console.error("Error processing document:", error);
      setIsProcessing(false);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to extract ideas from this material";
      setProcessingError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: errorMessage,
      });
    }
  };
  
  const handleCopyContent = () => {
    if (!document?.content) return;
    
    navigator.clipboard.writeText(document.content)
      .then(() => {
        setIsContentCopied(true);
        toast({
          title: "Content copied",
          description: "Content copied to clipboard",
        });
        
        setTimeout(() => setIsContentCopied(false), 2000);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Failed to copy content to clipboard",
        });
      });
  };
  
  const handleDownload = () => {
    if (!document) return;
    
    const filename = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (isLoading || !document) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/source-materials')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Materials
        </Button>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/source-materials')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Materials
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Material</CardTitle>
            <CardDescription>
              There was a problem loading this source material. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(0)}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const documentTypeLabel = document?.type === 'transcript' ? 'Transcript' : document?.type || 'Document';
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/source-materials')}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Materials
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="flex items-center gap-1">
              <FileType className="h-3 w-3" />
              {documentTypeLabel}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(document.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
          <Button 
            variant="outline" 
            onClick={handleCopyContent}
          >
            <ClipboardCopy className="mr-2 h-4 w-4" />
            {isContentCopied ? "Copied!" : "Copy"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          
          <Button 
            onClick={handleExtractIdeas}
            disabled={isProcessing || document.processing_status === 'processing'}
            variant="default"
          >
            {isProcessing || document.processing_status === 'processing' ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Extract Ideas
              </>
            )}
          </Button>
        </div>
      </div>
      
      {processingError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{processingError}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExtractIdeas} 
              disabled={isProcessing}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content</CardTitle>
            {(isProcessing || document.processing_status === 'processing') && (
              <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                Processing
              </Badge>
            )}
            {document.has_ideas && (
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                Ideas Generated
              </Badge>
            )}
            {document.processing_status === 'failed' && !isProcessing && (
              <Badge variant="outline" className="bg-red-100 dark:bg-red-900">
                Processing Failed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md max-h-[60vh] overflow-y-auto">
            {document.content || "No content available."}
          </div>
        </CardContent>
        {document.has_ideas && (
          <CardFooter className="border-t flex justify-end p-4">
            <Button 
              variant="outline" 
              className="gap-1"
              onClick={() => navigate('/pipeline?tab=ideas')}
            >
              <ExternalLink className="h-4 w-4" />
              View Generated Ideas
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SourceMaterialDetailPage;
