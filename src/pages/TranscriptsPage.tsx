
import React, { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Calendar, AlignLeft, BrainCircuit } from "lucide-react";
import { format } from "date-fns";
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';

const TranscriptsPage = () => {
  const { documents, isLoading, processTranscript } = useDocuments({ 
    type: "transcript",
    status: "active"
  });
  
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptContent, setTranscriptContent] = useState<string>("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ideas, setIdeas] = useState<string | null>(null);
  const [isIdeasDialogOpen, setIsIdeasDialogOpen] = useState(false);

  const handleViewTranscript = (content: string) => {
    setTranscriptContent(content);
    setIsViewOpen(true);
  };

  const handleProcessTranscript = async (id: string) => {
    setIsProcessing(true);
    setSelectedTranscript(id);
    
    try {
      const result = await processTranscript(id);
      // Check if result exists and is not null/undefined before setting state
      if (result && typeof result === 'string') {
        setIdeas(result);
        setIsIdeasDialogOpen(true);
        toast.success("Transcript processed successfully");
      } else {
        toast.error("Failed to process transcript");
      }
    } catch (error) {
      console.error("Failed to process transcript:", error);
      toast.error("Failed to process transcript");
    } finally {
      setIsProcessing(false);
      setSelectedTranscript(null);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meeting Transcripts</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-center">No Transcripts Yet</h3>
              <p className="text-muted-foreground text-center mt-2 max-w-md">
                Connect your meeting transcription services in Settings to automatically import meeting transcripts.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/settings?tab=webhooks'}
              >
                Configure Webhooks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-lg">{doc.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(doc.createdAt, "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {doc.content.substring(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewTranscript(doc.content)}
                  >
                    <AlignLeft className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleProcessTranscript(doc.id)}
                    disabled={isProcessing && selectedTranscript === doc.id}
                  >
                    {isProcessing && selectedTranscript === doc.id ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <BrainCircuit className="h-4 w-4 mr-1" />
                        Extract Ideas
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Transcript Viewer Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transcript Content</DialogTitle>
              <DialogDescription>
                View the full transcript content below
              </DialogDescription>
            </DialogHeader>
            <div className="whitespace-pre-wrap text-sm">
              {transcriptContent}
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Generated Ideas Dialog */}
        <Dialog open={isIdeasDialogOpen} onOpenChange={setIsIdeasDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generated Content Ideas</DialogTitle>
              <DialogDescription>
                Here are the content ideas extracted from your transcript
              </DialogDescription>
            </DialogHeader>
            <div className="whitespace-pre-wrap text-sm">
              {ideas}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TranscriptsPage;
