import React, { useCallback } from 'react';
import TranscriptList from '@/components/transcripts/TranscriptList';
import TranscriptActions from '@/components/transcripts/TranscriptActions';
import TranscriptViewDialog from '@/components/transcripts/TranscriptViewDialog';
import IdeasDialog from '@/components/transcripts/IdeasDialog';
import UploadDialog from '@/components/transcripts/UploadDialog';
import AddTextDialog from '@/components/transcripts/AddTextDialog';
import RecordingDialog from '@/components/transcripts/RecordingDialog';
import { useTranscripts } from '@/components/transcripts/useTranscripts';
import { useTranscriptProcessing } from '@/hooks/transcripts/useTranscriptProcessing';
import { useTranscriptDialogs } from '@/hooks/transcripts/useTranscriptDialogs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, BrainCircuit, Loader2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessingProgressDialog } from '@/components/documents/ProcessingProgressDialog';

const TranscriptsPage = () => {
  const {
    documents,
    isLoading,
    selectedTranscript,
    transcriptContent,
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
    handleViewTranscript: baseHandleViewTranscript,
    handleUploadDocument,
    handleAddText,
    handleAddRecording,
    handleExportTranscripts
  } = useTranscripts();

  const {
    isProcessing,
    processingDocuments,
    ideas,
    processingError,
    isProgressDialogOpen,
    handleProcessTranscript: baseHandleProcessTranscript,
    isDocumentProcessing,
    cancelProcessing,
    handleViewIdeas,
    setIsProgressDialogOpen
  } = useTranscriptProcessing(documents);

  // Add effect to log dialog state changes
  React.useEffect(() => {
    console.log('TranscriptsPage: Dialog state changed:', {
      isProgressDialogOpen,
      isProcessing,
      hasIdeas: ideas?.length > 0,
      error: processingError
    });
  }, [isProgressDialogOpen, isProcessing, ideas, processingError]);

  // Wrap the process handler to manage dialog state
  const handleProcessTranscript = useCallback(async (id: string) => {
    console.log('TranscriptsPage: Starting process with dialog:', id);
    try {
      await baseHandleProcessTranscript(id);
    } catch (error) {
      console.error('TranscriptsPage: Process error:', error);
    }
  }, [baseHandleProcessTranscript]);

  const handleViewTranscript = useCallback((content: string) => {
    baseHandleViewTranscript(content);
    setIsViewOpen(true);
  }, [baseHandleViewTranscript, setIsViewOpen]);

  const hasTranscripts = documents && documents.length > 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transcripts</h1>
        <p className="text-muted-foreground">
          Upload, record, or add text transcripts to extract content ideas
        </p>
      </div>

      <TranscriptActions 
        onOpenUpload={() => setIsUploadDialogOpen(true)}
        onOpenAddText={() => setIsAddTextDialogOpen(true)}
        onOpenRecording={() => setIsRecordingDialogOpen(true)} 
        onExport={handleExportTranscripts}
        hasTranscripts={hasTranscripts}
      />

      {isLoading ? (
        <Card className="p-8">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading transcripts...</span>
          </CardContent>
        </Card>
      ) : !hasTranscripts ? (
        <TranscriptEmptyState 
          onOpenUpload={() => setIsUploadDialogOpen(true)}
          onOpenAddText={() => setIsAddTextDialogOpen(true)}
          onOpenRecording={() => setIsRecordingDialogOpen(true)}
        />
      ) : (
        <ScrollArea className="h-[calc(100vh-230px)] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Date</TableHead>
                <TableHead>Title & Content</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[200px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const isCurrentlyProcessing = isDocumentProcessing(doc.id) || doc.processing_status === 'processing';
                
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="whitespace-nowrap">{format(doc.createdAt, "MMM d, yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{doc.title}</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {doc.content.substring(0, 150)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {isCurrentlyProcessing ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 flex items-center gap-1 mx-auto">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing
                        </Badge>
                      ) : doc.has_ideas ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 mx-auto">
                          {doc.ideas_count} Ideas
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted mx-auto">
                          Ready
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTranscript(doc.content)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {isCurrentlyProcessing ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => cancelProcessing()}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleProcessTranscript(doc.id)}
                            disabled={isCurrentlyProcessing || (isProcessing && selectedTranscript === doc.id)}
                          >
                            <BrainCircuit className="h-4 w-4 mr-1" />
                            {doc.has_ideas ? "View Ideas" : "Extract"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      )}

      <TranscriptViewDialog 
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        content={transcriptContent}
      />

      <IdeasDialog 
        isOpen={isIdeasDialogOpen}
        onOpenChange={setIsIdeasDialogOpen}
        ideas={{ message: "Ideas extracted from transcript", ideas: ideas }}
      />
      
      <UploadDialog 
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUploadDocument}
      />
      
      <AddTextDialog 
        isOpen={isAddTextDialogOpen}
        onOpenChange={setIsAddTextDialogOpen}
        onAddText={handleAddText}
      />
      
      <RecordingDialog
        isOpen={isRecordingDialogOpen}
        onOpenChange={setIsRecordingDialogOpen}
        onSaveRecording={handleAddRecording}
      />

      <ProcessingProgressDialog
        isOpen={isProgressDialogOpen}
        onOpenChange={setIsProgressDialogOpen}
        isProcessing={isProcessing}
        ideas={ideas || []}
        error={processingError}
        onViewIdeas={handleViewIdeas}
      />
    </div>
  );
};

interface TranscriptEmptyStateProps {
  onOpenUpload: () => void;
  onOpenAddText: () => void;
  onOpenRecording: () => void;
}

const TranscriptEmptyState: React.FC<TranscriptEmptyStateProps> = ({ onOpenUpload, onOpenAddText, onOpenRecording }) => (
  <Card className="bg-muted/50">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-center">No Documents Yet</h3>
      <p className="text-muted-foreground text-center mt-2 max-w-md">
        Upload transcripts, add text, or record your voice to extract content ideas.
      </p>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <Button 
          variant="outline" 
          onClick={onOpenAddText}
        >
          <FileText className="h-4 w-4 mr-2" />
          Add Text
        </Button>
        <Button 
          variant="outline"
          onClick={onOpenRecording}
        >
          <Loader2 className="h-4 w-4 mr-2" />
          Record Voice
        </Button>
        <Button 
          onClick={onOpenUpload}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default TranscriptsPage;
