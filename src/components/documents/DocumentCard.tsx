
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Edit, BrainCircuit, Loader2 } from "lucide-react";
import { Document } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useDocuments } from "@/hooks/useDocuments";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const { updateDocumentStatus, processTranscript } = useDocuments();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();
  
  const handleToggleStatus = () => {
    const newStatus = document.status === "active" ? "archived" : "active";
    updateDocumentStatus(document.id, newStatus);
  };

  const handleExtractIdeas = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      toast.info("Starting idea extraction...");
      
      await processTranscript(document.id);
      
      toast.success("Ideas are being extracted. This may take a moment.");
      // We don't set isProcessing to false here since it's a background process
      // The user can check status in the transcripts page
    } catch (error) {
      console.error("Error extracting ideas:", error);
      toast.error("Failed to extract ideas");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-4">
              <CardTitle className="text-base sm:text-lg truncate">{document.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {document.status === "active" ? "Archive" : "Unarchive"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Tags
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExtractIdeas} disabled={isProcessing}>
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  Extract Ideas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
            <Badge variant="outline" className="text-xs">{document.type}</Badge>
            <Badge variant={document.purpose === "writing_sample" ? "secondary" : "outline"} className="text-xs">
              {document.purpose === "writing_sample" ? "Writing Sample" : "Business Context"}
            </Badge>
            {document.content_type && (
              <Badge className="text-xs">{document.content_type}</Badge>
            )}
            <Badge variant={document.status === "active" ? "default" : "destructive"} className="text-xs">
              {document.status === "active" ? "Active" : "Archived"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-0 flex-grow">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
            {document.content || "No content"}
          </p>
        </CardContent>
        <CardFooter className="pt-4 pb-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={isMobile ? "flex-1" : "w-full"}
            onClick={() => setIsViewOpen(true)}
          >
            <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            View
          </Button>
          
          {isMobile && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleExtractIdeas}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Extract
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{document.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Document Details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1 sm:gap-2 my-2">
              <Badge variant="outline">{document.type}</Badge>
              <Badge variant={document.purpose === "writing_sample" ? "secondary" : "outline"}>
                {document.purpose === "writing_sample" ? "Writing Sample" : "Business Context"}
              </Badge>
              {document.content_type && (
                <Badge>{document.content_type}</Badge>
              )}
            </div>
            
            <div className="my-4 p-4 bg-muted/50 rounded-md border border-border whitespace-pre-wrap text-sm">
              {document.content ? (
                document.content
              ) : (
                <div className="text-muted-foreground italic">No content available</div>
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewOpen(false);
                  setIsEditing(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Tags
              </Button>
              
              <Button
                variant="default"
                onClick={() => {
                  setIsViewOpen(false);
                  handleExtractIdeas();
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Extract Ideas
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Edit Tags Dialog here - this would be implemented in a follow-up */}
    </>
  );
};

export default DocumentCard;
