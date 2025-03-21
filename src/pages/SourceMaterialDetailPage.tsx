
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
  FileType
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";

const SourceMaterialDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isContentCopied, setIsContentCopied] = useState(false);
  
  const { 
    fetchDocument, 
    isLoading, 
    error,
    processTranscript
  } = useDocuments();
  
  const [document, setDocument] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      fetchDocument(id)
        .then(doc => setDocument(doc))
        .catch(err => console.error("Failed to fetch document:", err));
    }
  }, [id, fetchDocument]);
  
  const handleExtractIdeas = async () => {
    if (!document) return;
    
    try {
      await processTranscript(document.id);
      toast({
        title: "Processing started",
        description: "We're extracting ideas from this material",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "Failed to extract ideas from this material",
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
  
  const isTranscript = document.type === 'transcript';
  const documentTypeLabel = isTranscript ? 'Transcript' : 'Document';
  
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
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Extract Ideas
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content</CardTitle>
            {document.processing_status === 'processing' && (
              <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                Processing
              </Badge>
            )}
            {document.has_ideas && (
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                Ideas Generated
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
