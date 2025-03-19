
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from 'sonner';

interface TranscriptViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
}

const TranscriptViewDialog: React.FC<TranscriptViewDialogProps> = ({
  isOpen,
  onOpenChange,
  content,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  
  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success("Content copied to clipboard");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy transcript:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Transcript Content</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review the full transcript content
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 p-4 bg-muted/50 rounded-md border border-border whitespace-pre-wrap text-sm">
          {content ? (
            content
          ) : (
            <div className="text-muted-foreground italic">No content available</div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!content || isCopied}
            className="gap-2"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptViewDialog;
