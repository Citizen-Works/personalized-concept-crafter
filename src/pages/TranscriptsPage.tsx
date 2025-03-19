
import React, { useState, useRef } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileText, Calendar, AlignLeft, BrainCircuit, Upload, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TranscriptsPage = () => {
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
  
  // New states for document upload and manual text entry
  const [uploadTitle, setUploadTitle] = useState("");
  const [manualText, setManualText] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleViewTranscript = (content: string) => {
    setTranscriptContent(content);
    setIsViewOpen(true);
  };

  const handleProcessTranscript = async (id: string) => {
    setIsProcessing(true);
    setSelectedTranscript(id);
    
    try {
      processTranscript(id, {
        onSuccess: (result) => {
          setIdeas(result);
          setIsIdeasDialogOpen(true);
          toast.success("Transcript processed successfully");
        },
        onError: (error) => {
          console.error("Failed to process transcript:", error);
          toast.error("Failed to process transcript");
        }
      });
    } finally {
      setIsProcessing(false);
      setSelectedTranscript(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadTitle(file.name.split('.')[0]);
    }
  };
  
  const handleUploadDocument = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Please select a file to upload");
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    try {
      const documentData = {
        title: uploadTitle || file.name.split('.')[0],
        type: "transcript" as const,
        purpose: "business_context" as const,
        content_type: null,
        status: "active" as const
      };
      
      await uploadDocument({ file, documentData });
      
      setIsUploadDialogOpen(false);
      setUploadTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    }
  };
  
  const handleAddText = async () => {
    if (!manualText) {
      toast.error("Please enter text content");
      return;
    }
    
    try {
      await uploadDocument({ 
        file: new File([manualText], `${manualTitle || 'New Text'}.txt`, { type: "text/plain" }),
        documentData: {
          title: manualTitle || "New Text",
          type: "transcript",
          purpose: "business_context",
          content_type: null,
          status: "active"
        }
      });
      
      setIsAddTextDialogOpen(false);
      setManualTitle("");
      setManualText("");
      
      toast.success("Text added successfully");
    } catch (error) {
      console.error("Error adding text:", error);
      toast.error("Failed to add text");
    }
  };

  const pageContent = (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meeting Transcripts</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddTextDialogOpen(true)} variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Text
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
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
            <h3 className="text-xl font-semibold text-center">No Documents Yet</h3>
            <p className="text-muted-foreground text-center mt-2 max-w-md">
              Upload transcripts or add text to extract content ideas.
            </p>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAddTextDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Text
              </Button>
              <Button 
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
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
                    "Processing..."
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
      
      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to extract content ideas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input 
                id="file" 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".txt,.md,.doc,.docx,.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={uploadTitle} 
                onChange={(e) => setUploadTitle(e.target.value)} 
                placeholder="Document title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadDocument}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Text Dialog */}
      <Dialog open={isAddTextDialogOpen} onOpenChange={setIsAddTextDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Text</DialogTitle>
            <DialogDescription>
              Add text content to extract ideas from
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="text-title">Title</Label>
              <Input 
                id="text-title" 
                value={manualTitle} 
                onChange={(e) => setManualTitle(e.target.value)} 
                placeholder="Text title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-content">Content</Label>
              <Textarea 
                id="text-content" 
                value={manualText} 
                onChange={(e) => setManualText(e.target.value)} 
                placeholder="Enter or paste your text here..."
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTextDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddText}>Add Text</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <MainLayout />
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="container py-4 px-2 sm:py-6 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8 max-w-7xl mx-auto animate-fade-in">
          {pageContent}
        </div>
      </main>
    </div>
  );
};

export default TranscriptsPage;
